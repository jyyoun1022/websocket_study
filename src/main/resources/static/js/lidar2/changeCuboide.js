
import * as THREE from "./build/three.module.js";
import { drawObjectsInRgbCanvas } from "./setObjectsInRgbCanvas.js";
import { setObjectInformation } from "./setObjectInformation.js";
import { getBox3 } from "./getBox3.js";
import { makeWireFrame } from "./makeWireFrame.js";
import { box3Data, cuboideData, globalData, objects, settingData, sphereData } from "./variables.js";

const cubeAttributes = [
    [0,3,6,9,27,33,39,45,51,57,60,66],          // 우측판 확대 축소
    [12,15,18,21,24,30,48,54,42,36,63,69],      // 좌측판 확대 축소
    [25,28,31,34,1,4,13,16,49,52,61,64],        // 위측판 확대 축소
    [37,40,43,46,7,10,19,22,55,58,70,67],       // 아랫판 확대 축소
    [50,53,56,59,32,35,2,8,17,23,38,41],        // 앞쪽판 확대 축소
    [62,65,68,71,5,11,14,20,26,29,44,47]        // 뒤쪽판 확대 축소
];

const frontCubeData = {
    position : { x:0, y:0, z:0 },
    size     : { w:0.1, h:1, d:0.1 },
    opacity  : 0.7
};

function changeCuboide(){


    if(!objects.object3Ds.length || !globalData.allowAllEvents){
        return;
    }

    const index = objects.object3Ds.findIndex((cuboide)=>{
        return cuboide.objectUUID === globalData.objectTarget;
    });

    const group = objects.object3Ds[index];

    // 여러 큐브 객체마다 sphere를 각각 조정해야 하기 때문에 큐브에서 sphere를 찾아서 조절해야함
    const upSphere = group.getObjectByName("upSphere");
    const downSphere = group.getObjectByName("downSphere");
    const rightSphere = group.getObjectByName("rightSphere");
    const leftSphere = group.getObjectByName("leftSphere");
    const frontSphere = group.getObjectByName("frontSphere");
    const backSphere = group.getObjectByName("backSphere");
    const cube = group.getObjectByName("cube");
    const frontCube = group.getObjectByName("frontCube");
    const rot = group.rotation.z;
    const rotPos = new THREE.Vector3();
    cube.geometry.computeBoundingBox();
    getBox3(cube);


    if(cuboideData.sort === "size"){

        if(cuboideData.way === "xrP"){
            objects.cameras[4].far += cuboideData.value;
            cubeAttributes[0].forEach((number)=>{ cube.geometry.attributes.position.array[number] += cuboideData.value; });
        }else if(cuboideData.way === "xrM" && box3Data.initWidth < box3Data.box3X){
            objects.cameras[4].far -= cuboideData.value;
            cubeAttributes[0].forEach((number)=>{ cube.geometry.attributes.position.array[number] += cuboideData.value; });
        }else if(cuboideData.way === "xlP"){
            objects.cameras[4].far += cuboideData.value;
            objects.cameras[4].position.x = leftSphere.position.x;
            cubeAttributes[1].forEach((number)=>{ cube.geometry.attributes.position.array[number] += -cuboideData.value; });
        }else if(cuboideData.way === "xlM" && box3Data.initWidth < box3Data.box3X){
            objects.cameras[4].far -= cuboideData.value;
            objects.cameras[4].position.x = leftSphere.position.x;
            cubeAttributes[1].forEach((number)=>{ cube.geometry.attributes.position.array[number] += -cuboideData.value; });
        }else if(cuboideData.way === "ytP"){
            objects.cameras[3].far += cuboideData.value;
            cubeAttributes[2].forEach((number)=>{ cube.geometry.attributes.position.array[number] += cuboideData.value; });
        }else if(cuboideData.way === "ytM" && box3Data.initHeight < box3Data.box3Y){
            objects.cameras[3].far -= cuboideData.value;
            cubeAttributes[2].forEach((number)=>{ cube.geometry.attributes.position.array[number] += cuboideData.value; });
        }else if(cuboideData.way === "ybP"){
            objects.cameras[3].far += cuboideData.value;
            objects.cameras[3].position.y = downSphere.position.y;
            cubeAttributes[3].forEach((number)=>{ cube.geometry.attributes.position.array[number] += -cuboideData.value; });
        }else if(cuboideData.way === "ybM" && box3Data.initHeight < box3Data.box3Y){
            objects.cameras[3].far -= cuboideData.value;
            objects.cameras[3].position.y = downSphere.position.y;
            cubeAttributes[3].forEach((number)=>{ cube.geometry.attributes.position.array[number] += -cuboideData.value; });
        }else if(cuboideData.way === "zfP"){
            objects.cameras[2].far += cuboideData.value;
            objects.cameras[2].position.z = frontSphere.position.z;
            cubeAttributes[4].forEach((number)=>{ cube.geometry.attributes.position.array[number] += cuboideData.value; });
        }else if(cuboideData.way === "zfM" && box3Data.initDepth < box3Data.box3Z){
            objects.cameras[2].far -= cuboideData.value;
            objects.cameras[2].position.z = frontSphere.position.z;
            cubeAttributes[4].forEach((number)=>{ cube.geometry.attributes.position.array[number] += cuboideData.value; });
        }else if(cuboideData.way === "zbP"){
            objects.cameras[2].far += cuboideData.value;
            cubeAttributes[5].forEach((number)=>{ cube.geometry.attributes.position.array[number] += -cuboideData.value; });
        }else if(cuboideData.way === "zbM" && box3Data.initDepth < box3Data.box3Z){
            objects.cameras[2].far -= cuboideData.value;
            cubeAttributes[5].forEach((number)=>{ cube.geometry.attributes.position.array[number] += -cuboideData.value; });
        }

        cube.geometry.attributes.position.needsUpdate = true;

    }else if(cuboideData.sort == "position"){

        if(cuboideData.way == "pxP" || cuboideData.way == "pxM"){
            rotPos.x = Math.cos(rot) * cuboideData.value;
            rotPos.y = Math.sin(rot) * cuboideData.value;
        }else if(cuboideData.way == "pyP" || cuboideData.way == "pyM"){
            rotPos.x = Math.sin(-rot) * cuboideData.value;
            rotPos.y = Math.cos(-rot) * cuboideData.value;
        }else if(cuboideData.way == "pzP" || cuboideData.way == "pzM") {
            rotPos.z = cuboideData.value;
        }

        group.position.x += rotPos.x;
        group.position.y += rotPos.y;
        group.position.z += rotPos.z;


    }else if(cuboideData.sort == "rotation"){

        if(cuboideData.way == "rzP" || cuboideData.way == "rzM") {
            rotateAboutPoint(group, box3Data.objectBox3Center, new THREE.Vector3(0, 0, 1), cuboideData.value);
        }else if(cuboideData.way == "rxP" || cuboideData.way == "rxM"){
            rotateAboutPoint(group, box3Data.objectBox3Center, new THREE.Vector3(1, 0, 0), cuboideData.value);
        }

    }

    cube.geometry.computeBoundingBox();
    getBox3(cube);

    if(settingData.visibleWireFrame) makeWireFrame(cube);

    if(cuboideData.iskeyboard){
        if(cuboideData.way === "ytP" || cuboideData.way === "ytM"){
            upSphere.position.y = box3Data.pointBox3Center.y + (box3Data.pointBox3Size.y/2+sphereData.gap);
            frontCube.position.y = box3Data.pointBox3Center.y + (box3Data.pointBox3Size.y/2+frontCubeData.size.h/2);
        }else if(cuboideData.way === "ybP" || cuboideData.way === "ybM"){
            downSphere.position.y = box3Data.pointBox3Center.y - (box3Data.pointBox3Size.y/2+sphereData.gap);
        }else if(cuboideData.way === "xrP" || cuboideData.way === "xrM"){
            rightSphere.position.x = box3Data.pointBox3Center.x + (box3Data.pointBox3Size.x/2+sphereData.gap);
        }else if(cuboideData.way === "xlP" || cuboideData.way === "xlM"){
            leftSphere.position.x = box3Data.pointBox3Center.x - (box3Data.pointBox3Size.x/2+sphereData.gap);
        }else if(cuboideData.way === "zfP" || cuboideData.way === "zfM"){
            frontSphere.position.z = box3Data.pointBox3Center.z + (box3Data.pointBox3Size.z/2+sphereData.gap);
        }else if(cuboideData.way === "zbP" || cuboideData.way === "zbM"){
            backSphere.position.z = box3Data.pointBox3Center.z - (box3Data.pointBox3Size.z/2+sphereData.gap);
        }
    }

    upSphere.position.x = box3Data.pointBox3Center.x;
    upSphere.position.z = box3Data.pointBox3Center.z;
    downSphere.position.x = box3Data.pointBox3Center.x;
    downSphere.position.z = box3Data.pointBox3Center.z;
    rightSphere.position.y = box3Data.pointBox3Center.y;
    rightSphere.position.z = box3Data.pointBox3Center.z;
    leftSphere.position.y = box3Data.pointBox3Center.y;
    leftSphere.position.z = box3Data.pointBox3Center.z;
    frontSphere.position.x = box3Data.pointBox3Center.x;
    frontSphere.position.y = box3Data.pointBox3Center.y;
    backSphere.position.x = box3Data.pointBox3Center.x;
    backSphere.position.y = box3Data.pointBox3Center.y;
    frontCube.position.x = box3Data.pointBox3Center.x;
    frontCube.position.z = box3Data.pointBox3Center.z;



    cuboideData.sort = null;
    cuboideData.way = null;
    cuboideData.iskeyboard = false;

    setObjectInformation(group);
    drawObjectsInRgbCanvas();


    function rotateAboutPoint(obj, point, axis, theta, pointIsWorld){

        pointIsWorld = (pointIsWorld === undefined)? false : pointIsWorld;
        if(pointIsWorld){
            obj.parent.localToWorld(obj.position);
        }
        obj.position.sub(point);
        obj.position.applyAxisAngle(axis, theta);
        obj.position.add(point);
        if(pointIsWorld){
            obj.parent.worldToLocal(obj.position);
        }
        obj.rotateOnAxis(axis, theta);
    }


}


export { changeCuboide }