import { normalPopUpUI } from './normalPopUpUI.js';
import { controlPopUp } from './controlPopUp.js';
import { objects } from './variables.js';

function setFailPopUp(){
   
    failPopUpWrap.innerHTML = normalPopUpUI;
    // style을 display none으로 셋팅해서 getBounding이 안됨
    // const left = rightWrap.getBoundingClientRect().left - reviewPopUpWrap.getBoundingClientRect().width;
    const left = rightWrap.getBoundingClientRect().left - 280;
    failPopUpWrap.style.top = "120px";
    failPopUpWrap.style.left = left + "px";

    const title = failPopUpWrap.querySelector('.title');
    title.children[0].innerText = "Reason For Return";
    const contentWrap = failPopUpWrap.querySelector('.normalContentWrap');
    const div = document.createElement( 'div' );
    const div1 = document.createElement( 'div' );
    div.classList.add('failMessage');
    div.classList.add('modify-scroll');
    div1.classList.add('failNotice');

    div1.innerHTML = `
                        ※ If you return it more than twice, points will not be paid, so please work carefully. <br>
                        ※ You must modify it within 24 hours of return to receive points after approval is completed.
                    `;

    contentWrap.append(div, div1);

    const buttonWrap = failPopUpWrap.querySelector('.buttonWrap');
    buttonWrap.classList.add('single');

    // 하단 버튼 추가
    const button = document.createElement( 'button' );
    button.innerText = "Confirm";
    button.id = "btnFailConfirm";
    buttonWrap.append(button);
 
    controlPopUp(failPopUpWrap);


    button.addEventListener('click', function(e){
        failPopUpWrap.style.display = "none";
    });

}


function changeFailPopUp(pcdTarget){

    // pcd list를 바꾸지 않고 클릭한 아이콘의 팝업만 보여줘야하기 때문에 globalPcdTarget이 아니라 클릭한 아이콘 target를 가지고옴
    const targetPcdIndex = objects.pcds.findIndex((pcd)=>{ return pcd.workTicketId === pcdTarget; });

    const contentWrap = failPopUpWrap.querySelector('.normalContentWrap');

    contentWrap.children[1].style.display = "block";
   
    let failMessage;

    if(objects.pcds[targetPcdIndex].content !== null){
        failMessage = objects.pcds[targetPcdIndex].content;
    }else{
        failMessage = objects.pcds[targetPcdIndex].inspNgMessage;
        contentWrap.children[1].style.display = "none";
    }

    contentWrap.children[0].innerHTML = failMessage;
    

}


export { setFailPopUp ,changeFailPopUp }