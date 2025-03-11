
import { makeSvg } from './makeSvg.js';
import { changeSvgList } from './changeSvgList.js';
import { changeObjectList } from './changeObjectList.js';
import { changeObjectMultiSelect } from "./setObjectMultiSelect.js";
import { deleteObject } from "./deleteObject.js";
import { drawObjectsInRgbCanvas } from "./setObjectsInRgbCanvas.js";
import { objects, globalData, cuboideData } from './variables.js';



function makeObjectList(){

    const index = globalData.objectListIndex;
    const uuid = globalData.objectTarget;

    const ul = document.createElement( 'ul' );
    const li1 = document.createElement( 'li' );
    const li2 = document.createElement( 'li' );
    const li3 = document.createElement( 'li' );
    const li4 = document.createElement( 'li' );
    const li5 = document.createElement( 'li' );
    const li6 = document.createElement( 'li' );
    const li7 = document.createElement( 'li' );
    const li8 = document.createElement( 'li' );

    ul.className = "cuboideList";
    ul.objectUUID = uuid;
    ul.objectShape = globalData.objectTargetShape;
    ul.usedAutoButton = false;
    ul.onlyRect = cuboideData.onlyRect;
    li1.innerHTML = `<input type='checkbox' id='${ uuid }'> <label for='${ uuid }'></label>`;
    li2.innerHTML = "#" + index;
    li3.innerHTML = globalData.defaultClass.name;
    li4.innerHTML = "<a class='material-icons' name='bboxAutoIcon' title='Make Bbox Auto'>fit_screen</a>";
    li5.innerHTML = "<a class='material-icons-outlined' title='Make Bbox Manual'>fit_screen</a>";
    li6.innerHTML = "<a class='material-icons' title='Change Class'>more_horiz</a>";
    li7.innerHTML = "<a class='material-icons' title='Show/Hide'>visibility</a>";
    li8.innerHTML = "<a class='material-icons' title='Delete'>delete</a>";
    let label = li1.querySelector('label');
  
    label.style.backgroundColor = globalData.defaultClass.color;


    for(let i=0 ; i<objectWrap.children.length ; i++){
        objectWrap.children[i].classList.remove("on");
    }
    ul.classList.add("on");

    for(let i=0 ; i<objectTagWrap.children.length ; i++){
        if(objectTagWrap.children[i].tagValTypeCd === "30") {
            objectTagWrap.children[i].querySelector("select").children[0].selected = true;
        }else if(objectTagWrap.children[i].tagValTypeCd === "20") {
            objectTagWrap.children[i].querySelector("input").value = "";
        }
    }

    // cuboide 선택
    ul.addEventListener('click', function(e){

        globalData.objectTarget = this.objectUUID;
        globalData.objectTargetShape = this.objectShape;

        for(let i=0 ; i<objectWrap.children.length ; i++){
            objectWrap.children[i].classList.remove("on");
        }

        this.classList.add("on");

        changeObjectList();
        changeSvgList();

    });


    // checkbox
    li1.children[0].addEventListener('change', function(e){
        changeObjectMultiSelect(this.checked, this.id);
    });


    // make auto svg
    li4.children[0].addEventListener('click', function(e){

        if(!globalData.allowAllEvents) return;
        const targetUL = this.parentElement.parentElement;
        autoMakeSvg(targetUL);
        e.stopPropagation();

    });


    // make nonAuto svg
    li5.children[0].addEventListener('click', function(e){

        if(!globalData.allowAllEvents) return;
        const targetUL = this.parentElement.parentElement;
        manualMakeSvg(targetUL);
        e.stopPropagation();

    });


    // class popUp
    li6.children[0].addEventListener('click', function(e){

        if(!globalData.allowAllEvents) return;
        globalData.objectTarget = this.parentElement.parentElement.objectUUID;
        classPopUpWrap.style.display = "block";
        const boundRect = this.getBoundingClientRect();
        classPopUpWrap.style.top = (boundRect.top - boundRect.height - 50) + "px";
        classPopUpWrap.style.right = "10px";
        e.stopPropagation();
    });

   
    // object visible
    li7.children[0].addEventListener('click', function(e){

        // if(!globalData.allowAllEvents) return;

        globalData.objectTarget = this.parentElement.parentElement.objectUUID;
        const targetIndex = objects.object3Ds.findIndex((object)=>{
            return object.objectUUID === globalData.objectTarget;
        });

        if(objects.object3Ds[targetIndex].visible){
            objects.object3Ds[targetIndex].visible = false;
            this.innerText = "visibility_off";
        }else{
            objects.object3Ds[targetIndex].visible = true;
            this.innerText = "visibility";
        }
        drawObjectsInRgbCanvas();
        e.stopPropagation();
    });


    // cuboide delete
    li8.children[0].addEventListener('click', function(e){

        deleteObject(this);
        drawObjectsInRgbCanvas();
        e.stopPropagation();

    });

    // RGBCamera가 없는경우 BBox만드는 버튼만 삭제, li는 UI를 위해서 유지
    if(!globalData.hasRGBCamera){
        li4.innerHTML = "";
        li5.innerHTML = "";
    }

    // object가 cylinder일경우 BBox만드는 버튼만 삭제, li는 UI를 위해서 유지
    if(globalData.objectTargetShape === "cylinder"){
        li4.innerHTML = "";
        li5.innerHTML = "";
    }



    ul.append(li1, li2, li3, li4, li5, li6, li7, li8);

    return ul;

}

function autoMakeSvg(targetUL){

    if(targetUL.usedAutoButton || targetUL.onlyRect) return;

    targetUL.usedAutoButton = true;

    globalData.objectTarget = targetUL.objectUUID;

    const targetIndex = objects.object3Ds.findIndex((object)=>{
        return object.objectUUID === globalData.objectTarget;
    });

    for(let i=0 ; i<objectWrap.children.length ; i++){
        objectWrap.children[i].classList.remove("on");
    }

    targetUL.classList.add("on");

    makeSvg(objects.object3Ds[targetIndex],"auto");
    changeSvgList();
}


function manualMakeSvg(targetUL){

    globalData.objectTarget = targetUL.objectUUID;

    const targetIndex = objects.object3Ds.findIndex((object)=>{
        return object.objectUUID === globalData.objectTarget;
    });

    makeSvg(objects.object3Ds[targetIndex], "nonAuto");
    changeSvgList();

}

export { makeObjectList, autoMakeSvg, manualMakeSvg }