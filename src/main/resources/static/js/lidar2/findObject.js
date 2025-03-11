import { getPointer } from './getPointer.js';
import { changeObjectList } from './changeObjectList.js';
import { changeSvgList } from './changeSvgList.js';
import { objects, events, globalData, settingData, screen, cuboideData } from './variables.js';


function findObject(){
    
    const view = getPointer(globalData.mainView);

    if(events.findObjectMouseMove === null){
        events.findObjectMouseMove = function(e) {
            view.pointer.x = ((e.clientX - view.left) / view.width) * 2 -1;
            view.pointer.y = -((e.clientY - view.top) / view.height) * 2 +1;
        };
    }
        

    if(events.findObjectMouseClick === null){
        events.findObjectMouseClick = function(e) {
            view.raycaster.setFromCamera( view.pointer, view.camera );
            let intersects = view.raycaster.intersectObjects( screen.scene.children , true );
            if(intersects.length > 0){
                for ( let j = 0; j < intersects.length; j++ ) {
                    if(globalData.isFindObject){
                        if(intersects[j].object.name === "cube" || intersects[j].object.name === "cylinder"){
                        
                            globalData.objectTarget = intersects[j].object.parent.objectUUID;

                            for(let i=0 ; i<objectWrap.children.length ; i++){
                                if(objectWrap.children[i].objectUUID === globalData.objectTarget){
                                const targetTop = objectWrap.children[i].offsetTop - objectWrap.offsetTop;
                                    objectWrap.scrollTop = targetTop;
                                    objectWrap.children[i].classList.add("on");
                                }else{
                                    objectWrap.children[i].classList.remove("on");
                                }
                            }

                            changeObjectList();
                            changeSvgList();

                            break;
                        }
                    }
                } 
            }
        };
    }

    // 작동 안할것 같음....
    if(events.findObjectMouseMove && events.findObjectMouseClick){
        objects.views[globalData.mainView].removeEventListener('mousemove', events.findObjectMouseMove);
        objects.views[globalData.mainView].removeEventListener('click', events.findObjectMouseClick);
    }
   

    objects.views[globalData.mainView].addEventListener('mousemove', events.findObjectMouseMove);
    objects.views[globalData.mainView].addEventListener('click', events.findObjectMouseClick);

}
export { findObject }