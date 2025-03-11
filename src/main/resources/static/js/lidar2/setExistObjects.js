import * as THREE from './build/three.module.js';
import { changeObjectList } from './changeObjectList.js';
import { makeCuboide } from './cuboide.js';
import { makeCylinder } from "./cylinder.js";
import { makeSvg } from './makeSvg.js';
import { matchClasses } from './matchClasses.js';
import { changeSvgList } from './changeSvgList.js';
import { changeRGBCamera } from './controlRGBCamera.js';
import { CSS2DObject } from "./examples/jsm/renderers/CSS2DRenderer.js";
import {objects, cuboideData, globalData, svgData, cylinderData, settingData } from './variables.js';



function setExistObjects() {

    const targetPcdInex = objects.pcds.findIndex((pcd)=>{ return pcd.workTicketId === globalData.pcdTarget; });

    // exist frame tag 셋팅
    // frameTapWrap에 만들어진 select들을 기준으로 기존 데이터를 비교하여 정보가 있으면 option에 selected를 함
    const existFrameTagList = objects.existData.tagList;
    const frameTagList = frameTagWrap.children;
    const pcdTagList = objects.pcds[targetPcdInex].tagList;


    // frame tag default로 만든후
    for(let i=0 ; i<frameTagList.length ; i++){
       if(frameTagList[i].tagValTypeCd === "30"){
           const options = frameTagList[i].children[2].children[0].options;
           options[0].selected = true;
       }else if(frameTagList[i].tagValTypeCd === "20"){
           const input = frameTagList[i].children[2].children[0];
           input.value = "";
       }
    }

    // frame tag option값 변경
    for(let i=0; i<frameTagList.length ; i++){
        for(let j=0 ; j<existFrameTagList.length ; j++){
            if(frameTagList[i].tagId === existFrameTagList[j].tagId){
                if(frameTagList[i].tagValTypeCd === "30") {
                    const options = frameTagList[i].children[2].children[0].options;
                    for (let h = 0; h < options.length; h++) {
                        if (options[h].value === existFrameTagList[j].val) {
                            options[h].selected = true;
                            break;
                        }
                    }
                    break;
                }else if(frameTagList[i].tagValTypeCd === "20") {
                    const input = frameTagList[i].children[2].children[0];
                    input.value = existFrameTagList[j].val;
                    break;
                }
            }
        }
    }
    // pcd tagList 값 변경
    for(let i=0; i<pcdTagList.length; i++){
        for(let j=0 ; j<existFrameTagList.length ; j++){
            if(pcdTagList[i].tagId === existFrameTagList[j].tagId){
                pcdTagList[i].val = existFrameTagList[j].val;
                pcdTagList[i].objectTagId = existFrameTagList[j].objectTagId;
            }
        }
    }


    // load된 cuboide data를 기준으로 새로운 object들을 생성

    if(objects.existData.objectList.length > 0){

        objects.existData.objectList.forEach((list, index)=>{

            (globalData.objectListIndex === null) ? globalData.objectListIndex = 0 : globalData.objectListIndex ++;

            let data = {};

            if(list.objectLocation === ""){
                data.x = 0;
                data.y = 0;
                data.z = 0;
                data.rotation = [0,0,0,"XYZ"];
                data.shape = "cube";
                data.w = 1;
                data.h = 1;
                data.d = 1;
                data.bboxList = [];
            }else{
                data = JSON.parse(list.objectLocation);
            }


            // if(data.length === undefined){
            //     data.x = 0;
            //     data.y = 0;
            //     data.z = 0;
            //     data.rotation = [0,0,0,"XYZ"];
            //     data.shape = "cube";
            //     data.w = 1;
            //     data.h = 1;
            //     data.d = 1;
            //     data.bboxList = [];
            // }


            if(data.shape === "cube"){

                cuboideData.position = { x: data.x, y: data.y, z: data.z };
                cuboideData.rotation = { x: data.rotation[0], y: data.rotation[1], z: data.rotation[2] };
                cuboideData.size = { w: data.w, h: data.h, d: data.d };
                cuboideData.onlyRect = data.onlyRect;
                makeCuboide();

            }else if(data.shape === "cylinder"){

                cylinderData.position = { x: data.x, y: data.y, z: data.z };
                cylinderData.rotation = { x: data.rotation[0], y: data.rotation[1], z: data.rotation[2] };
                cylinderData.size = { t: data.geometryParams.t, b: data.geometryParams.b, h: data.geometryParams.h };
                cylinderData.onlyRect = data.onlyRect;
                makeCylinder();

            }else{

                // 기존 데이터에서는 shape이 존재하지 않기 때문에 undefined로 나오는것은 cube로 생성함
                cuboideData.position = { x: data.x, y: data.y, z: data.z };
                cuboideData.rotation = { x: data.rotation[0], y: data.rotation[1], z: data.rotation[2] };
                cuboideData.size = { w: data.w, h: data.h, d: data.d };
                cuboideData.onlyRect = data.onlyRect;
                makeCuboide();

            }


            // object그룹 and object리스트 속성 변경
            // makeCuboide & makeCylinder 에서 생성된 objectUUID를 서버에서 받아온 objectUUID로 변경
            const group = objects.object3Ds[index];
            const mesh = objects.object3Ds[index].children[0];
            const groupList = objectWrap.children[index+1];
            const groupListCheckbox = objectWrap.children[index+1].children[0].children[0];
            const groupListCheckboxLabel = objectWrap.children[index+1].children[0].children[1];

            const classIndex = objects.classes.findIndex((classList)=>{
                return classList.classId === list.classId;
            });
            group.objectUUID = list.objectId;
            mesh.objectUUID = list.objectId;
            groupList.objectUUID = list.objectId;
            mesh.classId = list.classId;
            groupListCheckbox.id = list.objectId;
            groupListCheckboxLabel.setAttribute( 'for', list.objectId );

            mesh.material.color = new THREE.Color( objects.classes[classIndex].color );

            groupList.children[0].querySelector('label').style.backgroundColor = objects.classes[classIndex].color;
            groupList.children[2].innerHTML = objects.classes[classIndex].className;


            //기존 object의 tagList를 가지고 와서 생성된 object의 tag들중에 tagId가 같은 tag에 값을 셋팅
            list.tagList.forEach((list1)=>{
                for(let i=0; i< group.tagList.length; i++){
                    if(group.tagList[i].tagId === list1.tagId){
                        group.tagList[i].val = list1.val;
                        group.tagList[i].objectTagId = list1.objectTagId;
                    }
                }
            });


            // bbox 셋팅, bbox 생성시 cuboide list의 자동 아이콘을 클릭해서 생성하기 때문에
            // globalData.objectTarget 해당 object로 세팅해줘야함
            // if(data.shape === "cube") {
            if(data.shape !== "cylinder") {
                const bbox = data.bboxList;
                globalData.objectTarget = objects.object3Ds[index].objectUUID;
                if (bbox.length > 0) {
                    data.bboxList.forEach((bblist) => {
                        // camNumber를 camId 로 바꿔서 이전 산출물에서 들어오는 string bboxList의 camNumber를 받아올수 없어서
                        // camId가 없으면 camNumber를 확인하여 둘다 받게 처리
                        if(bblist.camId == null) {
                            bblist.camId = bblist.camNumber;
                        }
                        svgData.defaultRect.x = Number(bblist.x);
                        svgData.defaultRect.y = Number(bblist.y);
                        svgData.defaultRect.w = Number(bblist.width);
                        svgData.defaultRect.h = Number(bblist.height);
                        svgData.defaultRect.isVisible = bblist.isView;
                        globalData.rgbCameraTarget = bblist.camId;
                        makeSvg(objects.object3Ds[index], "exist");
                    });
                }
            }

            const label = setObjectLabel();
            function setObjectLabel() {
                let trackID;
                for(let i=0; i<group.tagList.length ; i++){
                    if(group.tagList[i].name === "trackID"){
                        trackID = group.tagList[i].val;
                        break;
                    }
                }
                if(trackID === undefined){
                    trackID = "0";
                }
                const div = document.createElement('div');
                div.className = 'objectLabel';
                div.textContent = trackID;
                const label = new CSS2DObject(div);
                label.name = "label";
                label.visible = settingData.visibleLabels;
                return label;
            }

            group.add(label);



        });

        globalData.objectTarget = objects.object3Ds[objects.existData.objectList.length-1].objectUUID;

        // pcd간 이동시 multi rgbCamera가 있는경우 rgbCameraTarget을 초기화 시켜줘야함
        rgbSelect.selectedIndex = 0;
        changeRGBCamera();

        // object class에 맞는 tag만을 보여줌
        matchClasses();
        changeObjectList();
        changeSvgList();

    }else{

        // pcd간 이동시 multi rgbCamera가 있는경우 rgbCameraTarget을 초기화 시켜줘야함
        rgbSelect.selectedIndex = 0;
        changeRGBCamera();

        // 기존에 존재하는 object가 없으면 object tag들을 안보이게 해야함
        matchClasses();
    }


    svgData.defaultRect = { x:0, y:0, w:100, h:100, isVisible: false };


}



export { setExistObjects }