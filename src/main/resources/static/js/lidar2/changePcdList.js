import { removeAllObjects } from "./removeAllObjects.js";
import { setPermission } from "./setPermission.js";
import { changeFailPopUp } from "./setFailPopUp.js";
import { loadAssets } from "./loadAssets.js";
import { resetMultiSelect } from "./setObjectMultiSelect.js";
import {setNotices} from "./setNotices.js";
import { objects, globalData } from './variables.js';




function changePcdList(sort, controlData){

    if(!globalData.isChangePcdList){
        return;
    }



    let targetIndex = objects.pcds.findIndex((pcd)=>{
        return pcd.workTicketId === globalData.pcdTarget;
    });

    // if(sort === "next"){
    //     (targetIndex < objects.pcds.length-1) ? targetIndex++ : targetIndex = 0;
    // }else{
    //     (targetIndex > 0) ? targetIndex-- : targetIndex = objects.pcds.length-1;
    // }

    let canChangePcd = false;

    if(sort === "next"){
        if(targetIndex < objects.pcds.length-1){
            targetIndex++;
            canChangePcd = true;
        }else{
            setNotices("lastPcdList");
        }
    }else{
        if(targetIndex > 0){
            targetIndex--
            canChangePcd = true;
        }else{
            setNotices("firstPcdList");
        }
    }

    if(canChangePcd){
        globalData.pcdTarget = objects.pcds[targetIndex].workTicketId;

        for(let i=0 ; i<frameWrap.children.length ; i++){
            frameWrap.children[i].classList.remove("on");
        }

        for(let i=0 ; i<frameWrap.children.length ; i++){
            if(frameWrap.children[i].pcdUUID === globalData.pcdTarget){
                frameWrap.children[i].classList.add("on");
                frameWrap.children[i].scrollIntoView( false );
                break;
            }
        }
        resetMultiSelect();
        removeAllObjects();
        setPermission();
        changeFailPopUp(globalData.pcdTarget);
        loadAssets(controlData);

        globalData.isChangePcdList = false;
    }

}

export { changePcdList }