import React from 'react';
import easyqlClient from '../server/easyql/client/easyqlClient';

const UserList = ({users}) => (
    <div>{
        users
        .map(user =>
            <div key={user.id}>{user.username+" ["+user.id+"] - "+user.password}</div>
        )
    }</div>
);

const TodoList = ({todos}) => (
    <div>{
        todos
        .map(todo =>
            <div key={todo.id}>{todo.text+" ["+todo.id+"]"}</div>
        )
    }</div>
);

class UserAdder extends React.Component {
    render() {
        return (
            <form onSubmit={this.onSubmit.bind(this)}>
                <input type="text" name="firstName" onChange={this.onChange.bind(this)}/>
                <input type="text" name="lastName" onChange={this.onChange.bind(this)}/>
                <button type="submit">Add user</button>
            </form>
        );
    }
    onChange(ev) {
        const {name, value} = ev.target;
        this.setState({[name]: value});
    }
    async onSubmit(ev) {
        ev.preventDefault();
        const object = {...this.state};
        const query = {
            queryType: 'write',
            modelName: 'User',
            object,
        };
        const response = await easyqlClient.query({query});
        if( ! response.error ) {
            window.document.location.reload();
        }
    }
}

class TodoAdder extends React.Component {
    render() {
        return (
            <form onSubmit={this.onSubmit.bind(this)}>
                <input type="text" name="text" onChange={this.onChange.bind(this)}/>
                <button type="submit">Add Todo</button>
            </form>
        );
    }
    onChange(ev) {
        const {name, value} = ev.target;
        this.setState({[name]: value});
    }
    async onSubmit(ev) {
        ev.preventDefault();
        const loggedUser = easyqlClient.getLoggedUser();
        const {id} = loggedUser;
        const object = {user: {id}, isCompleted: false, ...this.state};
        const query = {
            queryType: 'write',
            modelName: 'Todo',
            object,
        };
        const response = await easyqlClient.query({query});
        if( ! response.error ) {
            window.document.location.reload();
        }
    }
}

const Welcome = ({users, todos}) => (
    <div>
        <UserAdder/>
        <UserList users={users}/>
        <TodoAdder/>
        <TodoList todos={todos}/>
    </div>
);

async function getUsers({req}) {
    const query = {
        queryType: 'read',
        modelName: 'User',
    };
    const requestHeaders = req && req.headers;
    const response = await easyqlClient.query({query, requestHeaders});

    const users = response.objects;

    return users;
}

async function getTodos({req}) {
    const loggedUser = easyqlClient.getLoggedUser({req});
    if( ! loggedUser ) {
        return [];
    }

    const userId = loggedUser.id;
    const query = {
        queryType: 'read',
        modelName: 'Todo',
        filter: {
            user: {
                id: userId,
            },
        },
    };
    const requestHeaders = req && req.headers;
    const response = await easyqlClient.query({query, requestHeaders});

    const todos = response.objects;

    return todos;
}

const WelcomePage = {
    route: '/',
    view: Welcome,

    getInitialProps: async ({req}) => {
        const users = await getUsers({req});
        const todos = await getTodos({req});

        return {users, todos};
    },
};

export default WelcomePage;
