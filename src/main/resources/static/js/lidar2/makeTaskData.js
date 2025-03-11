import { makeTags } from './makeTags.js';
import { setSearchPopUp } from './setSearchPopUp.js';
// import { setValidationPopUp } from "./setValidationPopUp.js";
import { objects, globalData, cuboideData } from './variables.js';


function makeTaskData(datas, controlData){
    if(datas.task.camList.length){
        datas.task.camList.forEach((list, index) => {
            objects.rgbCameras[index] = {};
            objects.rgbCameras[index].camera = null;
            objects.rgbCameras[index].camId = list.camId;
            objects.rgbCameras[index].aspect = list.aspect;
            objects.rgbCameras[index].far = list.far;
            objects.rgbCameras[index].fov = list.fov;
            objects.rgbCameras[index].lookat = list.lookat;
            objects.rgbCameras[index].name = list.name;
            objects.rgbCameras[index].near = list.near;
            objects.rgbCameras[index].position = list.position;
            objects.rgbCameras[index].rotation = list.rotation;
            objects.rgbCameras[index].calibrationTxt = list.calibrationTxt;

            const length = Number(list.camId.length);
            objects.rgbCameras[index].shortName = list.camId.slice(length - 1, length);
        });


        // cali값이 있을경우 기존 rgb camera가 필요없으므로 render를 안시킴
        objects.rgbCameras.forEach((list)=>{
            if(list.calibrationTxt !== ""){
                globalData.needRgbRender = false;
            }
        });

    }else{
        globalData.hasRGBCamera = false;
    }

    datas.task.classes.forEach((list, index)=>{
        objects.classes[index] = {};
        objects.classes[index].classId = list.classId;
        objects.classes[index].className = list.className;
        objects.classes[index].color = list.color;
        objects.classes[index].hotkey = list.hotkey;
        objects.classes[index].hotkeyName = list.hotkeyName;
        objects.classes[index].dimension = {};

        // po에서 값받아서 수정해야함
        // if(list.classId === "C0000000000000000001"){
        //     objects.classes[index].dimension = { w:1, h:3, d:1 }
        // }else if(list.classId === "C0000000000000000002"){
        //     objects.classes[index].dimension = { w:1, h:1, d:3 }
        // }else if(list.classId === "C0000000000000000003"){
        //     objects.classes[index].dimension = { w:0.35, h:0.70, d:0.38 }
        // }else{
        //     objects.classes[index].dimension = { w:2, h:3, d:2 }
        // }

        if(list.width === 0 || list.height === 0 || list.depth === 0){
            objects.classes[index].dimension = { w:cuboideData.defaultSize.w, h:cuboideData.defaultSize.h, d:cuboideData.defaultSize.d }
        }else{
            objects.classes[index].dimension = { w:list.width, h:list.height, d:list.depth }
        }

        
    });



    // datas.task.tags.forEach((list, index)=>{
    //     objects.tags[index] = {};
    //     objects.tags[index].tagId = list.tagId;
    //     objects.tags[index].color = list.color;
    //     objects.tags[index].hotkey = list.hotkey;
    //     objects.tags[index].hotkeyName = list.hotkeyName;
    //     objects.tags[index].matchClasses = list.matchClasses;
    //     objects.tags[index].name = list.name;
    //     objects.tags[index].tagSelectValueVoList = list.tagSelectValueVoList;
    //     objects.tags[index].tagTypeCd = list.tagTypeCd;
    //     objects.tags[index].tagValTypeCd = list.tagValTypeCd;
    // });

    datas.task.tags.forEach((list, index)=>{
        objects.tags[index] = {};
        objects.tags[index].tagId = list.tagId;
        objects.tags[index].color = list.color;
        objects.tags[index].hotkey = list.hotkey;
        objects.tags[index].hotkeyName = list.hotkeyName;
        objects.tags[index].matchClasses = list.matchClasses;
        objects.tags[index].name = list.name;
        objects.tags[index].tagSelectValueVoList = list.tagSelectValueVoList;
        objects.tags[index].tagTypeCd = list.tagTypeCd;
        objects.tags[index].tagValTypeCd = list.tagValTypeCd;
        objects.tags[index].valueFilterNumber = list.valueFilterNumber;
        objects.tags[index].valueFilterLetter = list.valueFilterLetter;
        objects.tags[index].valueFilterSpecial = list.valueFilterSpecial;
        objects.tags[index].lengthNumber = list.lengthNumber;
        objects.tags[index].lengthLetter = list.lengthLetter;
        objects.tags[index].lengthSpecial = list.lengthSpecial;
    });


    // datas.task.errorCodeList.forEach((list, index)=> {
    //     objects.InspectErrorCodes[index] = {};
    //     objects.InspectErrorCodes[index].name = list.name;
    //     objects.InspectErrorCodes[index].value = list.value;
    // });

    objects.taskInfo.taskCode = datas.task.taskInfo.taskCode;
    objects.taskInfo.taskName = datas.task.taskInfo.taskName;

    // guide popup data
    objects.taskInfo.guideTitle = datas.task.taskInfo.guideTitle;
    // objects.taskInfo.taskDesc = datas.task.taskInfo.taskDesc;
    objects.taskInfo.attachFilePath = datas.task.taskInfo.attachFilePath;
    objects.taskInfo.uploadLinkUrl = datas.task.taskInfo.uploadLinkUrl;
    objects.taskInfo.downloadFile = datas.task.taskInfo.downloadFile;
    objects.taskInfo.attachedFileName = datas.task.taskInfo.attachedFileName;
    objects.taskInfo.downloadGuide = datas.task.taskInfo.downloadGuide;

    // seg 여부
    objects.taskInfo.isSegmentation = datas.task.taskInfo.isSegmentation;


    // tag select option에 default를 추가함
    if(globalData.isPageStart) {
        for (let i = 0; i < datas.task.tags.length; i++) {
            const defaultTag = {name: "Select", value: null};
            objects.tags[i].tagSelectValueVoList.unshift(defaultTag);
        }
    }



    globalData.defaultClass.name = datas.task.defaultClassName;

     // default class 가져오기
    for(let i=0 ; i<objects.classes.length ; i++){
        if(objects.classes[i].className === globalData.defaultClass.name){
            globalData.defaultClass.number = objects.classes[i].classId;
            globalData.defaultClass.color = objects.classes[i].color;
            globalData.defaultClass.dimension = objects.classes[i].dimension;
            break;
        }
    }

    // 한개의 project에 해당하는 tag의 값들은 동일함으로 pcd를 바꾸던, save를 하던 관계없음
    objects.tags.forEach((tag)=>{
        if(tag.tagTypeCd === "IMG"){
            let ul = makeTags(tag);
            frameTagWrap.appendChild(ul);
        }else if(tag.tagTypeCd === "OBJ"){
            let ul = makeTags(tag);
            objectTagWrap.appendChild(ul);
        }
    });

    globalData.permissionCode = datas.permissionCode;
    globalData.permissionName = datas.permissionName;
    // reqType은 F5 눌렀을때 현재 사용자의 permission을 담아서 넘겨줌
    globalData.reqType = datas.reqType;



    //class dimension setting
    cubeDimensionName.innerText = globalData.defaultClass.name;
    cuboideData.defaultSize = globalData.defaultClass.dimension;



    // page open시 pcdList를 불러올때 search값이 필요해서 여기서 셋팅
    setSearchPopUp(datas, controlData);
    // setValidationPopUp(datas, controlData);

    controlData("getPcdList");



}


export { makeTaskData }