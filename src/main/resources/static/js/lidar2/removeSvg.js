

import { makeSvg } from './makeSvg.js';
import { changeSvgList } from './changeSvgList.js';
import { objects, globalData } from './variables.js';

function removeSvg(object){

    // object는 선택한 cuboide의 g 객체
    // g객체에는 svgUUID 와 objectUUID 두개를 가지고 있음

    const svgUUID = object.svgUUID;
    const objectUUID = object.objectUUID;

    // svgSpace에서 svg 삭제하고 svgs배열에서도 삭제
    svgSpace.removeChild(object);
    const targetIndex = objects.svgs.findIndex((svg)=>{
        return svg.svgUUID === svgUUID;
    });
    objects.svgs.splice(targetIndex, 1);

    removeSvgIcon();



    function removeSvgIcon(){

        let iconLi;

        // cuboide list 중에서 선택한 cuboide list 찾기
        let objectListIndex;
        for(let i=0 ; i<objectWrap.children.length; i++){
            if(objectWrap.children[i].objectUUID === objectUUID){
                objectListIndex = i;
                break;
            }
        }

        iconLi = objectWrap.children[objectListIndex].children[3];


        // cuboide list에서 선택한 svg 삭제
        for(let i=0 ; i<iconLi.children.length ; i++){
            if(iconLi.children[i].svgUUID === svgUUID){               
                iconLi.children[i].remove();
                break;
            }
        }

        // cuboide에 속하는 svg가 여러개일 수 있기 때문에 확인후 아이콘 변경함
        const isSvgInCube = objects.svgs.findIndex((svg)=>{
            return svg.objectUUID === objectUUID;
        });
        if(isSvgInCube < 0) makeBBoxIcon(iconLi);

    }


    function makeBBoxIcon(iconLi){

        // svg를 다 지웠을 경우 auto버튼을 사용할 수 있도록 초기화
        const targetUL = iconLi.parentElement;
        targetUL.usedAutoButton = false;
       
        iconLi.innerHTML = "<a class='material-icons' name='bboxAutoIcon'>fit_screen</a>";

        iconLi.children[0].addEventListener('click', function(e){

            if(targetUL.usedAutoButton || targetUL.onlyRect) return;

            globalData.objectTarget = this.parentElement.parentElement.objectUUID;

            const targetIndex = objects.object3Ds.findIndex((cuboide)=>{
                return cuboide.objectUUID === globalData.objectTarget;
            });

            for(let i=0 ; i<objectWrap.children.length ; i++){
                objectWrap.children[i].classList.remove("on");
            }

            this.parentElement.parentElement.classList.add("on");

            makeSvg(objects.object3Ds[targetIndex], "auto");
            changeSvgList();

        });
    }
}


export { removeSvg }