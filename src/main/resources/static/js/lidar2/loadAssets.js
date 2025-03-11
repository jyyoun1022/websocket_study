import * as THREE from './build/three.module.js';
import { PCDLoader } from './examples/jsm/loaders/PCDLoader.js';
import { changeRGBCamera } from './controlRGBCamera.js';
import { initSvgViewer } from './initSvgViewer.js';
import { setSvgEvent } from './setSvgEvent.js';
import { setNotices } from "./setNotices.js";
import {objects, globalData, settingData, screen, hugeData} from './variables.js';


function loadAssets(controlData) {

    //로드할 pcd가 없는 경우 return
    if(!objects.pcds.length){
        if(globalData.isPageStart) {
            globalData.isPageStart = false;
            setSvgEvent();
        }
        loaderWrap.style.display = "none";
        return;
    }

    // let vn = "https://image-vn.dev-aistudio.com/aistudio";
    // let kr = "https://image.dev-aistudio.com/aistudio";
    //
    // if(Math.round(Math.random()*1) === 0) vn = "vvvvvvvvvvvvvvvv";
    // if(Math.round(Math.random()*1) === 0) kr = "kkkkkkkkkkkkkkkk";
    //
    // globalData.imageServerURL = vn;
    // globalData.imageServerDefault = kr;


    // let imageServerURL = null;
    let imageServerURL = globalData.imageServerURL;
    // if (_common.cookie.get('useEdgeServer') === 'true') {
    //     imageServerURL = globalData.edgeServerURL;
    // } else {
    //     imageServerURL = globalData.imageServerURL;
    // }
    const imageServerDefault = globalData.imageServerDefault;

    const targetPcd = objects.pcds.findIndex((pcd)=>{ return pcd.workTicketId === globalData.pcdTarget; });
    const totalAsset = 1 + objects.pcds[targetPcd].rgbImages.length;
    let loadedAsset = 0;


    loadStart();

    function loadStart(){
        loaderWrap.style.display = "flex";
        progressbar.style.width = 0;
        getPcd();
        getImage();
    }


    function loadPcd(url){
        return new Promise((resolve, reject)=>{
            const pcdLoader = new PCDLoader();

            pcdLoader.load( url,
                function ( points ) {

                    let colors = [];
                    const r = parseInt(settingData.pcdColor.substr(1,2), 16);
                    const g = parseInt(settingData.pcdColor.substr(3,2), 16);
                    const b = parseInt(settingData.pcdColor.substr(5,2), 16);

                    // pcdPointColors에서는 pcd에서 제공하는 origin color와 사용자가 지정한 custom color를 합쳐서 하나의 color 배열로 만듬
                    // colorIndexes에서는 pcd에서 제공한 origin color의 index를 저장해서 나중에 사용자가 custom color를 변경할때 사용
                    // frame 이동시 사용된 변수 초기화
                    hugeData.pcdPointColors = [];
                    hugeData.colorIndexes = [];
                    globalData.hasOriginPcdColor = false;

                    // pcd에 originColor가 있을 경우
                    if(points.geometry.attributes.color !== undefined){
                        globalData.hasOriginPcdColor = true;
                        colors = [...points.geometry.attributes.color.array];
                        for(let i=0 ; i < colors.length ; i+=3) {
                            if (colors[i] === 0 && colors[i + 1] === 0 && colors[i + 2] === 0) {
                                colors[i] = r;
                                colors[i + 1] = g;
                                colors[i + 2] = b;
                                hugeData.colorIndexes.push(i);
                            } else {
                                colors[i] = Math.floor(colors[i] * 255);
                                colors[i + 1] = Math.floor(colors[i + 1] * 255);
                                colors[i + 2] = Math.floor(colors[i + 2] * 255);
                            }
                        }
                    }else{
                        for(let i=0 ; i < points.geometry.attributes.position.array.length ; i+=3){
                            colors[i] = r, colors[i+1] = g, colors[i+2] = b;
                        }
                    }
                    hugeData.pcdPointColors = colors;
                    points.material = new THREE.PointsMaterial({ vertexColors: true, size:settingData.pcdSize });
                    points.material.sizeAttenuation = false;
                    objects.PcdModel = points;
                    resolve(points);
                },
                function(xhr){},
                function ( error ) {
                    reject(url);
                },
            );
        });
    }

    function getPcd(){

        const url = imageServerURL + objects.pcds[targetPcd].path + "/" + objects.pcds[targetPcd].fileName;
        const loadedPcd = loadPcd(url);

        loadedPcd.then((response)=>{
            screen.scene.add( response );
            loadProgress();
        }).catch((error)=>{
            const errorUrl = error;
            if(!errorUrl.startsWith(imageServerDefault)){
                const fileName = errorUrl.slice(imageServerURL.length);
                const url = imageServerDefault + fileName;
                const loadedPcd = loadPcd(url);
                loadedPcd.then((response)=>{
                    screen.scene.add( response );
                    loadProgress();
                }).catch((error)=>{
                    setNotices("noPcd");
                    loadProgress();
                });
            }else{
                setNotices("noPcd");
                loadProgress();
            }
        });

    }

    function loadImage(url){

        return new Promise((resolve, reject)=>{
            const request = new XMLHttpRequest();
            request.open('GET', url);
            request.responseType = 'blob';
            request.onload = function() {
                if(request.status === 200){
                    resolve(request.response);
                }else{
                    reject(url);
                }
            };
            request.onerror = function() {
                reject(url);
            };
            request.send();
        });
    }


    function getImage(){

        for(let i=0 ; i< objects.pcds[targetPcd].rgbImages.length ; i++){

            const url = imageServerURL + objects.pcds[targetPcd].rgbImages[i].path + "/" + objects.pcds[targetPcd].rgbImages[i].fileName;
            const loadedImage = loadImage(url);

            loadedImage.then((response)=>{

                const image = new Image();
                const url = window.URL.createObjectURL(response);
                image.src = url;
                objects.pcds[targetPcd].rgbImages[i].loadedImage = image;
                loadProgress();

            }).catch((error)=>{

                const errorUrl = error;

                if(!errorUrl.startsWith(imageServerDefault)){

                    const fileName = errorUrl.slice(imageServerURL.length);
                    const url = imageServerDefault + fileName;

                    const loadedImage = loadImage(url);
                    loadedImage.then((response)=>{
                        const image = new Image();
                        const url = window.URL.createObjectURL(response);
                        image.src = url;
                        objects.pcds[targetPcd].rgbImages[i].loadedImage = image;
                        loadProgress();
                    }).catch((error)=>{
                        const image = new Image();
                        image.src = globalData.staticServer + "/images/tool/lidar2/404.gif";
                        image.src = globalData.staticServer + "/image/tool/lidar2/404.gif";
                        objects.pcds[targetPcd].rgbImages[i].loadedImage = image;
                        loadProgress();
                    });
                }else{
                    const image = new Image();
                    image.src = globalData.staticServer + "/images/tool/lidar2/404.gif";
                    image.src = globalData.staticServer + "/image/tool/lidar2/404.gif";
                    objects.pcds[targetPcd].rgbImages[i].loadedImage = image;
                    loadProgress();
                }

            });

        }
    }


    function loadProgress(){
        if(loadedAsset < totalAsset-1){
            loadedAsset++;
            progressbar.style.width = `${loadedAsset / totalAsset * 100 | 0}%`;
        }else{
            // loadEnd를 바로 호출하면 image의 naturalWidth, naturalHeight 값이 0,0이 됨
            setTimeout(()=>{ loadEnd(); },10);
        }
    }

    function loadEnd(){

        loaderWrap.style.display = "none";

        // 선택한 pcd의 rgb image들을 바탕으로 svg data 계산 및 저장
        objects.pcds[targetPcd].rgbImages.forEach((data)=>{
            const camId =  data.camId;
            data.loadedData = initSvgViewer(data.loadedImage, camId);
        });

        // 처음 페이지 열릴때만 동작함
        if(globalData.isPageStart) setSvgEvent();

        changeRGBCamera();

        // 기존 데이터를 가져와 셋팅할려면 (svg 값이 image 크기에 따라서 변함) rgb image들을 load한 다음 데이터를 셋팅하고 난뒤 가능하므로 여기서 controlData를 함
        const pcdIndex = objects.pcds.findIndex((pcd)=>{ return pcd.workTicketId === globalData.pcdTarget; });
        controlData("getExistData");

    }

}


// function loadAssets(controlData) {
//
//     //로드할 pcd가 없는 경우 return
//     if(!objects.pcds.length){
//         if(globalData.isPageStart) {
//             globalData.isPageStart = false;
//             setSvgEvent();
//         }
//         loaderWrap.style.display = "none";
//         return;
//     }
//
//
//     const manager = new THREE.LoadingManager();
//     const pcdLoader = new PCDLoader( manager );
//     const imageLoader = new THREE.ImageLoader( manager );
//
//     const targetPcdIndex = objects.pcds.findIndex((pcd)=>{ return pcd.workTicketId === globalData.pcdTarget; });
//     const pcdFile = globalData.imageServerURL + objects.pcds[targetPcdIndex].path + "/" + objects.pcds[targetPcdIndex].fileName;
//
//
//     manager.onStart = function(){
//         loaderWrap.style.display = "flex";
//         progressbar.style.width = 0;
//     };
//
//
//     manager.onLoad = function(){
//
//         loaderWrap.style.display = "none";
//
//         // 선택한 pcd의 rgb image들을 바탕으로 svg data 계산 및 저장
//         objects.pcds[targetPcdIndex].rgbImages.forEach((data)=>{
//             const camId =  data.camId;
//             data.loadedData = initSvgViewer(data.loadedImage, camId);
//
//         });
//
//         // 처음 페이지 열릴때만 동작함
//         if(globalData.isPageStart) setSvgEvent();
//
//         changeRGBCamera();
//
//         // 기존 데이터를 가져와 셋팅할려면 (svg 값이 image 크기에 따라서 변함) rgb image들을 load한 다음 데이터를 셋팅하고 난뒤 가능하므로 여기서 controlData를 함
//         const pcdIndex = objects.pcds.findIndex((pcd)=>{ return pcd.workTicketId === globalData.pcdTarget; });
//         controlData("getExistData");
//     };
//
//
//     manager.onProgress = function( url, itemsLoaded, itemsTotal ){
//        progressbar.style.width = `${itemsLoaded / itemsTotal * 100 | 0}%`;
//     };
//
//
//     manager.onError = function ( url ) {
//         console.log( 'There was an error loading ' + url );
//     };
//
//
//     // pcd 로딩
//     pcdLoader.load( pcdFile, function ( points ) {
//
//         let colors = [];
//         const r = parseInt(settingData.pcdColor.substr(1,2), 16);
//         const g = parseInt(settingData.pcdColor.substr(3,2), 16);
//         const b = parseInt(settingData.pcdColor.substr(5,2), 16);
//
//         // pcdPointColors에서는 pcd에서 제공하는 origin color와 사용자가 지정한 custom color를 합쳐서 하나의 color 배열로 만듬
//         // colorIndexes에서는 pcd에서 제공한 origin color의 index를 저장해서 나중에 사요자가 custom color를 변경할때 사용
//         // pcd간 이동시 사용된 변수 초기화
//         hugeData.pcdPointColors = [];
//         hugeData.colorIndexes = [];
//         globalData.hasOriginPcdColor = false;
//
//         // pcd에 originColor가 있을 경우
//         if(points.geometry.attributes.color !== undefined){
//
//             globalData.hasOriginPcdColor = true;
//             colors = [...points.geometry.attributes.color.array];
//             for(let i=0 ; i < colors.length ; i+=3) {
//                 if (colors[i] === 0 && colors[i + 1] === 0 && colors[i + 2] === 0) {
//                     colors[i] = r;
//                     colors[i + 1] = g;
//                     colors[i + 2] = b;
//                     hugeData.colorIndexes.push(i);
//                 } else {
//                     colors[i] = Math.floor(colors[i] * 255);
//                     colors[i + 1] = Math.floor(colors[i + 1] * 255);
//                     colors[i + 2] = Math.floor(colors[i + 2] * 255);
//                 }
//             }
//
//         }else{
//
//             for(let i=0 ; i < points.geometry.attributes.position.array.length ; i+=3){
//                 colors[i] = r, colors[i+1] = g, colors[i+2] = b;
//             }
//
//         }
//
//         hugeData.pcdPointColors = colors;
//         points.material = new THREE.PointsMaterial({ vertexColors: true, size:settingData.pcdSize });
//         points.material.sizeAttenuation = false;
//         objects.PcdModel = points;
//         screen.scene.add( points );
//
//     });
//
//
//     // pcd에 속한 rgb images 로딩
//     for(let i=0 ; i< objects.pcds[targetPcdIndex].rgbImages.length ; i++){
//
//         const imageFile = globalData.imageServerURL + objects.pcds[targetPcdIndex].rgbImages[i].path + "/" + objects.pcds[targetPcdIndex].rgbImages[i].fileName;
//         imageLoader.load(imageFile,  function ( image ) {
//             console.log(image)
//             objects.pcds[targetPcdIndex].rgbImages[i].loadedImage = image;
//         });
//     }
//
// }

export { loadAssets }
