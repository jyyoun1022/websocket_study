

// 첨에 모든 pcd에 lock icon 값을 적용해야 하기 때문에 targetUUID를 두어 분기한다

// global 버전
// CORP_WORKER("compWorker", "Company Worker")
// CROWD_WORKER("crowdWorker", "Crowd Worker")
// CORP_REVIEWER("compReviewer", "Reviewer")
// INSPECTOR("inspector", "Inspector")
// MANAGER("manager", "Manager")
// MASTER("master", "Master")

// 고도화버전
// CORP_WORKER("compWorker", "Company Worker")
// CROWD_WORKER("crowdWorker", "Crowd Worker")
// CORP_REVIEWER("reviewer", "Reviewer")
// INSPECTOR("inspector", "Inspector")
// MANAGER("manager", "Manager")
// MASTER("master", "Master")


// permission이 "worker"일때
// search 사용 불가능
// status:"assigned"                                         : 작업자가 작업 할 수 있는 상태 (수정 가능)
// status:"worked"                                           : 작업자가 complete 버튼을 눌러서 작업을 완료한 상태 (수정 불가능)
// status:"reviewed", statusReview:"pass"                    : reviewer가 confirm한 작업물을 확인할 수 있는 상태 (수정 불가능)
// status:"reviewed", statusReview:"fail"                    : reviewer가 confirm한 작업물을 확인할 수 있는 상태 (수정 가능)
// status:"rvassigned"                                       : 작업자가 완료한 상태 (수정 불가능)
// status:"reviewed", statusReview:"pass", statusInsp:"OK"   : 작업자가 완료한 상태 (수정 불가능)
// status:"reviewed", statusReview:"pass", statusInsp:"NG"   : 작업자가 완료한 상태 (수정 불가능)


// permission이 "reviewer"일때
// search 사용이 가능
// option ["All","Review Assign", "Review Pass", "Review Fail", "Inspected", "Inspection OK", "Inspection NG"]
// "pass 버튼", "all pass 버튼", "fail 버튼", "save 버튼" 존재
// status:"rvassigned"                                       : reviewer가 "pass", "fail"을 확인할 수 있는 상태 | "pass 버튼", "all pass 버튼", "fail 버튼"만 노출 | save기능은 "pass 버튼" (수정 가능)
// status:"reviewed", statusReview:"pass"                    : reviewer가 "pass"를 한 상태  | "save 버튼"만 노출 | save기능은 "수정 버튼" (수정 가능)
// status:"reviewed", statusReview:"fail"                    : reviewer가 "fail"을 한 상태 | 모든 버튼 비노출 | (수정 불가능)
// status:"reviewed", statusReview:"pass", statusInsp:"OK"   : inspector가 "OK"를 한 상태 | "save 버튼"만 노출 | save기능은 "수정 버튼" (수정 가능)
// status:"reviewed", statusReview:"pass", statusInsp:"NG"   : inspector가 "NG"를 한 상태 | "save 버튼"만 노출 | save기능은 "수정 버튼" (수정 가능)



// permission이 "inspector"일때
// search 사용이 가능
// option ["All","Review Pass", "Inspected", "Inspection OK", "Inspection NG"]
// "OK 버튼", "all OK 버튼", "NG 버튼", "save 버튼" 존재
// status:"reviewed", statusReview:"pass"                    : inspector가 "NG", "OK"를 확인할 수 있는 상태 | "NG 버튼", "OK 버튼", "all OK 버튼", "save 버튼" 노출 |  save기능은 "수정 버튼" (수정 가능)
// status:"reviewed", statusReview:"pass", statusInsp:"OK"   : inspector가 "OK"를 한 상태 | "save 버튼"만 노출 | save기능은 "수정 버튼" (수정 가능)
// status:"reviewed", statusReview:"pass", statusInsp:"NG"   : inspector가 "NG"를 한 상태 | "save 버튼"만 노출 | save기능은 "수정 버튼" (수정 가능)



// permission이 "MANAGER, MASTER"일때 
// search 사용이 가능하며 option값은 ["All", "Open", "Assign", "worked", "Review Assign", "Review Pass", "Review Fail", "Inspected", "Inspection OK", "Inspection NG"]
// "save 버튼" 존재
// "pass 버튼", "all pass 버튼", "fail 버튼", "OK 버튼", "all OK 버튼", "NG 버튼" 비존재
// status:"open"                                             : 모든 버튼 비노출 | (수정 불가)
// status:"assigned"                                         : 모든 버튼 비노출 | (수정 불가)
// status:"worked"                                           : 모든 버튼 비노출 | (수정 불가)
// status:"rvassigned"                                       : 모든 버튼 비노출 | (수정 불가)
// status:"reviewed", statusReview:"pass"                    : 모든 버튼 비노출 | (수정 불가)
// status:"reviewed", statusReview:"fail"                    : 모든 버튼 비노출 | (수정 불가)
// status:"reviewed", statusReview:"pass", statusInsp:"OK"   : "save 버튼"만 노출 | (수정 가능)
// status:"reviewed", statusReview:"pass", statusInsp:"NG"   : "save 버튼"만 노출 | (수정 가능)


// worker
// assign : 열린 노란 자물쇠
// worked : 닫힌 회색 자물쇠
// rvassigned : 닫힌 노란 자물쇠
// pass : 닫힌 민트 자물쇠
// fail : 열린 빨간 자물쇠
// OK : 열린 파란색 자물쇠
// NG : 열린 주황색 자물쇠


// reviewer
// open : 닫힌 흰색 자물쇠
// rvassigned : 열린 노란 자물쇠
// pass : 열린 민트 자물쇠
// fail : 닫힌 빨간 자물쇠
// OK : 열린 파란색 자물쇠
// NG : 열린 주황색 자물쇠


// inspector
// pass : 열린 노란 자물쇠
// OK : 열린 파란색 자물쇠
// NG : 열린 주황색 자물쇠


// master, manager
// open : 닫힌 흰색 자물쇠
// assign : 닫힌 회색 자물쇠
// worked : 닫힌 회색 자물쇠
// rvassigned : 닫힌 노란 자물쇠
// pass : 닫힌 민트 자물쇠
// fail : 닫힌 빨간 자물쇠
// ok : 열린 파란색 자물쇠
// ng : 열린 주황색 자물쇠



// pcd가 바뀔때마다 실행됨


import { changeReviewPopUp }  from './setReviewPopUp.js';
import { changeInspectPopUp } from "./setInspectPopUp.js";
import { changeMasterPopUp } from "./setMasterPopUp.js";
import { objects, globalData } from './variables.js';


function setPermission(pcdUUID){

    let targetFrameIndex, targetUUID;

    if(pcdUUID === undefined){
        targetUUID = globalData.pcdTarget;
    }else {
        targetUUID = pcdUUID;
    }
   
    const targetPcdIndex = objects.pcds.findIndex((pcd)=>{ return pcd.workTicketId === targetUUID; });
    const reviewButtonWrap = reviewPopUpWrap.querySelector('.buttonWrap');
    const inspectButtonWrap = inspectPopUpWrap.querySelector('.buttonWrap');
    const user = globalData.permissionCode;
    const status = objects.pcds[targetPcdIndex].status;
    const review = objects.pcds[targetPcdIndex].statusReview;
    const inspect = objects.pcds[targetPcdIndex].statusInsp;

    for(let i=0 ; i<frameWrap.children.length ; i++){
        if(frameWrap.children[i].pcdUUID === targetUUID){
            targetFrameIndex = i;
            break;
        }
    }
    const lockIcon = frameWrap.children[targetFrameIndex].children[2].children[0];
    const failIcon = frameWrap.children[targetFrameIndex].children[1].children[0];

    // changeReviewPopUp();


    function setSelectInputStatus(){   
        for(let i=0 ; i<frameTagWrap.children.length ; i++){
            const select = frameTagWrap.children[i].children[2].children[0];
            select.disabled = !globalData.allowAllEvents;
        }
        for(let i=0 ; i<objectTagWrap.children.length ; i++){
            const select = objectTagWrap.children[i].children[2].children[0];
            select.disabled = !globalData.allowAllEvents;
        }
        // for(let i=1 ; i<objectWrap.children.length ; i++){
        //     const input = objectWrap.children[i].children[0].children[0];
        //     input.disabled = !globalData.allowAllEvents;
        // }
    }


    // workerBtnWrap      : 우측 하단 user가 작업자일때 나오는 버튼들 (save, givup, complete)
    // noneWorkerBtnWrap  : 우측 하단 user가 작업자가 아닐때 나오는 버튼들 (get more pcds, modify, all pass , all ok)
    // reviewButtonWrap   : review popup 안의 pass, fail, ok, ng 버튼들

    function workerPermission(){

        workerBtnWrap.style.display = "block";
        noneWorkerBtnWrap.style.display = "none";
        failIcon.style.display = "none";

        if(status === "assigned"){

            globalData.allowAllEvents = true;
            lockIcon.innerText = "lock_open";
            lockIcon.style.color = "#FFE400";
            lockIcon.title = "assigned";

        }else if(status === "worked"){

            globalData.allowAllEvents = false;
            workerBtnWrap.style.display = "none";
            lockIcon.innerText = "lock";
            lockIcon.style.color = "#767676";
            lockIcon.title = "worked";

        }else if(status === "reviewed"){

            if(review === "pass"){

                globalData.allowAllEvents = false;
                workerBtnWrap.style.display = "none";
                lockIcon.innerText = "lock";
                lockIcon.style.color = "#00F0FF";
                lockIcon.title = "reviewed pass";

                if(inspect === "OK"){
                    lockIcon.style.color = "#0078FF";
                    lockIcon.title = "inspection OK";

                }else  if(inspect === "NG"){
                    lockIcon.style.color = "#FF7800";
                    lockIcon.title = "inspection NG";
                }

            }else if( review === "fail"){

                globalData.allowAllEvents = true;
                lockIcon.innerText = "lock_open";
                lockIcon.style.color = "#FF0000";
                lockIcon.title = "reviewed fail";
                failIcon.style.display = "block";
            }
        }else if(status === "rvassigned"){

            globalData.allowAllEvents = false;
            workerBtnWrap.style.display = "none";
            lockIcon.innerText = "lock";
            lockIcon.style.color = "#FFE400";
            lockIcon.title = "review assigned";

        }
        setSelectInputStatus();
    }


    function reviewerPermission(){


        workerBtnWrap.style.display = "none";
        noneWorkerBtnWrap.style.display = "block";
        // button 단독으로 display block시 이상한 위치에 생김
        btnAllOK.style.display = "none";
        btnModify.style.visibility = "visible";
        reviewButtonWrap.style.display = "block";
        failIcon.style.display = "none";
        if(!objects.taskInfo.isSegmentation){
            btnAllPass.style.visibility = "visible";
        }else{
            btnAllPass.style.visibility = "hidden";
        }

        if(status === "rvassigned"){

            btnModify.style.visibility = "hidden";
            globalData.allowAllEvents = true;
            lockIcon.innerText = "lock_open";
            lockIcon.style.color = "#FFE400";
            lockIcon.title = "review assigned";

        }else if(status === "reviewed"){

            reviewButtonWrap.style.display = "none";
            btnAllPass.style.visibility = "hidden";

            if(review === "pass"){

                globalData.allowAllEvents = true;
                lockIcon.innerText = "lock_open";
                lockIcon.style.color = "#00F0FF";
                lockIcon.title = "reviewed pass";

                if(inspect === "OK"){

                globalData.allowAllEvents = true;
                lockIcon.innerText = "lock_open";
                lockIcon.style.color = "#0078FF";
                lockIcon.title = "inspection OK";

                }else if(inspect === "NG"){

                    globalData.allowAllEvents = true;
                    lockIcon.innerText = "lock_open";
                    lockIcon.style.color = "#FF7800";
                    lockIcon.title = "inspection NG";
                    failIcon.style.display = "block";

                }

            }else if( review === "fail"){

                btnModify.style.visibility = "hidden";
                globalData.allowAllEvents = false;
                lockIcon.innerText = "lock";
                lockIcon.style.color = "#FF0000";
                lockIcon.title = "reviewed fail";
                failIcon.style.display = "block";
            }
        }
        changeReviewPopUp();
        setSelectInputStatus();
    }


    function inspectorPermission(){

        workerBtnWrap.style.display = "none";
        noneWorkerBtnWrap.style.display = "block";
        // button 단독으로 display block시 이상한 위치에 생김
        btnAllPass.style.display = "none";
        btnAllOK.style.visibility = "visible";
        btnModify.style.visibility = "visible";
        inspectButtonWrap.style.display = "block";
        failIcon.style.display = "none";

        if(status === "reviewed"){

            if(review === "pass"){

                globalData.allowAllEvents = true;
                lockIcon.innerText = "lock_open";
                lockIcon.style.color = "#FFE400";
                lockIcon.title = "inspect assign";

                if(inspect === "OK"){

                    inspectButtonWrap.style.display = "none";
                    btnAllOK.style.visibility = "hidden";
                    globalData.allowAllEvents = true;
                    lockIcon.innerText = "lock_open";
                    lockIcon.style.color = "#0078FF";
                    lockIcon.title = "inspection OK";

                }else  if(inspect === "NG"){

                    inspectButtonWrap.style.display = "none";
                    btnAllOK.style.visibility = "hidden";
                    globalData.allowAllEvents = true;
                    lockIcon.innerText = "lock_open";
                    lockIcon.style.color = "#FF7800";
                    lockIcon.title = "inspection NG";
                    failIcon.style.display = "block";

                }

            }
        }
        changeInspectPopUp();
        setSelectInputStatus();
    }



    function masterPermission(){

        workerBtnWrap.style.display = "none";
        noneWorkerBtnWrap.style.display = "block";
        btnMorePcds.style.visibility = "hidden";
        btnAllPass.style.visibility = "hidden";
        btnAllOK.style.visibility = "hidden";
        btnModify.style.visibility = "hidden";
        failIcon.style.display = "none";
        reviewButtonWrap.style.display = "none";

        if(status === "open"){

            globalData.allowAllEvents = false;
            lockIcon.innerText = "lock";
            lockIcon.style.color = "#FFFFFF";
            lockIcon.title = "open";

        }else if(status === "assigned"){

            globalData.allowAllEvents = false;
            lockIcon.innerText = "lock";
            lockIcon.style.color = "#767676";
            lockIcon.title = "assign";
        
        }else if(status === "worked"){

            globalData.allowAllEvents = false;
            lockIcon.innerText = "lock";
            lockIcon.style.color = "#767676";
            lockIcon.title = "worked";

        }else if(status === "rvassigned"){

            globalData.allowAllEvents = false;
            lockIcon.innerText = "lock";
            lockIcon.style.color = "#FFE400";
            lockIcon.title = "review assign";

        }else if(status === "reviewed"){
            if(review === "pass"){

                globalData.allowAllEvents = false;
                lockIcon.innerText = "lock";
                lockIcon.style.color = "#00F0FF";
                lockIcon.title = "reviewed pass";

                if(inspect === "OK"){

                    globalData.allowAllEvents = true;
                    lockIcon.innerText = "lock_open";
                    lockIcon.style.color = "#0078FF";
                    lockIcon.title = "inspection OK";
                    btnModify.style.visibility = "visible";

                }else if(inspect === "NG"){

                    globalData.allowAllEvents = true;
                    lockIcon.innerText = "lock_open";
                    lockIcon.style.color = "#FF7800";
                    lockIcon.title = "inspection NG";
                    failIcon.style.display = "block";
                    btnModify.style.visibility = "visible";
                }

            }else if( review === "fail"){

                globalData.allowAllEvents = false;
                lockIcon.innerText = "lock";
                lockIcon.style.color = "#FF0000";
                lockIcon.title = "reviewed fail";
                failIcon.style.display = "block";
            }
        }
        changeMasterPopUp();
        setSelectInputStatus();
    }


    switch(user){

        // case "compWorker":
        //     workerPermission();
        //     break;
        //
        // case "crowdWorker":
        //     workerPermission();
        //     break;

        // case "compReviewer":
        //     reviewerPermission();
        //     break;

        case "reviewer":
            reviewerPermission();
            break;

        case "inspector":
            inspectorPermission();
            break;
        
        // case "manager":
        //     masterPermission();
        //     break;

        case "master":
            masterPermission();
            break;
    }

}

function initPermission(){

    //TODO: 테스트 필요

    // if(globalData.permissionCode === "compWorker"){
    //
    //     // 왼쪽 검색 및 리뷰 아이콘 버튼 안보게함
    //     btnSearchPcd.style.display = "none";
    //     btnReview.style.display = "none";
    //
    // }else if(globalData.permissionCode === "inspector"){
    //
    //     // reviewer 팝업 버튼 inspector용으로 변경
    //     // const reviewButtonWrap = reviewPopUpWrap.querySelector('.buttonWrap');
    //     // const button1 = reviewButtonWrap.children[0];
    //     // const button2 = reviewButtonWrap.children[1];
    //     // button1.innerText = "OK";
    //     // button2.innerText = "NG";
    //     // button1.id = "btnOK";
    //     // button2.id = "btnNG";
    // }


    //좌측 상단 유저 등급 표시
    //userWrap.innerText = `[ ${ globalData.permissionName } ]`;
    
}






export { setPermission, initPermission }