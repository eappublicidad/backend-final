let config = {};

config.database = {};
config.database.dialect = "mysql";
config.database.user = "root";
config.database.password = "";
config.database.port = "3306";
config.database.host = "localhost";
config.database.database = "rappi";
config.database.operatorsAliases = true;
config.database.pool = {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
};

config.sequelize = {};
config.sequelize.sync = false;

module.exports = config;