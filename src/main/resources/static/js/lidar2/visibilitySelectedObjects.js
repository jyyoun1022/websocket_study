

import { drawObjectsInRgbCanvas } from "./setObjectsInRgbCanvas.js";
import { objects, globalData } from './variables.js';



function visibilitySelectedObjects(target){

    // if(!globalData.allowAllEvents){
    //     return;
    // }

    let selectedObjects = [];

    if(globalData.selectedObjects.length){
        //array 얕은 복사
        selectedObjects = [...globalData.selectedObjects];
    }else{
        selectedObjects = [...objects.object3Ds];
    }

    selectedObjects.forEach((group)=>{
        if(globalData.objectAllVisibility){
            group.visible = false;
            if(target !== undefined) target.innerText = "visibility_off";
        }else{
            group.visible = true;
            if(target !== undefined) target.innerText = "visibility";
        }
    });

    for(let i=0; i<objectWrap.children.length ; i++){
        let ul, icon;
        ul = objectWrap.children[i];

        for(let j=0; j<selectedObjects.length ; j++){
            if(ul.id !== "classPopUpWrap" && ul.objectUUID === selectedObjects[j].objectUUID){
                icon = ul.children[6].children[0];
                if (globalData.objectAllVisibility) {
                    icon.innerText = "visibility_off";
                } else {
                    icon.innerText = "visibility";
                }
                break;
            }
        }
    }

    drawObjectsInRgbCanvas();

    (globalData.objectAllVisibility) ? globalData.objectAllVisibility = false : globalData.objectAllVisibility = true;
}

export { visibilitySelectedObjects }