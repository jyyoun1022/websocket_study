
import * as THREE from './build/three.module.js';
import { controlMainCamera } from './controlMainCamera.js';
import { matchClasses } from './matchClasses.js';
import { setCuboideInformation } from './cuboide.js';
import {drawObjectsInRgbCanvas} from "./setObjectsInRgbCanvas.js";

function changeCuboideList(objects, globalData, settingData, cuboideData){

    const dir = new THREE.Vector3();

    const targetIndex = objects.cuboides.findIndex((cuboide)=>{
        return cuboide.cuboideUUID === globalData.cuboideTarget;
    });


    const choiceGroup = objects.cuboides[targetIndex];

    objects.cuboides.forEach((group, index) =>{
        if(index === targetIndex){
            group.children.forEach((obj, index1)=>{
                if(index1 !== 0 && index1 !== 1){
                    if(settingData.visibleCuboideSphere) obj.visible = true;
                }else{
                    obj.visible = true;
                }
            });
        }else{
            group.children.forEach((obj, index2)=>{
                if(index2 !== 0 && index2 !== 1){
                    obj.visible = false;
                }
            });
        }
    });

    // 선택된 큐브그룹에 카메라 셋팅
    for(let i=2 ; i<5 ; i++){
        (i===2) ? dir.set(0,0,1) : (i===3) ? dir.set(0,1,0) : dir.set(1,0,0), objects.cameras[4].up.set(0,0,1);
        choiceGroup.add(objects.cameras[i]);
    }



    // 선택된 큐브그룹의 tagList들을 확인하여 cuboideTag select의 option값이나 input값 조절
    const cuboideTagList = cuboideTagWrap.children;
    for(let i=0 ; i<cuboideTagList.length ; i++){
        if(cuboideTagList[i].tagValTypeCd === "30"){
            const options = cuboideTagList[i].children[2].children[0].options;
            options[0].selected = true;
        }else if(cuboideTagList[i].tagValTypeCd === "20") {
            const input = cuboideTagList[i].children[2].children[0];
            input.value = "";
        }
    }
    choiceGroup.tagList.forEach((list)=>{
        for(let i=0 ; i<cuboideTagList.length ; i++){
            if(list.tagId === cuboideTagList[i].tagId){
                if(cuboideTagList[i].tagValTypeCd === "30"){
                    const options = cuboideTagList[i].children[2].children[0].options;
                    for (let j = 0; j < options.length; j++) {
                        if (options[j].value === list.val) {
                            options[j].selected = true;
                            break;
                        }
                    }
                }else if(cuboideTagList[i].tagValTypeCd === "20"){
                    if(list.val !== undefined){
                        const input = cuboideTagList[i].children[2].children[0];
                        input.value = list.val;
                    }
                }
            }
        }
    });

    //controlMainCamera(choiceGroup.position, objects);
    matchClasses(objects, globalData);
    setCuboideInformation(choiceGroup, cuboideData);
    drawObjectsInRgbCanvas(objects, globalData, settingData);
}


    export { changeCuboideList }