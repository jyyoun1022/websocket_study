
import { changeRGBCamera } from './controlRGBCamera.js';
import { setObjectInformation } from "./setObjectInformation.js";
import {objects, globalData, svgData} from './variables.js';



function changeSvgList(camId){

    if(camId !== undefined){
        const targetIndex = objects.rgbCameras.findIndex((camera)=>{
            return camera.camId === camId;
        });
        rgbSelect.selectedIndex = targetIndex;
        changeRGBCamera();
    }

    objects.svgs.forEach((g)=>{

        if(globalData.rgbCameraTarget === g.camId){
            g.style.visibility = "visible";
            if(globalData.objectTarget === g.objectUUID){
                for(let i=1; i<g.children.length; i++){
                    g.children[i].style.visibility = "visible";
                    setObjectInformation(g);
                }
                svgData.targetSvg = g;
            }else{
                for(let i=1; i<g.children.length; i++){
                    g.children[i].style.visibility = "hidden";
                }
            }
        }else{
            g.style.visibility = "hidden";
            for(let i=1; i<g.children.length; i++){
                g.children[i].style.visibility = "hidden";
            }
        }


    });

}

export { changeSvgList }