
import * as THREE from "./build/three.module.js";
import { box3Data, cuboideData } from "./variables.js";


function getBox3(object){

    box3Data.pointBox3 = new THREE.Box3().setFromBufferAttribute(object.geometry.attributes.position);
    box3Data.objectBox3 = new THREE.Box3().setFromObject(object);

    box3Data.pointBox3Size = box3Data.pointBox3.getSize(new THREE.Vector3());
    box3Data.pointBox3Center = box3Data.pointBox3.getCenter(new THREE.Vector3());

    box3Data.objectBox3Size = box3Data.objectBox3.getSize(new THREE.Vector3());
    box3Data.objectBox3Center = box3Data.objectBox3.getCenter(new THREE.Vector3());

    box3Data.initWidth = cuboideData.minSize.w;
    box3Data.initHeight = cuboideData.minSize.h;
    box3Data.initDepth = cuboideData.minSize.d;

    box3Data.box3X = box3Data.pointBox3.max.x + -box3Data.pointBox3.min.x;
    box3Data.box3Y = box3Data.pointBox3.max.y + -box3Data.pointBox3.min.y;
    box3Data.box3Z = box3Data.pointBox3.max.z + -box3Data.pointBox3.min.z;

}


export { getBox3 }