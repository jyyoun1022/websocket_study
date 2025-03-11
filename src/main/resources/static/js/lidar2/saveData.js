import * as THREE from './build/three.module.js';
import { findPcdPointsInCuboide } from "./findPcdPoints.js";
import { getCalibratedPointList } from './setObjectsInRgbCanvas.js';
import { getBox3 } from "./getBox3.js";
import {objects, globalData, hugeData, box3Data, screen} from './variables.js';

function saveData(controlData){

    // save data를 make할때 pcd points를 가지고 올려고 하면 비동기적으로 작동해야하기 때문에 미리 loading을 걸어둠
    dataLoaderWrap.style.display = "flex";

    async function startFindPoints(){
        try {
            hugeData.pcdPointData = await findPcdPointsInCuboide();
            startSaveData();
        }catch(e) {
            console.log(e);
        }
    }

    function startSaveData(){

        getCalibratedPointList();

        globalData.saveData = {
            projectId   : null,
            taskId  : null,
            workTicketId   : null,
            rawFileId   : null,
            reqType     : null,
            objectList  : [],
            tagList     : []
        };

        const targetPcdIndex = objects.pcds.findIndex((pcd) => {
            return pcd.workTicketId === globalData.pcdTarget;
        });
        globalData.saveData.projectId = objects.pcds[targetPcdIndex].projectId;
        globalData.saveData.taskId = objects.pcds[targetPcdIndex].taskId;
        globalData.saveData.workTicketId = objects.pcds[targetPcdIndex].workTicketId;
        globalData.saveData.rawFileId = objects.pcds[targetPcdIndex].rawFileId;
        globalData.saveData.reqType = globalData.reqType;

        // pcd에 저장된 tagList를 가지고와서 savaData tagList로 재가공
        // pcd의 tagList에는 tag가 선택되지 않더라도 미리 셋팅되어 있기 때문에 val값이 있는것만 저장
        // val의 default 값은 null인데 string으로 받음
        const pcdTagList = objects.pcds[targetPcdIndex].tagList;

        pcdTagList.forEach((list) => {
            if (list.val !== undefined && list.val !== "null" && list.val !== "") {
                const tag = {};
                tag.val = list.val;
                tag.tagId = list.tagId;
                tag.objectTagId = list.objectTagId;
                tag.name = list.name;
                tag.tagTypeCd = list.tagTypeCd;
                tag.tagValTypeCd = list.tagValTypeCd;
                tag.tagTypeCd = "IMG";
                globalData.saveData.tagList.push(tag);
            }
        });


        objects.object3Ds.forEach((group) => {

            const mesh = group.children[0];
            const shape = mesh.name;
            const pcdPointIndex = hugeData.pcdPointData.findIndex((data) => {
                return data.objectUUID === group.objectUUID;
            });

            // rect only일경우는 findPoints가 저장되어 있지 않기때문에 막아야함
            let findPoints = [];
            if (pcdPointIndex >= 0 && !mesh.onlyRect) findPoints = [...hugeData.pcdPointData[pcdPointIndex].findPoints];

            const object = {};
            object.tagList = [];
            const objectLocation = {};
            objectLocation.rotation = [];
            objectLocation.bboxList = [];
            objectLocation.pcdPoints = [];
            objectLocation.pcdPointsLength = findPoints.length;
            objectLocation.onlyRect = mesh.onlyRect;
            objectLocation.shape = mesh.name;

            // pcd에 대한 data
            object.projectId = objects.pcds[targetPcdIndex].projectId;
            object.taskId = objects.pcds[targetPcdIndex].taskId;
            object.workTicketId = objects.pcds[targetPcdIndex].workTicketId;
            object.rawFileId = objects.pcds[targetPcdIndex].rawFileId;
            object.objectId = group.objectUUID;
            object.classId = mesh.classId;
            object.objectOrder = getObjectIndex(group);


            if(shape === "cube"){

                // cuboide에 대한 data
                const finalCuboideData = getFinalCuboideData(group);
                objectLocation.w = finalCuboideData.size.w;
                objectLocation.h = finalCuboideData.size.h;
                objectLocation.d = finalCuboideData.size.d;
                objectLocation.x = finalCuboideData.position.x;
                objectLocation.y = finalCuboideData.position.y;
                objectLocation.z = finalCuboideData.position.z;
                objectLocation.rotation[0] = finalCuboideData.rotation.x;
                objectLocation.rotation[1] = finalCuboideData.rotation.y;
                objectLocation.rotation[2] = finalCuboideData.rotation.z;
                objectLocation.rotation[3] = group.rotation._order;
                // rgb영역의 object는 cube만 있기 때문에 cube만 calibrated된 pointList 저장함
                objectLocation.calibratedPointList = group.calibratedPointList;

            }else if(shape === "cylinder"){

                // cylinder에 대한 data
                getBox3(mesh);

                if(group.rotation.x === null) group.rotation.x = 0;
                if(group.rotation.y === null) group.rotation.y = 0;
                if(group.rotation.z === null) group.rotation.z = 0;

                objectLocation.w = box3Data.pointBox3Size.x;
                objectLocation.h = box3Data.pointBox3Size.y;
                objectLocation.d = box3Data.pointBox3Size.z;
                objectLocation.x = box3Data.objectBox3Center.x;
                objectLocation.y = box3Data.objectBox3Center.y;
                objectLocation.z = box3Data.objectBox3Center.z;
                objectLocation.rotation[0] = group.rotation.x;
                objectLocation.rotation[1] = group.rotation.y;
                objectLocation.rotation[2] = group.rotation.z;
                objectLocation.rotation[3] = group.rotation._order;

                objectLocation.geometryParams = {};
                const parameters = mesh.geometry.parameters;
                objectLocation.geometryParams.t = parameters.radiusTop;
                objectLocation.geometryParams.b = parameters.radiusBottom;
                objectLocation.geometryParams.h = parameters.height;

            }

            // segmentation 활성일 경우
            // po에서 seg tool을 선택하고 작업자가 worker가 아닌경우에만 seg data 저장
            //고도화에서 pcdPoints를 따로 저장하기 위해서 새롭게 추가함
            let pcdPoints = [];
            if(objects.taskInfo.isSegmentation && status !== "assigned") {
                if (pcdPointIndex >= 0 && !mesh.onlyRect) {
                    pcdPoints = findPoints;
                }
            }
            object.pcdPoints = JSON.stringify(pcdPoints);


            // cuboide에 해당하는 모든 bbox
            // cylinder는 bbox를 안만들기 때문에 cylinder uuid에 match되는 svg uuid는 없음
            objects.svgs.forEach((g) => {
                if (g.objectUUID === group.objectUUID) {
                    const bbox = {};
                    const rect = g.children[0];
                    bbox.x = rect.getAttribute("x");
                    bbox.y = rect.getAttribute("y");
                    bbox.width = rect.getAttribute("width");
                    bbox.height = rect.getAttribute("height");
                    bbox.isView = g.isView;
                    bbox.camId = g.camId;
                    // camNumber를 camId 로 바꿔서 이전 산출물에서 들어오는 string bboxList의 camNumber를 받아올수 없어서
                    // camId가 없으면 camNumber를 확인하여 둘다 받게 처리
                    bbox.camNumber = g.camId;
                    bbox.imgObjNumber = g.objectUUID;
                    bbox.cameraName = g.cameraName;
                    objectLocation.bboxList.push(bbox);
                }
            });

            // object에 해당하는 tag들
            // val값이 없는경우나 default인 경우는 제외
            // mesh의 class의 값이 tag의 matchClass값과 일치할때만 저장
            group.tagList.forEach((list) => {
                if (list.val !== undefined && list.val !== "null" && list.val !== "") {
                    const matchClasses = list.matchClasses.split(",");
                    for (let i = 0; i < matchClasses.length; i++) {
                        if (matchClasses[i] === mesh.classId) {
                            const tag = {};
                            tag.val = list.val;
                            tag.tagTypeCd = list.tagTypeCd;
                            tag.objectTagId = list.objectTagId;
                            tag.tagId = list.tagId;
                            object.tagList.push(tag);
                            break;
                        }
                    }
                }
            });

            object.objectLocation = JSON.stringify(objectLocation);
            globalData.saveData.objectList.push(object);
        });

        if(globalData.workProcess === "save"){
            controlData("save");
        }else if(globalData.workProcess === "complete"){
            controlData("complete");
        }else if(globalData.workProcess === "pass"){
            controlData("pass");
        }else if(globalData.workProcess === "modify"){
            controlData("modify");
        }
        // console.log(globalData.saveData)
    }

    const targetPcdIndex = objects.pcds.findIndex((pcd)=>{ return pcd.workTicketId === globalData.pcdTarget; });
    const status = objects.pcds[targetPcdIndex].status;

    // po에서 seg tool을 선택하고 작업자가 worker가 아닌경우에만 seg data 추출 시작
    // if(objects.taskInfo.isSegmentation && status !== "assigned"){
    //     startFindPoints();
    // }else{
    //     startSaveData();
    // }

    startFindPoints();


}

function getObjectIndex(group){
    for(let i=1 ; i<objectWrap.children.length ; i++){
        const uuid = objectWrap.children[i].objectUUID;
        if(uuid === group.objectUUID){
            const indexText = objectWrap.children[i].childNodes[1].innerText;
            const index = Number(indexText.substr(1));
            return index;
            break;
        }
    }
}


function getFinalCuboideData(group){

    if(group.rotation.x === null) group.rotation.x = 0;
    if(group.rotation.y === null) group.rotation.y = 0;
    if(group.rotation.z === null) group.rotation.z = 0;

    const cube = group.getObjectByName("cube");

    // group을 기준으로 box3를 가져오면 front cube 및 shperes 때문에 정확한 position을 뽑을 수 없기 때문에 cube를 기준으로 box3를 뽑음
    // groupBox3를 생성하지 않으면 cube에 대한 box3 center가 정확하게 나오지 않으며 objecBox3보다 선행되서 선언되어야 함
    const pointBox3 = new THREE.Box3().setFromBufferAttribute(cube.geometry.attributes.position);
    const groupBox3 = new THREE.Box3().setFromObject(group);
    const objectBox3 = new THREE.Box3().setFromObject(cube);

    const pointBox3Size = pointBox3.getSize(new THREE.Vector3());
    const objectBox3Center = objectBox3.getCenter(new THREE.Vector3());

    const position = { x: objectBox3Center.x, y: objectBox3Center.y, z: objectBox3Center.z };
    const size = { w: pointBox3Size.x, h: pointBox3Size.y, d: pointBox3Size.z };
    const rotation = { x: group.rotation.x, y: group.rotation.y, z: group.rotation.z };

    return { position, size, rotation, cube }


}


export { saveData, getFinalCuboideData }

