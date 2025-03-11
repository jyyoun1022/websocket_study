import { removeObject } from './removeObject.js';
import { changeCuboideList } from './changeCuboideList.js';
import { drawObjectsInRgbCanvas } from "./setObjectsInRgbCanvas.js";


function deleteSelectedCuboides(objects, globalData, settingData, screen, cuboideData){

    let selectedCuboides = [];

    if(globalData.selectedCuboides.length){
        //array 얕은 복사
        selectedCuboides = [...globalData.selectedCuboides];
    }else{
        selectedCuboides = [...objects.cuboides];
    }

    // 선택한 cuboide group를 screen에서 삭제
    selectedCuboides.forEach((group)=>{
        removeObject(group, screen.scene, "groupTotal", screen);
    });


    // 선택한 cuboide group를 cuboide list 에서 삭제
    // 얕은 복사해서 cuboideListClone을 생성했기 때문에 삭제로 인한 배열 변형이 없음
    const cuboideListClone = [...cuboideWrap.children];
    cuboideListClone.forEach((child)=>{
        if(child.id !== "classPopUpWrap"){
            for (let i = 0; i < selectedCuboides.length; i++) {
                if (child.cuboideUUID === selectedCuboides[i].cuboideUUID) {
                    child.remove();
                    break;
                }
            }
        }
    });


    // 선택한 cuboide group에 할당된 모든 svg를 삭제
    // 얕은 복사해서 svgListClone을 생성했기 때문에 삭제로 인한 배열 변형이 없음
    const svgListClone = [...svgSpace.children];
    svgListClone.forEach((child)=>{
        for (let i = 0; i < selectedCuboides.length; i++) {
            if (child.cuboideUUID === selectedCuboides[i].cuboideUUID) {
                child.remove();
                break;
            }
        }
    });

    // cuboide tag default로 만들기
    const cuboideTagList = cuboideTagWrap.children;
    for(let i=0 ; i<cuboideTagList.length ; i++){
        if(cuboideTagList[i].tagValTypeCd === "30"){
            const options = cuboideTagList[i].children[2].children[0].options;
            options[0].selected = true;
        }else if(cuboideTagList[i].tagValTypeCd === "20"){
            const input = cuboideTagList[i].children[2].children[0];
            input.value = "";
        }
    }


    // 삭제할 object가 1개일때는 상관이 없지만 여러개이면 삭제로 인한 배열 변형으로
    // 제대로 삭제가 안되는 경우가 생김 그래서 새로운 배열을 생성하여 대체함
    const cuboidesTemp = [];
    objects.cuboides.forEach((group)=> {
        for (let i = 0; i < selectedCuboides.length; i++) {
            if (group.cuboideUUID === selectedCuboides[i].cuboideUUID) {
                break;
            }else{
                if(i === selectedCuboides.length-1) cuboidesTemp.push(group);
            }
        }
    });
    objects.cuboides = cuboidesTemp;


    // 1개의 cuboide에 해당하는 svg는 여러개일 수 있으므로 삭제를 하면 svg 배열이 바껴버림으로
    // 선택한 cuboide에 할당된 모든 svg를 제외하고 objects.svgs를 다시 설정
    const svgsTemp = [];
    objects.svgs.forEach((group)=> {
        for (let i = 0; i < selectedCuboides.length; i++) {
            if (group.cuboideUUID === selectedCuboides[i].cuboideUUID) {
                break;
            }else{
                if(i === selectedCuboides.length-1) svgsTemp.push(group);
            }
        }
    });
    objects.svgs = svgsTemp;


    // objects.cuboides에 남아있는 object가 있으면 첫 object가 선택됨
    if(objects.cuboides.length){
        globalData.cuboideTarget = objects.cuboides[0].cuboideUUID;
        changeCuboideList(objects, globalData, settingData, cuboideData);
    }else{
        globalData.cuboideTarget = null;
        globalData.cuboideListIndex = 0;
    }

    // cuboide list 활성화
    for(let i=0 ; i < cuboideWrap.children.length ; i++){
        if(cuboideWrap.children[i].cuboideUUID === globalData.cuboideTarget) {
            const groupList = cuboideWrap.children[i];
            groupList.classList.add('on');
            break;
        }
    }

    globalData.selectedCuboides = [];

    drawObjectsInRgbCanvas(objects, globalData, settingData);
}

export { deleteSelectedCuboides }