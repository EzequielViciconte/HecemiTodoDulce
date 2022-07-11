const Slider = [...document.querySelectorAll('.SliderImg')],
    Next = document.querySelector('#Next'),
    Back = document.querySelector('#Back'),
    ImgChica = document.querySelector('#ImgChica1'),
    ImgChica2 = document.querySelector('#ImgChica2'),
    ImgChica3 = document.querySelector('#ImgChica3')
let Value;

if(Next && Back) 
{
    Next.addEventListener('click', () => CambiarPosicion(1));
    Back.addEventListener('click', () => CambiarPosicion(-1));
}


function CambiarPosicion(change) {
    const ElementoActivo = Number(document.querySelector('.show').dataset.id);
    Value = ElementoActivo;
    Value += change;


    if (Value === 1) {
        Back.classList.add('Invisible')
        ImgChica1.classList.toggle('Activo');
        ImgChica2.classList.toggle('Activo');

    } else if (Value === 2) {
        Back.classList.remove('Invisible');
        Next.classList.remove('Invisible');
        ImgChica1.classList.remove('Activo');
        ImgChica2.classList.add('Activo');
        ImgChica3.classList.remove('Activo');


    } else if (Value === 3) {
        Next.classList.add('Invisible');
        ImgChica2.classList.remove('Activo');
        ImgChica3.classList.add('Activo');

    }


    Slider[ElementoActivo - 1].classList.toggle('show');
    Slider[Value - 1].classList.toggle('show');
}

export default Slider;