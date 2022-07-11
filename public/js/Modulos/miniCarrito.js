const miniCarrito = document.querySelector('.Btncarrito');
const BtnCerrar = document.querySelector('.CerrarCarrito');
const Carrito = document.querySelector('.TablaCarrito ');
miniCarrito.addEventListener('click',MostrarCarrito);
BtnCerrar.addEventListener('click',CerrarCarrito)

document.querySelectorAll('.Boton').forEach(BtnAgregar => {
    BtnAgregar.addEventListener('click',agregarClickCarrito);
});

const MostrarCarritoGran = document.querySelector('.verCarrito');
MostrarCarritoGran.addEventListener('click',btnVerCarroGrande)


const DivCarrito = document.querySelector('.CarritoContenido');

// Funciones 
function agregarClickCarrito (e) {
    const UrlActual = window.location.href;
    const ProductoAct  = window.location.pathname
    const ProductNombre = ProductoAct.replace('/Tienda/','');
    const Boton = e.target.parentElement;
    let Producto;
    let Cantidad = 1;
    
    if(UrlActual == `http://localhost:3000/Tienda/${ProductNombre}`  ){
        Producto = Boton.parentElement.parentElement.parentElement.parentElement
        Cantidad = Producto.querySelector('.CantidadCarrito').value
    }else{
        Producto = Boton.closest('.Productos')
    }

    const Nombre = Producto.querySelector('.ProductoNombre').textContent
    const Imagen = Producto.querySelector('.ImagenProducto').src
    const Precio = Producto.querySelector('.PrecioProducto').textContent
    const id = Producto.getAttribute('data-id');
 


    añadirProductoCarrito(Nombre,Imagen,Precio,Cantidad,id);


  
}




// Funcion de Abrir y Cerrar Carrito 
function MostrarCarrito (e) {
    if(!Carrito){
        e.preventDefault();
        const DivCarrito = document.querySelector('.Carrito');
        DivCarrito.classList.add('Visible');
    }
    
}

function CerrarCarrito () {
    let DivCarrito = document.querySelector('.Carrito');
    DivCarrito.classList.remove('Visible');
}




// Funciones AñadirCarrito,Aumentar Cantidad,Calcular Total, etc.
function añadirProductoCarrito (Nombre,Imagen,Precio,Cantidad,id){
    const ElementoEnCarrito = DivCarrito.getElementsByClassName('EnCarrito');

    for(let i= 0; i < ElementoEnCarrito.length;i++){
        if(ElementoEnCarrito[i].innerText == Nombre)
        {
            let CantidadProducto = ElementoEnCarrito[i].parentElement.querySelector('.CantidadCarrito');
            CantidadProducto.value++;
            calcularTotal()
            const  ProductoEnCarrito  = getProductosEnCarrito();
            añadirLocalStorage('productoCarrito',ProductoEnCarrito);
            return;
        }
    }
    const Producto = document.createElement('DIV');
    Producto.classList.add('ProductosCarrito');
    Producto.setAttribute('data-id',id);
    Producto.innerHTML = `
        <img class="Imagen" id="Imagen" src="${Imagen}">
        <div>
        <h3 class="ProductoNombre EnCarrito" id="Titulo" >${Nombre}</h3> 
        <p class="PrecioProducto" id="Precio">${Precio}</p>
        <input class="CantidadCarrito" type="number" placeholder="Cantidad" min="1" value="${Cantidad}">
        </div>
        <i class="fa fa-circle-xmark EliminarProducto"></i>`
    DivCarrito.append(Producto);

    CantidadCarrito();
    calcularTotal();

    document.querySelectorAll('.CantidadCarrito').forEach(inputCantidad => {
        inputCantidad.addEventListener('change',actualizarPorInputCan);
    })

    document.querySelectorAll('.EliminarProducto').forEach(btnEliminar =>{
        btnEliminar.addEventListener('click',EliminarProductoCarrito)
    })

    const  ProductoEnCarrito  = getProductosEnCarrito();
    añadirLocalStorage('productoCarrito',ProductoEnCarrito);
}


function calcularTotal() {
    let Total = 0;
    let TotalFinal = 0;
    let Productos;

   
    if(Carrito){
        Productos = document.querySelectorAll('.ProductoIn');
    }else{
        Productos = document.querySelectorAll('.ProductosCarrito');
    }
     
    
    Productos.forEach(producto => {
        const ElementoPrecioProducto = producto.querySelector('#Precio');    
        const PrecioProducto = Number(ElementoPrecioProducto.textContent.replace('$',''));

        const ElementoCantidadProducto = producto.querySelector('.CantidadCarrito');
        const CantidadProducto = Number(ElementoCantidadProducto.value);
        
    
        Total = PrecioProducto * CantidadProducto;
        TotalFinal = TotalFinal + PrecioProducto * CantidadProducto;

        if(Carrito){
            const TotalPrecio = producto.querySelector('.TotalPrecio')
            TotalPrecio.textContent =`$ ${Total}`;
        }
    })
    ImprimirTotal(TotalFinal)

} 


function ImprimirTotal (Total) {
    const DivTotal = document.querySelector('.CarritoTotal');
    const CarritoTotal = document.querySelector('#Total');
    
    if(Carrito){
        CarritoTotal.innerHTML = `<h3>$${Total}</h3>`
        DivTotal.innerHTML = `<p class="SubTotal">SubTotal: $${Total}</p> `;
    }else{
        DivTotal.innerHTML = `<p class="SubTotal">SubTotal: $${Total}</p> `;
}
}
    


function CantidadCarrito () {
    let Productos;
     Productos = document.querySelectorAll('.ProductosCarrito');
    if(Carrito) {
         Productos = document.querySelectorAll('.ProductoIn');
    }
    
    const Cantidad = document.querySelector('.CantidadProductos');
    return Cantidad.textContent = Productos.length;
}


function EliminarProductoCarrito (e) {
    let Producto;
    Producto = e.target.parentElement;
    if(Carrito){
        Producto = e.target.parentElement.parentElement.parentElement.parentElement.querySelector('.ProductoIn')
    }

   Producto.remove();
   CantidadCarrito();
   const  ProductoEnCarrito  = getProductosEnCarrito();
   añadirLocalStorage('productoCarrito',ProductoEnCarrito);
   const Productos = JSON.parse(localStorage.getItem('productoCarrito'));
   if(Productos.length == 0 ){
        if(Carrito){
            CarritoVacio();
        }
    }
   return calcularTotal();
}

function actualizarPorInputCan (e) {
    console.log(e);
    calcularTotal();
    const  ProductoEnCarrito  = getProductosEnCarrito();
    añadirLocalStorage('productoCarrito',ProductoEnCarrito);
    
}

function btnVerCarroGrande(e) {

    const  ProductoEnCarrito  = getProductosEnCarrito();
    añadirLocalStorage('productoCarrito',ProductoEnCarrito);
}

// Crear el producto en carrito para mandarlo a localStorage
function getProductosEnCarrito() {
    let ProductosEnCarrito;
    if(Carrito){
        ProductosEnCarrito = document.querySelectorAll('.ProductoIn');
    }else{
        ProductosEnCarrito = document.querySelectorAll('.ProductosCarrito');
    }
    
    const arrProductosCarrito = [];
    ProductosEnCarrito.forEach(ProductoenCarrito => {
        const Nombre = ProductoenCarrito.querySelector('#Titulo').textContent;
        const Precio = ProductoenCarrito.querySelector('#Precio').textContent;
        const CantidadElemento = ProductoenCarrito.querySelector('.CantidadCarrito');
        const Cantidad = Number(CantidadElemento.value)
        const Imagen = ProductoenCarrito.querySelector('#Imagen').src;
        const id = ProductoenCarrito.getAttribute('data-id')
       
        const Producto = {
            Nombre:Nombre,
            Precio:Precio,
            Cantidad:Cantidad,
            Imagen:Imagen,
            id:id
        };
        arrProductosCarrito.push(Producto)
    })
    return arrProductosCarrito;
}

function añadirLocalStorage(key,productos){
    return localStorage.setItem(key, JSON.stringify(productos));
}

function CarritoVacio() {
    const SubtotalCar = document.querySelector('.SubtotalCar');
    return SubtotalCar.innerHTML = '<h3>Carrito Vacio</h3>'
}

export{CantidadCarrito};
export{calcularTotal};
export{actualizarPorInputCan};
export{EliminarProductoCarrito};
export{CarritoVacio};
export default miniCarrito;