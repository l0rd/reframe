const {requireAll, requireContext} = require('./utils/requireAll');

module.exports = () => {
    require.context = requireContext;
    const entities = requireAll(require.context("../models/entity", true, /\.ts$/));
 // const entities = requireAll(require.context("../models/entity", true, /\.js$/));
    const migrations = requireAll(require.context("../models/migration", true, /\.ts$/));
    const subscribers = requireAll(require.context("../models/subscriber", true, /\.ts$/));

    return {
        type: "sqlite",
        database: "database.sqlite",
        synchronize: true,
        logging: false,
        entities,
        migrations,
        subscribers,
        cli: {
            entitiesDir: "./models/entity",
            migrationsDir: "./models/migration",
            subscribersDir: "./models/subscriber"
        }
    };
}
