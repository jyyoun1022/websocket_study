import { makeFrameList } from './makeFrameList.js';
import { loadAssets } from './loadAssets.js';
import { setRGBCamera } from './controlRGBCamera.js';
import { objects, globalData } from './variables.js';


function resetPcdFileList(controlData){

    if(!objects.pcds.length){
       return;
    }
    // pcd list 셋팅
    objects.pcds.forEach((pcd, index)=>{
        const ul = makeFrameList(pcd, controlData);
        frameWrap.appendChild(ul);
    });


    // permission worker 기준으로
    // complete, giveUp일 경우
    // 1순위 : statusReview:"fail"
    // 2순위 : status:"assigned"
    // 3순위 : status:"worked"
    // save일 경우
    // 기존 pcd의 uuid

   if(globalData.workProcess === "complete" || globalData.workProcess === "giveup") {

       let findPcd = false;
       for(let i=0 ; i<objects.pcds.length ; i++) {
           if(objects.pcds[i].status === "reviewed" && objects.pcds[i].statusReview === "fail"){
               globalData.pcdTarget = objects.pcds[i].workTicketId;
               findPcd = true;
               break;
           }
       }
       if(!findPcd){
           for(let i=0 ; i<objects.pcds.length ; i++) {
               if(objects.pcds[i].status === "assigned"){
                   globalData.pcdTarget = objects.pcds[i].workTicketId;
                   findPcd = true;
                   break;
               }
           }
       }
       if(!findPcd){
           for(let i=0 ; i<objects.pcds.length ; i++) {
               if(objects.pcds[i].status === "worked"){
                   globalData.pcdTarget = objects.pcds[i].workTicketId;
                   findPcd = true;
                   break;
               }
           }
       }

       if(!findPcd) globalData.pcdTarget = objects.pcds[0].workTicketId;
       
   // save이거나 pass,fail,more,ok,ng 등
   }else{

       let findPcd = false;
       for(let i=0 ; i<objects.pcds.length ; i++){
           if(objects.pcds[i].workTicketId === globalData.pcdTarget){
               findPcd = true;
               break;
           }
       }
       if(!findPcd) globalData.pcdTarget = objects.pcds[0].workTicketId;
   }

    const frameWrapClone = [...frameWrap.children];
    frameWrapClone.forEach((child)=>{
        if(child.pcdUUID === globalData.pcdTarget){
            child.classList.add("on");
        } 
    });


    if(globalData.hasRGBCamera) setRGBCamera();
    loadAssets(controlData);
    
}



export { resetPcdFileList }