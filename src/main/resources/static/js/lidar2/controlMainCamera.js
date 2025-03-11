import * as THREE from './build/three.module.js';
import { objects } from './variables.js';

function controlMainCamera(position){
    objects.cameras[1].up.set( 0, 1, 0 );
    objects.cameras[1].position.copy(new THREE.Vector3(position.x, position.y, 20));
    objects.cameras[1].lookAt(new THREE.Vector3(position.x, position.y, 0));
    objects.cameras[1].up.set( 0, 0, 1 );
    objects.orbitControls[1].target = new THREE.Vector3(position.x, position.y, 0);
}

export { controlMainCamera }