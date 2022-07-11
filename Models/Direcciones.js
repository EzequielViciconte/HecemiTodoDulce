const Sequelize = require('sequelize');
const db = require('../config/db');
const bcrypt = require('bcrypt-nodejs');

const Direcciones = db.define('Direcciones', {
    Nombre:{
        type:Sequelize.STRING(60),
        validate:{
            notEmpty:{
                msg:'El nombre no puede ir vacia'
            }
        }
    },
    Apellido:{
        type:Sequelize.STRING(60),
        validate:{
            notEmpty:{
                msg:'El apellido no puede ir vacia'
            }
        }
    },
    Telefono:{
        type:Sequelize.STRING(60),
        validate:{
            notEmpty:{
                msg:'El telefono no puede ir vacio'
            }
        }
    },
    Direccion:{
        type:Sequelize.STRING(60),
        validate:{
            notEmpty:{
                msg:'Direccion no puede ir vacia'
            }
        }
    },
    Numeracion:{
        type:Sequelize.STRING(60),
        validate:{
            notEmpty:{
                msg:'La Numeracion no puede ir vacia'
            }
        }
    },
    Ciudad:{
        type:Sequelize.STRING(60),
        validate:{
            notEmpty:{
                msg:'La Ciudad no puede ir vacia'
            }
        }
    },
    Provincia:{
        type:Sequelize.STRING(60),
        validate:{
            notEmpty:{
                msg:'La Provincia no puede ir vacia'
            }
        }
    },
    CodigoPostal:Sequelize.STRING(60),
});





module.exports = Direcciones