const MenuMostrar = document.querySelector('.MenuMostrar');
const menuMobile = document.querySelector('.MenuNavegacion');

MenuMostrar.addEventListener('click',function(){
    menuMobile.classList.toggle('Visible');
})


export default menuMobile;