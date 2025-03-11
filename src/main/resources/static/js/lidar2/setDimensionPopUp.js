import { dimensionPopUpUI } from './dimensionPopUpUI.js';
import {objects, globalData, cuboideData} from './variables.js';
import { cubeGuideBoxFunc } from './setKeys.js';

function setDimensionPopUp(){

    leftWrap.insertAdjacentHTML('afterend', dimensionPopUpUI);

    // popUp close 버튼
    btnDimensionPopUpClose.addEventListener('click', function(e){
        dimensionPopUpWrap.style.display = "none";
    });

    objects.classes.forEach((obj)=>{
        const ul = document.createElement( 'ul' );
        const li1 = document.createElement( 'li' );
        const li2 = document.createElement( 'li' );
        ul.classId = obj.classId;
        ul.classColor = obj.color;
        ul.className =  obj.className;
        ul.dimension =  obj.dimension;

        li1.innerHTML = `<span class='circle1'></span>`;
        li1.children[0].style.backgroundColor = obj.color;
        li2.innerHTML = `${ obj.className }`;

        ul.append(li1, li2);
        dimensionPopUpContent.appendChild(ul);

        // class 선택 이벤트
        ul.addEventListener('click', function(e){
            globalData.defaultClass.number = this.classId;
            globalData.defaultClass.color = this.classColor;
            globalData.defaultClass.name = this.className;
            globalData.defaultClass.dimension = this.dimension;
            cubeDimensionName.innerText = globalData.defaultClass.name;
            cuboideData.defaultSize = globalData.defaultClass.dimension;
            dimensionPopUpWrap.style.display = "none";
            globalData.isMakeGuideBox = false;
            cubeGuideBoxFunc();
        });
    });


}


export { setDimensionPopUp }