
import { changeSvgList } from './changeSvgList.js';
import { changeObjectList } from './changeObjectList.js';
import { globalData } from './variables.js';

function makeSvgIcon(shortName, camId, svgUUID, objectUUID){
    
    let ul;

    for(let i=0 ; i<objectWrap.children.length ; i++){
        let uuid = objectWrap.children[i].objectUUID;
        if(uuid === objectUUID){
            ul = objectWrap.children[i];
        }
    }

    let a = document.createElement( 'a' );
    a.svgUUID = svgUUID;
    a.className = "svgIcon";
    a.innerHTML = shortName;

    // bbox icon 제거   
    for(let i=0 ; i<ul.children[3].children.length ; i++){
        let name = ul.children[3].children[i].getAttribute("name");
        if(name === "bboxAutoIcon"){
            ul.children[3].children[i].remove();
        }
    }

    // svg icon 추가
    // 자동 rect 생성 hotkey 동작 제어
    ul.children[3].appendChild(a);
    ul.usedAutoButton = true;


   
    a.addEventListener('click', function(e){

        // permission이 없을경우
        if(!globalData.allowAllEvents){
            return;
        }

        globalData.objectTarget = this.parentElement.parentElement.objectUUID;
        for(let i=0 ; i<objectWrap.children.length ; i++){
            objectWrap.children[i].classList.remove("on");
        }

        this.parentElement.parentElement.classList.add("on");
        changeSvgList(camId);
        changeObjectList();
        e.stopPropagation();
        
    });

}

export { makeSvgIcon }