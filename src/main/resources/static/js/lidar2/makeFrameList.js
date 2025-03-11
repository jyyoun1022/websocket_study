
import { loadAssets } from './loadAssets.js';
import { removeAllObjects } from './removeAllObjects.js';
import { setPermission } from './setPermission.js';
import { changeFailPopUp } from './setFailPopUp.js';
import { resetMultiSelect } from './setObjectMultiSelect.js';
import {globalData, objects} from './variables.js';


function makeFrameList(pcd, controlData){
    
    const ul = document.createElement( 'ul' );
    const li1 = document.createElement( 'li' );
    const li2 = document.createElement( 'li' );
    const li3 = document.createElement( 'li' );
    const timeText = elapsedText(pcd);

    ul.className = "frameList";
    ul.pcdUUID =  pcd.workTicketId;
    li1.innerHTML = `<p title='${ pcd.originalFileName }'>${ pcd.originalFileName }</p> <span>${ timeText }</span>`;
    li2.innerHTML = `<a class='material-icons-outlined'>announcement</a>`;
    li3.innerHTML = "<a class='material-icons'>lock</a>";

    for(let i=0 ; i<frameWrap.children.length ; i++){
        frameWrap.children[i].classList.remove("on");
    }

    function elapsedText(pcd) {
        const seconds = 1;
        const minute = seconds * 60;
        const hour = minute * 60;
        const day = hour * 24;
        const month = day * 30;
        // pcd.currentDatetime = "2023-05-01 00:00:00.0";
        // pcd.updateDatetime = "2023-03-21 00:00:00.0";
        const currentTime = new Date(pcd.currentDatetime);
        const updateTime = new Date(pcd.updateDatetime);

        const elapsedTime = Math.trunc((currentTime.getTime() - updateTime.getTime()) / 1000);

        let elapsedText = "";
        if (elapsedTime < seconds) {
            elapsedText = "just before";
        } else if (elapsedTime < minute) {
            elapsedText = elapsedTime + " seconds ago";
        } else if (elapsedTime < hour) {
            elapsedText = Math.trunc(elapsedTime / minute) + " minutes ago";
        } else if (elapsedTime < day) {
            elapsedText = Math.trunc(elapsedTime / hour) + " hours ago";
        } else if (elapsedTime < month) {
            elapsedText = Math.trunc(elapsedTime / day) + " days ago";
        } else {
            elapsedText = Math.trunc(elapsedTime / month) + " months ago";
        }
        return elapsedText;
    }
  

    li1.addEventListener('click', function(e){

        if(globalData.pcdTarget !== pcd.workTicketId){

            for(let i=0 ; i<frameWrap.children.length ; i++){
                frameWrap.children[i].classList.remove("on");
            }

            this.parentElement.classList.add("on");



            globalData.pcdTarget = pcd.workTicketId;
            resetMultiSelect();
            removeAllObjects();
            setPermission();
            changeFailPopUp(globalData.pcdTarget);
            loadAssets(controlData);

        }
       
    });

    li2.addEventListener('click', function(e){

        const display = failPopUpWrap.style.display;
        const tempPcdTarget = pcd.workTicketId;

        if(display === "" || display === "none"){
            failPopUpWrap.style.display = "block";
        }

        changeFailPopUp(tempPcdTarget);
    });

    ul.append(li1, li2, li3);

    // pcd list에서 pcd 변경은 기존 큐보이드와 svg를 제거하고 
    // loadAssets를 통해서 선택한 pcd와 image를 로딩하고 배치함


    return ul;

}



export { makeFrameList }