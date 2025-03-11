import * as THREE from './build/three.module.js';
import Stats from './examples/jsm/libs/stats.module.js';
import { OrbitControls } from './examples/jsm/controls/OrbitControls.js';
import { makeFrameList } from './makeFrameList.js';
import { setKeys } from './setKeys.js';
import { setGutterUI } from './setGutterUI.js';
import { setRGBCamera } from './controlRGBCamera.js';
import { setChildviewEvent } from './setChildviewEvent.js';
import { setSettings } from './setSettings.js';
import { setHotkeyUI } from './setHotkeyUI.js';
import { setClassPopUp } from './setClassPopUp.js';
import { setReviewPopUp } from './setReviewPopUp.js';
// import { setInspectPopUp } from './setInspectPopUp.js';
import { setMasterPopUp } from './setMasterPopUp.js';
import { setFailPopUp } from './setFailPopUp.js';
import { loadAssets } from './loadAssets.js';
import { setGuidePopUp } from "./setGuidePopUp.js";
import { setObjectMultiSelect } from './setObjectMultiSelect.js';
import { setDimensionPopUp } from "./setDimensionPopUp.js";
import { CSS2DRenderer, CSS2DObject } from './examples/jsm/renderers/CSS2DRenderer.js';
import { objects, events, globalData, settingData, screen } from './variables.js';




let windowWidth, windowHeight;


function init(controlData){

    screen.canvas = document.getElementById( 'canvas' );      
    screen.renderer = new THREE.WebGLRenderer( { antialias: false, alpha: true } );
    screen.renderer.setPixelRatio( window.devicePixelRatio );
    screen.renderer.setSize( window.innerWidth, window.innerHeight );
    screen.renderer.outputEncoding = THREE.sRGBEncoding;
    screen.renderer.precision = 'lowp';
    screen.renderer.powerPreference = 'low-power';
    screen.canvas.appendChild( screen.renderer.domElement );

    screen.labelRenderer = new CSS2DRenderer();
    screen.labelRenderer.setSize( window.innerWidth, window.innerHeight );
    screen.labelRenderer.domElement.style.position = 'absolute';
    // screen.labelRenderer.domElement.style.top = '489px';
    // screen.labelRenderer.domElement.style.left = '75px';
    screen.canvas.appendChild( screen.labelRenderer.domElement );
    
    const fov = 42;
    const aspect = window.innerWidth / window.innerHeight;
    const near = 0.01;
    const far = 1000;

    for(let i=0 ; i<5 ; i++){

        if(i === 0 && globalData.hasRGBCamera){

            // RGB 카메라가 있을 경우 카메라 셋팅
            objects.views[i] = document.querySelector('#svgWrap');
            objects.cameras[i] = new THREE.PerspectiveCamera(
                objects.rgbCameras[0].fov,
                objects.rgbCameras[0].aspect,
                objects.rgbCameras[0].near,
                objects.rgbCameras[0].far
            );
            objects.cameras[i].position.set(
                objects.rgbCameras[0].position[0],
                objects.rgbCameras[0].position[1],
                objects.rgbCameras[0].position[2]
            );
            objects.cameras[i].rotation.set(
                objects.rgbCameras[0].rotation[0],
                objects.rgbCameras[0].rotation[1],
                objects.rgbCameras[0].rotation[2],
            );

        }else if(i === 1){
            // main 카메라 셋팅
            objects.views[i] = document.querySelector('#view'+(i+1));
            objects.cameras[i] = new THREE.PerspectiveCamera(fov, aspect, near, far); 
            objects.cameras[i].position.set(0, 0, 20);
            objects.cameras[i].up.set( 0, 0, 1 );
            objects.orbitControls[i] = new OrbitControls(objects.cameras[i], objects.views[i]);
        }else{
            // child 카메라 셋팅
            objects.views[i] = document.querySelector('#view'+(i+1));
            objects.cameras[i] = new THREE.OrthographicCamera( 
               globalData.frustumSize / -2, 
               globalData.frustumSize / 2, 
               globalData.frustumSize / 2, 
               globalData.frustumSize / -2, 0, globalData.ogCameraFar[i-2] );
        }
    }
    

    screen.stats = new Stats();
    screen.stats.showPanel(0);
    screen.stats.domElement.style.cssText = 'position:absolute; bottom:0; left:0px;';
    centerWrap.appendChild( screen.stats.dom );

    screen.scene = new THREE.Scene();
    //screen.scene.background = new THREE.Color(0x000000);
    screen.scene.add(new THREE.AxesHelper(1));

    const light = new THREE.DirectionalLight( 0xffffff );
    light.position.set( 0, 1, 0 );
    screen.scene.add( light );

    const hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 1 );
    hemiLight.position.set(0,10,0);
    screen.scene.add( hemiLight );

    // plane 셋팅
    const geometry = new THREE.PlaneGeometry( 1, 1 );
    const material = new THREE.MeshBasicMaterial( {color: new THREE.Color(settingData.planeColor), side: THREE.DoubleSide, transparent:true, opacity:0.5 } );
    objects.plane = new THREE.Mesh( geometry, material );
    objects.plane.name = "plane";
    objects.plane.position.set(0, 0, settingData.planePosZ);
    objects.plane.scale.x = settingData.planeSize;
    objects.plane.scale.y = settingData.planeSize;
    objects.plane.visible = false;
    screen.scene.add( objects.plane );

    // pcd list 셋팅
    objects.pcds.forEach((pcd, index)=>{
        const ul = makeFrameList(pcd, controlData);
        frameWrap.appendChild(ul);
    });


    // 페이지가 처음 열렸을때는 pcds의 첫번째 pcd가 target이 됨
    if(globalData.pcdTarget === null && objects.pcds.length) {
        globalData.pcdTarget = objects.pcds[0].workTicketId;
    }
    const frameWrapClone = [...frameWrap.children];
    for(let i=0 ; i<frameWrapClone.length ; i++){
        if(frameWrapClone[i].pcdUUID === globalData.pcdTarget){
            frameWrapClone[i].classList.add("on");
            break;
        }
    }

    // clipboard copy
    titleIcon.addEventListener('click', function() {

        const text = `[${ objects.taskInfo.taskCode }] ${ objects.taskInfo.taskName }`;
        navigator.clipboard.writeText(text)
            .then(() => {
                alert('title copied!')
            })
            .catch(err => {
                // console.error('Error in copying text: ', err);
                alert('Error in copying text!')
            });
    });
    // clipboard copy


    // change tool 버튼
    if(globalData.permissionCode !== "worker") {
        btnChangeTool.classList.add('on');
        btnChangeTool.addEventListener("click", function (e) {
            const porjectId = globalData.pageParam.projectId;
            const taskId = globalData.pageParam.taskId;
            const reqType = globalData.reqType;
            let link;
            if(globalData.permissionCode === "reviewer") {
                link = `/annotation/reviewLidar?projectId=${porjectId}&taskId=${taskId}&reqType=${reqType}`;
            }
            // else if(globalData.permissionCode === "inspector"){
            //     link = `/annotation/reviewLidar?projectId=${porjectId}&taskId=${taskId}&reqType=${reqType}`;
            // }
            else if(globalData.permissionCode === "master"){
                link = `/annotation/reviewLidar?projectId=${porjectId}&taskId=${taskId}&reqType=${reqType}`;
            }
            location.href = link;
        });
    }



    // RGB 카메라가 있을 경우 camera 셋팅
    setRGBCamera();
    setSettings();
    setKeys(controlData);
    loadAssets(controlData);
    setHotkeyUI();
    setGutterUI();
    // setSearchPopUp(controlData);
    setClassPopUp();
    setDimensionPopUp();
    setReviewPopUp(controlData);
    // setInspectPopUp(controlData);
    setMasterPopUp(controlData);
    setFailPopUp();
    setGuidePopUp();
    setObjectMultiSelect();
    // setValidationPopUp();


    render();

    //css2 renderer때문에 childviewEvent가 제대로 안먹혀서 render후에 event를 셋팅해줌
    setChildviewEvent();


    function updateSize() {


        if ( windowWidth != window.innerWidth || windowHeight != window.innerHeight ) {

            windowWidth = window.innerWidth;
            windowHeight = window.innerHeight;
            screen.renderer.setSize( windowWidth, windowHeight );

            // window size 변경에 따른 childView event setting을 초기화
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


            // cuboideInfo.innerHTML = `${ windowWidth } / ${window.innerWidth}`;
        }
    }
    
    

    function render() {
    
        updateSize();
        let renderStartNumber;
        (globalData.needRgbRender) ? renderStartNumber = 0 : renderStartNumber = 1;

        for ( let i = renderStartNumber; i < objects.views.length ; ++ i ) {

            if(!globalData.hasRGBCamera && i === 0) i = 1;

            const view = objects.views[i];
            const camera = objects.cameras[i];
            const viewRect = view.getBoundingClientRect();
            const canvasRect = screen.canvas.getBoundingClientRect();
    
            let left, top, right, bottom, width, height, positiveYUpBottom;
    
                
            if(i === 0){
                left = viewRect.left - canvasRect.left;            
                top = viewRect.top - canvasRect.top;
                right = viewRect.right - canvasRect.left;
                bottom = viewRect.bottom - canvasRect.top;
                width =  right - left;
                height = bottom - top;
                positiveYUpBottom = canvasRect.height - bottom;
            }else{
                left = Math.max(0, viewRect.left - canvasRect.left);
                top = Math.max(0, viewRect.top - canvasRect.top);
                right = Math.min(viewRect.right, canvasRect.right) - canvasRect.left;
                bottom = Math.min(viewRect.bottom, canvasRect.bottom) - canvasRect.top;
                width = Math.min(canvasRect.width, right - left);
                height = Math.min(canvasRect.height, bottom - top);
                positiveYUpBottom = canvasRect.height - bottom;
            }
    
    
            screen.renderer.setViewport( left, positiveYUpBottom, width, height );
            screen.renderer.setScissor( left, positiveYUpBottom, width, height );
            screen.renderer.setScissorTest( true );
            camera.aspect = width / height;
    
            if(i > 1){
                camera.left = globalData.frustumSize * camera.aspect / - 2;
                camera.right = globalData.frustumSize * camera.aspect / 2;
                camera.top = globalData.frustumSize / 2;
                camera.bottom = globalData.frustumSize / -2;
            }       
            
            camera.updateProjectionMatrix();
            
    
            // svg 자동 생성용 camera셋팅
            if(i === 0 && objects.pcds.length !== 0){
                objects.rgbCameras.forEach((object)=>{
                    object.camera.updateProjectionMatrix();
                    screen.renderer.render( screen.scene, object.camera ); 
                });
            }
            
            screen.renderer.render( screen.scene, camera );
            if(i === 1){
                screen.labelRenderer.domElement.style.top = top + 'px';
                screen.labelRenderer.domElement.style.left = left + 'px';
                screen.labelRenderer.setSize(width, height);
                screen.labelRenderer.render( screen.scene, camera );
            }
        }
        
        
        screen.stats.update();
        requestAnimationFrame(render);
    }
    
}



export { init }