
import * as THREE from './build/three.module.js';
import { makeObjectList } from './makeObjectList.js';
import { makeUUID }  from './makeUUID.js';
import { setObjectInformation } from "./setObjectInformation.js";
import { makeWireFrame } from "./makeWireFrame.js";
import { getBox3 } from "./getBox3.js";
import { objects, cylinderData, globalData, settingData, screen, sphereData, box3Data } from './variables.js';




function makeCylinder(){

    const distance = 3;
    const dir = new THREE.Vector3();
    const cylinder = makeCylinder(cylinderData);
    const upSphere = makeSphere(sphereData);
    const downSphere = makeSphere(sphereData);
    const bottomSphere = makeSphere(sphereData);

    cylinder.name = "cylinder";
    upSphere.name = "upSphere";
    downSphere.name = "downSphere";
    bottomSphere.name = "bottomSphere";

    getBox3(cylinder);

    upSphere.position.set(
        -(cylinderData.size.t + sphereData.gap),
        cylinder.position.y+(box3Data.box3Y/2-sphereData.gap/2),
        cylinder.position.z
    );
    downSphere.position.set(
        cylinderData.size.b + sphereData.gap,
        cylinder.position.y-(box3Data.box3Y/2-sphereData.gap/2),
        cylinder.position.z
    );
    bottomSphere.position.set(
        cylinder.position.x,
        cylinder.position.y-(box3Data.box3Y/2+sphereData.gap),
        cylinder.position.z
    );


    const cylinderGroup = new THREE.Group();

    // 하나의 cuboide에는 objectUUID, svgUUID 이렇게 두종류가 있으며
    // objectUUID는 cuboide group, cube, cube list 에 같은 값으로 지정되며
    // svgUUID는 생성된 각 svg에 지정됨 cube uuid와 svg uuid는 서버에 저장함
    // cuboide가 생성될때 tagList를 할당하여 tag의 값이 변경될때마다 tagList에 저장함


    cylinder.objectUUID = makeUUID();
    cylinder.classId = globalData.defaultClass.number;
    cylinder.onlyRect = cylinderData.onlyRect;
    cylinderGroup.objectUUID = cylinder.objectUUID;
    cylinderGroup.tagList = [];
    objects.tags.forEach((list)=>{
        if(list.tagTypeCd === "OBJ"){
            const tag = {};
            tag.tagId = list.tagId;
            tag.tagTypeCd = list.tagTypeCd;
            tag.name = list.name;
            tag.matchClasses = list.matchClasses;
            cylinderGroup.tagList.push(tag);
        }
    });

    globalData.objectTarget = cylinderGroup.objectUUID;
    globalData.objectTargetShape = cylinder.name;

    cylinderGroup.add( cylinder, upSphere, downSphere, bottomSphere );

    // camera setting을 cuboide position, rotation후에 적용시키면 화면이 각 속성이 적용되어서 보이기 때문에
    // camera setting후 cuboide 속성을 적용시킴
    for(let i=2 ; i<5 ; i++){
        (i===2) ? dir.set(0,0,1) : (i===3) ? dir.set(0,1,0) : dir.set(1,0,0);
        objects.cameras[3].up.set( 0, 0, 1 );
        objects.cameras[4].up.set( 0, 0, 1 );
        cylinderGroup.add(objects.cameras[i]);
        objects.cameras[i].position.set(
            cylinderGroup.position.x-(distance*dir.x),
            cylinderGroup.position.y-(distance*dir.y),
            cylinderGroup.position.z+(distance*dir.z)
        );
        objects.cameras[i].lookAt(
            cylinderGroup.position.x+(distance*dir.x),
            cylinderGroup.position.y+(distance*dir.y),
            cylinderGroup.position.z-(distance*dir.z)
        );
    }

    cylinderGroup.position.set(cylinderData.position.x, cylinderData.position.y, cylinderData.position.z);
    cylinderGroup.rotation.set(cylinderData.rotation.x, cylinderData.rotation.y, cylinderData.rotation.z);
    screen.scene.add(cylinderGroup);


    const ul = makeObjectList();
    objectWrap.appendChild(ul);

    objects.object3Ds.push(cylinderGroup);
    makeWireFrame(cylinder);


    // object list가 생성되면 자동으로 focus시킴
    for(let i=0; i<objectWrap.children.length ; i++){
        if(objectWrap.children[i].objectUUID === globalData.objectTarget){
            objectWrap.children[i].scrollIntoView(false);
            break;
        }
    }

    function makeCylinder(data){
        let color, opacity;
        color = globalData.defaultClass.color;
        opacity = settingData.objectOpacity;
        const geometry = new THREE.CylinderGeometry( data.size.t, data.size.b, data.size.h, 32 );
        const material = new THREE.MeshBasicMaterial( { color: color, transparent:true, opacity: opacity, depthTest:false, depthWrite:false } );
        const cylinder = new THREE.Mesh( geometry, material );
        return cylinder;
    }


    function makeSphere(data){
        const geometry = new THREE.SphereGeometry( data.size.rad, data.size.ws, data.size.hs );
        const material = new THREE.MeshBasicMaterial({ color: sphereData.color, transparent:true });
        const sphere = new THREE.Mesh( geometry, material );
        return sphere;
    }

    setObjectInformation(cylinderGroup);

}





export { makeCylinder }