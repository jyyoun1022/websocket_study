
import * as THREE from "./build/three.module.js";
import { removeObject } from "./removeObject.js";
import { settingData } from "./variables.js";

function makeWireFrame(object){

    let opacity;
    (object.onlyRect) ? opacity = 0 : opacity = 0.2;

    if(object.children.length){
        for(let i=0 ; i<object.children.length ; i++){
            removeObject(object.children[i], object, "mesh");
        }
    }

    const wireframe = new THREE.WireframeGeometry( object.geometry );
    const lineMaterial = new THREE.LineBasicMaterial({ color: settingData.wireFrameColor, transparent: true, opacity: opacity, depthTest : false  });
    const lineObject = new THREE.LineSegments( wireframe, lineMaterial );
    if(!settingData.visibleWireFrame) lineObject.visible = false;
    object.add( lineObject );

}


export { makeWireFrame }