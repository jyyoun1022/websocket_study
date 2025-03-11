import * as THREE from './build/three.module.js';
import { makeUUID }  from './makeUUID.js';
import { makeSvgIcon } from './makeSvgIcon.js';
import { setAlert } from './setKeys.js';
import { makeRectInRgbCanvas } from "./setObjectsInRgbCanvas.js";
import { setObjectInformation } from "./setObjectInformation.js";
import { objects, globalData, svgData, settingData } from './variables.js';



function makeSvg(target, sort){

    let cube, targetCamera, loadedData;
    let rectData = {};

    // 선택한 pcd의 rgbImage에 등록된 data값을 불러옴
    const targetPcd = objects.pcds.findIndex((pcd)=>{ return pcd.workTicketId === globalData.pcdTarget; });
    // const targetRGB = objects.pcds[targetPcd].rgbImages.findIndex((rgb)=>{ return rgb.camId === globalData.rgbCameraTarget; });
    // const loadedData = objects.pcds[targetPcd].rgbImages[targetRGB].loadedData;


    target.children.forEach((child)=>{
        if(child.name === "cube"){
            cube = child;
        }
    });


    // svg auto 버튼 클릭시
    if(sort === "auto"){

        let makeRectNumber = 0;

        // rgb 카메라 별로 해당 cube가 보이며 width와 height가 0이 아닐때 svg 생성
        objects.rgbCameras.forEach((list, index)=>{
            loadedData = objects.pcds[targetPcd].rgbImages[index].loadedData;

           if(globalData.rgbCanvasParams.calibrationTxt === "" || globalData.rgbCanvasParams.calibrationTxt === undefined){
               rectData = getRectData(list.camera);
           }else{
               rectData = makeRectInRgbCanvas(index, target);
           }

            if(rectData.isVisible && rectData.w > 10 && rectData.h > 10){
                makeSvgGroup(list, rectData.isVisible);
                makeRectNumber++;
            }            
        });

        // auto button이 실행되지 않았을 경우 해당 UL의 usedAutoButton값 초기화와 alert
        if(!makeRectNumber){
            const cuboideList = [...objectWrap.children];
            const targetCuboideList = cuboideList.findIndex((list)=>{ return list.objectUUID === globalData.objectTarget; });
            objectWrap.children[targetCuboideList].usedAutoButton = false;

            setAlert("makeSvgAlert");
        }

    // svg 수동 버튼 클릭시
    }else if(sort === "nonAuto"){

        // svg 수동 버튼일때 현재 rgb camera 종류 구하고 해당 camera에 cube가 보이는지 판별
        // 수동일경우 모든 rectData값을 수동으로 설정하며 이미지에 따라 calcRate일 틀리기 때문에 default값도 달라짐
        for(let i=0 ; i<objects.rgbCameras.length ; i++){
            if(objects.rgbCameras[i].camId === globalData.rgbCameraTarget){
                targetCamera = objects.rgbCameras[i]; 
                loadedData = objects.pcds[targetPcd].rgbImages[i].loadedData;

                let svgSpace = svgWrap.getBoundingClientRect();
                let calcSvgSpace = new THREE.Vector2();
                calcSvgSpace.x = svgSpace.width * (loadedData.calcRate / svgData.zoomCurrent);
                calcSvgSpace.y = svgSpace.height * (loadedData.calcRate / svgData.zoomCurrent);

                rectData.w = svgData.defaultRect.w * (loadedData.calcRate / svgData.zoomCurrent);
                rectData.h = svgData.defaultRect.h * (loadedData.calcRate / svgData.zoomCurrent);
                rectData.x = (svgData.mousePos.x - svgSpace.x) * (loadedData.calcRate / svgData.zoomCurrent) - rectData.w/2;
                rectData.y = (svgData.mousePos.y - svgSpace.y) * (loadedData.calcRate / svgData.zoomCurrent) - rectData.h/2;
                rectData.isVisible = svgData.defaultRect.isVisible;

                if((rectData.x - rectData.w/2) < 0) rectData.x = 0;
                if((rectData.x + rectData.w) > calcSvgSpace.x) rectData.x = calcSvgSpace.x - rectData.w;
                if((rectData.y - rectData.h/2) < 0) rectData.y = 0;
                if((rectData.y + rectData.h) > calcSvgSpace.y) rectData.y = calcSvgSpace.y - rectData.h;

                // rectData.x = svgData.defaultRect.x;
                // rectData.y = svgData.defaultRect.y;
                // rectData.w = svgData.defaultRect.w * loadedData.calcRate;
                // rectData.h = svgData.defaultRect.h * loadedData.calcRate;
                // rectData.isVisible = svgData.defaultRect.isVisible;

                const isRect = isRectForCamera(targetCamera);
                if(isRect !== true){
                    makeSvgGroup(targetCamera, rectData.isVisible);
                }
                break;
            }
        }

    // 기존 data 로드시
    }else{

        for(let i=0 ; i<objects.rgbCameras.length ; i++){
            if(objects.rgbCameras[i].camId === globalData.rgbCameraTarget){

                targetCamera = objects.rgbCameras[i];
                loadedData = objects.pcds[targetPcd].rgbImages[i].loadedData;
                rectData.x = svgData.defaultRect.x;
                rectData.y = svgData.defaultRect.y;
                rectData.w = svgData.defaultRect.w;
                rectData.h = svgData.defaultRect.h;
                rectData.isVisible = svgData.defaultRect.isVisible;

                makeSvgGroup(targetCamera, rectData.isVisible);
                break;
            }
        }

    }


    //해당 카메라에 선택한 cube의 rect가 있는지 확인
    function isRectForCamera(camera){

        const objectUUID = cube.objectUUID;
        const camId = camera.camId;       

        for(let i=0 ; i<objects.svgs.length ; i++){
            if(objects.svgs[i].objectUUID === objectUUID && objects.svgs[i].camId === camId){
                return true;
           }
        }
        
    }


    function makeSvgGroup(list, isVisible){


        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        const upCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        const downCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        const rightCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        const leftCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        const upLeftCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        const upRightCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        const downLeftCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        const downRightCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        const deleteBtnCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        const deleteBtn = document.createElementNS('http://www.w3.org/2000/svg', 'path');

        deleteBtn.setAttribute("d", 
        "M10.013,5.008c0,2.761-2.239,5-5,5s-5-2.239-5-5c0-2.761,2.239-5,5-5C7.775,0.008,10.013,2.247,10.013,5.008z M7.463,3.102L6.92,2.558L5.013,4.464L3.107,2.558L2.563,3.102l1.907,1.906L2.563,6.914l0.545,0.544l1.906-1.906L6.92,7.458l0.543-0.544L5.557,5.008L7.463,3.102z"
        );
        deleteBtn.setAttribute("fill", "#ffffff");
        deleteBtnCircle.setAttribute("fill", "#000000");
        
        g.objectUUID = globalData.objectTarget;
        g.svgUUID = makeUUID();
        g.camId = list.camId;
        g.shortName = list.shortName;
        g.cameraName = list.name;
        g.isView = isVisible;
        g.setAttribute("name", "svgGroup");

        rect.setAttribute("name", "rect");
        upCircle.setAttribute("name", "upCircle");
        downCircle.setAttribute("name", "downCircle");
        rightCircle.setAttribute("name", "rightCircle");
        leftCircle.setAttribute("name", "leftCircle");
        upLeftCircle.setAttribute("name", "upLeftCircle");
        upRightCircle.setAttribute("name", "upRightCircle");
        downLeftCircle.setAttribute("name", "downLeftCircle");
        downRightCircle.setAttribute("name", "downRightCircle");
        deleteBtn.setAttribute("name", "deleteBtn");
        deleteBtnCircle.setAttribute("name", "deleteBtnCircle");   

        g.classList.add("svgGroup");
        rect.classList.add("svgRect");
        upCircle.classList.add("svgCircle");
        downCircle.classList.add("svgCircle");
        rightCircle.classList.add("svgCircle");
        leftCircle.classList.add("svgCircle");
        upLeftCircle.classList.add("svgCircle");
        upRightCircle.classList.add("svgCircle");
        downLeftCircle.classList.add("svgCircle");
        downRightCircle.classList.add("svgCircle");

        rect.setAttribute("width", rectData.w );
        rect.setAttribute("height", rectData.h );
        
        rect.setAttribute("x", rectData.x );
        rect.setAttribute("y", rectData.y );

        
        // 이미지 크기별 rect의 선 굵기 및 최소 사이즈 재지정 
        // svg가 이미지 크기에 따라서 사이즈가 다 다르기 때문에 각 변수값은 g테그 아래에 저장함
        // rectMinSize가 admin에서 minus값이 들어올때가 있어서 default 1로 변경
        svgData.rectMinSize.x = (svgData.rectMinSize.x <= 0) ? 1 : svgData.rectMinSize.x;
        svgData.rectMinSize.y = (svgData.rectMinSize.y <= 0) ? 1 : svgData.rectMinSize.y;

        // rect.style.strokeWidth = loadedData.calcRate;
        rect.style.strokeWidth = settingData.rectLineWidth;
        g.rectSize = new THREE.Vector2();
        g.rectSize.x = svgData.rectMinSize.x * loadedData.calcRate;
        g.rectSize.y = svgData.rectMinSize.y * loadedData.calcRate;
        g.circleSize = Math.min(20, loadedData.calcRate * settingData.rectCircleSize);
        g.deleteBtnSize = Math.min(20/4, loadedData.calcRate * settingData.rectCircleSize/4);


        
        g.append(rect, upCircle, downCircle, rightCircle, leftCircle, upLeftCircle, upRightCircle, downLeftCircle, downRightCircle, deleteBtnCircle, deleteBtn );

        objects.svgs.push(g);

        svgSpace.appendChild(g);


        setObjectInformation(g);

        setSvgCircle(g);
        changeSvgColor();

        makeSvgIcon(g.shortName, g.camId, g.svgUUID, g.objectUUID);
    }

    function setSvgCircle(g){

        const rect = g.children[0];
        const upCircle = g.children[1];
        const downCircle = g.children[2];
        const rightCircle = g.children[3];
        const leftCircle = g.children[4];
        const upLeftCircle = g.children[5];
        const upRightCircle = g.children[6];
        const downLeftCircle = g.children[7];
        const downRightCircle = g.children[8];
        const deleteBtnCircle = g.children[9];
        const deleteBtn = g.children[10];

        const rectBBox = rect.getBBox();
        upCircle.setAttribute("r", g.circleSize );
        upCircle.setAttribute("cx", rectData.x + rectBBox.width/2 );
        upCircle.setAttribute("cy", rectData.y );

        downCircle.setAttribute("r", g.circleSize );
        downCircle.setAttribute("cx", rectData.x + rectBBox.width/2 );
        downCircle.setAttribute("cy", rectData.y + rectBBox.height );

        rightCircle.setAttribute("r", g.circleSize );
        rightCircle.setAttribute("cx", rectData.x + rectBBox.width );
        rightCircle.setAttribute("cy", rectData.y + rectBBox.height/2 );

        leftCircle.setAttribute("r", g.circleSize );
        leftCircle.setAttribute("cx", rectData.x );
        leftCircle.setAttribute("cy", rectData.y + rectBBox.height/2 );

        upLeftCircle.setAttribute("r", g.circleSize );
        upLeftCircle.setAttribute("cx", rectData.x );
        upLeftCircle.setAttribute("cy", rectData.y );

        upRightCircle.setAttribute("r", g.circleSize );
        upRightCircle.setAttribute("cx", rectData.x + rectBBox.width );
        upRightCircle.setAttribute("cy", rectData.y );

        downLeftCircle.setAttribute("r", g.circleSize );
        downLeftCircle.setAttribute("cx", rectData.x );
        downLeftCircle.setAttribute("cy", rectData.y + rectBBox.height );

        downRightCircle.setAttribute("r", g.circleSize );
        downRightCircle.setAttribute("cx", rectData.x + rectBBox.width );
        downRightCircle.setAttribute("cy", rectData.y + rectBBox.height );

        deleteBtnCircle.setAttribute("r", g.circleSize/1.2 );
        deleteBtnCircle.setAttribute("cx", rectData.x + rectBBox.width + g.circleSize * 2);
        deleteBtnCircle.setAttribute("cy", rectData.y + g.circleSize * 3.3);

        deleteBtn.style.transform = "translate(" + ((rectData.x + rectBBox.width) + g.deleteBtnSize * 3) + "px , "
            + (rectData.y + g.deleteBtnSize * 8) +"px) scale(" + g.deleteBtnSize + ")";

    }


    function getRectData(camera){

        // 각 view 마다 크기가 틀리기 떄문에 render를 한번 걸쳐서 camera aspect와 updateProjectionMatrix를 해야됨
        // redener을 먼저 실행한후 이 함수가 실행되어야 함

        let x = 0, y = 0, w = 0, h = 0;
        const positions = cube.geometry.attributes.position.array;
        const vector3 = new THREE.Vector3();
        const box2 = new THREE.Box2(new THREE.Vector2(1, 1), new THREE.Vector2(-1, -1));
        const box3 = new THREE.Box3().setFromObject(cube);
        const box3Center = box3.getCenter(new THREE.Vector3());
        let isVisible = false;
    

        // svg에 배당되어 있는 camera의 절두체를 설정
        const projectScreenMatrix = new THREE.Matrix4();
        projectScreenMatrix.multiplyMatrices(
            camera.projectionMatrix, 
            camera.matrixWorldInverse
        );
        const frustum = new THREE.Frustum();
        frustum.setFromProjectionMatrix(projectScreenMatrix);
    
        for(let i=0 ; i<positions.length ; i+=3){
    
            const vertices = new THREE.Vector3(positions[i], positions[i+1], positions[i+2]);
            vector3.copy(vertices);
            vector3.applyMatrix4(cube.matrixWorld);       
            vector3.project(camera);           
            box2.min.min(vector3);
            box2.max.max(vector3);
            
            if(frustum.containsPoint(new THREE.Vector3(vertices.x + box3Center.x, vertices.y + box3Center.y, vertices.z + box3Center.z ))){
                isVisible = true;
            }
    
        }
        
        // let renderWidth =  svgWrap.offsetWidth / 2;
        // let renderHeight = svgWrap.offsetHeight / 2;

        // svgWrap의 크기는 image의 크기에 따라서 변하기 때문에 loadedData에서 가져와 셋팅함
        let renderWidth =  loadedData.calcScale.x / 2;
        let renderHeight = loadedData.calcScale.y / 2;
    
        renderWidth = renderWidth * (loadedData.calcRate / svgData.zoomCurrent);
        renderHeight = renderHeight * (loadedData.calcRate / svgData.zoomCurrent);

    
        x = (box2.min.x + 1) * renderWidth;
        y = (1 - box2.max.y) * renderHeight;
        w = (box2.max.x - box2.min.x) * renderWidth;
        h = (box2.max.y - box2.min.y) * renderHeight;
    
        if(x < 0) {
            w -= Math.abs(x);
            x = 0;
        }
        if(y < 0) {
            h -= Math.abs(y);
            y = 0;
        }
        if(x + w > renderWidth * 2) {
            w = (renderWidth * 2) - x;
        }
        if(y + h > renderHeight * 2) {
            h = h - Math.abs((renderHeight * 2) - y - h);
        }
    
        return { x, y, w, h, isVisible }
    
    }

}


function changeSvgCircle(g){

    const targetPcd = objects.pcds.findIndex((pcd)=>{ return pcd.workTicketId === globalData.pcdTarget; });
    const targetCamIndex = objects.pcds[targetPcd].rgbImages.findIndex((rgb)=>{ return rgb.camId === g.camId; });
    const rect = g.children[0];
    const upCircle = g.children[1];
    const downCircle = g.children[2];
    const rightCircle = g.children[3];
    const leftCircle = g.children[4];
    const upLeftCircle = g.children[5];
    const upRightCircle = g.children[6];
    const downLeftCircle = g.children[7];
    const downRightCircle = g.children[8];
    const deleteBtnCircle = g.children[9];
    const deleteBtn = g.children[10];
    const loadedData = objects.pcds[targetPcd].rgbImages[targetCamIndex].loadedData;

    g.circleSize = Math.min(20, loadedData.calcRate * settingData.rectCircleSize);
    g.deleteBtnSize = Math.min(20/4, loadedData.calcRate * settingData.rectCircleSize/4);

    const rectBBox = rect.getBBox();

    upCircle.setAttribute("r", g.circleSize );
    downCircle.setAttribute("r", g.circleSize );
    rightCircle.setAttribute("r", g.circleSize );
    leftCircle.setAttribute("r", g.circleSize );
    upLeftCircle.setAttribute("r", g.circleSize );
    upRightCircle.setAttribute("r", g.circleSize );
    downLeftCircle.setAttribute("r", g.circleSize );
    downRightCircle.setAttribute("r", g.circleSize );
    deleteBtnCircle.setAttribute("r", g.circleSize/1.2 );
    deleteBtnCircle.setAttribute("cx", rectBBox.x + rectBBox.width + g.circleSize * 2);
    deleteBtnCircle.setAttribute("cy", rectBBox.y + g.circleSize * 3.3);

    deleteBtn.style.transform = "translate(" + ((rectBBox.x + rectBBox.width) + g.deleteBtnSize * 3) + "px , "
        + (rectBBox.y + g.deleteBtnSize * 8) +"px) scale(" + g.deleteBtnSize + ")";

}

function changeSvgColor(){

    const targetIndex = objects.object3Ds.findIndex((cuboide)=>{ return cuboide.objectUUID === globalData.objectTarget; });
    const cube = objects.object3Ds[targetIndex].children[0];
    let color = new THREE.Color( cube.material.color.r, cube.material.color.g, cube.material.color.b );
    color = "#" + color.getHexString();

    for(let i=0; i<objects.svgs.length ; i++){
        if(objects.svgs[i].objectUUID === globalData.objectTarget){
            objects.svgs[i].children[0].style.stroke = color;
        }
    }

}


export { makeSvg, changeSvgCircle, changeSvgColor }