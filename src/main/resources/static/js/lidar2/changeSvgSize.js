
import { setObjectInformation } from "./setObjectInformation.js";
import { svgData } from "./variables.js";

function changeSvgSize(dir){

    const svg = svgData.targetSvg;
    const rect = svgData.targetSvg.children[0];
    let rectBBox = rect.getBBox();
    let move = svgData.svgMove;
    let x = rectBBox.x;
    let y = rectBBox.y;
    let width = rectBBox.width;
    let height = rectBBox.height;

    if(dir === "up"){
        height = height - move.y;
        y = y + move.y;
    }else if(dir === "down"){
        height = height + move.y;
    }else if(dir === "right"){
        width = width + move.x;
    }else if(dir === "left"){
        width = width - move.x;
        x = x + move.x;
    }else if(dir === "upLeft"){
        y = y + move.y;
        x = x + move.x;
        height = height - move.y;
        width = width - move.x;
    }else if(dir === "upRight"){
        y = y + move.y;
        height = height - move.y;
        width = width + move.x;
    }else if(dir === "downLeft"){
        x = x + move.x;
        height = height + move.y;
        width = width - move.x;
    }else if(dir === "downRight"){
        height = height + move.y;
        width = width + move.x;
    }


    if(y < 0) {
        height += y;
        y = 0;
    }
    if(x < 0) {
        width += x;
        x = 0;
    }
    if(x + width > svgData.calcSvgSpace.x) {
        width = svgData.calcSvgSpace.x - x;
    }
    if(y + height > svgData.calcSvgSpace.y) {
        height = svgData.calcSvgSpace.y - y;
    }

    if(width < svgData.targetSvg.rectSize.x){
        width = svgData.targetSvg.rectSize.x;
    }
    if(height < svgData.targetSvg.rectSize.y){
        height = svgData.targetSvg.rectSize.y;
    }

    rect.setAttribute('x', x);
    rect.setAttribute('y', y);
    if(width>0) rect.setAttribute('width', width);
    if(height>0) rect.setAttribute('height', height);

    setObjectInformation(rect.parentNode);


    //rect의 정보가 변경되었기 때문에 다시 업데이트
    rectBBox = rect.getBBox();

    for(let i=1; i<11; i++){
        if(i === 1){
            svg.children[i].setAttribute('cx', rectBBox.x + rectBBox.width/2);
            svg.children[i].setAttribute('cy', rectBBox.y);
        }else if(i === 2){
            svg.children[i].setAttribute('cx', rectBBox.x + rectBBox.width/2);
            svg.children[i].setAttribute('cy', rectBBox.y + rectBBox.height);
        }else if(i === 3){
            svg.children[i].setAttribute('cx', rectBBox.x + rectBBox.width);
            svg.children[i].setAttribute('cy', rectBBox.y + rectBBox.height/2);
        }else if(i === 4){
            svg.children[i].setAttribute('cx', rectBBox.x);
            svg.children[i].setAttribute('cy', rectBBox.y + rectBBox.height/2);
        }else if(i === 5){
            svg.children[i].setAttribute('cx', rectBBox.x);
            svg.children[i].setAttribute('cy', rectBBox.y);
        }else if(i === 6){
            svg.children[i].setAttribute('cx', rectBBox.x + rectBBox.width);
            svg.children[i].setAttribute('cy', rectBBox.y);
        }else if(i === 7){
            svg.children[i].setAttribute('cx', rectBBox.x);
            svg.children[i].setAttribute('cy', rectBBox.y + rectBBox.height);
        }else if(i === 8){
            svg.children[i].setAttribute('cx', rectBBox.x + rectBBox.width);
            svg.children[i].setAttribute('cy', rectBBox.y + rectBBox.height);
        }else if(i === 9){
            svg.children[i].setAttribute("cx", rectBBox.x + rectBBox.width + svgData.targetSvg.circleSize*2);
            svg.children[i].setAttribute("cy", rectBBox.y + svgData.targetSvg.circleSize * 3.3);
        }else if(i === 10){
            svg.children[i].style.transform = "translate(" + ((rectBBox.x + rectBBox.width) + svgData.targetSvg.deleteBtnSize*3) + "px , "
                + (rectBBox.y + svgData.targetSvg.deleteBtnSize * 8) +"px)  scale(" + svgData.targetSvg.deleteBtnSize + ")";
        }
    }

}

export { changeSvgSize }