const Sequelize = require('sequelize');
const db = require('../config/db');

const Orden = db.define('Orden', {
    Nombre:{
        type: Sequelize.STRING(60),
        allowNull: false,
    },
    email:{
        type: Sequelize.STRING(30),
        allowNull: false
    },
    Payment_id :{ 
        type: Sequelize.STRING(60),
        allowNull: false,
        unique: {
            args:true,
        }
    },
    Status:{
        type: Sequelize.STRING(),
        allowNull: false,
    },
    Payment_type:{
        type:  Sequelize.STRING(),
        allowNull: false,
    }
});



module.exports = Orden