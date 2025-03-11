import { globalData, objects, svgData } from "./variables.js";

function controlAreaRect(sort){

    const targetPcd = objects.pcds.findIndex((pcd)=>{ return pcd.workTicketId === globalData.pcdTarget; });
    const targetRGB = objects.pcds[targetPcd].rgbImages.findIndex((rgb)=>{ return rgb.camId === globalData.rgbCameraTarget; });
    const loadedData = objects.pcds[targetPcd].rgbImages[targetRGB].loadedData;
    globalData.selectedSvgs = [];

    if(sort === "make"){

        svgData.areaRect.rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        svgData.areaRect.rect.classList.add("areaRect");
        svgData.areaRect.rect.setAttribute("name", "areaRect");
        svgData.areaRect.rect.setAttribute("width", 1);
        svgData.areaRect.rect.setAttribute("height", 1);
        svgData.areaRect.rect.setAttribute('x', svgData.areaRect.startPosition.x);
        svgData.areaRect.rect.setAttribute('y', svgData.areaRect.startPosition.y);
        svgSpace.appendChild(svgData.areaRect.rect);

    }else if(sort === "delete"){

        for(let i=0; i<svgSpace.children.length ; i++){
            const targetName = svgSpace.children[i].getAttribute("name");
            if(targetName === "areaRect"){
                const rect = svgSpace.children[i];
                svgSpace.removeChild(rect);
                svgData.areaRect.rect = null;
                break;
            }
        }
        const width = svgData.areaRect.endPosition.x - svgData.areaRect.startPosition.x;
        const height = svgData.areaRect.endPosition.y - svgData.areaRect.startPosition.y;

        const range = svgSpace.createSVGRect();
        range.x = svgData.areaRect.startPosition.x / (loadedData.calcRate / svgData.zoomCurrent);
        range.y = svgData.areaRect.startPosition.y / (loadedData.calcRate / svgData.zoomCurrent);
        range.width = width / (loadedData.calcRate / svgData.zoomCurrent);
        range.height = height / (loadedData.calcRate / svgData.zoomCurrent);
        const svgList = svgSpace.getIntersectionList(range, null);

        for(let i=0 ; i<svgList.length ; i++){
            if(svgList[i].getAttribute("name") === "rect"){
                if(svgList[i].parentNode.style.visibility === "visible"){
                    globalData.selectedSvgs.push(svgList[i].parentNode);
                }
            }
        }

        for(let i=0 ; i<objects.svgs.length ; i++){
            const rect = objects.svgs[i].children[0];
            rect.classList.remove("alphaAnimation");
        }

        for(let i=0 ; i<globalData.selectedSvgs.length ; i++){
            const rect = globalData.selectedSvgs[i].children[0];
            rect.classList.add("alphaAnimation");
        }

    }else if(sort === "move"){

        const width = svgData.areaRect.endPosition.x - svgData.areaRect.startPosition.x;
        const height = svgData.areaRect.endPosition.y - svgData.areaRect.startPosition.y;
        if(width>0) svgData.areaRect.rect.setAttribute('width',  width);
        if(height>0) svgData.areaRect.rect.setAttribute('height',  height);

    }

}

export { controlAreaRect }