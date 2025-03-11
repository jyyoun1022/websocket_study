
import * as THREE from './build/three.module.js';
import { objects, screen } from './variables.js';

function getPointer(view){
    const pointer = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    const elemRect = objects.views[view].getBoundingClientRect();
    const camera = objects.cameras[view];
    const canvasRect =  screen.canvas.getBoundingClientRect();                

    const right = Math.min(elemRect.right, canvasRect.right) - canvasRect.left;
    const left = Math.max(0, elemRect.left - canvasRect.left);
    const bottom = Math.min(elemRect.bottom, canvasRect.bottom) - canvasRect.top;
    const top = Math.max(0, elemRect.top - canvasRect.top);
    const width = Math.min(canvasRect.width, right - left);
    const height = Math.min(canvasRect.height, bottom - top);

    return { pointer, raycaster, camera, left, right, top, bottom, width, height };
}

export { getPointer }