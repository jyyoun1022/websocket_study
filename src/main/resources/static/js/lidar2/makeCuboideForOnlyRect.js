
import { makeCuboide } from "./cuboide.js";
import { moveScreen } from "./setKeys.js";
import { matchClasses } from "./matchClasses.js";
import { drawObjectsInRgbCanvas } from "./setObjectsInRgbCanvas.js";
import { objects, cuboideData, globalData } from './variables.js';



function makeCuboideForOnlyRect(){

    if(!globalData.allowAllEvents) return;

    // 모든 cuboides의 sphere를 안보이게 함
    objects.object3Ds.forEach((group)=>{
        group.children.forEach((obj, index)=>{
            if(index !== 0 && index !== 1){
                obj.visible = false;
            }
        });
    });

    cuboideData.position = { x:0,  y:0, z:0 };
    cuboideData.onlyRect = true;

    // cuboide list index값 셋팅
    (globalData.objectListIndex === null) ? globalData.objectListIndex = 0 : globalData.objectListIndex ++;

    makeCuboide();
    moveScreen();
    matchClasses();
    drawObjectsInRgbCanvas();

}

export { makeCuboideForOnlyRect }