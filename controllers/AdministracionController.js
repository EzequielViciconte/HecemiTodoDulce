const Direcciones = require('../Models/Direcciones')

exports.MiCuenta = (req, res) => {
  res.render("Mi-Cuenta", {
    NombrePagina: "Mi Cuenta",
  });
};

exports.MisDatos = (req, res) => {
  res.render("Mis-Datos", {
    NombrePagina: "Mis Datos",
  });
};

//********** Direcciones  ***********/

exports.Direcciones = async (req, res) => {
  const UsuarioId = req.user.id;
  const Direccion = await Direcciones.findOne({
    where:{
      UsuarioId
    }
  });

  res.render("Direcciones", {
    NombrePagina: "Direcciones",
    Direccion
  });
};

exports.FormAgregarDireccion = (req,res)=> {
  const usuarioId = req.user.id;

   res.render("AgregarDireccion", {
    NombrePagina: "Agregar Direcciones",
    usuarioId
  });
}

exports.AgregarDireccion = async (req,res) => {
  const Direccion = req.body;
  try {
    await Direcciones.create(Direccion);
    // Flash Message y Redireccionar 
    req.flash('exito','Direccion Guardada Correctamente')
    res.redirect('/Direcciones')
  } catch (error) {
    console.log(error);
  }
}



//********** Mis tarjetas   ***********/

exports.MisTarjetas = (req, res) => {
  res.render("Mis-Tarjetas", {
    NombrePagina: "Mis tarjetas",
  });
};
