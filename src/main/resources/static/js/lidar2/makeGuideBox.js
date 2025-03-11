
import * as THREE from './build/three.module.js';
import { getPointer } from './getPointer.js';
import { removeObject } from './removeObject.js';
import { makeCuboide } from './cuboide.js';
import { makeCylinder } from './cylinder.js';
import { moveScreen } from './setKeys.js';
import { matchClasses } from './matchClasses.js';
import { drawObjectsInRgbCanvas } from "./setObjectsInRgbCanvas.js";
import { objects, events, globalData, cuboideData, screen, cylinderData } from './variables.js';


function makeGuideBox(){
  
    resetGuideBox();

    // 새롭게 cuboide를 생성할때 기본 사이즈를 생성될 사이즈로 셋팅
    cuboideData.size = { w:cuboideData.defaultSize.w, h:cuboideData.defaultSize.h, d:cuboideData.defaultSize.d }
    cuboideData.position = { x: null, y: null, z: null };
    cuboideData.rotation = { x: null, y: null, z: null };

    cylinderData.size = { t:cylinderData.defaultSize.t, b:cylinderData.defaultSize.b, h:cylinderData.defaultSize.h };
    cylinderData.position = { x: null, y: null, z: null };
    cylinderData.rotation = { x: null, y: null, z: null };

    let guideBoxSize = {};
    if(globalData.objectShape === "cylinder"){
        guideBoxSize = { w: 4, h: 2, d: 1 }
    }else{
        guideBoxSize = { w: cuboideData.size.w, h: cuboideData.size.h, d: cuboideData.size.d }
    }

    const view = getPointer(globalData.mainView);
    const box = new THREE.BoxGeometry( guideBoxSize.w, guideBoxSize.h, guideBoxSize.d );
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent:true, opacity:0.2, depthTest:false, depthWrite:false });
    objects.guideBox = new THREE.Mesh(box, material);
    objects.guideBox.name = "cube";
    screen.scene.add(objects.guideBox);

    if( events.guideBoxMouseMove === null){
        events.guideBoxMouseMove = function(e) {
            view.pointer.x = ((e.clientX -  view.left) /  view.width) * 2 -1;
            view.pointer.y = -((e.clientY -  view.top) /  view.height) * 2 +1;
            view.raycaster.setFromCamera(  view.pointer,  view.camera );
            let intersects =  view.raycaster.intersectObjects( screen.scene.children , true );
            if(intersects.length > 0){
                for ( let j = 0; j < intersects.length; j++ ) {
                    if(intersects[j].object.name === "plane"){
                        objects.guideBox.position.x = intersects[j].point.x;
                        objects.guideBox.position.y = intersects[j].point.y;
                        objects.guideBox.position.z = intersects[j].point.z + guideBoxSize.d/2;
                        drawObjectsInRgbCanvas();
                    }
                } 
            }
        };
    }

    if( events.guideBoxMouseClick === null){

        events.guideBoxMouseClick = function(e) {

            // 모든 objects의 sphere를 안보이게 함
            objects.object3Ds.forEach((group)=> {
                group.children.forEach((obj) => {
                    const name = obj.name.substring(obj.name.length - 6, obj.name.length);
                    if (name === "Sphere") {
                        obj.visible = false;
                    } else {
                        obj.visible = true;
                    }
                });
            });

            switch(globalData.objectShape) {
                case "cube":
                    cuboideData.position = {
                        x: objects.guideBox.position.x,
                        y: objects.guideBox.position.y,
                        z: objects.guideBox.position.z
                    };
                    cuboideData.onlyRect = false;
                    (globalData.objectListIndex === null) ? globalData.objectListIndex = 0 : globalData.objectListIndex++;
                    makeCuboide();
                    break;

                case "cylinder":
                    cylinderData.position = {
                        x: objects.guideBox.position.x,
                        y: objects.guideBox.position.y,
                        z: objects.guideBox.position.z
                    };
                    cylinderData.onlyRect = false;
                    (globalData.objectListIndex === null) ? globalData.objectListIndex = 0 : globalData.objectListIndex++;
                    makeCylinder();
                    break;

            }


            removeObject(objects.guideBox, screen.scene, "mesh");
            objects.views[globalData.mainView].removeEventListener('mousemove', events.guideBoxMouseMove);
            objects.views[globalData.mainView].removeEventListener('click', events.guideBoxMouseClick);

            moveScreen();
            matchClasses();

            objects.guideBox = null;

            drawObjectsInRgbCanvas();
        };
    }

    objects.views[globalData.mainView].addEventListener('mousemove', events.guideBoxMouseMove);
    objects.views[globalData.mainView].addEventListener('click', events.guideBoxMouseClick);


}



function resetGuideBox(){

    if(events.guideBoxMouseMove && events.guideBoxMouseClick){
        objects.views[globalData.mainView].removeEventListener('mousemove', events.guideBoxMouseMove);
        objects.views[globalData.mainView].removeEventListener('click', events.guideBoxMouseClick);
        events.guideBoxMouseMove = null;
        events.guideBoxMouseClick = null;
    }

    if(events.findObjectMouseMove && events.findObjectMouseClick){
        objects.views[globalData.mainView].removeEventListener('mousemove', events.findObjectMouseMove);
        objects.views[globalData.mainView].removeEventListener('click', events.findObjectMouseClick);
        events.findObjectMouseMove = null;
        events.findObjectMouseClick = null;
    }

    if(objects.guideBox) {
        removeObject(objects.guideBox, screen.scene, "mesh");
        objects.guideBox = null;
    }

    drawObjectsInRgbCanvas();

}


export { makeGuideBox, resetGuideBox }