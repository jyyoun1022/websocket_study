
import * as THREE from './build/three.module.js';
import { makeObjectList } from './makeObjectList.js';
import { makeUUID }  from './makeUUID.js';
import { drawObjectsInRgbCanvas } from "./setObjectsInRgbCanvas.js";
import { changeSvgList } from "./changeSvgList.js";
import { setObjectInformation } from "./setObjectInformation.js";
import { makeWireFrame } from "./makeWireFrame.js";
import { getBox3 } from "./getBox3.js";
import { objects, cuboideData, globalData, settingData, screen, box3Data, sphereData } from './variables.js';




const frontCubeData = {
    position : { x:0, y:0, z:0 }, 
    size     : { w:0.1, h:1, d:0.1 },
    opacity  : 0.7
};


// make cube 시작
function makeCuboide(){

    const distance = 3;
    const dir = new THREE.Vector3();
    const cube = makeCube(cuboideData);
    const frontCube = makeCube(frontCubeData, "front");
    const upSphere = makeSphere(sphereData);
    const downSphere = makeSphere(sphereData);
    const rightSphere = makeSphere(sphereData);
    const leftSphere = makeSphere(sphereData);
    const frontSphere = makeSphere(sphereData);
    const backSphere = makeSphere(sphereData);

    cube.name = "cube";
    frontCube.name = "frontCube";
    upSphere.name = "upSphere";
    downSphere.name = "downSphere";
    rightSphere.name = "rightSphere";
    leftSphere.name = "leftSphere";
    frontSphere.name = "frontSphere";
    backSphere.name = "backSphere";

    getBox3(cube);
    

    frontCube.position.set(0, box3Data.box3Y/2+frontCubeData.size.h/2, 0);
    upSphere.position.set(0, box3Data.box3Y/2+sphereData.gap, 0);
    rightSphere.position.set(box3Data.box3X/2+sphereData.gap, 0, 0);
    leftSphere.position.set(-(box3Data.box3X/2+sphereData.gap), 0, 0);
    downSphere.position.set(0, -(box3Data.box3Y/2+sphereData.gap), 0);
    frontSphere.position.set(0, 0, box3Data.box3Z/2+sphereData.gap);
    backSphere.position.set(0, 0, -(box3Data.box3Z/2+sphereData.gap));

    const cuboideGroup = new THREE.Group();

    
    // 하나의 cuboide에는 objectUUID, svgUUID 이렇게 두종류가 있으며
    // objectUUID는 cuboide group, cube, cube list 에 같은 값으로 지정되며
    // svgUUID는 생성된 각 svg에 지정됨 cube uuid와 svg uuid는 서버에 저장함
    // cuboide가 생성될때 tagList를 할당하여 tag의 값이 변경될때마다 tagList에 저장함

    cube.objectUUID = makeUUID();
    cube.classId = globalData.defaultClass.number;
    cube.onlyRect = cuboideData.onlyRect;
    cuboideGroup.objectUUID = cube.objectUUID;
    cuboideGroup.tagList = [];
    objects.tags.forEach((list)=>{
        if(list.tagTypeCd === "OBJ"){
            const tag = {};
            tag.tagId = list.tagId;
            tag.tagTypeCd = list.tagTypeCd;
            tag.name = list.name;
            tag.matchClasses = list.matchClasses;
            cuboideGroup.tagList.push(tag);
        }
    });


    globalData.objectTarget = cuboideGroup.objectUUID;
    globalData.objectTargetShape = cube.name;

    cuboideGroup.add( cube, frontCube, upSphere, downSphere, rightSphere, leftSphere, frontSphere, backSphere );


    // camera setting을 cuboide position, rotation후에 적용시키면 화면이 각 속성이 적용되어서 보이기 때문에
    // camera setting후 cuboide 속성을 적용시킴
    for(let i=2 ; i<5 ; i++){
        (i===2) ? dir.set(0,0,1) : (i===3) ? dir.set(0,1,0) : dir.set(1,0,0);
        objects.cameras[3].up.set( 0, 0, 1 );
        objects.cameras[4].up.set( 0, 0, 1 );
        cuboideGroup.add(objects.cameras[i]);
        objects.cameras[i].position.set(
            cuboideGroup.position.x-(distance*dir.x),
            cuboideGroup.position.y-(distance*dir.y),
            cuboideGroup.position.z+(distance*dir.z)
        );
        objects.cameras[i].lookAt(
            cuboideGroup.position.x+(distance*dir.x),
            cuboideGroup.position.y+(distance*dir.y),
            cuboideGroup.position.z-(distance*dir.z)
        );
    }

    cuboideGroup.position.set(cuboideData.position.x, cuboideData.position.y, cuboideData.position.z);
    cuboideGroup.rotation.set(cuboideData.rotation.x, cuboideData.rotation.y, cuboideData.rotation.z);
    screen.scene.add(cuboideGroup);


    const ul = makeObjectList();
    objectWrap.appendChild(ul);

    objects.object3Ds.push(cuboideGroup);
    makeWireFrame(cube);


    // cuboide type이 only rect일때 material opacity를 0으로 만들어서 안보이게함
    if(cube.onlyRect){
        cube.material.opacity = 0;
        frontCube.material.opacity = 0;
        upSphere.material.opacity = 0;
        downSphere.material.opacity = 0;
        rightSphere.material.opacity = 0;
        leftSphere.material.opacity = 0;
        frontSphere.material.opacity = 0;
        backSphere.material.opacity = 0;
    }


    // object list가 생성되면 자동으로 focus시킴
    for(let i=0; i<objectWrap.children.length ; i++){
        if(objectWrap.children[i].objectUUID === globalData.objectTarget){
            objectWrap.children[i].scrollIntoView(false);
            break;
        }
    }


    function makeCube(data, sort){

        let color, opacity;

        if(sort === "front"){
            color = settingData.frontCubeColor;
            opacity = frontCubeData.opacity;
        }else{
            color = globalData.defaultClass.color;
            opacity = settingData.objectOpacity;
        }

        const geometry = new THREE.BoxGeometry( data.size.w, data.size.h, data.size.d );
        const material = new THREE.MeshBasicMaterial( { color: color, transparent:true, opacity: opacity, depthTest:false, depthWrite:false } );
        const cube = new THREE.Mesh( geometry, material );
        return cube;
    }


    function makeSphere(data){
        const geometry = new THREE.SphereGeometry( data.size.rad, data.size.ws, data.size.hs );
        const material = new THREE.MeshBasicMaterial({ color: sphereData.color, transparent:true });
        const sphere = new THREE.Mesh( geometry, material );
        return sphere;
    }


    changeSvgList();
    setObjectInformation(cuboideGroup);
    drawObjectsInRgbCanvas();
}
// make cube 끝




export { makeCuboide }