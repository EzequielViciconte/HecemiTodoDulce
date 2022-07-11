let checkout;
const axios = require('axios');
const UrlLocal = window.location.origin;
const path = window.location.pathname
const Url = `${UrlLocal}${path}`; 
if(Url == 'http://localhost:3000/success'){
    localStorage.clear();
}

const BotonPagar = document.querySelector('#BtnPagar')
// Seleccionar todos los Input.
const Nombre = document.querySelector('.Nombre');
const Apellido = document.querySelector('.Apellido');
const Telefono = document.querySelector('.Telefono');
const Calle = document.querySelector('.Calle');
const Numeracion = document.querySelector('.Numeracion');
const Ciudad = document.querySelector('.Ciudad');
const Provincia = document.querySelector('.Provincia');
const CP = document.querySelector('.CP');
const Direccion = document.querySelector('.DireccionValor');


/********* Direcciones  **********/

if(Direccion){
    VerificarDatos()
    Direccion.addEventListener('change',function(){
        const Seleccionado = this.options[Direccion.selectedIndex]; 
        LlenarCamposDireccion(Seleccionado);
        VerificarDatos();
    })

}



// Funciones
function LlenarCamposDireccion(Seleccionado){
        axios.get('/TomarDirecciones')
        .then(response => {
           const Direcciones = response.data
           Direcciones.forEach(Direccios => {
            if(Direccios.id == Seleccionado.value){
                let Direccion ={
                    'Nombre':Direccios.Nombre,
                    'Apellido': Direccios.Apellido,
                    'Telefono': Direccios.Telefono,
                    'Calle': Direccios.Direccion,
                    'Numeracion': Direccios.Numeracion,
                    'Ciudad': Direccios.Ciudad,
                    'Provincia': Direccios.Provincia,
                    'CP': Direccios.CodigoPostal
                };

                Nombre.value = Direccios.Nombre;
                Apellido.value = Direccios.Apellido;
                Telefono.value = Direccios.Telefono;
                Calle.value = Direccios.Direccion;
                Numeracion.value = Direccios.Numeracion;
                Ciudad.value = Direccios.Ciudad;
                Provincia.value = Direccios.Provincia;
                CP.value = Direccios.CodigoPostal;
                VerificarDatos();
                añadirLocalStorage('direccion',Direccion);
            }
           }); 
        })

        
}

// Verificar que esten todos los datos completados
function VerificarDatos() {
    if(Nombre.value == '' || Apellido.value == '' || Telefono.value == '' || Calle.value == '' || Numeracion.value == '' || Ciudad.value == '' || Provincia.value == '' || CP.value == '' ){
        BotonPagar.href='';
    }else{
        BotonPagar.href='/pasarela';
    }
}

function añadirLocalStorage(key,productos){
    return localStorage.setItem(key, JSON.stringify(productos));
}



export default checkout;