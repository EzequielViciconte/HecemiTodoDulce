const Productos = require('../Models/Productos');


exports.CrearTienda = async(req, res, next) => {
    const productos = await Productos.findAll()

    if (!productos) return next();

    res.render('Tienda', {
        NombrePagina: 'Tienda Hecemi',
        productos
    })
};


// Entrar a productos segun su Url
exports.ProductoUrl = async(req, res, next) => {
    const Producto = await Productos.findOne({
        where: {
            Imagen: req.params.Url
        }
    });

    const productos = await Productos.findAll();
    if (!Producto) return next();

    //Render a la Vista
    res.render('Producto', {
        NombrePagina: Producto.Titulo,
        Producto,
        productos
    })


}