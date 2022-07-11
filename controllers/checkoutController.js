const mercadopago = require("mercadopago");
const Orden = require("../Models/Orden");
const Usuarios = require("../Models/Usuarios");
const ProductosBD = require('../Models/Productos');
const DireccionesBD = require('../Models/Direcciones');
const enviarEmail = require('../handlers/email');
const { NUMBER } = require("sequelize");
var preference = {
    items:[
    ],
    back_urls: {
        "success": "http://localhost:3000/success",
        "failure": "http://localhost:3000/rejected",
        "pending": "http://localhost:3000/feedback"
    },
    payer:{},
    shipments:{
        "cost": 0,
        "mode": "not_specified"
    },
    auto_return: "approved",
    payment_methods:{
        "installments": 1
    },
    statement_descriptor: "HecemiTodoDulce"

}

exports.mostrarCarrito = (req,res) =>{
    res.render('Carrito', {
        NombrePagina: 'Carrito',
    });
}



exports.DatosdeCompra = async (req,res,next)=> {
   const UsuarioId = req.user.id;
   const Direcciones = await  DireccionesBD.findAll({
    where:{
      UsuarioId
    }
  })

  const {Nombre,Email} = req.user;


    res.render('DatosEntrega',{
        NombrePagina:'Datos del Cliente',
        Direcciones,
        Nombre,
        Email
    })
}

exports.TomarDirecciones = async (req,res) => {
    const Direccion = await DireccionesBD.findAll();
    res.send(Direccion)
}


//***** Pasarela de Pago *****/

exports.PasaraledaPago = (req,res)=> {
    res.render('PasarelaDepago',{
        NombrePagina:'Datos del Cliente',
    })
}

exports.mostrarCheckoutMp = async   (req,res,next) =>{
    const Productos =  req.body.Productos;
    const Direccion = req.body.Direccion;


    
    const Email = req.session.passport.user.Email
    const usuario = await Usuarios.findOne({Email});
    const ProductossBD = await ProductosBD.findAll()

    for(let i = 0;i < Productos.length;i++){
        const id = Productos[i].id
        let Precio;
        ProductossBD.forEach(productoBD => {
            if(id == productoBD.Id){
                Precio = productoBD.Precio;
            }
        });
        
        preference.items.push({
            title:Productos[i].Nombre,
            unit_price:Number(Precio),
            currency_id: 'ARS',
            quantity:Number(Productos[i].Cantidad),
        });

        preference.payer = {
            "name":usuario.Nombre,
            "email":usuario.Email,
            "phone": {
                "area_code": "11",
                "number": Number(Direccion.Telefono)
            },
            "address":{
                "street_name": Direccion.Calle,
                "zip_code":Direccion.CP
            }
        }
    }
    if(preference.items.length == 0){
        res.redirect('/')
        return next();
    }

    const response = await mercadopago.preferences.create(preference);
    const Url = response.response.init_point
    res.json(Url);
}



exports.FinalizarCompra = async (req,res,next)=>{
    preference.items = [];
    const Datos = req.query;
    const Comprador = req.user;


    if(Datos.status == 'null'){
        res.redirect('/');
        return next();
    }

    let order = ({
        Nombre:Comprador.Nombre,
        email:Comprador.Email,
        Payment_id: Datos.payment_id,
        Status:Datos.status,
        Payment_type:Datos.payment_type
    })

  
    try {
        await Orden.create(order);
    } catch (error) {
    }

    // Enviar Notificaion Por Emial
    await enviarEmail.Enviar({
        usuario:Comprador,
        subject:'Orden de Compra',
        Archivo:'OrdendeCompra'
    });
    req.flash('correcto','Compra Realizada correctamente,le enviaremos un email con los pasos a seguir');
    res.render('Orden',{
        NombrePagina: 'Orden',
        mensajes:req.flash(),
        order
    })

} 

