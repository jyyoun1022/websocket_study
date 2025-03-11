import * as THREE from "./build/three.module.js";
import { globalData, objects, svgData } from "./variables.js";

function changeSvgPosition(tempSvgData) {

    let rect, rectBBox;
    let svgPosition = new THREE.Vector2();

    //drag로 선택안했을때 와 마우스event일떄
    if(tempSvgData === undefined){
        rect = svgData.targetSvg.children[0];
        rectBBox = rect.getBBox();
    }else{
        //drag로 svg를 선택했을때
        rect = tempSvgData.rect;
        rectBBox = tempSvgData.rectBBox;
    }

    svgPosition.x = rectBBox.x + svgData.svgMove.x;
    svgPosition.y = rectBBox.y + svgData.svgMove.y;

    if(rectBBox.x + svgData.svgMove.x < 0){
        svgPosition.x = 0;
    }
    if(rectBBox.y + svgData.svgMove.y < 0){
        svgPosition.y = 0;
    }
    if((rectBBox.x + svgData.svgMove.x) + rectBBox.width > svgData.calcSvgSpace.x){
        svgPosition.x = svgData.calcSvgSpace.x - rectBBox.width - 0.1;
    }
    if((rectBBox.y + svgData.svgMove.y) + rectBBox.height  > svgData.calcSvgSpace.y){
        svgPosition.y = svgData.calcSvgSpace.y - rectBBox.height - 0.1;
    }

    rect.setAttribute("x", svgPosition.x );
    rect.setAttribute("y", svgPosition.y );


    // rect가 이동했기 때문에 그 이동에 대한 BBox를 다시 재정립
    const movedRectBBox = rect.getBBox();
    const targetSvg = rect.parentNode;
    targetSvg.children[1].setAttribute("cx", movedRectBBox.x + movedRectBBox.width/2 );
    targetSvg.children[1].setAttribute("cy", movedRectBBox.y );
    targetSvg.children[2].setAttribute("cx", movedRectBBox.x + movedRectBBox.width/2 );
    targetSvg.children[2].setAttribute("cy", movedRectBBox.y + movedRectBBox.height );
    targetSvg.children[3].setAttribute("cx", movedRectBBox.x + movedRectBBox.width );
    targetSvg.children[3].setAttribute("cy", movedRectBBox.y + movedRectBBox.height/2 );
    targetSvg.children[4].setAttribute("cx", movedRectBBox.x );
    targetSvg.children[4].setAttribute("cy", movedRectBBox.y + movedRectBBox.height/2 );
    targetSvg.children[5].setAttribute("cx", movedRectBBox.x );
    targetSvg.children[5].setAttribute("cy", movedRectBBox.y );
    targetSvg.children[6].setAttribute("cx", movedRectBBox.x + movedRectBBox.width );
    targetSvg.children[6].setAttribute("cy", movedRectBBox.y );
    targetSvg.children[7].setAttribute("cx", movedRectBBox.x );
    targetSvg.children[7].setAttribute("cy", movedRectBBox.y + movedRectBBox.height );
    targetSvg.children[8].setAttribute("cx", movedRectBBox.x + movedRectBBox.width );
    targetSvg.children[8].setAttribute("cy", movedRectBBox.y + movedRectBBox.height );
    targetSvg.children[9].setAttribute("cx", movedRectBBox.x + movedRectBBox.width + targetSvg.circleSize * 2 );
    targetSvg.children[9].setAttribute("cy", movedRectBBox.y + targetSvg.circleSize * 3.3);

    targetSvg.children[10].style.transform = "translate(" + ((movedRectBBox.x + movedRectBBox.width) + targetSvg.deleteBtnSize * 3) + "px , "
        + (movedRectBBox.y + targetSvg.deleteBtnSize * 8 ) +"px) scale(" + targetSvg.deleteBtnSize + ")";


}

export { changeSvgPosition }