import * as THREE from './build/three.module.js';
import { makeGuideBox, resetGuideBox } from './makeGuideBox.js';
import { findObject } from './findObject.js';
import { changeCuboide } from './changeCuboide.js';
import { changeCylinder } from "./changeCylinder.js";
import { saveData } from './saveData.js';
import { setHotKeys } from './setHotKeys.js';
import { findPcdPoints } from './findPcdPoints.js';
import { controlMainCamera } from './controlMainCamera.js';
import { removeAllObjects } from './removeAllObjects.js';
import { changeObjectSphere } from './setSettings.js';
import { changeObjectList } from "./changeObjectList.js";
import { changeSvgList } from "./changeSvgList.js";
import { deleteSelectedObjects } from "./deleteSelectedObjects.js";
import { visibilitySelectedObjects } from "./visibilitySelectedObjects.js";
import { visibilitySelectedSvgs } from "./visibilitySelectedSvgs.js";
import { deleteObject } from "./deleteObject.js";
import { changePcdList } from "./changePcdList.js";
import { copyPasteObjects } from "./copyPasteObjects.js";
import { autoMakeSvg, manualMakeSvg } from "./makeObjectList.js";
import { setSvgWrapDefault } from "./initSvgViewer.js";
import { changeRGBCamera } from "./controlRGBCamera.js";
import { makeCuboideForOnlyRect } from "./makeCuboideForOnlyRect.js";
import { changeSvgPosition } from "./changeSvgPosition.js";
import { objects, globalData, events, cuboideData, cylinderData, svgData, settingData } from './variables.js';





const btnList = [
    btnMoveScreen,
    btnCubeGuideBox,
    btnCylinderGuideBox,
    btnFindObject,
    btnObjectAllVisibility,
    btnObjectAllDelete,
    btnChangeAllClass,
    btnSave,
    btnFindPcdPoints,
    btnSetDefaultView,
    btnSearchPcd,
    btnReview,
    // btnGiveUp,
    btnComplete,
    btnMorePcds,
    btnModify,
    btnAllPass,
    btnAllOK,
    btnHelp,
    btnMakeObjectForOnlyRect,
    btnAutoMakeAllSvg,
    btnChangeCubeDimension,
    // btnSearchValidation
];


const resetBtn = function(){
    btnList.forEach((btn)=>{ btn.classList.remove("on"); });
}

// 왼쪽 영역 move 버튼
const moveScreen = function(){
    if(!globalData.isMoveScreen){
        resetBtn();
        resetGuideBox();
        btnMoveScreen.classList.add("on");
        globalData.isMoveScreen = true;
        globalData.isMakeGuideBox = false;
        globalData.isFindObject = false;
    }
}

// 왼쪽 영역 cube guide 버튼
const cubeGuideBoxFunc = function(){
    if(!globalData.isMakeGuideBox && globalData.allowAllEvents){
        resetBtn();
        btnCubeGuideBox.classList.add("on");
        globalData.objectShape = "cube";
        globalData.isMoveScreen = false;
        globalData.isMakeGuideBox = true;
        globalData.isFindObject = false;
        makeGuideBox();
    }
}

// 왼쪽 영역 cylinder guide 버튼
const cylinderGuideBoxFunc = function(){
    if(!globalData.isMakeGuideBox && globalData.allowAllEvents){
        resetBtn();
        btnCylinderGuideBox.classList.add("on");
        globalData.objectShape = "cylinder";
        globalData.isMoveScreen = false;
        globalData.isMakeGuideBox = true;
        globalData.isFindObject = false;
        makeGuideBox();
    }
}

// 왼쪽 영역 find 버튼
const findObjectFunc = function(){
    if(!globalData.isFindObject && globalData.allowAllEvents){
        resetBtn();
        resetGuideBox();
        findObject();
        btnFindObject.classList.add("on");
        globalData.isMoveScreen = false;
        globalData.isMakeGuideBox = false;
        globalData.isFindObject = true;
    }
}


// space bar 기본 view
const setDefaultView = function(){
    btnSetDefaultView.classList.add("on");
    globalData.isMoveScreen = false;
    svgData.zoomCurrent = 1;
    controlMainCamera(new THREE.Vector3(0,0,20));
    setSvgWrapDefault();
    setTimeout(()=>{ moveScreen(); },100);
}


const setDefaultChildCamera = function(){
    const distance = 3;
    const dir = new THREE.Vector3();
    for(let i=2 ; i<5 ; i++){
        (i===2) ? dir.set(0,0,1) : (i===3) ? dir.set(0,1,0) : dir.set(1,0,0);
        objects.cameras[i].position.set(-distance*dir.x, -distance*dir.y, distance*dir.z );
        objects.cameras[i].zoom = 1;
        objects.cameras[i].far = globalData.ogCameraFar[i-2];
    }
}

// cuboide에 해당하는 pcd point 색상 바꾸기
const findPcdPointsFunc = function(){
    // if(!globalData.allowAllEvents){
    //     return;
    // }
    globalData.isMoveScreen = false;
    btnFindPcdPoints.classList.add("on");
    if(objects.object3Ds.length > 0){
        findPcdPoints();
    }else{
        setAlert("findPointsAlert");
    }
    setTimeout(()=>{ moveScreen(); },100);
}


// 모든 경고 문구
const setAlert = function(alertSort){

    if(!globalData.allowAllEvents){
        return;
    }

    const message = globalData.alerts[alertSort];

    alertPopUpWrap.classList.add("show");
    alertMessage.innerText = message;
    btnConfirm.style.display = "inline-block";
    btnCancel.style.display = "inline-block";

    if(events.alertConfirmClick) btnConfirm.removeEventListener('click', events.alertConfirmClick);
    if(events.alertCancelClick) btnCancel.removeEventListener('click', events.alertCancelClick);


    switch(alertSort){

        case "deleteAllCuboideAlert":
            events.alertConfirmClick = function(e){
                deleteSelectedObjects();
                alertPopUpWrap.classList.remove("show");
            };
            events.alertCancelClick = function(e){
                alertPopUpWrap.classList.remove("show");
            };
            btnConfirm.addEventListener('click', events.alertConfirmClick);
            btnCancel.addEventListener('click',  events.alertCancelClick);
            break;

        case "findPointsAlert":
            events.alertConfirmClick = function(e){
                alertPopUpWrap.classList.remove("show");
            };
            btnConfirm.addEventListener('click', events.alertConfirmClick);
            btnCancel.style.display = "none";
            break;

        case "makeSvgAlert":
            events.alertConfirmClick = function(e){
                alertPopUpWrap.classList.remove("show");
            };
            btnConfirm.addEventListener('click', events.alertConfirmClick);
            btnCancel.style.display = "none";
            break;

    }

}


const searchPcd = function(){

    // if(globalData.permissionCode === "compWorker"){
    //     return;
    // }
    btnSearchPcd.classList.add("on");
    const display = searchPopUpWrap.style.display;
    if(display === "" || display === "none"){
        searchPopUpWrap.style.display = "block";
    }else{
        searchPopUpWrap.style.display = "none";
    }
    globalData.isMoveScreen = false;
    setTimeout(()=>{ moveScreen(); },100);
}


const reviewFunc = function(){
    let popUp, display;
    if(globalData.permissionCode === "worker"){
        return;
    }else{
        btnReview.classList.add("on");
        // if(globalData.permissionCode === "compReviewer"){
        if(globalData.permissionCode === "reviewer"){
            popUp = reviewPopUpWrap;
            display = popUp.style.display;
        }
        // else if(globalData.permissionCode === "inspector") {
        //     popUp = inspectPopUpWrap;
        //     display = popUp.style.display;
        // }
        else if(globalData.permissionCode === "master") {
            popUp = masterPopUpWrap;
            display = popUp.style.display;
        }

        if(display === "" || display === "none"){
            popUp.style.display = "block";
        }else{
            popUp.style.display = "none";
        }
    }

    globalData.isMoveScreen = false;
    setTimeout(()=>{ moveScreen(); },100);
}


// const giveUpFunc = function(controlData){
//     const pcdIndex = objects.pcds.findIndex((pcd)=>{ return pcd.workTicketId === globalData.pcdTarget; });
//     globalData.pcdTargetName = objects.pcds[pcdIndex].originalFileName;
//     globalData.isResetPcdFileList = true;
//     removeAllObjects();
//     controlData("giveUp");
// }


const morePcdsFunc = function(controlData){
    controlData("morePcds");
}


const changeNextCuboideList = function(){

    if(!objects.object3Ds.length){
        return;
    }

    for(let i=0 ; i<objectWrap.children.length ; i++){
        objectWrap.children[i].classList.remove("on");
    }

    let targetIndex = objects.object3Ds.findIndex((cuboide)=>{
        return cuboide.objectUUID === globalData.objectTarget;
    });

    if(targetIndex < objects.object3Ds.length-1){
        globalData.objectTarget = objects.object3Ds[targetIndex+1].objectUUID;
        globalData.objectTargetShape = objects.object3Ds[targetIndex+1].children[0].name;
        objectWrap.children[targetIndex+2].classList.add("on");
        objectWrap.children[targetIndex+2].scrollIntoView(false);
    }else{
        globalData.objectTarget = objects.object3Ds[0].objectUUID;
        globalData.objectTargetShape = objects.object3Ds[0].children[0].name;
        objectWrap.children[1].classList.add("on");
        objectWrap.children[1].scrollIntoView(false);
    }

    changeObjectList();
    changeSvgList();
}


const changeAllClassFunc = function(target){
    // permission이 없을경우
    if(!globalData.allowAllEvents){
        return;
    }
    globalData.changeAllClass = true;
    classPopUpWrap.style.display = "block";
    const boundRect = target.getBoundingClientRect();
    classPopUpWrap.style.top = (boundRect.top - boundRect.height - 50) + "px";
    classPopUpWrap.style.right = "10px";
}

// const controlGuidePopUp = function(){
//     const display = guidePopUpWrap.style.display;
//     if(display === "block"){
//         guidePopUpWrap.style.display = "none";
//     }else{
//         guidePopUpWrap.style.display = "block";
//     }
// }
// const controlValidationPopup = function(){
//     const display = document.querySelector("#vcModal").style.display;
//     if(display === "block"){
//         document.querySelector("#vcModal").style.display = "none";
//     }else{
//         $("#vcModal").css("left",($(window).width() - $("#vcModal").width()) / 2);
//         $("#vcModal").css("top", ($(window).height() - $("#vcModal").height()) / 2);
//         document.querySelector("#vcModal").style.display = "block";
//     }
// }


const makeSvgBykey = function(sort){
    let targetUL;
    for (let i = 0; i < objectWrap.children.length; i++) {
        if (objectWrap.children[i].classList.contains('on')) {
            targetUL = objectWrap.children[i];
            break;
        }
    }
    if (targetUL !== undefined){
        if(sort === "auto"){
            autoMakeSvg(targetUL);
        }else{
            manualMakeSvg(targetUL);
        }
    }
}

const autoMakeAllSvg = function(){

    for (let i = 0; i < objectWrap.children.length; i++) {
        let targetUL = objectWrap.children[i];
        if (objectWrap.children[i].classList.contains('cuboideList') && targetUL.objectShape === "cube") {
            autoMakeSvg(targetUL);
        }
    }

}

const changeCubeDimension = function(){
    const cubeBtnArea = leftWrap.children[0].children[1];
    const boundRect = cubeBtnArea.getBoundingClientRect();
    dimensionPopUpWrap.style.display = "block";
    dimensionPopUpWrap.style.top = (boundRect.top - boundRect.height) + "px";
    dimensionPopUpWrap.style.left = "56px";
}


function setKeys(controlData){

    btnList.forEach((btn)=>{
        btn.addEventListener("click", setBtn, false );
    });

    function setBtn(){
        switch( this ) {
            case btnMoveScreen:
                moveScreen();
                break;
            case btnCubeGuideBox:
                cubeGuideBoxFunc();
                break;
            case btnCylinderGuideBox:
                cylinderGuideBoxFunc();
                break;
            case btnFindObject:
                findObjectFunc();
                break;
            case btnObjectAllVisibility:
                visibilitySelectedObjects(this);
                break;
            case btnObjectAllDelete:
                setAlert("deleteAllCuboideAlert");
                break;
            case btnChangeAllClass:
                changeAllClassFunc(this);
                break;
            case btnSave:
                globalData.workProcess = "save";
                saveData(controlData);
                break;
            case btnFindPcdPoints:
                findPcdPointsFunc();
                break;
            case btnSetDefaultView:
                setDefaultView();
                break;
            case btnSearchPcd:
                searchPcd();
                break;
            case btnReview:
                reviewFunc();
                break;
            // case btnGiveUp:
            //     globalData.workProcess = "giveup";
            //     giveUpFunc(controlData);
            //     break;
            case btnComplete:
                globalData.workProcess = "complete";
                saveData(controlData);
                break;
            case btnMorePcds:
                globalData.workProcess = "more";
                morePcdsFunc(controlData);
                break;
            case btnModify:
                globalData.workProcess = "modify";
                saveData(controlData);
                break;
            case btnAllPass:
                globalData.workProcess = "allPass";
                controlData("allPass");
                break;
            case btnAllOK:
                globalData.workProcess = "allOK";
                controlData("allOK");
                break;
            case btnHelp:
                controlGuidePopUp();
                break;
            case btnMakeObjectForOnlyRect:
                makeCuboideForOnlyRect();
                makeSvgBykey("manual");
                break;
            case btnAutoMakeAllSvg:
                autoMakeAllSvg();
                break;
            case btnChangeCubeDimension:
                changeCubeDimension();
                break;
            // case btnSearchValidation:
            //     controlValidationPopup();
            //     break;

        }
    }

    const positionYplus = function(){
        if(globalData.objectTargetShape === "cube"){
            cuboideData.sort = "position";
            cuboideData.way = "pyP";
            cuboideData.value = settingData.objectMoveRate;
            cuboideData.iskeyboard = true;
            changeCuboide();
        }else if(globalData.objectTargetShape === "cylinder") {
            cylinderData.sort = "position";
            cylinderData.way = "pyP";
            cylinderData.value = settingData.objectMoveRate;
            cylinderData.iskeyboard = true;
            changeCylinder();
        }
    }
    const positionXminus = function(){
        if(globalData.objectTargetShape === "cube") {
            cuboideData.sort = "position";
            cuboideData.way = "pxM";
            cuboideData.value = -settingData.objectMoveRate;
            cuboideData.iskeyboard = true;
            changeCuboide();
        }else if(globalData.objectTargetShape === "cylinder") {
            cylinderData.sort = "position";
            cylinderData.way = "pxM";
            cylinderData.value = -settingData.objectMoveRate;
            cylinderData.iskeyboard = true;
            changeCylinder();
        }
    }
    const positionYminus = function(){
        if(globalData.objectTargetShape === "cube") {
            cuboideData.sort = "position";
            cuboideData.way = "pyM";
            cuboideData.value = -settingData.objectMoveRate;
            cuboideData.iskeyboard = true;
            changeCuboide();
        }else if(globalData.objectTargetShape === "cylinder") {
            cylinderData.sort = "position";
            cylinderData.way = "pyM";
            cylinderData.value = -settingData.objectMoveRate;
            cylinderData.iskeyboard = true;
            changeCylinder();
        }
    }
    const positionXplus = function(){
        if(globalData.objectTargetShape === "cube") {
            cuboideData.sort = "position";
            cuboideData.way = "pxP";
            cuboideData.value = settingData.objectMoveRate;
            cuboideData.iskeyboard = true;
            changeCuboide();
        }else if(globalData.objectTargetShape === "cylinder") {
            cylinderData.sort = "position";
            cylinderData.way = "pxP";
            cylinderData.value = settingData.objectMoveRate;
            cylinderData.iskeyboard = true;
            changeCylinder();
        }
    }

    const setSvgPosition = function(sort){

        const targetPcd = objects.pcds.findIndex((pcd)=>{ return pcd.workTicketId === globalData.pcdTarget; });
        const targetRGB = objects.pcds[targetPcd].rgbImages.findIndex((rgb)=>{ return rgb.camId === globalData.rgbCameraTarget; });
        const loadedData = objects.pcds[targetPcd].rgbImages[targetRGB].loadedData;
        const position = new THREE.Vector2();

        if(sort === "up"){
            position.x = 0;
            position.y = -settingData.svgMoveRate * (loadedData.calcRate / svgData.zoomCurrent);
        }else if(sort === "down"){
            position.x = 0;
            position.y = settingData.svgMoveRate * (loadedData.calcRate / svgData.zoomCurrent);
        }else if(sort === "left"){
            position.x = -settingData.svgMoveRate * (loadedData.calcRate / svgData.zoomCurrent);
            position.y = 0;
        }else{
            position.x = settingData.svgMoveRate * (loadedData.calcRate / svgData.zoomCurrent);
            position.y = 0;
        }

        if(globalData.selectedSvgs.length){

            for(let i=0; i<globalData.selectedSvgs.length ; i++) {
                const tempSvgData = {};
                tempSvgData.targetSvg = globalData.selectedSvgs[i];
                tempSvgData.rect = tempSvgData.targetSvg.children[0];
                tempSvgData.rectBBox = tempSvgData.rect.getBBox();
                tempSvgData.svgPosition = { x : tempSvgData.rectBBox.x , y : tempSvgData.rectBBox.y };
                svgData.svgMove.x = position.x;
                svgData.svgMove.y = position.y;
                changeSvgPosition(tempSvgData);
            }

        }else{

            svgData.svgMove.x = position.x;
            svgData.svgMove.y = position.y;
            changeSvgPosition();

        }

    }


    document.addEventListener( 'keydown', function (e) {

        const key = _common.getKeyboard(e);

        // globalData.allowAllEvents는
        // permission이 있는 경우와 없는 경우를 세밀하게 조절해야 하기 때문에 각각 이벤트에 할당해야함
        // input에 text를 입력하는 경우
        if(globalData.allowInputEvent){
            if(key.keyName === "ENTER"){
                globalData.inputTextAreaTarget.blur();
            }else if(key.keyName === "ESCAPE"){
                globalData.inputTextAreaTarget.value = "";
            }
            return;
        }


        setHotKeys(key);

        if (key.keyName === "W" && globalData.allowAllEvents){
            if(globalData.selectedObjects.length){
                for(let i=0; i<globalData.selectedObjects.length ; i++) {
                    const target = globalData.selectedObjects[i].objectUUID;
                    const shape = globalData.selectedObjects[i].children[0].name;
                    globalData.objectTarget = target;
                    globalData.objectTargetShape = shape;
                    positionYplus();
                }
            }else{
                positionYplus();
            }
        }
        if (key.keyName === "A" && globalData.allowAllEvents){
            if(globalData.selectedObjects.length){
                for(let i=0; i<globalData.selectedObjects.length ; i++) {
                    const target = globalData.selectedObjects[i].objectUUID;
                    const shape = globalData.selectedObjects[i].children[0].name;
                    globalData.objectTarget = target;
                    globalData.objectTargetShape = shape;
                    positionXminus();
                }
            }else{
                positionXminus();
            }
        }
        if (key.keyName === "S" && globalData.allowAllEvents){
            if(globalData.selectedObjects.length){
                for(let i=0; i<globalData.selectedObjects.length ; i++) {
                    const target = globalData.selectedObjects[i].objectUUID;
                    const shape = globalData.selectedObjects[i].children[0].name;
                    globalData.objectTarget = target;
                    globalData.objectTargetShape = shape;
                    positionYminus();
                }
            }else{
                positionYminus();
            }
        }
        if (key.keyName === "D" && globalData.allowAllEvents){
            if(globalData.selectedObjects.length){
                for(let i=0; i<globalData.selectedObjects.length ; i++) {
                    const target = globalData.selectedObjects[i].objectUUID;
                    const shape = globalData.selectedObjects[i].children[0].name;
                    globalData.objectTarget = target;
                    globalData.objectTargetShape = shape;
                    positionXplus();
                }
            }else{
                positionXplus();
            }
        }
        if (key.keyName === "Z" && globalData.allowAllEvents){
            if(globalData.objectTargetShape === "cube") {
                cuboideData.sort = "position";
                cuboideData.way = "pzP";
                cuboideData.value = settingData.objectMoveRate;
                cuboideData.iskeyboard = true;
                changeCuboide();
            }else if(globalData.objectTargetShape === "cylinder") {
                cylinderData.sort = "position";
                cylinderData.way = "pzP";
                cylinderData.value = settingData.objectMoveRate;
                cylinderData.iskeyboard = true;
                changeCylinder();
            }
        }
        if (key.keyName === "X" && globalData.allowAllEvents){
            if(globalData.objectTargetShape === "cube") {
                cuboideData.sort = "position";
                cuboideData.way = "pzM";
                cuboideData.value = -settingData.objectMoveRate;
                cuboideData.iskeyboard = true;
                changeCuboide();
            }else if(globalData.objectTargetShape === "cylinder") {
                cylinderData.sort = "position";
                cylinderData.way = "pzM";
                cylinderData.value = -settingData.objectMoveRate;
                cylinderData.iskeyboard = true;
                changeCylinder();
            }
        }
        if (key.keyName === "Q" && globalData.allowAllEvents){
            if(globalData.objectTargetShape === "cube") {
                cuboideData.sort = "rotation";
                cuboideData.way = "rzP";
                cuboideData.value = settingData.objectRotateRate;
                cuboideData.iskeyboard = true;
                changeCuboide();
            }else if(globalData.objectTargetShape === "cylinder") {
                cylinderData.sort = "rotation";
                cylinderData.way = "rzP";
                cylinderData.value = settingData.objectRotateRate;
                cylinderData.iskeyboard = true;
                changeCylinder();
            }
        }
        if (key.keyName === "E" && globalData.allowAllEvents){
            if(globalData.objectTargetShape === "cube") {
                cuboideData.sort = "rotation";
                cuboideData.way = "rzM";
                cuboideData.value = -settingData.objectRotateRate;
                cuboideData.iskeyboard = true;
                changeCuboide();
            }else if(globalData.objectTargetShape === "cylinder") {
                cylinderData.sort = "rotation";
                cylinderData.way = "rzM";
                cylinderData.value = -settingData.objectRotateRate;
                cylinderData.iskeyboard = true;
                changeCylinder();
            }
        }
        if (key.keyName === "Shift+Q" && globalData.allowAllEvents){
            if(globalData.objectTargetShape === "cube") {
                cuboideData.sort = "rotation";
                cuboideData.way = "rxP";
                cuboideData.value = -settingData.objectRotateRate;
                cuboideData.iskeyboard = true;
                changeCuboide();
            }else if(globalData.objectTargetShape === "cylinder") {
                cylinderData.sort = "rotation";
                cylinderData.way = "rxP";
                cylinderData.value = -settingData.objectRotateRate;
                cylinderData.iskeyboard = true;
                changeCylinder();
            }
        }
        if (key.keyName === "Shift+E" && globalData.allowAllEvents){
            if(globalData.objectTargetShape === "cube") {
                cuboideData.sort = "rotation";
                cuboideData.way = "rxM";
                cuboideData.value = settingData.objectRotateRate;
                cuboideData.iskeyboard = true;
                changeCuboide();
            }else if(globalData.objectTargetShape === "cylinder") {
                cylinderData.sort = "rotation";
                cylinderData.way = "rxM";
                cylinderData.value = settingData.objectRotateRate;
                cylinderData.iskeyboard = true;
                changeCylinder();
            }
        }
        if (key.keyName === "ARROWLEFT" && globalData.allowAllEvents){
            if(globalData.objectTargetShape === "cube") {
                cuboideData.sort = "rotation";
                cuboideData.way = "rzP";
                cuboideData.value = Math.PI/2;
                cuboideData.iskeyboard = true;
                changeCuboide();
            }else if(globalData.objectTargetShape === "cylinder") {
                cylinderData.sort = "rotation";
                cylinderData.way = "rxM";
                cylinderData.value = -Math.PI/2;
                cylinderData.iskeyboard = true;
                changeCylinder();
            }
        }
        if (key.keyName === "ARROWRIGHT" && globalData.allowAllEvents){
            if(globalData.objectTargetShape === "cube") {
                cuboideData.sort = "rotation";
                cuboideData.way = "rzM";
                cuboideData.value = -Math.PI/2;
                cuboideData.iskeyboard = true;
                changeCuboide();
            }else if(globalData.objectTargetShape === "cylinder") {
                cylinderData.sort = "rotation";
                cylinderData.way = "rxP";
                cylinderData.value = Math.PI/2;
                cylinderData.iskeyboard = true;
                changeCylinder();
            }
        }
        if (key.keyName === "Shift+W" && globalData.allowAllEvents){
            if(globalData.objectTargetShape === "cube") {
                cuboideData.sort = "size";
                cuboideData.way = "ytP";
                cuboideData.value = settingData.objectSizeRate;
                cuboideData.iskeyboard = true;
                changeCuboide();
            }else if(globalData.objectTargetShape === "cylinder") {
                cylinderData.sort = "size";
                cylinderData.way = "ytP";
                cylinderData.value = settingData.objectSizeRate;
                cylinderData.iskeyboard = true;
                changeCylinder();
            }
        }
        if (key.keyName === "Alt+W" && globalData.allowAllEvents){
            if(globalData.objectTargetShape === "cube") {
                cuboideData.sort = "size";
                cuboideData.way = "ytM";
                cuboideData.value = -settingData.objectSizeRate;
                cuboideData.iskeyboard = true;
                changeCuboide();
            }else if(globalData.objectTargetShape === "cylinder") {
                cylinderData.sort = "size";
                cylinderData.way = "ytM";
                cylinderData.value = settingData.objectSizeRate;
                cylinderData.iskeyboard = true;
                changeCylinder();
            }
        }
        if (key.keyName === "Shift+A" && globalData.allowAllEvents){
            if(globalData.objectTargetShape === "cube") {
                cuboideData.sort = "size";
                cuboideData.way = "xlP";
                cuboideData.value = settingData.objectSizeRate;
                cuboideData.iskeyboard = true;
                changeCuboide();
            }else if(globalData.objectTargetShape === "cylinder") {
                cylinderData.sort = "size";
                cylinderData.way = "xlP";
                cylinderData.value = settingData.objectSizeRate;
                cylinderData.iskeyboard = true;
                changeCylinder();
            }
        }
        if (key.keyName === "Alt+A" && globalData.allowAllEvents){
            if(globalData.objectTargetShape === "cube") {
                cuboideData.sort = "size";
                cuboideData.way = "xlM";
                cuboideData.value = -settingData.objectSizeRate;
                cuboideData.iskeyboard = true;
                changeCuboide();
            }else if(globalData.objectTargetShape === "cylinder") {
                cylinderData.sort = "size";
                cylinderData.way = "xlM";
                cylinderData.value = settingData.objectSizeRate;
                cylinderData.iskeyboard = true;
                changeCylinder();
            }
        }
        if (key.keyName === "Shift+S" && globalData.allowAllEvents){
            if(globalData.objectTargetShape === "cube") {
                cuboideData.sort = "size";
                cuboideData.way = "ybP";
                cuboideData.value = settingData.objectSizeRate;
                cuboideData.iskeyboard = true;
                changeCuboide();
            }else if(globalData.objectTargetShape === "cylinder") {
                cylinderData.sort = "size";
                cylinderData.way = "ybP";
                cylinderData.value = settingData.objectSizeRate;
                cylinderData.iskeyboard = true;
                changeCylinder();
            }
        }
        if (key.keyName === "Alt+S" && globalData.allowAllEvents){
            if(globalData.objectTargetShape === "cube") {
                cuboideData.sort = "size";
                cuboideData.way = "ybM";
                cuboideData.value = -settingData.objectSizeRate;
                cuboideData.iskeyboard = true;
                changeCuboide();
            }else if(globalData.objectTargetShape === "cylinder") {
                cylinderData.sort = "size";
                cylinderData.way = "ybM";
                cylinderData.value = settingData.objectSizeRate;
                cylinderData.iskeyboard = true;
                changeCylinder();
            }
        }
        if (key.keyName === "Shift+D" && globalData.allowAllEvents){
            if(globalData.objectTargetShape === "cube") {
                cuboideData.sort = "size";
                cuboideData.way = "xrP";
                cuboideData.value = settingData.objectSizeRate;
                cuboideData.iskeyboard = true;
                changeCuboide();
            }else if(globalData.objectTargetShape === "cylinder") {
                cylinderData.sort = "size";
                cylinderData.way = "xrP";
                cylinderData.value = settingData.objectSizeRate;
                cylinderData.iskeyboard = true;
                changeCylinder();
            }
        }
        if (key.keyName === "Alt+D" && globalData.allowAllEvents){
            if(globalData.objectTargetShape === "cube") {
                cuboideData.sort = "size";
                cuboideData.way = "xrM";
                cuboideData.value = -settingData.objectSizeRate;
                cuboideData.iskeyboard = true;
                changeCuboide();
            }else if(globalData.objectTargetShape === "cylinder") {
                cylinderData.sort = "size";
                cylinderData.way = "xrM";
                cylinderData.value = settingData.objectSizeRate;
                cylinderData.iskeyboard = true;
                changeCylinder();
            }
        }
        if (key.keyName === "Shift+Z" && globalData.allowAllEvents){
            cuboideData.sort = "size";
            cuboideData.way = "zfP";
            cuboideData.value = settingData.objectSizeRate;
            cuboideData.iskeyboard = true;
            changeCuboide();
        }
        if (key.keyName === "Alt+Z" && globalData.allowAllEvents){
            cuboideData.sort = "size";
            cuboideData.way = "zfM";
            cuboideData.value = -settingData.objectSizeRate;
            cuboideData.iskeyboard = true;
            changeCuboide();
        }
        if (key.keyName === "Shift+X" && globalData.allowAllEvents){
            cuboideData.sort = "size";
            cuboideData.way = "zbP";
            cuboideData.value = settingData.objectSizeRate;
            cuboideData.iskeyboard = true;
            changeCuboide();
        }
        if (key.keyName === "Alt+X" && globalData.allowAllEvents){
            cuboideData.sort = "size";
            cuboideData.way = "zbM";
            cuboideData.value = -settingData.objectSizeRate;
            cuboideData.iskeyboard = true;
            changeCuboide();
        }
        if (key.keyName === "Ctrl+C") {
            copyPasteObjects("copy");
        }
        if (key.keyName === "Ctrl+Shift+C") {
            copyPasteObjects("copyAll");
        }
        if (key.keyName === "Ctrl+V" && globalData.allowAllEvents) {
            copyPasteObjects("paste");

        }

        if (key.keyName === " "){
            setDefaultView();
            setDefaultChildCamera();
        }
        if (key.keyName === "1" && globalData.allowAllEvents){
            moveScreen();
        }
        if (key.keyName === "2" && globalData.allowAllEvents){
            cubeGuideBoxFunc();
        }
        if (key.keyName === "3" && globalData.allowAllEvents){
            cylinderGuideBoxFunc();
        }
        if (key.keyName === "4" && globalData.allowAllEvents){
            makeCuboideForOnlyRect();
            makeSvgBykey("manual");
        }
        if (key.keyName === "5" && globalData.allowAllEvents){
            findObjectFunc();
        }
        if (key.keyName === "6" && globalData.allowAllEvents){
            findPcdPointsFunc();
        }
        // if (key.keyName === "7" && globalData.allowAllEvents){
        //     searchPcd();
        // }
        // if (key.keyName === "8" && globalData.allowAllEvents){
        //     reviewFunc();
        // }
        if (key.keyName === "7"){
            searchPcd();
        }
        if (key.keyName === "8"){
            reviewFunc();
        }
        if (key.keyName === "9"){
            controlGuidePopUp();
        }
        if (key.keyName === "TAB") {
            changeNextCuboideList();
        }
        if (key.keyName === "DELETE" && globalData.allowAllEvents) {
            deleteObject();
        }
        if(key.keyName === "PAGEDOWN"){
            changePcdList("next", controlData);
        }
        if(key.keyName === "PAGEUP"){
            changePcdList("prev", controlData);
        }
        if (key.keyName === "F1"){
            controlGuidePopUp();
        }
        if (key.keyName === "F2"){
            settingData.visibleObjectSphere = !settingData.visibleObjectSphere;
            changeObjectSphere();
            _common.cookie.set("visibleObjectSphere", settingData.visibleObjectSphere);
        }
        if (key.keyName === "F3"){
            visibilitySelectedSvgs();
        }
        if (key.keyName === "F4"){
            visibilitySelectedObjects();
        }
        if (key.keyName === "F5"){

            const targetPcdIndex = objects.pcds.findIndex((pcd)=>{ return pcd.workTicketId === globalData.pcdTarget; });
            const projectId = objects.pcds[targetPcdIndex].projectId;
            const taskId = objects.pcds[targetPcdIndex].taskId;
            const workTicketId = globalData.pcdTarget;
            const pageNum = globalData.currentPage;
            const reqType = globalData.reqType;

            let next = window.location.pathname;
            next += "?projectId=" + projectId
                + "&taskId=" + taskId
                + "&workTicketId=" + workTicketId
                + "&reqType=" + reqType
                + "&pageNum=" + pageNum
            // + "&viewType=MAIN_CAM"
            ;
            window.location = next;
        }
        if (key.keyName === "F6"){
            makeSvgBykey("auto");
        }
        if (key.keyName === "F7"){
            makeSvgBykey("manual");
        }
        if (key.keyName === "F8"){
            const total = rgbSelect.children.length;
            let currentIndex = rgbSelect.selectedIndex;
            (currentIndex < total-1) ? currentIndex++ : currentIndex = 0;
            rgbSelect.selectedIndex = currentIndex;
            changeRGBCamera();
            if(objects.svgs.length) changeSvgList();
        }

        if (key.keyName === "T" && globalData.allowAllEvents){
            setSvgPosition("up");
        }
        if (key.keyName === "G" && globalData.allowAllEvents){
            setSvgPosition("down");
        }
        if (key.keyName === "F" && globalData.allowAllEvents){
            setSvgPosition("left");
        }
        if (key.keyName === "H" && globalData.allowAllEvents){
            setSvgPosition("right");
        }



        e.preventDefault();

    }, false);


}


export { setKeys , moveScreen, setAlert, cubeGuideBoxFunc }