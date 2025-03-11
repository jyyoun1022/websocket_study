
import { globalData } from './variables.js';
function setObjectListIndex(){

    for(let i=1 ; i<objectWrap.children.length ; i++){
        const indexWrap = objectWrap.children[i].childNodes[1];
        indexWrap.innerHTML = "#" + i;
    }
    globalData.objectListIndex = objectWrap.children.length - 1;

}

export { setObjectListIndex }