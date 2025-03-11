
import { makeSvg } from './makeSvg.js';
import { changeSvgList } from './changeSvgList.js';
import { changeCuboideList } from './changeCuboideList.js';
import { changeCuboideMultiSelect } from "./setCuboideMultiSelect.js";
import { deleteCuboide } from "./deleteCuboide.js";
import {drawObjectsInRgbCanvas} from "./setObjectsInRgbCanvas.js";



function makeCuboideList(objects, events, globalData, svgData, settingData, screen, cuboideData){

    const index = globalData.cuboideListIndex;
    const uuid = globalData.cuboideTarget;

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
    ul.cuboideUUID = uuid;
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
    for(let i=0 ; i<cuboideWrap.children.length ; i++){
        cuboideWrap.children[i].classList.remove("on");
    }
    ul.classList.add("on");

    for(let i=0 ; i<cuboideTagWrap.children.length ; i++){
        if(cuboideTagWrap.children[i].tagValTypeCd === "30") {
            cuboideTagWrap.children[i].querySelector("select").children[0].selected = true;
        }else if(cuboideTagWrap.children[i].tagValTypeCd === "20") {
            cuboideTagWrap.children[i].querySelector("input").value = "";
        }
    }

    // cuboide 선택
    ul.addEventListener('click', function(e){

        globalData.cuboideTarget = this.cuboideUUID;

        for(let i=0 ; i<cuboideWrap.children.length ; i++){
            cuboideWrap.children[i].classList.remove("on");
        }

        this.classList.add("on");

        changeCuboideList(objects, globalData, settingData, cuboideData);
        changeSvgList(objects, globalData, settingData);

    });


    // checkbox
    li1.children[0].addEventListener('change', function(e){
        changeCuboideMultiSelect(this.checked, this.id, objects, globalData );
    });


    // make auto svg
    li4.children[0].addEventListener('click', function(e){

        if(!globalData.allowAllEvents) return;
        const targetUL = this.parentElement.parentElement;
        autoMakeSvg(targetUL, objects, events, globalData, svgData, settingData, screen, cuboideData);
        e.stopPropagation();

    });


    // make nonAuto svg
    li5.children[0].addEventListener('click', function(e){

        if(!globalData.allowAllEvents) return;
        const targetUL = this.parentElement.parentElement;
        manualMakeSvg(targetUL, objects, events, globalData, svgData, settingData, screen, cuboideData);
        e.stopPropagation();

    });


    // class popUp
    li6.children[0].addEventListener('click', function(e){

        if(!globalData.allowAllEvents) return;
        globalData.cuboideTarget = this.parentElement.parentElement.cuboideUUID;
        classPopUpWrap.style.display = "block";
        const boundRect = this.getBoundingClientRect();
        classPopUpWrap.style.top = (boundRect.top - boundRect.height - 50) + "px";
        classPopUpWrap.style.right = "10px";
        e.stopPropagation();
    });

   
    // cuboide visible
    li7.children[0].addEventListener('click', function(e){


        if(!globalData.allowAllEvents) return;
        globalData.cuboideTarget = this.parentElement.parentElement.cuboideUUID;
        const targetIndex = objects.cuboides.findIndex((cuboide)=>{
            return cuboide.cuboideUUID === globalData.cuboideTarget;
        });

        if(objects.cuboides[targetIndex].visible){
            objects.cuboides[targetIndex].visible = false;
            this.innerText = "visibility_off";
        }else{
            objects.cuboides[targetIndex].visible = true;
            this.innerText = "visibility";
        }
        drawObjectsInRgbCanvas(objects, globalData, settingData);
        e.stopPropagation();
    });


    // cuboide delete
    li8.children[0].addEventListener('click', function(e){

        deleteCuboide(objects, globalData, screen, settingData, this);
        drawObjectsInRgbCanvas(objects, globalData, settingData);
        e.stopPropagation();

    });

    // RGBCamera가 없는경우 BBox만드는 버튼만 삭제, li는 UI를 위해서 유지
    if(!globalData.hasRGBCamera){
        li4.innerHTML = "";
        li5.innerHTML = "";
    }

    ul.append(li1, li2, li3, li4, li5, li6, li7, li8);

    return ul;

}

function autoMakeSvg(targetUL, objects, events, globalData, svgData, settingData, screen, cuboideData){

    if(targetUL.usedAutoButton || targetUL.onlyRect) return;

    targetUL.usedAutoButton = true;

    globalData.cuboideTarget = targetUL.cuboideUUID;

    const targetIndex = objects.cuboides.findIndex((cuboide)=>{
        return cuboide.cuboideUUID === globalData.cuboideTarget;
    });

    for(let i=0 ; i<cuboideWrap.children.length ; i++){
        cuboideWrap.children[i].classList.remove("on");
    }

    targetUL.classList.add("on");

    makeSvg(objects.cuboides[targetIndex], objects, events, globalData, svgData, settingData, screen, cuboideData, "auto");

    changeSvgList(objects, globalData, settingData);
}


function manualMakeSvg(targetUL, objects, events, globalData, svgData, settingData, screen, cuboideData){

    globalData.cuboideTarget = targetUL.cuboideUUID;

    const targetIndex = objects.cuboides.findIndex((cuboide)=>{
        return cuboide.cuboideUUID === globalData.cuboideTarget;
    });

    makeSvg(objects.cuboides[targetIndex], objects, events, globalData, svgData, settingData, screen, cuboideData, "nonAuto");
    changeSvgList(objects, globalData, settingData);

}

export { makeCuboideList, autoMakeSvg, manualMakeSvg }