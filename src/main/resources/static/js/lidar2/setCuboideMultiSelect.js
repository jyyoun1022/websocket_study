


function setCuboideMultiSelect(objects, globalData){

    checkBoxCubeAll.addEventListener('change', function(e){

        const cuboideWrapClone = [...cuboideWrap.children];

        if(this.checked) {

            // cuboide list에서 check한후 전체선택을 check한 경우
            // 기존 selectedCuboides의 데이터는 초기화 시켜야함
            globalData.selectedCuboides = [];
            
            cuboideWrapClone.forEach((list, index)=>{
                if(index > 0){
                    const checkbox = list.children[0].children[0];
                    const targetIndex = objects.cuboides.findIndex((cuboide)=>{
                        return cuboide.cuboideUUID === list.cuboideUUID;
                    });
                    checkbox.checked = true;

                    globalData.selectedCuboides.push(objects.cuboides[targetIndex]);
                }
            });
        }else{
            cuboideWrapClone.forEach((list, index)=>{
                if(index > 0){
                    const checkbox = list.children[0].children[0];
                    checkbox.checked = false;
                    globalData.selectedCuboides = [];
                }
            });
        }


    });



}



function changeCuboideMultiSelect(checked, uuid, objects, globalData){

    if(checked === true){
        const targetIndex = objects.cuboides.findIndex((cuboide)=>{
            return cuboide.cuboideUUID === uuid;
        });
        globalData.selectedCuboides.push(objects.cuboides[targetIndex]);
    }else{
        const targetIndex = globalData.selectedCuboides.findIndex((cuboide)=>{
            return cuboide.cuboideUUID === uuid;
        });
        globalData.selectedCuboides.splice(targetIndex, 1);
    }


}

function resetMultiSelect(globalData){

    checkBoxCubeAll.checked = false;
    globalData.selectedCuboides = [];

}



export { setCuboideMultiSelect, changeCuboideMultiSelect, resetMultiSelect }