const passport = require("passport");
const Usuario = require("../Models/Usuarios");
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const Crypto = require('crypto');
const bcrypt = require('bcrypt-nodejs');
const enviarEmail = require('../handlers/email')

exports.autenticarUsuario = passport.authenticate('local',{
    successRedirect: '/',
    failureRedirect: 'iniciar-sesion',
    failureFlash:true,
    badRequestMessage:'Ambos Campos son Obligatorios'
});

exports.usuarioAutenticado = (req,res,next) => {
    if(req.isAuthenticated())
    {
        return next();
    }
    // sino esta autenticado,redirigir a Iniciar Secion
    return res.redirect('/iniciar-sesion');
}

exports.cerrarSesion = (req,res,next)=> {
    req.logout(function(err){
        if(err){
            return next(err);
        }
    });
    req.flash('correcto','Cerraste sesion correctamente');
    res.redirect('/iniciar-sesion')
    next();
}


// Formulario para Restablecer password
exports.formRestPassword = (req,res,next)=> {
    res.render('restablecer-password',{
        NombrePagina:'Restablece tu Contraseña',
    })
};
// Enviar Token
exports.EnviarToken = async (req,res,next)=>{
    const usuario = await Usuario.findOne({Email:req.body.Email});
    if(!usuario)
    {
        req.flash('error','Usuario No existente');
        return res.redirect('/iniciar-secion');
    }

    // Usuario Existe,Generar Token
    usuario.Token = Crypto.randomBytes(20).toString('hex');
    usuario.Expiracion = Date.now() + 3600000;

    // Guardar en BD
    usuario.save();
    const ResetUrl = `http://${req.headers.host}/restablecer-password/${usuario.Token}`;

    console.log(ResetUrl);

    // Enviar Notificaion Por Emial
    await enviarEmail.Enviar({
        usuario,
        subject:'Resetear Contraseña',
        ResetUrl,
        Archivo:'Restablecer'
    });

    // Todo Correcto yo que me alegro
    req.flash('correcto','Revisa tu casilla De Email');
    res.redirect('/iniciar-sesion');
};
exports.ValidarToken = async (req,res) => {
    const usuario = await Usuario.findOne({ where: { Token: req.params.Token } });

    //Si no existe el Usuario
    if (!usuario) {
        req.flash('error', 'No valido');
        res.redirect('/reestablecer');
    }


    // Formulario para generar el password
    res.render('resetPassword', {
        NombrePagina: 'Reestablecer Contraseña'
    });
}
exports.ActualizarContraseña = async(req, res) => {
    // Verifica el token  valido pero tambien la fecha de expiracion
    const usuario = await Usuario.findOne({
        where: {
            Token: req.params.Token,
            Expiracion: {
                [Op.gte]: Date.now()
            }
        }
    });

    // Verificar si existe el usuario
    if (!usuario) {
        req.flash('error', 'No Valido');
        res.redirect('/reestablecer');
    }


    //hashear el nuevo PASSWORD
    usuario.Token = null;
    usuario.Expiracion = null;
    usuario.Contraseña = bcrypt.hashSync(req.body.Password, bcrypt.genSaltSync(10));

    // Guardamos el nuevo Password
    await usuario.save();
    req.flash('correcto', 'Tu Contraseña se ha cambiado correctamente');
    res.redirect('/iniciar-sesion');
}