!MENU_ORDER 10
!MENU_INDENT 12
!MENU_LINK /../../
!OUTPUT ../readme.md
!INLINE ./snippets/header.md --hide-source-path
!MENU
&nbsp;

Framework to create web apps.
Designed for high development speed with no sacrifice on flexibility.

Assembles a JavaScript stack with integrations for:
Node.js servers (Express, Koa, Hapi),
Node.js ORMs (TypeORM & more to come),
React, React Router, React Native Web, Vue.js, TypeScript, PostCSS, etc.

All stacks are supported:
<br/> &nbsp; &#8226; &nbsp; frontend + backend + database/ORM (aka full-stack)
<br/> &nbsp; &#8226; &nbsp; frontend + backend (aka SSR)
<br/> &nbsp; &#8226; &nbsp; frontend only (aka static site)
<br/> &nbsp; &#8226; &nbsp; backend only (aka old-school app with plain old HTML)

Hello world app:
<img src='https://github.com/reframejs/reframe/raw/master/docs/images/previews/welcome.png?sanitize=true'/>
That's it.
We simply define a React component and a so-called "page config".
No build configuration.
(But if you want to, you can configure and take control over anything.)

<br/>

#### Contents

 - [Why Reframe](#why-reframe)
 - [Examples](#examples)
 - [Quick Start](#quick-start)

### Why Reframe

There are many web frameworks out there with huge adoption, including Ruby on Rails, Django and Next.js.
So why do we need another one?
The main reasons are around flexibility.

Web frameworks have a bad reputation regarding flexibility.
There is a general belief that there is a trade off between development speed and flexibility
and that a web framework always comes with a lost in flexibility.
We believe it doesn't have to be that way.

Reframe is designed from the ground up to be entirely flexible.
We would even argue that Reframe is more flexible than gluying do-one-thing-do-it-well libraries yourself.

Reframe's flexibility is based on three pillars:

1. **Progressive Eject** -
   All Reframe parts are ejectable:
   You can eject the build configuration (the webpack config), and/or the render code, and/or the routing code, and/or the server code, etc.

2. **Minimal glue code** -
   We isolate a maximum of code in do-one-thing-do-it-well libraries.
   That way, we manage to keep the glue code to a tiny ~500 lines of code.

3. **Flexible stack** -
   You can change the stack of your app at any time
   and remove/add a frontend, backend, or database/ORM.
   For example you can start with a frontend only (static site) and later add a Node.js server to it.

Benefits of that flexibility:

**Take Over Control** -
You can eject and take control over Reframe parts
as your app grows and the need arises.
All Reframe parts are ejectable which means that you can gain full control.

**Removable** -
If you eject all Reframe parts then you effectively get rid of Reframe.
At that point your code doesn't depend on Reframe anymore and only depends on do-one-thing-do-it-well libraries
(e.g. React, Webpack, etc.).

**Rapid Prototyping** -
You can change your app's stack at any time which comes in handy for quick prototyping.
For example,
you could implement your first prototype as a frontend only (static site)
and skip a real database by hard-writing the data in your codebase.
You could then deploy easily and for free (to a static host such as Netlify or GitHub Pages).
Later, when hard-writing data isn't sustainable anymore, you would add a server and a real database to your prototype.

**Learn Once, Write Any App** -
Instead of learning different web frameworks depending on what JavaScript stack you need,
you can learn Reframe to implement apps with any JavaScript stack.




!INLINE ./top-link.md #contents --hide-source-path

<br/>
<br/>



### Examples

- [Frontend](#frontend)
- [Full-stack](#full-stack)

###### Frontend

We define a page config `HelloPage`:

~~~jsx
// ~/my-app/pages/HelloPage.config.js

!INLINE ../examples/basics/pages/HelloPage.config.js --hide-source-path
~~~

<p align="center">
    <img src='https://github.com/reframejs/reframe/raw/master/docs/images/previews/hello.png?sanitize=true' width="780" style="max-width:100%;"/>
</p>

And that's it,
we created a frontend simply by defining one page config.

!INLINE ./top-link.md #examples Examples --hide-source-path
<br/>
!INLINE ./top-link.md #contents Contents --hide-source-path
<br/>
<br/>

###### Full-stack

Let's look at a Todo App.
(Note that the database/ORM integration shown here is work-in-progress.)

~~~ts
import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm";

@Entity()
export class Todo {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    text: string;

    @Column()
    isCompleted: boolean;

    @ManyToOne("User")
    author: "User";
}
~~~

To make our `Todo` entries accessible from our views, we define permissions:

~~~js
// Only the author of a todo item should be allowed to read & write
const isTodoAuthor = ({loggedUser, object: todo}) => loggedUser && loggedUser.id===todo.author.id;

const permissions = [
    {
        modelName: 'Todo',
        write: isTodoAuthor,
        read: isTodoAuthor,
    },
];
~~~

We can now access `Todo` entries from our view:

~~~js
import React from 'react';
import easyqlClient from '@easyql/client';

const TodoList = ({todos}) => (
    <div>{ todos.map(todo =>
        <div key={todo.id}>{todo.text}</div>
    )}</div>
);

const getInitialProps = async ({req}) => {
    const loggedUser = easyqlClient.getLoggedUser({req});
    const query = {
        queryType: 'read',
        modelName: 'Todo',
        filter: {
            author: {
                id: loggedUser.id,
            },
        },
    };
    const response = await easyqlClient.query({query, req});
    const todos = response.objects;
    return {todos};
};

export default {
    route: '/',
    view: TodoList,
    getInitialProps,
};
~~~

And that's it,
we simply defined pages, data models, and permissions to create a full-stack app.

!INLINE ./top-link.md #examples Examples --hide-source-path
<br/>
!INLINE ./top-link.md #contents Contents --hide-source-path

<br/>
<br/>





### Quick Start

!INLINE ./getting-started.md --hide-source-path

!INLINE ./top-link.md #contents --hide-source-path

<br/>
<br/>
