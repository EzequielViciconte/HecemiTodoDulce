const Productos = require('../Models/Productos');

exports.MostrarTartas = async(req, res, next) => {
    const productos = await Productos.findAll({ limit: 3 })

    if (!productos) return next();

    res.render('home', {
        NombrePagina: 'HecemiTodoDulce',
        Pagina: 'index',
        Header: 'ContenedorHeader',
        productos
    })

}