
import * as THREE from './build/three.module.js';
import { getFinalCuboideData } from './saveData.js';
import { objects, globalData, settingData } from './variables.js';



function setParamsInRgbCanvas(){

    const targetPcd = objects.pcds.findIndex((pcd)=>{ return pcd.workTicketId === globalData.pcdTarget; });
    const targetRGB = objects.pcds[targetPcd].rgbImages.findIndex((rgb)=>{ return rgb.camId === globalData.rgbCameraTarget; });
    const loadedData = objects.pcds[targetPcd].rgbImages[targetRGB].loadedData;
    const imageFile = objects.pcds[targetPcd].rgbImages[targetRGB].loadedImage;
    const targetCalibration =  objects.rgbCameras.findIndex((camera)=>{ return camera.camId === globalData.rgbCameraTarget; });
    const calibrationTxt = objects.rgbCameras[targetCalibration].calibrationTxt;


    // const calibrationTxt = `
    //     Number: 1|
    //     LidarImageOffset|
    //     0|
    //     Angle : LR, UD, Rot|
    //     -4.666471,0.029524,0.012215|
    //     TranslationMatrix|
    //     0.560000,-0.340000,-0.570000|
    //     intrinsicCameraParameter|
    //     1484.864234,1402.624750,1074.600000,633.437500,-0.487890,0.179688,0.000000,0.000000
    // `;

    globalData.rgbCanvasParams.calibrationTxt = calibrationTxt;
    globalData.rgbCanvasParams.cal = _ren.fn.convertCalibrationValues(globalData.rgbCanvasParams.calibrationTxt);

    globalData.rgbCanvasParams.canvasElement = document.querySelector('#rgbCanvas');
    globalData.rgbCanvasParams.naturalWidth  = imageFile.naturalWidth;
    globalData.rgbCanvasParams.naturalHeight = imageFile.naturalHeight;
    globalData.rgbCanvasParams.isDot = false;
    globalData.rgbCanvasParams.opacity = settingData.RGBopacity;

    drawObjectsInRgbCanvas();

}


function getCalibratedPointList(){

    // save할때 cube가 투영되어 있는 point를 얻는 함수임
    //rgb camera가 n대일 경우 calibrationTxt가 있는 경우랑 없는경우가 혼합되어 있을때는 고려하지 않았음
    if(
        globalData.rgbCanvasParams.calibrationTxt === "" ||
        globalData.rgbCanvasParams.calibrationTxt === undefined){
        return;
    }

    for(let i=0 ; i<objects.object3Ds.length ; i++) {
        objects.object3Ds[i].calibratedPointList = [];
    }

    objects.rgbCameras.forEach((camera)=>{

        const cal =  _ren.fn.getConvertCalibrationValues(camera.calibrationTxt);

        for(let i=0 ; i<objects.object3Ds.length ; i++){

            // object3Ds안에는 cube, cylinder 등이 있는데 cylinder는 cali가된 pointList를 얻지 못하기에 pass시켜야함
            const objectSort = objects.object3Ds[i].children[0].name;
            if(objectSort === "cylinder") continue;

            const group = convertObjectForRender(objects.object3Ds[i]);
            const object = {};
            const pointList = group.pointList;
            const xList = [];
            const yList = [];
            const zList = [];
            pointList.forEach(function(point){
                xList.push(point.x);
                yList.push(point.y);
                zList.push(point.z);
            });
            const xyzList = [xList, yList, zList];
            object.points = xyzList;
            const list = {};
            list.imgObjNumber = objects.object3Ds[i].objectUUID;
            list.pointList = _ren.fn.calcPixel(object, cal).pointList;
            list.camId = camera.camId;
            if(camera.camId == null) {
                //calibratedPointList에서 기존에는 camNumber로 들어가는것 camId로 변경했기 때문에 둘다 들어가게 처리
                list.camId = camera.camNumber
            }
            objects.object3Ds[i].calibratedPointList.push(list);
        }
    });

}


function drawObjectsInRgbCanvas(){

    if( globalData.rgbCanvasParams.calibrationTxt === "" ||
        globalData.rgbCanvasParams.calibrationTxt === undefined){
        return;
    }

    globalData.rgbCanvasParams.opacity = settingData.RGBopacity;
    globalData.rgbCanvasParams.objectList = [];
    globalData.rgbCanvasParams.circleColor = "#000000";
    globalData.rgbCanvasParams.circleSize = 10;


    // guide박스가 동작할때
    if(objects.guideBox !== null){
        const size = {
            "w" : objects.guideBox.geometry.parameters.width,
            "h" : objects.guideBox.geometry.parameters.height,
            "d" : objects.guideBox.geometry.parameters.depth
        };
        const box = new THREE.BoxGeometry(size.w, size.h, size.d);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent:true, opacity:0.2, depthTest:false, depthWrite:false });
        const guideBox = new THREE.Mesh(box, material);
        guideBox.name = "cube";
        const group = new THREE.Group();
        group.add(guideBox);
        group.position.copy(objects.guideBox.position);
        const guidBoxGroup = convertObjectForRender(group);
        globalData.rgbCanvasParams.objectList.push(guidBoxGroup);
    }

    const targetIndex = objects.object3Ds.findIndex((cuboide)=>{
        return cuboide.objectUUID === globalData.objectTarget;
    });

    for(let i=0; i<objects.object3Ds.length ; i++){
        const onlyRect = objects.object3Ds[i].children[0].onlyRect;
        const isCylinder = (objects.object3Ds[i].children[0].name === "cylinder") ? true : false;

        if(objects.object3Ds[i].visible && !onlyRect && !isCylinder) {
            let targetedObject = (objects.object3Ds[i].objectUUID === globalData.objectTarget) ? true : false;
            const group = convertObjectForRender(objects.object3Ds[i], targetedObject);
            globalData.rgbCanvasParams.objectList.push(group);
        }
    }


    _ren.fn.draw3dToCanvas(globalData.rgbCanvasParams);
}


function makeRectInRgbCanvas(cameraIndex, target){

    const targetPcd = objects.pcds.findIndex((pcd)=>{ return pcd.workTicketId === globalData.pcdTarget; });
    const loadedData = objects.pcds[targetPcd].rgbImages[cameraIndex].loadedData;
    const imageFile = objects.pcds[targetPcd].rgbImages[cameraIndex].loadedImage;
    const calibrationTxt = objects.rgbCameras[cameraIndex].calibrationTxt;
    // const calibrationTxt = `
    //     Number: 1|
    //     LidarImageOffset|
    //     0|
    //     Angle : LR, UD, Rot|
    //     -4.666471,0.029524,0.012215|
    //     TranslationMatrix|
    //     0.560000,-0.340000,-0.570000|
    //     intrinsicCameraParameter|
    //     1484.864234,1402.624750,1074.600000,633.437500,-0.487890,0.179688,0.000000,0.000000
    // `;



    const result = {};
    const params = {};
    params.object = {};
    const cubeGroup = convertObjectForRender(target);

    params.calibrationTxt = calibrationTxt;
    params.object.objectType = cubeGroup.objectType;
    params.object.pointList = cubeGroup.pointList;
    params.naturalWidth = imageFile.naturalWidth;
    params.naturalHeight = imageFile.naturalHeight;

    const rectData = _ren.fn.getBboxFromObject(params);

    result.x = rectData.x;
    result.y = rectData.y;
    result.w = rectData.width;
    result.h = rectData.height;
    result.isVisible = rectData.isVisible;

    return result;
}


function convertObjectForRender(group, targetedCuboide) {

    const finalCuboideData = getFinalCuboideData(group);
    let color = new THREE.Color( finalCuboideData.cube.material.color.r, finalCuboideData.cube.material.color.g, finalCuboideData.cube.material.color.b );
    color = "#" + color.getHexString();

    const geometry = new THREE.BoxGeometry( finalCuboideData.size.w, finalCuboideData.size.h, finalCuboideData.size.d );
    geometry.rotateX(finalCuboideData.rotation.x);
    geometry.rotateY(finalCuboideData.rotation.y);
    geometry.rotateZ(finalCuboideData.rotation.z);
    geometry.translate(finalCuboideData.position.x, finalCuboideData.position.y, finalCuboideData.position.z);

    const points = geometry.attributes.position.array;

    const data = {
        objectType : _ren.constants.OBJECT_TYPE_CUBOID
        , pointList: []
        , isFill: targetedCuboide
        , fillColor : color
        , fillOpacity : 0.2
        , isLine: true
        , lineColor : color
        , lineWidth : settingData.cuboideLineWidth
        , centerPosition : {}
    };

    for(let i = 0; i < 24; i += 3) {
        const x = points[i];
        const y = points[i+1];
        const z = points[i+2];
        data.pointList.push({ "x": x, "y": y, "z": z });
    }

    if(settingData.visibleCenterPoint) data.centerPosition = getCuboideCenter();

    function getCuboideCenter(){

        let sumX = 0;
        let sumY = 0;
        let sumZ = 0;
        const center = {};

        for(let i=0; i<data.pointList.length ;i++){
            const x = data.pointList[i].x;
            const y = data.pointList[i].y;
            const z = data.pointList[i].z;
            sumX += x;
            sumY += y;
            sumZ += z;
        }
        center.x = sumX/8;
        center.y = sumY/8;
        center.z = sumZ/8;

        return center;
    }


    return data;
}


// function convertObjectForRender(cubeGroup, targetedCuboide) {
//
//     const cube = cubeGroup.children[0];
//     let color = new THREE.Color( cube.material.color.r, cube.material.color.g, cube.material.color.b );
//     color = "#" + color.getHexString();
//
//     const pointBox3 = new THREE.Box3().setFromBufferAttribute(cube.geometry.attributes.position);
//     const pointBox3Size = pointBox3.getSize(new THREE.Vector3());
//     const params = {};
//     params.position = new THREE.Vector3().copy(cubeGroup.position);
//     params.rotation = new THREE.Vector3().copy(cubeGroup.rotation);
//     params.size = { w: pointBox3Size.x, h: pointBox3Size.y, d: pointBox3Size.z };
//
//     const geometry = new THREE.BoxGeometry( params.size.w, params.size.h, params.size.d );
//     geometry.rotateX(params.rotation.x);
//     geometry.rotateY(params.rotation.y);
//     geometry.rotateZ(params.rotation.z);
//     geometry.translate(params.position.x, params.position.y, params.position.z);
//
//     const points = geometry.attributes.position.array;
//
//     const data = {
//         objectType : _ren.constants.OBJECT_TYPE_CUBOID
//         , pointList: []
//         , isFill: targetedCuboide
//         , fillColor : color
//         , fillOpacity : 0.2
//         , isLine: true
//         , lineColor : color
//         , lineWidth : settingData.cuboideLineWidth
//     };
//
//     for(let i = 0; i < 24; i += 3) {
//         const x = points[i];
//         const y = points[i+1];
//         const z = points[i+2];
//         data.pointList.push({ "x": x, "y": y, "z": z });
//     }
//
//     return data;
// }

export { setParamsInRgbCanvas, drawObjectsInRgbCanvas, makeRectInRgbCanvas, getCalibratedPointList }
