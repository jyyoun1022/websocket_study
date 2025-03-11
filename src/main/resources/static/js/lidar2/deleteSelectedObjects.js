import { removeObject } from './removeObject.js';
import { changeObjectList } from './changeObjectList.js';
import { drawObjectsInRgbCanvas } from "./setObjectsInRgbCanvas.js";
import { setObjectListIndex } from "./setObjectListIndex.js";
import { objects, globalData, screen } from './variables.js';


function deleteSelectedObjects(){

    let selectedObjects = [];

    if(globalData.selectedObjects.length){
        //array 얕은 복사
        selectedObjects = [...globalData.selectedObjects];
    }else{
        selectedObjects = [...objects.object3Ds];
    }

    // 선택한 object group를 screen에서 삭제
    selectedObjects.forEach((group)=>{
        removeObject(group, screen.scene, "groupTotal");
    });


    // 선택한 object group를 object list 에서 삭제
    // 얕은 복사해서 objectListClone을 생성했기 때문에 삭제로 인한 배열 변형이 없음
    const objectListClone = [...objectWrap.children];
    objectListClone.forEach((child)=>{
        if(child.id !== "classPopUpWrap"){
            for (let i = 0; i < selectedObjects.length; i++) {
                if (child.objectUUID === selectedObjects[i].objectUUID) {
                    child.remove();
                    break;
                }
            }
        }
    });


    // 선택한 object group에 할당된 모든 svg를 삭제
    // 얕은 복사해서 svgListClone을 생성했기 때문에 삭제로 인한 배열 변형이 없음
    const svgListClone = [...svgSpace.children];
    svgListClone.forEach((child)=>{
        for (let i = 0; i < selectedObjects.length; i++) {
            if (child.objectUUID === selectedObjects[i].objectUUID) {
                child.remove();
                break;
            }
        }
    });

    // object tag default로 만들기
    const objectTagList = objectTagWrap.children;
    for(let i=0 ; i<objectTagList.length ; i++){
        if(objectTagList[i].tagValTypeCd === "30"){
            const options = objectTagList[i].children[2].children[0].options;
            options[0].selected = true;
        }else if(objectTagList[i].tagValTypeCd === "20"){
            const input = objectTagList[i].children[2].children[0];
            input.value = "";
        }
    }


    // 삭제할 object가 1개일때는 상관이 없지만 여러개이면 삭제로 인한 배열 변형으로
    // 제대로 삭제가 안되는 경우가 생김 그래서 새로운 배열을 생성하여 대체함
    const objectsTemp = [];
    objects.object3Ds.forEach((group)=> {
        for (let i = 0; i < selectedObjects.length; i++) {
            if (group.objectUUID === selectedObjects[i].objectUUID) {
                break;
            }else{
                if(i === selectedObjects.length-1) objectsTemp.push(group);
            }
        }
    });
    objects.object3Ds = objectsTemp;


    // 1개의 object에 해당하는 svg는 여러개일 수 있으므로 삭제를 하면 svg 배열이 바껴버림으로
    // 선택한 object에 할당된 모든 svg를 제외하고 objects.svgs를 다시 설정
    const svgsTemp = [];
    objects.svgs.forEach((group)=> {
        for (let i = 0; i < selectedObjects.length; i++) {
            if (group.objectUUID === selectedObjects[i].objectUUID) {
                break;
            }else{
                if(i === selectedObjects.length-1) svgsTemp.push(group);
            }
        }
    });
    objects.svgs = svgsTemp;


    // objects.object3Ds에 남아있는 object가 있으면 첫 object가 선택됨
    if(objects.object3Ds.length){
        globalData.objectTarget = objects.object3Ds[0].objectUUID;
        changeObjectList();
    }else{
        globalData.objectTarget = null;
        globalData.objectListIndex = 0;
    }

    // object list 활성화
    for(let i=0 ; i < objectWrap.children.length ; i++){
        if(objectWrap.children[i].objectUUID === globalData.objectTarget) {
            const groupList = objectWrap.children[i];
            groupList.classList.add('on');
            break;
        }
    }

    globalData.selectedObjects = [];

    drawObjectsInRgbCanvas();
    setObjectListIndex();
}

export { deleteSelectedObjects }