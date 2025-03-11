import * as THREE from './build/three.module.js';

function controlPopUp(object){

    const title = object.querySelector('.title');
    title.id = "popUpTitle";
    const closeBtn = title.querySelector('.material-icons'); 
    const shift = new THREE.Vector2();
    const size = new THREE.Vector2();

    closeBtn.addEventListener('click', function(e){
        object.style.display = "none";
    });

    const popUpMouseDown = function(event){
        event.preventDefault();
        document.addEventListener('mousemove', popUpMouseMove );
        document.addEventListener('mouseup', popUpMouseUp );
        shift.x = event.clientX - object.getBoundingClientRect().left;
        shift.y = event.clientY - object.getBoundingClientRect().top;
        size.x = object.getBoundingClientRect().width;
        size.y = object.getBoundingClientRect().height;
    }

    const popUpMouseMove = function(event){
        let left = event.clientX - shift.x;
        let top = event.clientY - shift.y;

        if (left < 0) {
            left = 0;
        }else if(left + size.x > window.innerWidth) {
            left = window.innerWidth - size.x;
        }
        if (top < 0) {
            top = 0;
        }else if(top + size.y > window.innerHeight) {
            top =  window.innerHeight - size.y;
        }

        object.style.left = left + "px";
        object.style.top = top + "px";
        
    }

    const popUpMouseUp = function(event){
        document.removeEventListener('mousemove', popUpMouseMove );
        document.removeEventListener('mouseup', popUpMouseUp );
    }

    title.addEventListener('mousedown', popUpMouseDown );

}

export { controlPopUp }