import * as THREE from './build/three.module.js';
import { classPopUpUI } from './classPopUpUI.js';
import { matchClasses } from './matchClasses.js';
import { changeObjectList } from './changeObjectList.js';
import { drawObjectsInRgbCanvas } from "./setObjectsInRgbCanvas.js";
import { changeSvgColor } from "./makeSvg.js";
import { objects, globalData } from './variables.js';


function setClassPopUp(){

    objectWrap.innerHTML = classPopUpUI;

    // popUp close 버튼
    btnClassPopUpClose.addEventListener('click', function(e){
        classPopUpWrap.style.display = "none";
    });

    objects.classes.forEach((obj)=>{
        const ul = document.createElement( 'ul' );
        const li1 = document.createElement( 'li' );
        const li2 = document.createElement( 'li' );
        const li3 = document.createElement( 'li' );
        ul.classId = obj.classId;
        ul.classColor = obj.color;
        ul.className =  obj.className;

        li1.innerHTML = `<span class='circle1'></span>`;
        li1.children[0].style.backgroundColor = obj.color;
        li2.innerHTML = `${ obj.className }`;
        li3.innerHTML = `${ obj.hotkeyName }`;

        ul.append(li1, li2, li3);
        classPopUpContent.appendChild(ul);

        // class 선택 이벤트
        ul.addEventListener('click', function(e){
            globalData.class.number = this.classId;
            globalData.class.color = this.classColor;
            globalData.class.name = this.className;
            classPopUpWrap.style.display = "none";

            if(globalData.changeAllClass === false){

                changeClass();

            }else{

                let objectLists = [];
                let tempObjectTarget = globalData.objectTarget;
                if(globalData.selectedObjects.length){
                    objectLists = globalData.selectedObjects;
                }else{
                    objectLists = objects.object3Ds;
                }
                objectLists.forEach((list)=>{
                    globalData.objectTarget = list.objectUUID;
                    changeClass();
                });
                globalData.objectTarget = tempObjectTarget;
                globalData.changeAllClass = false;

            }


        });

    });


}

function changeClass(){

    // object3Ds group 배열에서 선택한 object group 찾기
    const objectIndex = objects.object3Ds.findIndex((object)=>{
        return object.objectUUID === globalData.objectTarget;
    });

    // object list 중에서 선택한 object list 찾기
    let objectListIndex;
    for(let i=0 ; i<objectWrap.children.length; i++){
        if(objectWrap.children[i].objectUUID === globalData.objectTarget){
            objectListIndex = i;
            break;
        }
    }

    // object 색상 변경, classId 변경
    const geometry = objects.object3Ds[objectIndex].children[0];
    geometry.material.color = new THREE.Color(globalData.class.color);
    geometry.classId = globalData.class.number;

    // list circle 색상, title 변경
    const objectList = objectWrap.children[objectListIndex];
    objectList.children[0].querySelector('label').style.backgroundColor = globalData.class.color;
    objectList.children[2].innerHTML = globalData.class.name;


    // cuboide target 변경
    globalData.objectTarget = objects.object3Ds[objectIndex].objectUUID;
    for(let i=0 ; i<objectWrap.children.length ; i++){
        objectWrap.children[i].classList.remove("on");
    }
    objectList.classList.add("on");
    changeObjectList();


    // cuboide class에 맞는 tag만을 보여줌
    matchClasses();

    // svg stroke 색상 변경
    changeSvgColor();

    drawObjectsInRgbCanvas();


}

export { setClassPopUp, changeClass }