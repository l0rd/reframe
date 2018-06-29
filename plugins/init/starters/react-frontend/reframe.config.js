module.exports = {
    $plugins: [
        require('@reframe/react-kit'),
        require('@reframe/deploy-git'),
    ],
    doNotRenderInBrowser: true,

    // Make all pages be rendered to HTML at build-time
    defaultPageConfig: {
        renderPageAtBuildTime: true,
    },

    buildRepository: {
     // Replace this with your repository
     // remote: 'git@github.com:username/repo',
        branch: 'dist',
    },
};
