

import * as THREE from './build/three.module.js';
import { OBB } from './examples/jsm/math/OBB.js';
import { ConvexHull } from './examples/jsm/math/ConvexHull.js';
import { getFinalCuboideData } from './saveData.js';
import { objects, settingData, hugeData } from './variables.js';


function findPcdPoints() {

    // await를 사용해서 point값을 모두다 찾을때까지 waiting함
    async function startFindPoints(){
        try {
            hugeData.pcdPointData = await findPcdPointsInCuboide();
            changePcdPointColor();
        }catch(e) {
            console.log(e);
        }
    }
    startFindPoints();
}


function findPcdPointsInCuboide(){

    // find point의 양이 cuboid의 숫자에 따라서 엄청나게 많아질 수 있기 때문에 promise를 사용함
    return new Promise((resolve, reject) => {

        const PCDArray = objects.PcdModel.geometry.attributes.position.array;
        const pointsData = [];

        for(let i=0 ; i<objects.object3Ds.length ; i++){

            const meshName = objects.object3Ds[i].children[0].name;
            const onlyRect = objects.object3Ds[i].children[0].onlyRect;

            if(meshName === "cube" && !onlyRect){

                const findPoints = [];
                const findPointIndex = [];
                const finalCuboideData = getFinalCuboideData(objects.object3Ds[i]);
                const geometry = new THREE.BoxGeometry( finalCuboideData.size.w, finalCuboideData.size.h, finalCuboideData.size.d );
                const material = new THREE.MeshBasicMaterial( { color: 0x0078FF,  transparent:true, opacity:0.3} );
                const cube = new THREE.Mesh( geometry, material );
                cube.position.set(finalCuboideData.position.x, finalCuboideData.position.y, finalCuboideData.position.z);
                cube.rotation.set(finalCuboideData.rotation.x, finalCuboideData.rotation.y, finalCuboideData.rotation.z);

                const size = new THREE.Vector3(finalCuboideData.size.w, finalCuboideData.size.h, finalCuboideData.size.d);
                geometry.userData.obb = new OBB();
                geometry.userData.obb.halfSize.copy( size ).multiplyScalar( 0.5 );
                cube.userData.obb = new OBB();
                cube.updateMatrix();
                cube.updateMatrixWorld();
                cube.userData.obb.copy( cube.geometry.userData.obb );
                cube.userData.obb.applyMatrix4( cube.matrixWorld );

                for(let j=0 ; j<PCDArray.length ; j+=3){
                    const point = new THREE.Vector3(PCDArray[j], PCDArray[j+1], PCDArray[j+2]);
                    const result = cube.userData.obb.containsPoint(point);
                    if(result) {
                        findPoints.push(point);
                        findPointIndex.push(j);
                    }
                }

                const result = {};
                result.objectUUID = objects.object3Ds[i].objectUUID;
                result.findPoints = findPoints;
                result.pointIndex = findPointIndex;
                pointsData.push(result);

            }else if(meshName === "cylinder"){

                const findPoints = [];
                const findPointIndex = [];
                const geometryPoints = [];
                const groupPosition = new THREE.Vector3().copy(objects.object3Ds[i].position);
                const groupRotation = new THREE.Vector3().copy(objects.object3Ds[i].rotation);
                const mesh = objects.object3Ds[i].children[0];
                const parameters = mesh.geometry.parameters;
                const geometry = new THREE.CylinderGeometry(parameters.radiusTop, parameters.radiusBottom, parameters.height,32);

                geometry.rotateX(groupRotation.x);
                geometry.rotateY(groupRotation.y);
                geometry.rotateZ(groupRotation.z);
                geometry.translate(groupPosition.x, groupPosition.y, groupPosition.z);

                const positions = geometry.attributes.position.array;

                for(let i=0; i<positions.length ; i+=3){
                    const point = new THREE.Vector3( positions[i], positions[i+1], positions[i+2]);
                    geometryPoints.push(point);
                }

                const convexHull = new ConvexHull().setFromPoints( geometryPoints );

                for(let j=0 ; j<PCDArray.length ; j+=3){
                    const point = new THREE.Vector3(PCDArray[j], PCDArray[j+1], PCDArray[j+2]);
                    const result = convexHull.containsPoint(point);
                    if(result) {
                        findPoints.push(point);
                        findPointIndex.push(j);
                    }
                }

                const result = {};
                result.objectUUID = objects.object3Ds[i].objectUUID;
                result.findPoints = findPoints;
                result.pointIndex = findPointIndex;
                pointsData.push(result);

            }



        }
        resolve(pointsData);
        reject("fail to find points");
    });
}


function changePcdPointColor(){

    const PCDArray = objects.PcdModel.geometry.attributes.position.array;

    const colors = [];
    const r = parseInt( settingData.pcdColor.slice(1,3), 16 );
    const g = parseInt( settingData.pcdColor.slice(3,5), 16 );
    const b = parseInt( settingData.pcdColor.slice(5,7), 16 );


    // pcd의 전체 point 색상 초기화
    for(let i=0 ; i<PCDArray.length ; i+=3){
        colors[i] = r, colors[i+1] = g, colors[i+2] = b;
    }

    hugeData.pcdPointData.forEach((data)=>{

        const targetIndex = objects.object3Ds.findIndex((cuboide)=>{ return cuboide.objectUUID === data.objectUUID; });
        const classId = objects.object3Ds[targetIndex].children[0].classId;
        const colorIndex = objects.classes.findIndex((classInfo)=>{ return classInfo.classId === classId; });
        const color = objects.classes[colorIndex].color;
        const r = parseInt( color.slice(1,3), 16 );
        const g = parseInt( color.slice(3,5), 16 );
        const b = parseInt( color.slice(5,7), 16 );

        for(let i=0 ; i<data.pointIndex.length ; i++){
            const point = data.pointIndex[i];
            colors[point] = r, colors[point+1] = g, colors[point+2] = b;
        }

    });

    objects.PcdModel.geometry.setAttribute( 'color', new THREE.BufferAttribute( new Uint8Array(colors), 3 , true) );
}


export { findPcdPoints, findPcdPointsInCuboide }