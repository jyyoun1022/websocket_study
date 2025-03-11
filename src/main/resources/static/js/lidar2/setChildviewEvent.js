import * as THREE from './build/three.module.js';
import { getPointer } from "./getPointer.js";
import { changeCuboide } from "./changeCuboide.js";
import { changeCylinder } from "./changeCylinder.js";
import { box3Data, cuboideData, cylinderData, events, globalData, objects, screen, settingData, sphereData } from "./variables.js";



// document에 moveEvent를 선언하기 위해서 각 view 별 moveEvent를 생성하여 할당해보니
// view.pointer 좌표가 이상하게 나와서 mouseDown하는 시점에 해당 view의 moveEvent를 add 시킴
function setChildviewEvent(){

    let arrayIndex, object, viewTarget, frontCube, sphereName;
    let useRightButton = false;
    const prePointer =  new THREE.Vector2();

    for (let i=2 ; i<objects.views.length ; i++) {

        const view = getPointer(i);

        // childView mouse down
        if(events.childviewMouseDown[i] === null || events.childviewMouseDown[i] === undefined){

            events.childviewMouseDown[i] = function(e) {

                // cunboide가 없거나 permission이 없을경우
                if(!objects.object3Ds.length || !globalData.allowAllEvents){
                    return;
                }

                if(e.button === 2) useRightButton = true;

                view.pointer.x = ((e.clientX - view.left) / view.width) * 2 -1;
                view.pointer.y = -((e.clientY - view.top) / view.height) * 2 +1;
                view.raycaster.setFromCamera( view.pointer, view.camera );

                prePointer.copy(view.pointer);

                let intersects = view.raycaster.intersectObjects( screen.scene.children , true );

                if(intersects.length > 0){
                    if(!useRightButton){
                        for ( let j = 0; j < intersects.length; j++ ) {
                            if(intersects[j].object.name === "upSphere"){
                                setSphere(intersects[j].object);
                                break;
                            }else if(intersects[j].object.name === "downSphere"){
                                setSphere(intersects[j].object);
                                break;
                            }else if(intersects[j].object.name === "rightSphere"){
                                setSphere(intersects[j].object);
                                break;
                            }else if(intersects[j].object.name === "leftSphere"){
                                setSphere(intersects[j].object);
                                break;
                            }else if(intersects[j].object.name === "frontSphere"){
                                setSphere(intersects[j].object);
                                break;
                            }else if(intersects[j].object.name === "backSphere"){
                                setSphere(intersects[j].object);
                                break;
                            }else if(intersects[j].object.name === "bottomSphere"){
                                setSphere(intersects[j].object);
                                break;
                            }
                        }
                    }else{
                        document.body.style.cursor = "grab";
                        viewTarget = e.target.id;
                        document.addEventListener('mousemove', events.childviewMouseMove );
                    }
                }

                function setSphere(obj){
                    obj.material.color = new THREE.Color(sphereData.hoverColor);
                    document.body.style.cursor = "pointer";
                    sphereName = obj.name;
                    viewTarget = e.target.id;
                    document.addEventListener('mousemove', events.childviewMouseMove );
                }
            };
            objects.views[i].addEventListener('mousedown', events.childviewMouseDown[i] );
        }


        // childview scroll event
        if(events.childviewMouseWheel[i] === null || events.childviewMouseWheel[i] === undefined) {
            events.childviewMouseWheel[i] = function(e) {
                let scrollTarget = e.target.id;
                let zoomRate = e.deltaY * -0.001;
                let i = Number(scrollTarget.substring(scrollTarget.length-1, scrollTarget.length)) - 1 ;
                objects.cameras[i].zoom += zoomRate;
            };
            objects.views[i].addEventListener('mousewheel', events.childviewMouseWheel[i] );
        }


    }


    // childview mouse move
    if(events.childviewMouseMove === null || events.childviewMouseMove === undefined){

        events.childviewMouseMove = function(e) {

            let i = Number(viewTarget.substring(viewTarget.length-1, viewTarget.length)) - 1 ;

            const view = getPointer(i);

            view.pointer.x = ((e.clientX - view.left) / view.width) * 2 -1;
            view.pointer.y = -((e.clientY - view.top) / view.height) * 2 +1;

            const mouseY = ((view.pointer.y - prePointer.y) * settingData.objectSizeRate) * 50;
            const mouseX = ((view.pointer.x - prePointer.x) * settingData.objectSizeRate) * 80;

            view.raycaster.setFromCamera( view.pointer, view.camera );
            let intersects = view.raycaster.intersectObjects( screen.scene.children , true );

            if(globalData.objectTarget !== null){
                arrayIndex = objects.object3Ds.findIndex((object)=>{
                    return object.objectUUID === globalData.objectTarget;
                });
                object = objects.object3Ds[arrayIndex].getObjectByName(sphereName);
                frontCube = objects.object3Ds[arrayIndex].getObjectByName("frontCube");
            }


            if(object != undefined) {

                // object shape이 cuboide일 경우
                if (globalData.objectTargetShape === "cube") {

                    if (sphereName === "upSphere") {
                        if (i === 2) {
                            if (view.pointer.y - prePointer.y > 0) {
                                object.position.y += mouseY;
                                frontCube.position.y += mouseY;
                                cuboideData.way = "ytP";
                                cuboideData.value = mouseY;
                            } else if (box3Data.initHeight < box3Data.box3Y) {
                                object.position.y += mouseY;
                                frontCube.position.y += mouseY;
                                cuboideData.way = "ytM";
                                cuboideData.value = mouseY;
                            }
                        } else if (i === 4) {
                            if (view.pointer.x - prePointer.x < 0) {
                                object.position.y -= mouseX;
                                frontCube.position.y -= mouseX;
                                cuboideData.way = "ytP";
                                cuboideData.value = -mouseX;
                            } else if (box3Data.initHeight < box3Data.box3Y) {
                                object.position.y -= mouseX;
                                frontCube.position.y -= mouseX;
                                cuboideData.way = "ytM";
                                cuboideData.value = -mouseX;
                            }
                        }
                    } else if (sphereName === "downSphere") {
                        if (i === 2) {
                            if (view.pointer.y - prePointer.y < 0) {
                                object.position.y += mouseY;
                                cuboideData.way = "ybP";
                                cuboideData.value = -mouseY;
                            } else if (box3Data.initHeight < box3Data.box3Y) {
                                object.position.y += mouseY;
                                cuboideData.way = "ybM";
                                cuboideData.value = -mouseY;
                            }
                        } else if (i === 4) {
                            if (view.pointer.x - prePointer.x > 0) {
                                object.position.y -= mouseX;
                                cuboideData.way = "ybP";
                                cuboideData.value = mouseX;
                            } else if (box3Data.initHeight < box3Data.box3Y) {
                                object.position.y -= mouseX;
                                cuboideData.way = "ybM";
                                cuboideData.value = mouseX;
                            }
                        }
                    } else if (sphereName === "rightSphere") {
                        if (i === 2 || i === 3) {
                            if (view.pointer.x - prePointer.x > 0) {
                                object.position.x += mouseX;
                                cuboideData.way = "xrP";
                                cuboideData.value = mouseX;
                            } else if (box3Data.initWidth < box3Data.box3X) {
                                object.position.x += mouseX;
                                cuboideData.way = "xrM";
                                cuboideData.value = mouseX;
                            }
                        }
                    } else if (sphereName === "leftSphere") {
                        if (i === 2 || i === 3) {
                            if (view.pointer.x - prePointer.x < 0) {
                                object.position.x += mouseX;
                                cuboideData.way = "xlP";
                                cuboideData.value = -mouseX;
                            } else if (box3Data.initWidth < box3Data.box3X) {
                                object.position.x += mouseX;
                                cuboideData.way = "xlM";
                                cuboideData.value = -mouseX;
                            }
                        }
                    } else if (sphereName === "frontSphere") {
                        if (i === 3 || i === 4) {
                            if (view.pointer.y - prePointer.y > 0) {
                                object.position.z += mouseY;
                                cuboideData.way = "zfP";
                                cuboideData.value = mouseY;
                            } else if (box3Data.initDepth < box3Data.box3Z) {
                                object.position.z += mouseY;
                                cuboideData.way = "zfM";
                                cuboideData.value = mouseY;
                            }
                        }
                    } else if (sphereName === "backSphere") {
                        if (i === 3 || i === 4) {
                            if (view.pointer.y - prePointer.y < 0) {
                                object.position.z += mouseY;
                                cuboideData.way = "zbP";
                                cuboideData.value = -mouseY;
                            } else if (box3Data.initDepth < box3Data.box3Z) {
                                object.position.z += mouseY;
                                cuboideData.way = "zbM";
                                cuboideData.value = -mouseY;
                            }
                        }
                    }
                    cuboideData.sort = "size";
                    document.body.style.cursor = "pointer";

                    changeCuboide();

                } else if(globalData.objectTargetShape === "cylinder") {


                    if (sphereName === "upSphere") {
                        if (i === 2 || 3) {
                            if (view.pointer.x - prePointer.x < 0) {
                                object.position.x += mouseX;
                                cylinderData.way = "xlP";
                                cylinderData.value = -mouseX;
                            } else if (box3Data.initWidth < box3Data.box3X) {
                                object.position.x += mouseX;
                                cylinderData.way = "xlM";
                                cylinderData.value = mouseX;
                            }
                        }
                    }else if(sphereName === "downSphere") {
                        if (i === 2 || 3) {
                            if (view.pointer.x - prePointer.x < 0) {
                                object.position.x += mouseX;
                                cylinderData.way = "xrM";
                                cylinderData.value = -mouseX;
                            } else if (box3Data.initWidth < box3Data.box3X) {
                                object.position.x += mouseX;
                                cylinderData.way = "xrP";
                                cylinderData.value = mouseX;
                            }
                        }
                    }else if(sphereName === "bottomSphere") {
                        if (i === 2) {
                            if (view.pointer.y - prePointer.y < 0) {
                                object.position.y += mouseY/2;
                                cylinderData.way = "ybP";
                                cylinderData.value = -mouseY;
                            } else if (box3Data.initHeight < box3Data.box3Y) {
                                object.position.y += mouseY/2;
                                cylinderData.way = "ybM";
                                cylinderData.value = mouseY;
                            }
                        }else if(i === 4){
                            if (view.pointer.x - prePointer.x < 0) {
                                object.position.y -= mouseX/2;
                                cylinderData.way = "ybP";
                                cylinderData.value = mouseX;
                            } else if (box3Data.initWidth < box3Data.box3X) {
                                object.position.y -= mouseX/2;
                                cylinderData.way = "ybM";
                                cylinderData.value = -mouseX;
                            }
                        }
                    }

                    cylinderData.sort = "size";
                    document.body.style.cursor = "pointer";

                    changeCylinder();

                }
            }



            if(useRightButton){
                if( i === 2){
                    objects.cameras[i].position.x -= mouseX;
                    objects.cameras[i].position.y -= mouseY;
                }else if(i === 3){
                    objects.cameras[i].position.x -= mouseX;
                    objects.cameras[i].position.z -= mouseY;
                }else if(i === 4){
                    objects.cameras[i].position.y += mouseX;
                    objects.cameras[i].position.z -= mouseY;
                }

            }

            prePointer.copy(view.pointer);

        };
    }

    if(events.childviewMouseUp === null || events.childviewMouseUp === undefined){
        events.childviewMouseUp = function(e) {
            sphereName = null;
            useRightButton = false;
            if(object !== undefined){
                object.material.color = new THREE.Color(sphereData.color);
            }
            document.body.style.cursor = "default";
            document.removeEventListener('mousemove', events.childviewMouseMove );
        };
        document.addEventListener('mouseup', events.childviewMouseUp );
    }



}


export { setChildviewEvent }