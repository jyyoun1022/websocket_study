
import { matchClasses } from "./matchClasses.js";
import { removeObject } from './removeObject.js';
import {drawObjectsInRgbCanvas} from "./setObjectsInRgbCanvas.js";

function deleteCuboide(objects, globalData, screen, settingData, target){

    if(!globalData.allowAllEvents){
        return;
    }

    // list에서 delete icon을 클릭하여 큐브를 삭제하면 target에 icon이 들어오는데
    // delete key를 눌러서 큐브를 삭제하면 target에 아무것도 안들어옴
    if(target !== undefined) globalData.cuboideTarget = target.parentElement.parentElement.cuboideUUID;

    const targetIndex = objects.cuboides.findIndex((cuboide)=>{
        return cuboide.cuboideUUID === globalData.cuboideTarget;
    });

    removeObject(objects.cuboides[targetIndex], screen.scene, "groupTotal", screen);
    objects.cuboides.splice(targetIndex, 1);
    if(target !== undefined){
        target.parentElement.parentElement.remove();
    }else{
        for(let i=0 ; i < cuboideWrap.children.length ; i++){
            if (cuboideWrap.children[i].cuboideUUID === globalData.cuboideTarget) {
                cuboideWrap.children[i].remove();
                break;
            }
        }
    }


    // 한 cube당 여러개의 rect가 있을수 있기에 svgs 배열을 다시 구성함
    // delete를 사용하면 objects.svgs에 length값이 있기 때문에 다른 function에서 문제됨
    let svgsTemp = [];
    objects.svgs.forEach((g)=>{
        if(g.cuboideUUID === globalData.cuboideTarget){
            svgSpace.removeChild(g);
        }else{
            svgsTemp.push(g);
        }
    });
    objects.svgs = svgsTemp;

    globalData.cuboideTarget = null;

    matchClasses(objects, globalData);
    drawObjectsInRgbCanvas(objects, globalData, settingData);

}

export { deleteCuboide }
