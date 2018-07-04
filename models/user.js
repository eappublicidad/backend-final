const User = sequelize.define('user', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    nombres: {
        type: Sequelize.STRING,
        allowNull: false
    },
    apellidos: {
        type: Sequelize.STRING,
        allowNull: false
    },
    // default values for dates => current time
    birthday: {
        type: Sequelize.DATE,
        allowNull: false
    },

    // Creating two objects with the same value will throw an error. The unique property can be either a
    // boolean, or a string. If you provide the same string for multiple columns, they will form a
    // composite unique key.
    uniqueOne: { type: Sequelize.STRING, unique: 'email_index' },
    /*
        // It is possible to create foreign keys:
        bar_id: {
            type: Sequelize.INTEGER,
    
            references: {
                // This is a reference to another model
                model: Bar,
    
                // This is the column name of the referenced model
                key: 'id',
    
                // This declares when to check the foreign key constraint. PostgreSQL only.
                deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
            }
        }*/
}, {
        // don't add the timestamp attributes (updatedAt, createdAt)
        timestamps: false,

        // don't use camelcase for automatically added attributes but underscore style
        // so updatedAt will be updated_at
        underscored: true,

        // disable the modification of table names; By default, sequelize will automatically
        // transform all passed model names (first parameter of define) into plural.
        // if you don't want that, set the following
        freezeTableName: true,

        // define the table's name
        tableName: 'user',

        // Enable optimistic locking.  When enabled, sequelize will add a version count attribute
        // to the model and throw an OptimisticLockingError error when stale instances are saved.
        // Set to true or a string with the attribute name you want to use to enable.
        version: true
    });

module.exports = User;