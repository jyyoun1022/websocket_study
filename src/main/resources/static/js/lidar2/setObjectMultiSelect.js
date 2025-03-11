
import { objects, globalData } from './variables.js';


function setObjectMultiSelect(){

    checkBoxObejctAll.addEventListener('change', function(e){

        const objectWrapClone = [...objectWrap.children];

        if(this.checked) {

            // cuboide list에서 check한후 전체선택을 check한 경우
            // 기존 selectedObjects의 데이터는 초기화 시켜야함
            globalData.selectedObjects = [];

            objectWrapClone.forEach((list, index)=>{
                if(index > 0){
                    const checkbox = list.children[0].children[0];
                    const targetIndex = objects.object3Ds.findIndex((object)=>{
                        return object.objectUUID === list.objectUUID;
                    });
                    checkbox.checked = true;

                    globalData.selectedObjects.push(objects.object3Ds[targetIndex]);
                }
            });
        }else{

            objectWrapClone.forEach((list, index)=>{
                if(index > 0){
                    const checkbox = list.children[0].children[0];
                    checkbox.checked = false;
                    globalData.selectedObjects = [];
                }
            });

            findObjectTarget();
        }


    });


}



function changeObjectMultiSelect(checked, uuid){

    if(checked === true){
        const targetIndex = objects.object3Ds.findIndex((cuboide)=>{
            return cuboide.objectUUID === uuid;
        });
        globalData.selectedObjects.push(objects.object3Ds[targetIndex]);

    }else{
        const targetIndex = globalData.selectedObjects.findIndex((cuboide)=>{
            return cuboide.objectUUID === uuid;
        });
        globalData.selectedObjects.splice(targetIndex, 1);
    }

}


function resetMultiSelect(){

    checkBoxObejctAll.checked = false;
    globalData.selectedObjects = [];

}


function findObjectTarget(){

    const objectWrapClone = [...objectWrap.children];

    for(let i=0; i<objectWrapClone.length ; i++){
        if(objectWrapClone[i].classList.contains('on')){
            globalData.objectTarget = objectWrapClone[i].objectUUID;
            globalData.objectTargetShape = objectWrapClone[i].objectShape;
            break;
        }
    }
}



export { setObjectMultiSelect, changeObjectMultiSelect, resetMultiSelect }