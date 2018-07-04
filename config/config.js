let config = {};

config.database = {};
config.database.dialect = "mysql";
config.database.username = "root";
config.database.password = "";
config.database.port = "3306";
config.database.host = "127.0.0.1";
config.database.database = "rappi";
config.database.operatorsAliases = true;

config.database.pool = {};
config.database.pool.max = 5;
config.database.pool.min = 0;
config.database.pool.acquire = 30000;
config.database.pool.idle = 10000;

config.sequelize = {};
config.sequelize.sync = {};
config.sequelize.sync.force = true;
//config.sequelize.sync.logging: null;

module.exports = config;