
import { normalPopUpUI } from './normalPopUpUI.js';
import { controlPopUp } from './controlPopUp.js';
import { saveData } from './saveData.js';
import { objects, globalData } from './variables.js';


function setReviewPopUp(controlData){
   
    reviewPopUpWrap.innerHTML = normalPopUpUI;
    // style을 display none으로 셋팅해서 getBounding이 안됨
    // const left = rightWrap.getBoundingClientRect().left - reviewPopUpWrap.getBoundingClientRect().width;
   const left = rightWrap.getBoundingClientRect().left - 280;
    reviewPopUpWrap.style.top = "120px";
    reviewPopUpWrap.style.left = left + "px";

    const title = reviewPopUpWrap.querySelector('.title');
    title.children[0].innerText = "Review Detail";
    const contentWrap = reviewPopUpWrap.querySelector('.normalContentWrap');
    const div = document.createElement( 'div' );
    const div1 = document.createElement( 'div' );
    const textarea = document.createElement( 'textarea' );
    textarea.addEventListener('focus', function(e){
        globalData.allowInputEvent = true;
        globalData.inputTextAreaTarget = this;
    });
    textarea.addEventListener('blur', function(e){
        globalData.allowInputEvent = false;
        globalData.inputTextAreaTarget = null;
    });
    div.innerHTML = `
                        File Name : 57585.039376.pcd<br>
                        status : Review Assign<br>
                        Worker/Fall Count: label20<br>
                        Worked Date : 2022-07-18 13:50:23<br>
                        Reviewer: yrin97<br>
                        Reviewed Date: 
                    `;

    div1.innerText = "Reason For Fail";
    div1.className = "subTitle";

    contentWrap.append(div, div1, textarea);

   
    const buttonWrap = reviewPopUpWrap.querySelector('.buttonWrap');

    // 하단 버튼 추가
    const button1 = document.createElement( 'button' );
    const button2 = document.createElement( 'button' );
    button1.innerText = "Pass";
    button2.innerText = "Fail";
    button1.id = "btnPass";
    button2.id = "btnFail";
    buttonWrap.append(button1, button2);

    button1.addEventListener('click',function(e){
        globalData.workProcess = "pass";
        saveData(controlData);
    })
    button2.addEventListener('click',function(e){
        globalData.failData.message = textarea.value;
        controlData("fail");
        textarea.value = "";
    })
 
    changeReviewPopUp();
    controlPopUp(reviewPopUpWrap);
    

}


function changeReviewPopUp(){

    //로드할 pcd가 없는 경우 return
    if(!objects.pcds.length){
        return;
    }

    const targetPcdIndex = objects.pcds.findIndex((pcd)=>{ return pcd.workTicketId === globalData.pcdTarget; });
    const fileName = objects.pcds[targetPcdIndex].originalFileName;
    const status = objects.pcds[targetPcdIndex].status;
    const workedDatetime = objects.pcds[targetPcdIndex].workedDatetime;
    const reviewerId = objects.pcds[targetPcdIndex].reviewerId;
    const annotatorId = objects.pcds[targetPcdIndex].annotatorId;
    const reviewedDatetime = objects.pcds[targetPcdIndex].reviewedDatetime;

    const contentWrap = reviewPopUpWrap.querySelector('.normalContentWrap');

    contentWrap.children[0].innerHTML = `
                        File Name : ${ fileName }<br>
                        status : ${ status }<br>
                        Worked Date :  ${ workedDatetime }<br>
                        Worker:  ${ annotatorId }<br>
                        Reviewer:  ${ reviewerId }<br>
                        Reviewed Date: ${ reviewedDatetime }
                    `;

}


export { setReviewPopUp ,changeReviewPopUp }