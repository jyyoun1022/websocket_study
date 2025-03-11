import * as THREE from './build/three.module.js';
import { settingUI } from './settingUI.js';
import { drawObjectsInRgbCanvas } from "./setObjectsInRgbCanvas.js";
import { changeSvgCircle } from "./makeSvg.js";
import {objects, globalData, settingData, defaultSettingData, hugeData} from './variables.js';


settingTapWrap.innerHTML = settingUI;

const tapBtns = [btnWork, btnSetting, btnHotKey];
const tapWraps = [workTapWrap, settingTapWrap, hotkeyTapWrap];
const titles = [
    "centerPointVisible", "labelsVisible", "ObejctSphereVisible", "PCDVisible", "PCDCounter", "PCDColor",
    "wireframeVisible", "wireframeColor", "frontCuboidVisible", "frontCuboidColor", "OPLCounter", "SRCounter",
    "MRCounter", "RRCounter", "SMRCounter", "planeVisible", "planeShape", "PPCounter", "PSCounter", "planeColor",
    "IBCounter", "ICCounter", "ROCounter", "CLWCounter", "RLWCounter", "RCSCounter", "PcdOriginColor"
];

let geometry;

// const defaultSettingData = {};


function setSettings() {

    // for (const [key, value] of Object.entries(settingData)) {
    //     defaultSettingData[key] = value;
    // }

    // tap 버튼들
    btnWork.addEventListener("click", function (e) {
        setTapEvent(tapBtns[0], tapWraps[0]);
    });
    btnSetting.addEventListener("click", function (e) {
        setTapEvent(tapBtns[1], tapWraps[1]);
    });
    btnHotKey.addEventListener("click", function (e) {
        setTapEvent(tapBtns[2], tapWraps[2]);
    });


    // pcd size
    $('#PCDSlider').slider({
        range: 'min',
        min: 1,
        max: 10,
        value: settingData.pcdSize,
        step: 0.1,
        slide: function (event, ui) {
            $('#PCDCounter p').html(ui.value);
            settingData.pcdSize = ui.value;
            objects.PcdModel.material.size = settingData.pcdSize;
            _common.cookie.set("pcdSize", settingData.pcdSize);
        }
    });

    // cuboide opacity
    $('#OPLSlider').slider({
        range: 'min',
        min: 0.1,
        max: 1,
        value: settingData.objectOpacity,
        step: 0.01,
        slide: function (event, ui) {
            $('#OPLCounter p').html(ui.value);
            settingData.objectOpacity = ui.value;
            changeObjectStatus("opacity");
            _common.cookie.set("objectOpacity", settingData.objectOpacity);
        }
    });

    // cuboide size ratio
    $('#SRSlider').slider({
        range: 'min',
        min: 0.01,
        max: 0.1,
        value: settingData.objectSizeRate,
        step: 0.001,
        slide: function (event, ui) {
            $('#SRCounter p').html(ui.value);
            settingData.objectSizeRate = ui.value;
            _common.cookie.set("objectSizeRate", settingData.objectSizeRate);
        }
    });


    // cuboide move ratio
    $('#MRSlider').slider({
        range: 'min',
        min: 0.01,
        max: 0.2,
        value: settingData.objectMoveRate,
        step: 0.001,
        slide: function (event, ui) {
            $('#MRCounter p').html(ui.value);
            settingData.objectMoveRate = ui.value;
            _common.cookie.set("objectMoveRate", settingData.objectMoveRate);
        }
    });

    // cuboide rotation ratio
    $('#RRSlider').slider({
        range: 'min',
        min: 0.01,
        max: 0.1,
        value: settingData.objectRotateRate,
        step: 0.001,
        slide: function (event, ui) {
            $('#RRCounter p').html(ui.value);
            settingData.objectRotateRate = ui.value;
            _common.cookie.set("objectRotateRate", settingData.objectRotateRate);
        }
    });

    // svg move ratio
    $('#SMRSlider').slider({
        range: 'min',
        min: 1.0,
        max: 10.0,
        value: settingData.svgMoveRate,
        step: 0.5,
        slide: function (event, ui) {
            $('#SMRCounter p').html(ui.value);
            settingData.svgMoveRate = ui.value;
            _common.cookie.set("svgMoveRate", settingData.svgMoveRate);
        }
    });

    // plane positionZ ratio
    $('#PPSlider').slider({
        range: 'min',
        min: -20,
        max: 20,
        value: settingData.planePosZ,
        step: 0.1,
        slide: function (event, ui) {
            // $('#PPCounter p').html(ui.value);
            planePosInput.value = ui.value;
            settingData.planePosZ = ui.value;
            objects.plane.position.z = settingData.planePosZ;
            _common.cookie.set("planePosZ", settingData.planePosZ);
        }
    });
    btnPlanePosPlus.addEventListener("click", function (e) {
        if(settingData.planePosZ < 20){
            settingData.planePosZ += 0.1;
            objects.plane.position.z = settingData.planePosZ;
            $('#PPSlider').slider('value', settingData.planePosZ);
            planePosInput.value = settingData.planePosZ.toFixed(1);
            _common.cookie.set("planePosZ", settingData.planePosZ);
            e.stopPropagation();
        }
    });
    btnPlanePosMinus.addEventListener("click", function (e) {
        if(settingData.planePosZ > -20){
            settingData.planePosZ -= 0.1;
            objects.plane.position.z = settingData.planePosZ;
            $('#PPSlider').slider('value', settingData.planePosZ);
            planePosInput.value = settingData.planePosZ.toFixed(1);
            _common.cookie.set("planePosZ", settingData.planePosZ);
            e.stopPropagation();
        }
    });
    planePosInput.addEventListener('focus', function(e){
        globalData.allowInputEvent = true;
        globalData.inputTextAreaTarget = this;
        e.stopPropagation();
    });
    planePosInput.addEventListener('blur', function(e){
        globalData.allowInputEvent = false;
        globalData.inputTextAreaTarget = null;
        if(this.value >= -20 && this.value <= 20){
            settingData.planePosZ = Number(this.value);
            objects.plane.position.z = settingData.planePosZ;
            $('#PPSlider').slider('value', settingData.planePosZ);
            _common.cookie.set("planePosZ", settingData.planePosZ);
        }else{
            this.value = settingData.planePosZ;
        }
        e.stopPropagation();
    });




    // plane size ratio
    $('#PSSlider').slider({
        range: 'min',
        min: 1,
        max: 1000,
        value: settingData.planeSize,
        step: 1,
        slide: function (event, ui) {
            // $('#PSCounter p').html(ui.value);
            planeSizeInput.value = ui.value;
            settingData.planeSize = ui.value;
            objects.plane.scale.x = settingData.planeSize;
            objects.plane.scale.y = settingData.planeSize;
            _common.cookie.set("planeSize", settingData.planeSize);
        }
    });
    btnPlaneSizePlus.addEventListener("click", function (e) {
        if(settingData.planeSize < 1000){
            settingData.planeSize++;
            objects.plane.scale.x = settingData.planeSize;
            objects.plane.scale.y = settingData.planeSize;
            $('#PSSlider').slider('value', settingData.planeSize);
            planeSizeInput.value = settingData.planeSize;
            _common.cookie.set("planeSize", settingData.planeSize);
            e.stopPropagation();
        }
    });
    btnPlaneSizeMinus.addEventListener("click", function (e) {
        if(settingData.planeSize > 1){
            settingData.planeSize--;
            objects.plane.scale.x = settingData.planeSize;
            objects.plane.scale.y = settingData.planeSize;
            $('#PSSlider').slider('value', settingData.planeSize);
            planeSizeInput.value = settingData.planeSize;
            _common.cookie.set("planeSize", settingData.planeSize);
            e.stopPropagation();
        }
    });
    planeSizeInput.addEventListener('focus', function(e){
        globalData.allowInputEvent = true;
        globalData.inputTextAreaTarget = this;
        e.stopPropagation();
    });
    planeSizeInput.addEventListener('blur', function(e){
        globalData.allowInputEvent = false;
        globalData.inputTextAreaTarget = null;
        if(this.value >= 1 && this.value <= 1000){
            settingData.planeSize = Number(this.value);
            objects.plane.scale.x = settingData.planeSize;
            objects.plane.scale.y = settingData.planeSize;
            $('#PSSlider').slider('value', settingData.planeSize);
            _common.cookie.set("planeSize", settingData.planeSize);
        }else{
            this.value = settingData.planeSize;
        }
        e.stopPropagation();
    });




    // image brightness
    $('#IBSlider').slider({
        range: 'min',
        min: 0,
        max: 200,
        value: settingData.imageBrightness,
        step: 1,
        slide: function (event, ui) {
            $('#IBCounter p').html(ui.value);
            settingData.imageBrightness = ui.value;
            rgbImage.style.filter = `brightness(${ settingData.imageBrightness }%) contrast(${ settingData.imageContrast }%)`;
            _common.cookie.set("imageBrightness", settingData.imageBrightness);
        }
    });

    // image contrast
    $('#ICSlider').slider({
        range: 'min',
        min: 0,
        max: 200,
        value: settingData.imageContrast,
        step: 1,
        slide: function (event, ui) {
            $('#ICCounter p').html(ui.value);
            settingData.imageContrast = ui.value;
            rgbImage.style.filter = `brightness(${ settingData.imageBrightness }%) contrast(${ settingData.imageContrast }%)`;
            _common.cookie.set("imageContrast", settingData.imageContrast);
        }
    });

    // RGB Opacity
    $('#ROSlider').slider({
        range: 'min',
        min: 0,
        max: 1,
        value: settingData.RGBopacity,
        step: 0.01,
        slide: function (event, ui) {
            $('#ROCounter p').html(ui.value);
            settingData.RGBopacity = ui.value;
            drawObjectsInRgbCanvas();
            _common.cookie.set("RGBopacity", settingData.RGBopacity);
        }
    });

    // cuboid line width
    $('#CLWSlider').slider({
        range: 'min',
        min: 1,
        max: 10,
        value: settingData.cuboideLineWidth,
        step: 1,
        slide: function (event, ui) {
            $('#CLWCounter p').html(ui.value);
            settingData.cuboideLineWidth = ui.value;
            drawObjectsInRgbCanvas();
            _common.cookie.set("cuboideLineWidth", settingData.cuboideLineWidth);
        }
    });

    // rect line width
    $('#RLWSlider').slider({
        range: 'min',
        min: 0.5,
        max: 10,
        value: settingData.rectLineWidth,
        step: 1,
        slide: function (event, ui) {
            $('#RLWCounter p').html(ui.value);
            settingData.rectLineWidth = ui.value;
            const rectList = document.querySelectorAll('.svgRect');
            rectList.forEach((rect) => {
                rect.style.strokeWidth = settingData.rectLineWidth;
            });
            _common.cookie.set("rectLineWidth", settingData.rectLineWidth);
        }
    });

    // rect circle size
    $('#RCSSlider').slider({
        range: 'min',
        min: 0.5,
        max: 5,
        value: settingData.rectCircleSize,
        step: 0.1,
        slide: function (event, ui) {
            $('#RCSCounter p').html(ui.value);
            settingData.rectCircleSize = ui.value;
            objects.svgs.forEach((group) => {
                changeSvgCircle(group);
            });
            _common.cookie.set("rectCircleSize", settingData.rectCircleSize);
        }
    });

    // 모든 radio 버튼 event
    $('#settingTapWrap input[type=radio]').on('change', function () {
        switch (this.value) {
            case 'showCP':
                settingData.visibleCenterPoint = true;
                drawObjectsInRgbCanvas();
                vcp1.checked = settingData.visibleCenterPoint;
                vcp2.checked = !settingData.visibleCenterPoint;
                _common.cookie.set("visibleCenterPoint", true);
                break;
            case 'hiddenCP':
                settingData.visibleCenterPoint = false;
                drawObjectsInRgbCanvas();
                vcp1.checked = settingData.visibleCenterPoint;
                vcp2.checked = !settingData.visibleCenterPoint;
                _common.cookie.set("visibleCenterPoint", false);
                break;
            case 'showLB':
                settingData.visibleLabels = true;
                changeLabels();
                _common.cookie.set("visibleLabels", true);
                break;
            case 'hiddenLB':
                settingData.visibleLabels = false;
                changeLabels();
                _common.cookie.set("visibleLabels", false);
                break;
            case 'showCS':
                settingData.visibleObjectSphere = true;
                changeObjectSphere();
                _common.cookie.set("visibleObjectSphere", true);
                break;
            case 'hiddenCS':
                settingData.visibleObjectSphere = false;
                changeObjectSphere();
                _common.cookie.set("visibleObjectSphere", false);
                break;
            case 'showPC':
                settingData.visiblePointCloud = true;
                objects.PcdModel.visible = true;
                _common.cookie.set("visiblePointCloud", true);
                break;
            case 'hiddenPC':
                settingData.visiblePointCloud = false;
                objects.PcdModel.visible = false;
                _common.cookie.set("visiblePointCloud", false);
                break;
            case 'originPCC':
                settingData.showOriginPcdColor = true;
                changePcdColor();
                _common.cookie.set("showOriginPcdColor", true);
                break;
            case 'customPCC':
                settingData.showOriginPcdColor = false;
                changePcdColor();
                _common.cookie.set("showOriginPcdColor", false);
                break;
            case 'showWF':
                settingData.visibleWireFrame = true;
                changeWireFrame("visible");
                _common.cookie.set("visibleWireFrame", true);
                break;
            case 'hiddenWF':
                settingData.visibleWireFrame = false;
                changeWireFrame("visible");
                _common.cookie.set("visibleWireFrame", false);
                break;
            case 'showFC':
                settingData.visibleFrontCube = true;
                changeFrontCube("visible");
                _common.cookie.set("visibleFrontCube", true);
                break;
            case 'hiddenFC':
                settingData.visibleFrontCube = false;
                changeFrontCube("visible");
                _common.cookie.set("visibleFrontCube", false);
                break;
            case 'showPL':
                settingData.visiblePlane = true;
                objects.plane.visible = settingData.visiblePlane;
                _common.cookie.set("visiblePlane", true);
                break;
            case 'hiddenPL':
                settingData.visiblePlane = false;
                objects.plane.visible = settingData.visiblePlane;
                _common.cookie.set("visiblePlane", false);
                break;
            case 'squarePL':
                settingData.planeShape = "square";
                geometry = new THREE.PlaneGeometry(1, 1);
                objects.plane.geometry = geometry;
                _common.cookie.set("planeShape", "square");
                break;
            case 'circlePL':
                settingData.planeShape = "circle";
                geometry = new THREE.CircleGeometry(0.5, 32);
                objects.plane.geometry = geometry;
                _common.cookie.set("planeShape", "circle");
                break;
            // case 'defaultIS':
            //     _common.cookie.set("useEdgeServer", false);
            //     location.reload()
            //     break;
            // case 'edgeIS':
            //     _common.cookie.set("useEdgeServer", true);
            //     location.reload()
            //     break;
        }
    });


    // color picker event
    $('input[type=color]').on('change', function () {

        this.parentNode.style.backgroundColor = this.value;

        // pcd color
        if (this.id === "PCP") {

            settingData.pcdColor = this.value;
            changePcdColor();
            _common.cookie.set("pcdColor", settingData.pcdColor);

            // wireframe color
        } else if (this.id === "WCP") {

            settingData.wireFrameColor = this.value;
            changeWireFrame("color");
            _common.cookie.set("wireFrameColor", settingData.wireFrameColor);

            // front cube color
        } else if (this.id === "FCP") {

            settingData.frontCubeColor = this.value;
            changeFrontCube("color");
            _common.cookie.set("frontCubeColor", settingData.frontCubeColor);

            // floor color
        } else if (this.id === "PLCP") {

            settingData.planeColor = this.value;
            objects.plane.material.color = new THREE.Color(settingData.planeColor);
            _common.cookie.set("planeColor", settingData.planeColor);
        }
    });

    $('#SRCounter p').html(settingData.objectSizeRate);
    $('#MRCounter p').html(settingData.objectMoveRate);
    $('#RRCounter p').html(settingData.objectRotateRate);

    $('#SMRCounter p').html(settingData.svgMoveRate);

    $('#PCDCounter p').html(settingData.pcdSize);
    $('#OPLCounter p').html(settingData.objectOpacity);

    $('#PPCounter p').html(settingData.planePosZ);
    $('#PSCounter p').html(settingData.planeSize);

    $('#IBCounter p').html(settingData.imageBrightness);
    $('#ICCounter p').html(settingData.imageContrast);

    $('#ROCounter p').html(settingData.RGBopacity);
    $('#CLWCounter p').html(settingData.cuboideLineWidth);

    $('#RLWCounter p').html(settingData.rectLineWidth);
    $('#RCSCounter p').html(settingData.rectCircleSize);


    WCP.parentNode.style.backgroundColor = settingData.wireFrameColor;
    FCP.parentNode.style.backgroundColor = settingData.frontCubeColor;
    PCP.parentNode.style.backgroundColor = settingData.pcdColor;
    PLCP.parentNode.style.backgroundColor = settingData.planeColor;


    titles.forEach((list)=> {
        const btn = document.getElementById(list);
        btn.addEventListener("click", function (e) {
            settingDefault(list, "event");
        });
    });

    function setTapEvent(btn, wrap){
        tapBtns.forEach((btn)=>{
            btn.classList.remove("on");
        });
        tapWraps.forEach((wrap)=>{
            wrap.style.display = "none";
        });
        btn.classList.add("on");
        wrap.style.display = "block";
    }


}

function changePcdColor(){

    let colors = [];
    const r = parseInt(settingData.pcdColor.substr(1,2), 16);
    const g = parseInt(settingData.pcdColor.substr(3,2), 16);
    const b = parseInt(settingData.pcdColor.substr(5,2), 16);

    // pcd에 originColor가 있을 경우
    if(globalData.hasOriginPcdColor) {

        if(settingData.showOriginPcdColor){
            for(let i=0 ; i <  hugeData.colorIndexes.length ; i++){
                hugeData.pcdPointColors[hugeData.colorIndexes[i]] = r;
                hugeData.pcdPointColors[hugeData.colorIndexes[i]+1] = g;
                hugeData.pcdPointColors[hugeData.colorIndexes[i]+2] = b;
            }
            colors = [...hugeData.pcdPointColors];
        }else{
            for(let i=0 ; i < objects.PcdModel.geometry.attributes.position.array.length ; i+=3){
                colors[i] = r, colors[i+1] = g, colors[i+2] = b;
            }
        }

    }else{

        if(objects.PcdModel !== null){
            for(let i=0 ; i < objects.PcdModel.geometry.attributes.position.array.length ; i+=3){
                colors[i] = r, colors[i+1] = g, colors[i+2] = b;
            }
        }

    }


    if(objects.PcdModel !== null) objects.PcdModel.geometry.setAttribute( 'color', new THREE.BufferAttribute( new Uint8Array(colors), 3, true ) );
}

function changeObjectStatus(sort){
    if(objects.object3Ds.length){
        objects.object3Ds.forEach((group)=>{
            const object = group.children[0];
            if(sort === "opacity" && !object.onlyRect){
                object.material.opacity = settingData.objectOpacity;
            }
        });
    }
}

function changeWireFrame(sort){

    if(objects.object3Ds.length){
        objects.object3Ds.forEach((group)=>{
            const object = group.children[0];
            if(sort === "visible"){
                object.children[0].visible = settingData.visibleWireFrame;
            }else if(sort === "color"){
                object.children[0].material.color = new THREE.Color(settingData.wireFrameColor);
            }
        });
    }
}

function changeLabels(sort){
    objects.object3Ds.forEach((group)=>{
        const label = group.getObjectByName("label");
        if(label !== undefined){
            label.visible = settingData.visibleLabels;
        }
    });
}


function changeFrontCube(sort){
    if(objects.object3Ds.length){
        objects.object3Ds.forEach((group)=>{
            const frontCube = group.getObjectByName("frontCube");
            if(frontCube !== undefined){
                if(sort === "visible"){
                    frontCube.visible = settingData.visibleFrontCube;
                }else if(sort === "color"){
                    frontCube.material.color = new THREE.Color(settingData.frontCubeColor);
                }
            }
        });
    }
}

function settingDefault(target, sort){

    switch (target) {
        case 'centerPointVisible':
            if(sort === "event") {
                settingData.visibleCenterPoint = defaultSettingData.visibleCenterPoint;
                _common.cookie.set("visibleCenterPoint", settingData.visibleCenterPoint);
            }
            drawObjectsInRgbCanvas();
            vcp1.checked = settingData.visibleCenterPoint;
            vcp2.checked = !settingData.visibleCenterPoint;
            break;
        case 'labelsVisible':
            if(sort === "event") {
                settingData.visibleLabels = defaultSettingData.visibleLabels;
                _common.cookie.set("visibleLabels", settingData.visibleLabels);
            }
            changeLabels();
            vlb1.checked = settingData.visibleLabels;
            vlb2.checked = !settingData.visibleLabels;
            break;
        case 'ObejctSphereVisible':
            if(sort === "event") {
                settingData.visibleObjectSphere = defaultSettingData.visibleObjectSphere;
                _common.cookie.set("visibleObjectSphere", settingData.visibleObjectSphere);
            }
            changeObjectSphere();
            break;
        case 'PCDVisible':
            if(sort === "event") {
                settingData.visiblePointCloud = defaultSettingData.visiblePointCloud;
                _common.cookie.set("visiblePointCloud", settingData.visiblePointCloud);
            }
            if(objects.PcdModel !== null) objects.PcdModel.visible = settingData.visiblePointCloud;
            vpc1.checked = settingData.visiblePointCloud;
            vpc2.checked = !settingData.visiblePointCloud;
            break;
        case 'PCDCounter':
            if(sort === "event") {
                settingData.pcdSize = defaultSettingData.pcdSize;
                _common.cookie.set("pcdSize", settingData.pcdSize);
            }
            $('#PCDSlider').slider('value', settingData.pcdSize);
            $('#PCDCounter p').html( settingData.pcdSize );
            if(objects.PcdModel !== null) objects.PcdModel.material.size = settingData.pcdSize;
            break;
        case 'PcdOriginColor':
            if(sort === "event") {
                settingData.showOriginPcdColor = defaultSettingData.showOriginPcdColor;
                _common.cookie.set("showOriginPcdColor", settingData.showOriginPcdColor);
            }
            changePcdColor();

            pcc1.checked = settingData.showOriginPcdColor;
            pcc2.checked = !settingData.showOriginPcdColor;
            break;
        case 'PCDColor':
            if(sort === "event") {
                settingData.pcdColor = defaultSettingData.pcdColor;
                _common.cookie.set("pcdColor", settingData.pcdColor);
            }
            changePcdColor();
            PCP.parentNode.style.backgroundColor = settingData.pcdColor;
            break;
        case 'wireframeVisible':
            if(sort === "event") {
                settingData.visibleWireFrame = defaultSettingData.visibleWireFrame;
                _common.cookie.set("visibleWireFrame", settingData.visibleWireFrame);
            }
            changeWireFrame("visible");
            vwf1.checked = settingData.visibleWireFrame;
            vwf2.checked = !settingData.visibleWireFrame;
            break;
        case 'wireframeColor':
            if(sort === "event") {
                settingData.wireFrameColor = defaultSettingData.wireFrameColor;
                _common.cookie.set("wireFrameColor", settingData.wireFrameColor);
            }
            changeWireFrame("color");
            WCP.parentNode.style.backgroundColor = settingData.wireFrameColor;
            break;
        case 'frontCuboidVisible':
            if(sort === "event") {
                settingData.visibleFrontCube = defaultSettingData.visibleFrontCube;
                _common.cookie.set("visibleFrontCube", settingData.visibleFrontCube);
            }
            changeFrontCube("visible");
            vfc1.checked = settingData.visibleFrontCube;
            vfc2.checked = !settingData.visibleFrontCube;
            break;
        case 'frontCuboidColor':
            if(sort === "event") {
                settingData.frontCubeColor = defaultSettingData.frontCubeColor;
                _common.cookie.set("frontCubeColor", settingData.frontCubeColor);
            }
            changeFrontCube("color");
            FCP.parentNode.style.backgroundColor = settingData.frontCubeColor;
            break;
        case 'OPLCounter':
            if(sort === "event") {
                settingData.objectOpacity = defaultSettingData.objectOpacity;
                _common.cookie.set("objectOpacity", settingData.objectOpacity);
            }
            $('#OPLSlider').slider('value', settingData.objectOpacity);
            $('#OPLCounter p').html( settingData.objectOpacity );
            changeObjectStatus("opacity");
            break;
        case 'SRCounter':
            if(sort === "event") {
                settingData.objectSizeRate = defaultSettingData.objectSizeRate;
                _common.cookie.set("objectSizeRate", settingData.objectSizeRate);
            }
            $('#SRSlider').slider('value', settingData.objectSizeRate);
            $('#SRCounter p').html( settingData.objectSizeRate );
            break;
        case 'MRCounter':
            if(sort === "event") {
                settingData.objectMoveRate = defaultSettingData.objectMoveRate;
                _common.cookie.set("objectMoveRate", settingData.objectMoveRate);
            }
            $('#MRSlider').slider('value', settingData.objectMoveRate);
            $('#MRCounter p').html( settingData.objectMoveRate );
            break;
        case 'RRCounter':
            if(sort === "event") {
                settingData.objectRotateRate = defaultSettingData.objectRotateRate;
                _common.cookie.set("objectRotateRate", settingData.objectRotateRate);
            }
            $('#RRSlider').slider('value', settingData.objectRotateRate);
            $('#RRCounter p').html( settingData.objectRotateRate );
            break;
        case 'SMRCounter':
            if(sort === "event") {
                settingData.svgMoveRate = defaultSettingData.svgMoveRate;
                _common.cookie.set("svgMoveRate", settingData.svgMoveRate);
            }
            $('#SMRSlider').slider('value', settingData.svgMoveRate);
            $('#SMRCounter p').html( settingData.svgMoveRate );
            break;
        case 'planeVisible':
            if(sort === "event") {
                settingData.visiblePlane = defaultSettingData.visiblePlane;
                _common.cookie.set("visiblePlane", settingData.visiblePlane);
            }
            objects.plane.visible = settingData.visiblePlane;
            vpl1.checked = settingData.visiblePlane;
            vpl2.checked = !settingData.visiblePlane;
            break;
        case 'planeShape':
            if(sort === "event") {
                settingData.planeShape = defaultSettingData.planeShape;
                _common.cookie.set("planeShape", settingData.planeShape);
            }
            if(settingData.planeShape === "square"){
                geometry = new THREE.PlaneGeometry(1, 1);
                pls1.checked = true;
                pls2.checked = false;
            }else{
                geometry = new THREE.CircleGeometry(0.5, 32);
                pls1.checked = false;
                pls2.checked = true;
            }
            objects.plane.geometry = geometry;

            break;
        case 'PPCounter':
            if(sort === "event") {
                settingData.planePosZ = defaultSettingData.planePosZ;
                _common.cookie.set("planePosZ", settingData.planePosZ);
            }
            $('#PPSlider').slider('value', settingData.planePosZ);
            planePosInput.value = settingData.planePosZ.toFixed(1);
            objects.plane.position.z = settingData.planePosZ;
            break;
        case 'PSCounter':
            if(sort === "event") {
                settingData.planeSize = defaultSettingData.planeSize;
                _common.cookie.set("planeSize", settingData.planeSize);
            }
            $('#PSSlider').slider('value', settingData.planeSize);
            planeSizeInput.value = settingData.planeSize;
            objects.plane.scale.x = settingData.planeSize;
            objects.plane.scale.y = settingData.planeSize;
            break;
        case 'planeColor':
            if(sort === "event") {
                settingData.planeColor = defaultSettingData.planeColor;
                _common.cookie.set("planeColor", settingData.planeColor);
            }
            objects.plane.material.color = new THREE.Color(settingData.planeColor);
            PLCP.parentNode.style.backgroundColor = settingData.planeColor;
            break;
        case 'IBCounter':
            if(sort === "event") {
                settingData.imageBrightness = defaultSettingData.imageBrightness;
                _common.cookie.set("imageBrightness", settingData.imageBrightness);
            }
            $('#IBSlider').slider('value', settingData.imageBrightness);
            $('#IBCounter p').html( settingData.imageBrightness );
            rgbImage.style.filter = `brightness(${ settingData.imageBrightness }%) contrast(${ settingData.imageContrast }%)`;
            break;
        case 'ICCounter':
            if(sort === "event") {
                settingData.imageContrast = defaultSettingData.imageContrast;
                _common.cookie.set("imageContrast", settingData.imageContrast);
            }
            $('#ICSlider').slider('value', settingData.imageContrast);
            $('#ICCounter p').html( settingData.imageContrast );
            rgbImage.style.filter = `brightness(${ settingData.imageBrightness }%) contrast(${ settingData.imageContrast }%)`;
            break;
        case 'ROCounter':
            if(sort === "event") {
                settingData.RGBopacity = defaultSettingData.RGBopacity;
                _common.cookie.set("RGBopacity", settingData.RGBopacity);
            }
            $('#ROSlider').slider('value', settingData.RGBopacity);
            $('#ROCounter p').html( settingData.RGBopacity );
            drawObjectsInRgbCanvas();
            break;
        case 'CLWCounter':
            if(sort === "event") {
                settingData.cuboideLineWidth = defaultSettingData.cuboideLineWidth;
                _common.cookie.set("cuboideLineWidth", settingData.cuboideLineWidth);
            }
            $('#CLWSlider').slider('value', settingData.cuboideLineWidth);
            $('#CLWCounter p').html( settingData.cuboideLineWidth );
            drawObjectsInRgbCanvas();
            break;
        case 'RLWCounter':
            if(sort === "event") {
                settingData.rectLineWidth = defaultSettingData.rectLineWidth;
                _common.cookie.set("rectLineWidth", settingData.rectLineWidth);
            }
            $('#RLWSlider').slider('value', settingData.rectLineWidth);
            $('#RLWCounter p').html( settingData.rectLineWidth );
            const rectList = document.querySelectorAll('.svgRect');
            rectList.forEach((rect)=>{
                rect.style.strokeWidth = settingData.rectLineWidth;
            });
            break;
        case 'RCSCounter':
            if(sort === "event") {
                settingData.rectCircleSize = defaultSettingData.rectCircleSize;
                _common.cookie.set("rectCircleSize", settingData.rectCircleSize);
            }
            $('#RCSSlider').slider('value', settingData.rectCircleSize);
            $('#RCSCounter p').html( settingData.rectCircleSize );
            objects.svgs.forEach((group)=>{
                changeSvgCircle(group);
            });
            break;
        // case 'imageServerUrl' :
        //     isu1.checked = !settingData.useEdgeServer;
        //     isu2.checked = settingData.useEdgeServer;
        //     break;
    }
}



function changeObjectSphere(){

    if(objects.object3Ds.length) {
        const targetIndex = objects.object3Ds.findIndex((object)=>{
            return object.objectUUID === globalData.objectTarget;
        });
        objects.object3Ds[targetIndex].children.forEach((obj) => {
            const name = obj.name.substring(obj.name.length - 6, obj.name.length);
            if (name === "Sphere") {
                obj.visible = settingData.visibleObjectSphere;
            }
        });
        vcs1.checked = settingData.visibleObjectSphere;
        vcs2.checked = !settingData.visibleObjectSphere;
    }

}

export{ setSettings, settingDefault, changeObjectSphere }