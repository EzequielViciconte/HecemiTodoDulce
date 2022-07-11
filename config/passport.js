const passport = require('passport');
const Usuarios = require('../Models/Usuarios');
const localStrategy = require('passport-local').Strategy;


passport.use(new localStrategy({
    usernameField:'Email',
    passwordField:'Contraseña'
},async (Email,Contraseña,done)=>{
    try {
        const Usuario = await Usuarios.findOne({
            where:{
                Email
            }
        })
        if(!Usuario)  return done(null,false,{
            message:'Usuario No encontrado'
        });
    
        // El usuario existe,Verificar Password
        if(!Usuario.verificarContraseña(Contraseña)){
            return done(null,false,{
                message:'Contraseña Incorrecta'
            });
        }
        // Email existente y Password Correto
        return done(null,Usuario);
    } catch (error) {
        // Si usuario no existe 
        return done(null,false,{
            message: 'Esa cuenta no existe'
        });
    }
}));

// Serealizar el usuario
passport.serializeUser((Usuario, callback) => {
    callback(null, Usuario)
});

// Deserializar usuario

passport.deserializeUser((Usuario, callback) => {
    callback(null, Usuario)
});

//Exportar

module.exports = passport