
import * as THREE from './build/three.module.js';
import { removeSvg } from './removeSvg.js';
import { changeObjectList } from "./changeObjectList.js";
import { changeSvgList } from "./changeSvgList.js";
import { controlAreaRect } from "./controlAreaRect.js";
import { changeSvgPosition } from "./changeSvgPosition.js";
import { changeSvgSize } from "./changeSvgSize.js";
import { objects, events, globalData, svgData } from './variables.js';




function setSvgEvent(){

    // RGB Camera가 없는 task는 return함
    if(!globalData.hasRGBCamera) return;

    document.oncontextmenu = function (e) { return false; };


    // 작동 안할지도...
    if(svgWrap.addEventListener || document.addEventListener){
        
        svgWrap.removeEventListener('mousewheel', events.svgMouseWheel );
        document.removeEventListener('mouseup', events.svgMouseUp );
        document.removeEventListener('mousemove', events.svgMouseMove );
        svgWrap.removeEventListener('mousedown', events.svgMouseDown );
        svgWrap.removeEventListener('mouseover', events.svgMouseOver );
        svgWrap.removeEventListener('mouseout', events.svgMouseOut );
    
    }

    // wheel event
    if(events.svgMouseWheel === null){
        events.svgMouseWheel = function(event) {

            if(!objects.pcds.length) return;

            // 선택한 pcd의 rgbImage에 등록된 data값을 불러옴
            const targetPcd = objects.pcds.findIndex((pcd)=>{ return pcd.workTicketId === globalData.pcdTarget; });
            const targetRGB = objects.pcds[targetPcd].rgbImages.findIndex((rgb)=>{ return rgb.camId === globalData.rgbCameraTarget; });
            const loadedData = objects.pcds[targetPcd].rgbImages[targetRGB].loadedData;

            let zoomRatio, zoomAccel;

            svgData.zoomBefore = svgData.zoomCurrent;


            if (svgData.zoomBefore > svgData.zoomMax/2) {
                zoomAccel = 0.1;
            } else if (svgData.zoomBefore > svgData.zoomMax/4) {
                zoomAccel = 0.2;
            } else {
                zoomAccel = 0.5;
            }

            if(event.wheelDelta > 0){
                if(svgData.zoomCurrent < svgData.zoomMax){
                    zoomRatio = svgData.zoomCurrent += zoomAccel;
                }else{
                    zoomRatio  = svgData.zoomCurrent;
                }
            }else{
                if(svgData.zoomCurrent > svgData.zoomMin){
                    zoomRatio = svgData.zoomCurrent -= zoomAccel;
                }else{
                    zoomRatio  = svgData.zoomCurrent;
                }
            }

            svgData.zoomCurrent = Number(zoomRatio.toFixed(1));

            svgWrap.style.width = (loadedData.calcScale.x * svgData.zoomCurrent) + 'px';
            svgWrap.style.height = (loadedData.calcScale.y * svgData.zoomCurrent) + 'px';

            let offsetX = event.offsetX / (svgData.zoomBefore * 10) * 10;
            let offsetY = event.offsetY / (svgData.zoomBefore * 10) * 10;

            let afterOffsetLeft = svgWrap.offsetLeft + ((offsetX * svgData.zoomBefore) - (offsetX * svgData.zoomCurrent));
            let afterOffsetTop = svgWrap.offsetTop + ((offsetY * svgData.zoomBefore) - (offsetY * svgData.zoomCurrent));

            svgWrap.style.left = afterOffsetLeft + "px";
            svgWrap.style.top = afterOffsetTop + "px";
        }; 
    }


    // mouse over event
    if(events.svgMouseOver === null){
        events.svgMouseOver = function(event) {

            const targetName = event.target.getAttribute("name");
            event.preventDefault();

            if(targetName === "rightCircle" || targetName === "leftCircle"){
                document.body.style.cursor = "ew-resize";
            }else if(targetName === "upCircle" || targetName === "downCircle") {
                document.body.style.cursor = "ns-resize";
            }else if(targetName === "upLeftCircle" || targetName === "downRightCircle"){
                    document.body.style.cursor = "nwse-resize";
            }else if(targetName === "upRightCircle" || targetName === "downLeftCircle"){
                document.body.style.cursor = "nesw-resize";
            }else if(targetName === "rect"){
                document.body.style.cursor = "move";
            }else if(targetName === "deleteBtn" || targetName === "deleteBtnCircle"){
                document.body.style.cursor = "pointer";
            }
        }
    }


    // mouse out event
    if(events.svgMouseOut === null){
        events.svgMouseOut = function(event) {
            document.body.style.cursor = "default";
        }
    }
    

    // mouse down event
    if(events.svgMouseDown === null){
        events.svgMouseDown = function(event) {

            if(!objects.pcds.length) return;

            const targetPcd = objects.pcds.findIndex((pcd)=>{ return pcd.workTicketId === globalData.pcdTarget; });
            const targetRGB = objects.pcds[targetPcd].rgbImages.findIndex((rgb)=>{ return rgb.camId === globalData.rgbCameraTarget; });
            const loadedData = objects.pcds[targetPcd].rgbImages[targetRGB].loadedData;

            svgData.mousePrePos.x = event.clientX;
            svgData.mousePrePos.y = event.clientY;
        
            let targetName = event.target.getAttribute("name");
            let tagName = event.target.tagName;

            event.preventDefault();

            // image 이동 - permission이 없더라도 이미지 이동은 가능
            if(targetName === "svgSpace" && event.button === 2){
                svgData.isImageMove = true;
            }

            // svg 이동 크기조절 - permission이 없으면 불가능
            if(globalData.allowAllEvents && event.button === 0){
                // svg scale 조절
                if(tagName === "circle"){
                    svgData.isSvgEdit = true;
                    svgData.targetCircle = event.target;
                    svgData.targetSvg = event.target.parentNode;
                }
                // svg 이동
                if(tagName === "rect"){
                    svgData.isSvgMove = true;
                    svgData.targetSvg = event.target.parentNode;
                }
                // svg 삭제
                if(targetName === "deleteBtn" || targetName === "deleteBtnCircle"){
                    removeSvg(event.target.parentNode);
                }

                // rect 선택으로 cuboide 변경
                if(svgData.targetSvg !== null){
                    globalData.objectTarget = svgData.targetSvg.objectUUID;
                    for(let i=0 ; i<objectWrap.children.length ; i++){
                        if(objectWrap.children[i].objectUUID === globalData.objectTarget){
                            const targetTop = objectWrap.children[i].offsetTop - objectWrap.offsetTop;
                            objectWrap.scrollTop = targetTop;
                            objectWrap.children[i].classList.add("on");
                        }else{
                            objectWrap.children[i].classList.remove("on");
                        }
                    }
                    changeObjectList();
                    changeSvgList();
                }


                //svg drag 선택
                if(!svgData.isSvgMove && !svgData.isSvgEdit && svgData.areaRect.rect === null){
                    svgData.areaRect.startPosition = {
                        x: event.offsetX * (loadedData.calcRate / svgData.zoomCurrent),
                        y: event.offsetY * (loadedData.calcRate / svgData.zoomCurrent)
                    };
                    svgData.isAreaDrag = true;
                    controlAreaRect("make");
                }


            }

        };
    }
 

    // mouse up event
    if(events.svgMouseUp === null){
        events.svgMouseUp = function(event) {

            if(!objects.pcds.length) return;

            const targetPcd = objects.pcds.findIndex((pcd)=>{ return pcd.workTicketId === globalData.pcdTarget; });
            const targetRGB = objects.pcds[targetPcd].rgbImages.findIndex((rgb)=>{ return rgb.camId === globalData.rgbCameraTarget; });
            const loadedData = objects.pcds[targetPcd].rgbImages[targetRGB].loadedData;

            if(svgData.isAreaDrag) {
                if(svgData.areaRect.rect !== null){
                    svgData.areaRect.endPosition = {
                        x: event.offsetX * (loadedData.calcRate / svgData.zoomCurrent),
                        y: event.offsetY * (loadedData.calcRate / svgData.zoomCurrent)
                    };
                    controlAreaRect("delete");
                }
            }
            svgData.isSvgMove = false;
            svgData.isImageMove = false;
            svgData.isSvgEdit = false;
            svgData.isAreaDrag = false;
            svgData.targetCircle = null;
            // svgData.targetSvg = null;
            document.body.style.cursor = "default";

        };
    }


    // mouse move event
    if(events.svgMouseMove === null){
        events.svgMouseMove = function(event) {

            if(!objects.pcds.length){
                return;
            }


            // 선택한 pcd의 rgbImage에 등록된 data값을 불러옴
            const targetPcd = objects.pcds.findIndex((pcd)=>{ return pcd.workTicketId === globalData.pcdTarget; });
            const targetRGB = objects.pcds[targetPcd].rgbImages.findIndex((rgb)=>{ return rgb.camId === globalData.rgbCameraTarget; });
            const loadedData = objects.pcds[targetPcd].rgbImages[targetRGB].loadedData;

            if(loadedData === null) return;

            svgData.mousePos.x = event.clientX;
            svgData.mousePos.y = event.clientY;
            let x = svgData.mousePos.x - svgData.mousePrePos.x;
            let y = svgData.mousePos.y - svgData.mousePrePos.y;

            svgData.svgMove.x = x * (loadedData.calcRate / svgData.zoomCurrent);
            svgData.svgMove.y = y * (loadedData.calcRate / svgData.zoomCurrent);

        
            let svgSpace = svgWrap.getBoundingClientRect();
            svgData.calcSvgSpace = new THREE.Vector2();
            svgData.calcSvgSpace.x = svgSpace.width * (loadedData.calcRate / svgData.zoomCurrent);
            svgData.calcSvgSpace.y = svgSpace.height * (loadedData.calcRate / svgData.zoomCurrent);


            // 이미지 이동
            if(svgData.isImageMove){
                svgWrap.style.left = (svgWrap.offsetLeft + x) + "px";
                svgWrap.style.top = (svgWrap.offsetTop + y) + "px";
            }

            // svg이동
            if(svgData.isSvgMove){
                changeSvgPosition();
            }

            // svg 크기 조절
            if(svgData.isSvgEdit){
            
                let parentName = svgData.targetSvg.getAttribute("name");
                let targetName = svgData.targetCircle.getAttribute("name");
                
                if(parentName === "svgGroup"){

                    if(targetName === "upCircle"){
                        changeSvgSize("up");
                    }else if(targetName === "downCircle"){
                        changeSvgSize("down");
                    }else if(targetName === "rightCircle"){
                        changeSvgSize("right");
                    }else if(targetName === "leftCircle"){
                        changeSvgSize("left");
                    }else if(targetName === "upLeftCircle"){
                        changeSvgSize("upLeft");
                    }else if(targetName === "upRightCircle"){
                        changeSvgSize("upRight");
                    }else if(targetName === "downLeftCircle"){
                        changeSvgSize("downLeft");
                    }else if(targetName === "downRightCircle"){
                        changeSvgSize("downRight");
                    }
                    
                }

            }



            // svg drag 선택
            if(svgData.isAreaDrag) {
                if(svgData.areaRect.rect !== null){
                    svgData.areaRect.endPosition = {
                        x: event.offsetX * (loadedData.calcRate / svgData.zoomCurrent),
                        y: event.offsetY * (loadedData.calcRate / svgData.zoomCurrent)
                    };
                    controlAreaRect("move");
                }
            }

            svgData.mousePrePos.copy(svgData.mousePos);
        };
    }
    
    svgWrap.addEventListener('mousewheel', events.svgMouseWheel );
    document.addEventListener('mouseup', events.svgMouseUp );
    document.addEventListener('mousemove', events.svgMouseMove );
    svgWrap.addEventListener('mousedown', events.svgMouseDown );
    svgWrap.addEventListener('mouseover', events.svgMouseOver );
    svgWrap.addEventListener('mouseout', events.svgMouseOut );

}


export { setSvgEvent }