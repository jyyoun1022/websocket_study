import * as THREE from './build/three.module.js';
import { makeCuboide } from "./cuboide.js";
import { makeCylinder } from "./cylinder.js";
import { getFinalCuboideData } from "./saveData.js";
import { makeUUID } from "./makeUUID.js";
import { changeObjectList } from "./changeObjectList.js";
import { changeSvgList } from "./changeSvgList.js";
import { makeSvg } from "./makeSvg.js";
import { setNotices } from "./setNotices.js";
import { changeRGBCamera } from "./controlRGBCamera.js";
import { getBox3 } from "./getBox3.js";
import { objects, cuboideData, globalData, svgData, box3Data, cylinderData } from './variables.js';



function copyPasteObjects(sort) {

    if (sort === "copy") {

        // pcd에서 선택한 object들을 copy한 다음 다른 pcd로 넘어가면 objects.svgs 정보가 날라가버려서
        // 선택한 objects정보와 모든 svgs 정보를 같이 가지고 다녀야함
        // object가 없는 pcd에서 ctrl+c 를 눌러서 copy 되지 않게 막기
        if (objects.object3Ds.length) {
            if (globalData.selectedObjects.length) {
                globalData.copiedObjects.object3Ds = [...globalData.selectedObjects];
                globalData.copiedObjects.svgs = [...objects.svgs];
                setNotices("copySelectedObjects");
            }else{
                setNotices("noObjectsToSelect");
            }
        } else {
            setNotices("noObjectsToCopy");
        }

    }else if(sort === "copyAll"){

        if (objects.object3Ds.length) {
            globalData.copiedObjects.object3Ds = [...objects.object3Ds];
            globalData.copiedObjects.svgs = [...objects.svgs];
            setNotices("copyAllObjects");
        } else {
            setNotices("noObjectsToCopy");
        }

    }else{

        if(globalData.copiedObjects.object3Ds === undefined) return;

        globalData.copiedObjects.object3Ds.forEach((list)=> {

            globalData.objectListIndex++;

            const copiedMesh = list.children[0];
            const shape = copiedMesh.name;
            const copiedClassId = copiedMesh.classId;
            const copiedTagList = list.tagList;
            const copiedSvgList = [];
            let objectListIndex;

            if(shape === "cube"){

                // copy한 object group의 정보 저장
                const copiedCuboideData = getFinalCuboideData(list);
                // 새로운 cuboide group를 만듬
                cuboideData.position = { x: copiedCuboideData.position.x, y: copiedCuboideData.position.y, z: copiedCuboideData.position.z };
                cuboideData.rotation = { x: copiedCuboideData.rotation.x, y: copiedCuboideData.rotation.y, z: copiedCuboideData.rotation.z };
                cuboideData.size = { w: copiedCuboideData.size.w, h: copiedCuboideData.size.h, d: copiedCuboideData.size.d };
                cuboideData.onlyRect = copiedMesh.onlyRect;
                makeCuboide();

            }else if(shape === "cylinder"){

                getBox3(copiedMesh);
                const parameters = copiedMesh.geometry.parameters;
                cylinderData.position = { x: box3Data.objectBox3Center.x, y: box3Data.objectBox3Center.y, z: box3Data.objectBox3Center.z };
                cylinderData.rotation = { x: list.rotation.x, y: list.rotation.y, z: list.rotation.z };
                cylinderData.size = { t: parameters.radiusTop, b: parameters.radiusBottom, h: parameters.height };
                makeCylinder();

            }

            // copy한 svg정보 저장
            globalData.copiedObjects.svgs.forEach((g)=>{
                if(g.objectUUID === list.objectUUID){
                    const bbox = {};
                    const rect = g.children[0];
                    bbox.x = rect.getAttribute("x");
                    bbox.y = rect.getAttribute("y");
                    bbox.width = rect.getAttribute("width");
                    bbox.height = rect.getAttribute("height");
                    bbox.isView = g.isView;
                    bbox.camId = g.camId;
                    bbox.imgObjNumber = g.objectUUID;
                    bbox.cameraName = g.cameraName;
                    copiedSvgList.push(bbox);
                }
            });


            // 만들어진 cuboide group 찾기
            const objectIndex = objects.object3Ds.findIndex((groupList)=>{
                return globalData.objectTarget === groupList.objectUUID;
            });
            const classIndex = objects.classes.findIndex((classList)=>{
                return copiedClassId === classList.classId;
            });
            // for(let i=0 ; i<objectWrap.children.length ; i++){
            //     objectWrap.children[i].classList.remove("on");
            // }
            for(let i=0 ; i < objectWrap.children.length ; i++){
                if(objectWrap.children[i].objectUUID === globalData.objectTarget) {
                    objectListIndex = i;
                    break;
                }
            }

            // 만들어진 cuboide group의 속성 변경 (class, tag 등)
            const madeObjectGroup = objects.object3Ds[objectIndex];
            const madeMesh = madeObjectGroup.children[0];
            madeMesh.classId = copiedClassId;
            madeMesh.material.color = new THREE.Color( objects.classes[classIndex].color );
            copiedTagList.forEach((tagList)=>{
                for(let i=0; i< madeObjectGroup.tagList.length; i++){
                    if(madeObjectGroup.tagList[i].tagId === tagList.tagId){
                        madeObjectGroup.tagList[i].val = tagList.val;
                        madeObjectGroup.tagList[i].objectTagId = makeUUID();
                    }
                }
            });

            // 만들어진 object groupList의 속성 변경 (label 색상, class 이름 등)
            const groupList = objectWrap.children[objectListIndex];
            const groupListCheckboxLabel = objectWrap.children[objectListIndex].children[0].children[1];
            const groupListTitle = objectWrap.children[objectListIndex].children[2];
            groupListTitle.innerText = objects.classes[classIndex].className;
            groupListCheckboxLabel.style.backgroundColor = objects.classes[classIndex].color;


            // 새로운 svg를 만듬
            if(copiedSvgList.length > 0){
                copiedSvgList.forEach((bblist)=>{
                    svgData.defaultRect.x = Number(bblist.x);
                    svgData.defaultRect.y = Number(bblist.y);
                    svgData.defaultRect.w = Number(bblist.width);
                    svgData.defaultRect.h = Number(bblist.height);
                    svgData.defaultRect.isVisible = bblist.isView;
                    globalData.rgbCameraTarget = bblist.camId;
                    makeSvg(madeObjectGroup, "exist");
                });
            }

            // pcd간 이동시 multi rgbCamera가 있는경우 rgbCameraTarget을 초기화 시켜줘야함
            rgbSelect.selectedIndex = 0;
            changeRGBCamera();
            changeObjectList();
            changeSvgList();

        });
    }

}

export { copyPasteObjects }