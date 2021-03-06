const {transparentGetter, requireFileGetter} = require('@brillout/reconfig/getters');

const packageName = require('./package.json').name;

const serverStartFile = require.resolve('./start');
const hapiIntegrationPluginFile = require.resolve('./hapiIntegrationPlugin');

module.exports = {
    $name: packageName,
    $getters: [
        transparentGetter('serverStartFile'),
        requireFileGetter('hapiIntegrationPluginFile'),
    ],
    serverStartFile,
    hapiIntegrationPluginFile,
    ejectables: getEjectables(),
};


function getEjectables() {
    const ejectName_server = 'server';
    const ejectName_serverIntegration = 'server-integration';
    return [
        {
            name: ejectName_server,
            description: 'Eject the code that creates the Node.js/hapi server.',
            descriptionLong: [
                'Ejects the code that creates a hapi server instance.',
                '',
                'This is a very common ejectable and we strongly encourage you to eject it.',
                '',
                'This is the right eject if you want to for example:',
                ' - Add API endpoints',
                ' - Add routes to the server',
                ' - Change server configuration (e.g. the server port)',
                ' - Add hapi plugins',
                '',
                'If you want to use another web framework instead of hapi, then also eject the `'+ejectName_serverIntegration+'` ejectable, see `$ reframe help eject '+ejectName_serverIntegration+'`.',
            ].join('\n'),
            listingPrio: 100,
            actions: [
                {
                    targetDir: 'server/',
                    configIsFilePath: true,
                    configPath: 'serverStartFile',
                },
            ],
        },
        {
            name: ejectName_serverIntegration,
            description: 'Eject the hapi plugin that integrates hapi with Reframe.',
            descriptionLong: [
                'Ejects the hapi plugin that implements the hapi <-> Reframe integration.',
                '',
                "This is an uncommon ejectable and chances are that you will never have to eject it.",
                'However, it can be useful if you want to fully customize the server.',
                'E.g. if you want to use another web framework instead of hapi.',
                '',
                'If you just want to make changes to the hapi server, then run `$ reframe eject '+ejectName_server+'` instead.'
            ].join('\n'),
            actions: [
                {
                    targetDir: 'server/',
                    configIsFilePath: true,
                    configPath: 'hapiIntegrationPluginFile',
                },
            ],
        },
    ];
}
