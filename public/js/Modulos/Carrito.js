// Importar Funciones
import { CantidadCarrito } from "./miniCarrito.js";
import { calcularTotal } from "./miniCarrito.js";
import { EliminarProductoCarrito } from "./miniCarrito";
import { actualizarPorInputCan } from "./miniCarrito";
import { CarritoVacio } from "./miniCarrito.js";
const Carrito = document.querySelector('.TablaCarrito');
const Comprar = document.querySelector('.FormularioCompra');
const TablaDireccion = document.querySelector('.TablaDireccion');

if(Carrito && TablaDireccion){
    Comprar.addEventListener('submit',checkout)
}

if(localStorage.getItem('productoCarrito')){
    TomarLocalStorage();
}





function checkout(e){
    e.preventDefault();
    PasarOrdenBack(e);
}

function TomarLocalStorage(){
    const tbodyTabla = document.querySelector('tbody');
    const Productos = JSON.parse(localStorage.getItem('productoCarrito'));
    const Direccion = JSON.parse(localStorage.getItem('direccion'));

    if(Productos.length == 0 ){
        if(Carrito){
            CarritoVacio();
        }
        
    }else{
        Productos.forEach(Producto => {
            if(Carrito){
                CompletarCarritoDatos(Producto,Direccion,tbodyTabla)
                llenarCarritoMiniStorage(Producto);
            }else
            {
             llenarCarritoMiniStorage(Producto)
            }   
        });
    }



    document.querySelectorAll('#Cantidad').forEach(inputCantidad=>{
        inputCantidad.addEventListener('change',actualizarPorInputCan)
    })
    document.querySelectorAll('.BtnEliminar').forEach(btnEliminar =>{
        btnEliminar.addEventListener('click',EliminarProductoCarrito)
    })



}


function PasarOrdenBack(e){
    const Productos = Carrito.querySelectorAll('.ProductoIn');
    let arrProductos =[];
    Productos.forEach(producto =>{
        const Nombre = producto.querySelector('#Titulo').textContent
        const Cantidad = producto.querySelector('#Cantidad').value
        const id =   producto.getAttribute('data-id');

        const ProductoJunt = {
            Nombre:Nombre,
            id:id,
            Cantidad:Cantidad
        }
        
        arrProductos.push(ProductoJunt)
    })

    // Tomar Direccion
    const Direccion = TablaDireccion.querySelector('.DireccionIn'),
        Calle = Direccion.querySelector('.CartDireccion').textContent,
        CP = Direccion.querySelector('.CartCp').textContent,
        Telefono = Direccion.querySelector('.CartTelefono').textContent

    const arrDireccion = {
        Calle:Calle,
        CP:CP,
        Telefono:Telefono
    }

    const Conjunto  =  {
        Productos:arrProductos,
        Direccion:arrDireccion
    };


    if(arrProductos.length == 0 ){
        console.log('Carrito Vacio')
    }else{
        fetch('http://localhost:3000/checkout',{
        method:'POST',
        headers:{
            'Access-Control-Allow-Origins': '*' ,
            'Content-Type':'application/json',
        },
        body:JSON.stringify(Conjunto),
        
    })
    .then(function(config){
        return config.json();
    }).then(function(res){
        location.href=res;
    })
    }
}


function CompletarCarritoDatos (Producto,Direccion,tbodyTabla) {
    // Pasar Direccion a la tabla
    const tablaDireccionbody = document.querySelector('.TablaDireccion tbody')
    if(tablaDireccionbody){
        const {Apellido,Calle,Ciudad,Numeracion,Telefono,CP} = Direccion
        // Tabla De Direccion
        const TablaDireccion = document.createElement('TR');
        TablaDireccion.classList.add('DireccionIn');
        TablaDireccion.innerHTML = `<td class="CartNombre"> ${Direccion.Nombre} ${Apellido}</td>
        <td class="CartTelefono">${Telefono}</td>
        <td class="CartDireccion">${Calle} ${Numeracion}</td>
        <td class="CartCiudad">${Ciudad}</td>
        <td class="CartCp">${CP}</td>
        `

        if(tablaDireccionbody){
            tablaDireccionbody.append(TablaDireccion);
        }


    }


    // Pasar Productos a la tabla
    const {Nombre,Precio,Cantidad,Imagen,id}=Producto
    // Tabla De Productos
    const TablaProducto = document.createElement('TR')
    TablaProducto.setAttribute('data-id',id)
    TablaProducto.classList.add('ProductoIn');
    const PrecioElemento = Precio.replace('$' , '');

    TablaProducto.innerHTML = `<td class="CartImg"><img class="ImagenTabla" id="Imagen" src="${Imagen}"></td>
    <td class="CartTitulo" id="Titulo">${Nombre}</td>
    <td class="Precio" id="Precio" >$ ${PrecioElemento}</td>
    <td class="CartCant"><input id="Cantidad" class="CantidadCarrito" type="number" name="Cantidad" min="1" value="${Cantidad}"></td>
    <td class="CartBtn"><button class="Boton BtnEliminar"><span>Eliminar</span></button></td>
    <td class="TotalPrecio">$ ${PrecioElemento * Cantidad}</td>
    `
    tbodyTabla.append(TablaProducto);
 


    
    
}

function llenarCarritoMiniStorage(ProductoLocal) {
    const {Nombre,Precio,Cantidad,Imagen,id} = ProductoLocal;
    const DivCarrito = document.querySelector('.CarritoContenido');
  
    const Producto = document.createElement('DIV');
    Producto.classList.add('ProductosCarrito');
    Producto.setAttribute('data-id',id)
    Producto.innerHTML = `
        <img class="Imagen" id="Imagen" src="${Imagen}">
        <div>
        <h3 class="ProductoNombre EnCarrito" id="Titulo" >${Nombre}</h3> 
        <p class="PrecioProducto" id="Precio">${Precio}</p>
        <input class="CantidadCarrito" type="number" placeholder="Cantidad" min="1" value="${Cantidad}">
        </div>
        <i class="fa fa-circle-xmark EliminarProducto"></i>`
    DivCarrito.append(Producto);

    if(Producto){
        CantidadCarrito();
        calcularTotal();

        document.querySelectorAll('.CantidadCarrito').forEach(inputCantidad => {
            inputCantidad.addEventListener('change',actualizarPorInputCan);
        })
        document.querySelectorAll('.EliminarProducto').forEach(btnEliminar =>{
            btnEliminar.addEventListener('click',EliminarProductoCarrito)
            
        })
    }
   

}





export default Carrito;