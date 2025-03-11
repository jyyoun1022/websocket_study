
import { objects, globalData } from './variables.js';

function matchClasses(){

    if(globalData.objectTarget === null){
        const objectTagList = objectTagWrap.children;
        for(let i=0; i<objectTagList.length; i++){
            objectTagList[i].style.display = "none";
        }
    }else{
        const targetIndex = objects.object3Ds.findIndex((object)=>{
            return object.objectUUID === globalData.objectTarget;
        });
        const object = objects.object3Ds[targetIndex].children[0];
        const objectTagList = objectTagWrap.children;
        for(let i=0; i<objectTagList.length; i++){
            const matchClasses = objectTagList[i].matchClasses.split(",");
            const isMatchClass = matchClasses.findIndex((list)=>{
                return object.classId === list;
            });
            (isMatchClass < 0) ? objectTagList[i].style.display = "none" : objectTagList[i].style.display = "flex";
        }
    }

}

export { matchClasses }
