

import { objects, globalData } from './variables.js';


function visibilitySelectedSvgs(){

    let selectedSvgs = [];

    for(let i=0 ; i<globalData.selectedObjects.length ; i++){
        for(let j=0; j<objects.svgs.length ; j++){
            if(globalData.selectedObjects[i].objectUUID === objects.svgs[j].objectUUID){
                selectedSvgs.push(objects.svgs[j]);
            }
        }
    }

    if(!selectedSvgs.length){
        selectedSvgs = [...objects.svgs];
    }

    // selectedSvgs.forEach((g)=>{
    //     if(globalData.rgbCameraTarget === g.camId) {
    //         if (globalData.svgAllVisibility) {
    //             g.style.visibility = "hidden";
    //         } else {
    //             g.style.visibility = "visible";
    //         }
    //     }
    // });

    selectedSvgs.forEach((g)=>{
        if(globalData.rgbCameraTarget === g.camId) {
            if (globalData.svgAllVisibility) {
                g.style.visibility = "hidden";
                for(let i=1; i<g.children.length; i++){
                    g.children[i].style.visibility = "hidden";
                }
            } else {
                g.style.visibility = "visible";
                for(let i=1; i<g.children.length; i++){
                    g.children[i].style.visibility = "visible";
                }
            }
        }
    });

    (!globalData.svgAllVisibility) ? globalData.svgAllVisibility = true : globalData.svgAllVisibility = false;

}

export { visibilitySelectedSvgs }