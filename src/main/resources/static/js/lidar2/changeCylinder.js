
import * as THREE from "./build/three.module.js";
import { setObjectInformation } from "./setObjectInformation.js";
import { getBox3 } from "./getBox3.js";
import { makeWireFrame } from "./makeWireFrame.js";
import { box3Data, cylinderData, globalData, objects, settingData, sphereData } from "./variables.js";


function changeCylinder(){


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
    const bottomSphere = group.getObjectByName("bottomSphere");
    const cylinder = group.getObjectByName("cylinder");
    const rot = group.rotation.z;
    const rotPos = new THREE.Vector3();
    cylinder.geometry.computeBoundingBox();
    getBox3(cylinder);

    // cylinderData.size에 의존해서 cylinder를 새롭게 만들기 때문에 모든 param을 선택한 cylinder 기반으로 재정립해야함
    const parameters = cylinder.geometry.parameters;
    cylinderData.size.t = parameters.radiusTop;
    cylinderData.size.b = parameters.radiusBottom;
    cylinderData.size.h = parameters.height;


    if(cylinderData.sort === "size"){

        if(cylinderData.way === "xlP"){
            objects.cameras[2].far += cylinderData.value;
            objects.cameras[2].position.z = (box3Data.box3Z/2+(sphereData.gap+0.5));
            objects.cameras[4].far += cylinderData.value;
            objects.cameras[4].position.x = -(box3Data.box3X/2+(sphereData.gap+0.5));
            cylinderData.size.t += cylinderData.value;
        }else if(cylinderData.way === "xlM") {
            if(objects.cameras[2].far > globalData.ogCameraFar[0]) objects.cameras[2].far -= cylinderData.value;
            objects.cameras[2].position.z = (box3Data.box3Z/2+(sphereData.gap+0.5));
            if(objects.cameras[4].far > globalData.ogCameraFar[2]) objects.cameras[4].far -= cylinderData.value;
            objects.cameras[4].position.x = -(box3Data.box3X/2+(sphereData.gap+0.5));
            cylinderData.size.t -= cylinderData.value;
        }else if(cylinderData.way === "xrP") {
            objects.cameras[2].far += cylinderData.value;
            objects.cameras[2].position.z = (box3Data.box3Z/2+(sphereData.gap+0.5));
            objects.cameras[4].far += cylinderData.value;
            objects.cameras[4].position.x = -(box3Data.box3X/2+(sphereData.gap+0.5));
            cylinderData.size.b += cylinderData.value;
        }else if(cylinderData.way === "xrM") {
            if(objects.cameras[2].far > globalData.ogCameraFar[0]) objects.cameras[2].far -= cylinderData.value;
            objects.cameras[2].position.z = (box3Data.box3Z/2+(sphereData.gap+0.5));
            if(objects.cameras[4].far > globalData.ogCameraFar[2]) objects.cameras[4].far -= cylinderData.value;
            objects.cameras[4].position.x = -(box3Data.box3X/2+(sphereData.gap+0.5));
            cylinderData.size.b -= cylinderData.value;
        }else if(cylinderData.way === "ybP") {
            objects.cameras[3].far += cylinderData.value;
            objects.cameras[3].position.y = -(box3Data.box3Y/2+(sphereData.gap+0.5));
            cylinderData.size.h += cylinderData.value;
        }else if(cylinderData.way === "ybM") {
            if(objects.cameras[3].far > globalData.ogCameraFar[1]) objects.cameras[3].far -= cylinderData.value;
            objects.cameras[3].position.y = -(box3Data.box3Y/2+(sphereData.gap+0.5));
            cylinderData.size.h -= cylinderData.value;
        }else if(cylinderData.way === "ytP") {
            objects.cameras[3].far += cylinderData.value;
            objects.cameras[3].position.y = -(box3Data.box3Y/2+(sphereData.gap+0.5));
            cylinderData.size.h += cylinderData.value;
        }else if(cylinderData.way === "ytM") {
            if(objects.cameras[3].far > globalData.ogCameraFar[1]) objects.cameras[3].far -= cylinderData.value;
            objects.cameras[3].position.y = -(box3Data.box3Y/2+(sphereData.gap+0.5));
            cylinderData.size.h -= cylinderData.value;
        }

        cylinder.geometry.dispose();
        cylinder.geometry = new THREE.CylinderGeometry( cylinderData.size.t, cylinderData.size.b, cylinderData.size.h, 32 );

    }else if(cylinderData.sort == "position"){

        if(cylinderData.way == "pxP" || cylinderData.way == "pxM"){
            rotPos.x = Math.cos(rot) * cylinderData.value;
            rotPos.y = Math.sin(rot) * cylinderData.value;
        }else if(cylinderData.way == "pyP" || cylinderData.way == "pyM"){
            rotPos.x = Math.sin(-rot) * cylinderData.value;
            rotPos.y = Math.cos(-rot) * cylinderData.value;
        }else if(cylinderData.way == "pzP" || cylinderData.way == "pzM") {
            rotPos.z = cylinderData.value;
        }

        group.position.x += rotPos.x;
        group.position.y += rotPos.y;
        group.position.z += rotPos.z;


    }else if(cylinderData.sort == "rotation"){

        if(cylinderData.way == "rzP" || cylinderData.way == "rzM") {
            rotateAboutPoint(group, box3Data.objectBox3Center, new THREE.Vector3(0, 0, 1), cylinderData.value);
        }else if(cylinderData.way == "rxP" || cylinderData.way == "rxM"){
            rotateAboutPoint(group, box3Data.objectBox3Center, new THREE.Vector3(1, 0, 0), cylinderData.value);
        }

    }

    cylinder.geometry.computeBoundingBox();
    getBox3(cylinder);

    if(settingData.visibleWireFrame) makeWireFrame(cylinder);

    if(cylinderData.iskeyboard){
        if(cylinderData.way === "xlP" || cylinderData.way === "xlM"){
            upSphere.position.x = -(cylinderData.size.t + sphereData.gap);
        }else if( cylinderData.way === "xrP" || cylinderData.way === "xrM") {
            downSphere.position.x = cylinderData.size.b + sphereData.gap;
        }
    }


    upSphere.position.y = box3Data.box3Y/2-sphereData.gap/2;
    downSphere.position.y = -(box3Data.box3Y/2-sphereData.gap/2);
    bottomSphere.position.y = -(box3Data.box3Y/2+sphereData.gap);

    cylinderData.sort = null;
    cylinderData.way = null;
    cylinderData.iskeyboard = false;

    setObjectInformation(group);


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


export { changeCylinder }