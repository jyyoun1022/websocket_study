
import * as THREE from './build/three.module.js';
import { setChildviewEvent } from './setChildviewEvent.js';
import { resetGuideBox } from "./makeGuideBox.js";
import { findObject } from "./findObject.js";
import { objects, events, cuboideData, globalData, settingData, screen } from './variables.js';


function setGutterUI(){

    let gutters = [gutter1, gutter2, gutter3];

    let leftWrapWidth = leftWrap.offsetWidth;
    let topWrapHeight = topWrap.offsetHeight;


    let shift = new THREE.Vector2();


    gutters.forEach((gutter) =>{
        gutter.onmousedown = function(event){
            event.preventDefault();
            events.gutterMouseDown(event);
        };
    });

    if(events.gutterMouseDown === null){
        events.gutterMouseDown = function(e) {
            globalData.gutterTarget = e.target;
            shift.x = e.clientX - globalData.gutterTarget.getBoundingClientRect().left;
            shift.y = e.clientY - globalData.gutterTarget.getBoundingClientRect().top;
            document.addEventListener('mousemove', events.gutterMouseMove);
            document.addEventListener('mouseup', events.gutterMouseUp);
        };
    }

    if(events.gutterMouseMove === null){
        events.gutterMouseMove = function(e) {

            let newLeft = e.clientX - shift.x;
            let newTop = e.clientY - shift.y;
            let childViewWidth = childViewWrap.offsetWidth;
            let childViewLeft = childViewWrap.getBoundingClientRect().left;
            let rightWrapWidth = rightWrap.offsetWidth;
            let footerWrapHeight = footerWrap.offsetHeight;

            if(globalData.gutterTarget.id === 'gutter1'){

                if (newLeft < leftWrapWidth) {
                    newLeft = leftWrapWidth;
                }
                if (newLeft > window.innerWidth - rightWrapWidth) {
                    newLeft = window.innerWidth - rightWrapWidth;
                }
            
                gutter1.style.left = newLeft + 'px';
                gutter3.style.width =  newLeft - leftWrapWidth + 'px';
                childViewWrap.style.width = window.innerWidth - (newLeft + rightWrapWidth) + 'px';
                mainViewWrap.style.width = newLeft - leftWrapWidth + 'px';

            }else if(globalData.gutterTarget.id === 'gutter2'){

                if (newLeft < leftWrapWidth + childViewWidth) {
                    newLeft = leftWrapWidth + childViewWidth;
                }
                if (newLeft > window.innerWidth - rightWrapWidth/2) {
                    newLeft = window.innerWidth - rightWrapWidth/2;
                }
                gutter2.style.left = newLeft + 'px';
                gutter1.style.left = childViewLeft + 'px';
                gutter3.style.width = newLeft - (leftWrapWidth + childViewWidth) + 'px';
                rightWrap.style.width = window.innerWidth - newLeft + 'px';
                centerWrap.style.width = newLeft - leftWrapWidth + 'px';
                mainViewWrap.style.width = newLeft - (leftWrapWidth + childViewWidth) + 'px';

            }else if(globalData.gutterTarget.id === 'gutter3'){

                if (newTop < topWrapHeight) {
                    newLeft = topWrapHeight;
                }

                if (newTop > window.innerHeight - footerWrapHeight) {
                    newTop = window.innerHeight - footerWrapHeight;
                }

                gutter3.style.top = (newTop - topWrapHeight) + 'px';
                view1.style.height = (newTop - topWrapHeight) + 'px';
                view2.style.height = window.innerHeight - (newTop + footerWrapHeight ) + 'px';

            }
        };
    }

    if(events.gutterMouseUp === null){
        events.gutterMouseUp = function(e) {
            globalData.gutterTarget = null;

            // gutter 이동에 따른 childView event setting을 초기화
            if(objects.object3Ds.length){
                for (let i=2 ; i<objects.views.length ; i++) {
                    objects.views[i].removeEventListener('mousedown', events.childviewMouseDown[i] );
                }
                document.removeEventListener('mousemove', events.childviewMouseMove );
                document.removeEventListener('mouseup', events.childviewMouseUp );
                events.childviewMouseDown = [];
                events.childviewMouseUp = null;
                events.childviewMouseMove = null;
                setChildviewEvent();
            }

            // gutter 이동에 따른 findObject 초기화
            objects.views[globalData.mainView].removeEventListener('mousemove', events.findObjectMouseMove);
            objects.views[globalData.mainView].removeEventListener('click', events.findObjectMouseClick);
            events.findObjectMouseMove = null;
            events.findObjectMouseClick = null;
            findObject();


            
            document.removeEventListener('mousemove', events.gutterMouseMove);
            document.removeEventListener('mouseup', events.gutterMouseUp);
        };
    }


   
}

export { setGutterUI }