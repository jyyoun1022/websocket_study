
import { matchClasses } from "./matchClasses.js";
import { removeObject } from './removeObject.js';
import {drawObjectsInRgbCanvas} from "./setObjectsInRgbCanvas.js";
import { setObjectListIndex } from "./setObjectListIndex.js";
import { objects, globalData, screen } from './variables.js';

function deleteObject(target){

    if(!globalData.allowAllEvents){
        return;
    }

    // list에서 delete icon을 클릭하여 큐브를 삭제하면 target에 icon이 들어오는데
    // delete key를 눌러서 큐브를 삭제하면 target에 아무것도 안들어옴
    if(target !== undefined) globalData.objectTarget = target.parentElement.parentElement.objectUUID;

    const targetIndex = objects.object3Ds.findIndex((object)=>{
        return object.objectUUID === globalData.objectTarget;
    });

    removeObject(objects.object3Ds[targetIndex], screen.scene, "groupTotal");
    objects.object3Ds.splice(targetIndex, 1);
    if(target !== undefined){
        target.parentElement.parentElement.remove();
    }else{
        for(let i=0 ; i < objectWrap.children.length ; i++){
            if (objectWrap.children[i].objectUUID === globalData.objectTarget) {
                objectWrap.children[i].remove();
                break;
            }
        }
    }


    // 한 object당 여러개의 rect가 있을수 있기에 svgs 배열을 다시 구성함
    // delete를 사용하면 objects.svgs에 length값이 있기 때문에 다른 function에서 문제됨
    let svgsTemp = [];
    objects.svgs.forEach((g)=>{
        if(g.objectUUID === globalData.objectTarget){
            svgSpace.removeChild(g);
        }else{
            svgsTemp.push(g);
        }
    });
    objects.svgs = svgsTemp;

    globalData.objectTarget = null;

    matchClasses();
    drawObjectsInRgbCanvas();
    setObjectListIndex();

}

export { deleteObject }
