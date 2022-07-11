const Sequelize = require('sequelize');
const db = require('../config/db');

const Productos = db.define('Productos', {
    Id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },

    Titulo: {
        type: Sequelize.STRING(60),
    },

    Precio: {
        type: Sequelize.DECIMAL(10, 2)
    },

    Cantidad: {
        type: Sequelize.INTEGER(11),
    },

    Imagen: {
        type: Sequelize.STRING
    },

    Descripcion: {
        type: Sequelize.TEXT
    }

});


module.exports = Productos