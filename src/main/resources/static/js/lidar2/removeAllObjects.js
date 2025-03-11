
import { removeObject } from './removeObject.js';
import { objects, globalData, screen } from './variables.js';

function removeAllObjects(){

    // scene에서 object 제거
    if(objects.object3Ds.length){
        objects.object3Ds.forEach((group)=>{
            removeObject(group, screen.scene, "groupTotal");
        });
    }

    // deep clone 후 object list 제거
    const objectListClone = [...objectWrap.children];
    if(objectListClone.length){
        objectListClone.forEach((child)=>{
            if(child.id !== "classPopUpWrap"){
                child.remove();
            }
        });
    }

    // deep clone 후 svg 제거
    const svgListClone = [...svgSpace.children];
    if(svgListClone.length) {
        svgListClone.forEach((child) => {
            child.remove();
        });
    }
    
    // pcd 제거
    if(objects.PcdModel !== null ) removeObject(objects.PcdModel, screen.scene, "mesh");


    //save, compelete등 pcdFileList를 reset할 경우 tag 및 pcd 리스트를 삭제함
    if(globalData.isResetPcdFileList){

        const pcdListClone = [...frameWrap.children];
        pcdListClone.forEach((child)=>{
            child.remove();
        });

        // const pcdTagListClone = [...frameTagWrap.children];
        // pcdTagListClone.forEach((child)=>{
        //     child.remove();
        // });

        // const CuboideTagListClone = [...objectTagWrap.children];
        // CuboideTagListClone.forEach((child)=>{
        //     child.remove();
        // });

        const rgbSelectClone = [...rgbSelect.children];
        rgbSelectClone.forEach((child)=>{
            child.remove();
        });
    
        rgbImage.src = "";
    }

    // 모든 라벨 삭제
    const lables = document.querySelectorAll('.objectLabel');
    lables.forEach((list)=>{
        list.remove();
    });


    resetData();


    
    // 다른 pcd를 선택했을 경우 data를 reset함
    function resetData(){
        
        objects.object3Ds = [];
        objects.svgs = [];
        objects.PcdModel = null;
        objects.existData = {
            projectId    : null,
            taskId   : null,
            workTicketId    : null,
            objectList   : null,
            tagList      : null
        }
        globalData.objectTarget = null;
        globalData.objectListIndex = 0;
        globalData.failData = {};
        globalData.NGData = {
                                message     : null,
                                errorCode   : []
                            };
        // globalData.searchData = {};


        if(globalData.isResetPcdFileList){
            objects.pcds = [];
            // objects.classes = [];
            // objects.tags = [];
            globalData.isResetPcdFileList = false;
        }

        //console.log( screen.renderer.info )
    }

}


export { removeAllObjects }
