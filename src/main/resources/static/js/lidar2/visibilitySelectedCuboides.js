import {drawObjectsInRgbCanvas} from "./setObjectsInRgbCanvas.js";

function visibilitySelectedCuboides(objects, globalData, settingData, target){

    if(!globalData.allowAllEvents){
        return;
    }


    let selectedCuboides = [];

    if(globalData.selectedCuboides.length){
        //array 얕은 복사
        selectedCuboides = [...globalData.selectedCuboides];
    }else{
        selectedCuboides = [...objects.cuboides];
    }

    selectedCuboides.forEach((group)=>{
        if(globalData.cubeAllVisibility){
            group.visible = false;
            if(target !== undefined) target.innerText = "visibility_off";
        }else{
            group.visible = true;
            if(target !== undefined) target.innerText = "visibility";
        }
    });

    for(let i=0; i<cuboideWrap.children.length ; i++){
        let ul, icon;
        ul = cuboideWrap.children[i];

        for(let j=0; j<selectedCuboides.length ; j++){
            if(ul.id !== "classPopUpWrap" && ul.cuboideUUID === selectedCuboides[j].cuboideUUID){
                icon = ul.children[6].children[0];
                if (globalData.cubeAllVisibility) {
                    icon.innerText = "visibility_off";
                } else {
                    icon.innerText = "visibility";
                }
                break;
            }
        }
    }

    drawObjectsInRgbCanvas(objects, globalData, settingData);

    (globalData.cubeAllVisibility) ? globalData.cubeAllVisibility = false : globalData.cubeAllVisibility = true;
}

export { visibilitySelectedCuboides }