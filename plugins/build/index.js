const {transparentGetter, lazyRequireFileGetter, requireFileGetter} = require('@brillout/reconfig/getters');
const buildFile = require.resolve('./executeBuild');
const getBuildInfoFile = require.resolve('./getBuildInfo');
const packageName = require('./package.json').name;

module.exports = {
    $name: packageName,
    $getters: [
        lazyRequireFileGetter('buildFile', 'runBuild'),
        requireFileGetter('getBuildInfoFile', 'getBuildInfo'),
        transparentGetter('doNotWatchBuildFiles'),
        transparentGetter('log'),
        {
            prop: 'webpackBrowserConfigModifier',
            getter: configParts => assemble_modifiers('webpackBrowserConfig', configParts),
        },
        {
            prop: 'webpackNodejsConfigModifier',
            getter: configParts => assemble_modifiers('webpackNodejsConfig', configParts),
        },
    ],
    buildFile,
    getBuildInfoFile,
    ejectables: getEjectables(),
};

// We assemble several webpack config modifiers into one supra modifier
function assemble_modifiers(modifier_name, configParts) {
    const assert_usage = require('reassert/usage');

    // `configParts` holds all globalConfig parts
    // `config` holds a webpack config
    let supra_modifier = ({config}) => config;

    // We assemble all `configParts`'s config modifiers into one `supra_modifier`
    configParts
    .forEach(configPart => {
        const modifier = configPart[modifier_name];
        if( ! modifier ) {
            return;
        }
        assert_usage(configPart[modifier_name] instanceof Function);
        const previous_modifier = supra_modifier;
        supra_modifier = (
            args => {
                const config = previous_modifier(args);
                const config__new = modifier({...args, config});
                assert_usage(
                    config__new,
                    (
                        configPart.$name ? (
                            "The `"+modifier_name+"` of `"+configPart.$name+"`"
                        ) : (
                            "A `"+modifier_name+"`"
                        )
                    ) + (
                        " is returning `"+config__new+"` but it should be returning a webpack config instead."
                    )
                );
                return config__new;
            }
        );
    });

    return supra_modifier;
}

function getEjectables() {
    const buildFile__ejected = 'PROJECT_ROOT/build/index.js';
    const getBuildInfoFile__ejected = 'PROJECT_ROOT/build/getBuildInfo.js';

    const buildEjectName = 'build';
    const staticRenderingEjectName = 'build-static-rendering';
    const browserEntriesEjectName = 'build-browser-entries';

    return [
        {
            name: buildEjectName,
            description: 'Eject the build code.',
            fileCopies: [
                {
                    noDependerRequired: true,
                    oldPath: buildFile,
                    newPath: buildFile__ejected,
                },
                {
                    noDependerRequired: true,
                    oldPath: getBuildInfoFile,
                    newPath: getBuildInfoFile__ejected,
                },
            ],
            configChanges: [
                {
                    configPath: 'buildFile',
                    newConfigValue: ({makePathRelative}) => makePathRelative(buildFile__ejected),
                },
                {
                    configPath: 'getBuildInfo',
                    newConfigValue: ({makePathRelative}) => makePathRelative(getBuildInfoFile__ejected),
                },
            ],
        },
        {
            name: staticRenderingEjectName,
            description: 'Eject the code that renders your pages to HTML at build-time.',
            fileCopies: [
                {
                    oldPath: packageName+'/getPageHTMLs',
                    newPath: 'PROJECT_ROOT/build/getPageHTMLs.js',
                    noDependerMessage: (
                        'Did you run `eject '+buildEjectName+'` before running `eject '+staticRenderingEjectName+'`?\n'+
                        'Did you run `eject '+staticRenderingEjectName+'` already?'
                    ),
                },
            ],
        },
        {
            name: browserEntriesEjectName,
            description: 'Eject the code that generates the browser entry of each page.',
            fileCopies: [
                {
                    oldPath: packageName+'/getPageBrowserEntries',
                    newPath: 'PROJECT_ROOT/build/getPageBrowserEntries.js',
                    noDependerMessage: (
                        'Did you run `eject '+buildEjectName+'` before running `eject '+browserEntriesEjectName+'`?\n'+
                        'Did you run `eject '+browserEntriesEjectName+'` already?'
                    ),
                },
            ],
        },
    ];
}
