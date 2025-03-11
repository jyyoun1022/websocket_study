
import * as THREE from './build/three.module.js';
import { matchClasses } from './matchClasses.js';
import { setObjectInformation } from './setObjectInformation.js';
import { drawObjectsInRgbCanvas } from "./setObjectsInRgbCanvas.js";
import { getBox3 } from "./getBox3.js";
import {objects, globalData, settingData, cuboideData, box3Data, cylinderData, sphereData} from './variables.js';


function changeObjectList(){


    const targetIndex = objects.object3Ds.findIndex((object)=>{
        return object.objectUUID === globalData.objectTarget;
    });

    const choiceGroup = objects.object3Ds[targetIndex];
    objects.object3Ds.forEach((group, index) =>{
        if(index === targetIndex){
            group.children.forEach((obj)=>{
                const name = obj.name.substring(obj.name.length-6, obj.name.length);
                if(name === "Sphere"){
                    if(settingData.visibleObjectSphere) obj.visible = true;
                }
            });
        }else{
            group.children.forEach((obj)=>{
                const name = obj.name.substring(obj.name.length-6, obj.name.length);
                if(name === "Sphere"){
                    obj.visible = false;
                }else{
                    obj.visible = true;
                }
            });
        }
    });

    // 선택된 오브젝트그룹에 카메라 셋팅
    setChildCameras();


    // 선택된 오브젝트그룹의 tagList들을 확인하여 objectTag select의 option값이나 input값 조절
    const objectTagList = objectTagWrap.children;
    for(let i=0 ; i<objectTagList.length ; i++){
        if(objectTagList[i].tagValTypeCd === "30"){
            const options = objectTagList[i].children[2].children[0].options;
            options[0].selected = true;
        }else if(objectTagList[i].tagValTypeCd === "20") {
            const input = objectTagList[i].children[2].children[0];
            input.value = "";
        }
    }
    choiceGroup.tagList.forEach((list)=>{
        for(let i=0 ; i<objectTagList.length ; i++){
            if(list.tagId === objectTagList[i].tagId){
                if(objectTagList[i].tagValTypeCd === "30"){
                    const options = objectTagList[i].children[2].children[0].options;
                    for (let j = 0; j < options.length; j++) {
                        if (options[j].value === list.val) {
                            options[j].selected = true;
                            break;
                        }
                    }
                }else if(objectTagList[i].tagValTypeCd === "20"){
                    if(list.val !== undefined){
                        const input = objectTagList[i].children[2].children[0];
                        input.value = list.val;
                    }
                }
            }
        }
    });

    function setChildCameras(){
        const dir = new THREE.Vector3();
        const mesh = choiceGroup.children[0];
        const distance = 3;
        getBox3(mesh);

        for(let i=2 ; i<5 ; i++){
            (i===2) ? dir.set(0,0,1) : (i===3) ? dir.set(0,1,0) : dir.set(1,0,0), objects.cameras[4].up.set(0,0,1);
            choiceGroup.add(objects.cameras[i]);
        }

        if(mesh.name === "cube"){

            const downSphere = choiceGroup.getObjectByName("downSphere");
            const leftSphere = choiceGroup.getObjectByName("leftSphere");
            const frontSphere = choiceGroup.getObjectByName("frontSphere");
            objects.cameras[2].far = box3Data.box3Z + distance;
            objects.cameras[3].far = box3Data.box3Y + distance;
            objects.cameras[4].far = box3Data.box3X + distance;
            objects.cameras[2].position.z = frontSphere.position.z;
            objects.cameras[3].position.y = downSphere.position.y;
            objects.cameras[4].position.x = leftSphere.position.x;

        }else if(mesh.name === "cylinder"){

            objects.cameras[2].far = box3Data.box3Z + distance;
            objects.cameras[3].far = box3Data.box3Y + distance;
            objects.cameras[4].far = box3Data.box3X + distance;
            objects.cameras[2].position.z = (box3Data.box3Z/2+(sphereData.gap+0.5));
            objects.cameras[4].position.x = -(box3Data.box3X/2+(sphereData.gap+0.5));
            objects.cameras[3].position.y = -(box3Data.box3Y/2+(sphereData.gap+0.5));

        }



    }

    matchClasses();
    setObjectInformation(choiceGroup);
    drawObjectsInRgbCanvas();
}


    export { changeObjectList }