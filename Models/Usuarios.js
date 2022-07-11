const Sequelize = require('sequelize');
const db = require('../config/db');
const Direcciones = require('./Direcciones');
const bcrypt = require('bcrypt-nodejs');

const Usuarios = db.define('Usuarios', {
    id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    Nombre : Sequelize.STRING(60),
    Email: {
        type: Sequelize.STRING(30),
        allowNull: false,
        validate: {
            isEmail: {
                msg: 'Agrega un Correo Valido'
            },
        },
        unique: {
            args:true,
            msg: 'Usuario Registrado'
        }

    },
    Contraseña:{
        type:Sequelize.STRING(60),
        allowNull:false,
        validate:{
            notEmpty:{
                msg:'La contraseña no puede ir vacia'
            }
        }
    },
    Activo: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    Token: Sequelize.STRING,
    Expiracion: Sequelize.DATE
}, {
    hooks: {
        beforeCreate(usuario) {
            usuario.Contraseña = bcrypt.hashSync(usuario.Contraseña, bcrypt.genSaltSync(10));
        }
    }
});


//Metodos Personalizados
Usuarios.prototype.verificarContraseña = function(Contraseña) {
    return bcrypt.compareSync(Contraseña, this.Contraseña)
}

Usuarios.hasMany(Direcciones);


module.exports = Usuarios