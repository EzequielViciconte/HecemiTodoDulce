const Usuarios = require('../Models/Usuarios');

exports.FormCrearUsuario = (req, res) => {
    res.render('crear-cuenta', {
        NombrePagina: 'Crea Tu Cuenta'
    });
};

exports.CrearUsuario = async (req,res)=>{
    const usuario = req.body
    try {
        await Usuarios.create(usuario);
        // Url Confirmacion 
        const Url = `http://${req.header.host}/confirmar-cuenta/:Url`;

        // Flash Message y Redireccionar 
        req.flash('exito','Usuario Creado Correctamente')
        res.redirect('/iniciar-sesion')
    } catch (error) {
        // Errores de Sequelize
        const erroresSequelize = error.errors.map(err => err.message);
        
        // Redireccionar y mostrar errores en pantalla
        req.flash('error',erroresSequelize);
        res.redirect('/crear-cuenta');
    }
}

exports.formIniciarSesion =  (req,res)=>{
    res.render('iniciar-sesion',{
         NombrePagina: 'Iniciar Sesion'
    })
}

