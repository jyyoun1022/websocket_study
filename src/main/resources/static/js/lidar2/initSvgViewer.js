import * as THREE from './build/three.module.js';
import {objects, globalData, svgData} from './variables.js';

function initSvgViewer(image, camId){

    let viewer = view1.getBoundingClientRect();
    let viewerScale = new THREE.Vector2();
    let imageScale =  new THREE.Vector2();
    let calcScale = new THREE.Vector2();
    let calcRate;

    viewerScale.x = viewer.width;
    viewerScale.y = viewer.height;

    imageScale.x = image.naturalWidth;
    imageScale.y = image.naturalHeight;

    // 이미지가 viewer보다 클 경우
     if (imageScale.x > viewerScale.x){
        let rate = viewerScale.x / imageScale.x;
        calcScale.x = viewerScale.x;
        calcScale.y = rate * imageScale.y;
        if(calcScale.y > viewerScale.y){
            let rate = viewerScale.y / calcScale.y;
            calcScale.y = viewerScale.y;
            calcScale.x = rate * calcScale.x;
        }
     }else{
         calcScale.x = imageScale.x;
         calcScale.y = imageScale.y;
         if(calcScale.y > viewerScale.y){
            let rate = viewerScale.y / calcScale.y;
            calcScale.y = viewerScale.y;
            calcScale.x = rate * calcScale.x;
         }
     }

    // 이미지가 viewer보다 작을 경우
    if(imageScale.y < viewerScale.y){
        let rate = viewerScale.y / imageScale.y;
        calcScale.y = viewerScale.y;
        calcScale.x =  rate * imageScale.x;
        if(calcScale.x > viewerScale.x){
            let rate = viewerScale.x / imageScale.x;
            calcScale.x = viewerScale.x;
            calcScale.y = rate * imageScale.y;
        }
    }

    // 이미지 크기에 따른 rgb camera aspect를 따로 설정 해야함
    const targetPcd = objects.pcds.findIndex((pcd)=>{ return pcd.workTicketId === globalData.pcdTarget; });
    const targetRGB = objects.pcds[targetPcd].rgbImages.findIndex((rgb)=>{ return rgb.camId === camId; });
    objects.rgbCameras[targetRGB].camera.aspect = calcScale.x / calcScale.y;
    objects.rgbCameras[targetRGB].camera.updateProjectionMatrix();


    calcRate =  imageScale.x / calcScale.x;

    return { viewerScale, imageScale, calcScale, calcRate }

}


function setSvgStatus(){

    // 선택한 pcd의 rgbImage에 등록된 data값을 불러옴
    const targetPcd = objects.pcds.findIndex((pcd)=>{ return pcd.workTicketId === globalData.pcdTarget; });
    const targetRGB = objects.pcds[targetPcd].rgbImages.findIndex((rgb)=>{ return rgb.camId === globalData.rgbCameraTarget; });
    const loadedData = objects.pcds[targetPcd].rgbImages[targetRGB].loadedData;

    // 페이지가 처음 열릴때만 svgWrap의 사이즈 조절함
    if(globalData.isPageStart){
        setSvgWrapDefault();
    }

    svgWrap.style.width = (loadedData.calcScale.x * svgData.zoomCurrent) + 'px';
    svgWrap.style.height = (loadedData.calcScale.y * svgData.zoomCurrent) + 'px';
    svgSpace.setAttribute("viewBox", "0 0" + " " + loadedData.imageScale.x  + " " + loadedData.imageScale.y );

}

function setSvgWrapDefault(){

    // 선택한 pcd의 rgbImage에 등록된 data값을 불러옴
    const targetPcd = objects.pcds.findIndex((pcd)=>{ return pcd.workTicketId === globalData.pcdTarget; });
    const targetRGB = objects.pcds[targetPcd].rgbImages.findIndex((rgb)=>{ return rgb.camId === globalData.rgbCameraTarget; });
    const loadedData = objects.pcds[targetPcd].rgbImages[targetRGB].loadedData;

    svgWrap.style.width = loadedData.calcScale.x + 'px';
    svgWrap.style.height = loadedData.calcScale.y + 'px';
    svgWrap.style.left = (loadedData.viewerScale.x/2 - loadedData.calcScale.x/2) + 'px';
    svgWrap.style.top = (loadedData.viewerScale.y/2 - loadedData.calcScale.y/2) + 'px';
}


export { initSvgViewer, setSvgStatus, setSvgWrapDefault }