
import { objects, globalData } from './variables.js';

function setNotices(sort){

    let text;
    const targetPcdIndex = objects.pcds.findIndex((pcd)=>{ return pcd.workTicketId === globalData.pcdTarget;  });


    switch( sort ) {
        case "copySelectedObjects": case "copyAllObjects":
            text = `
                ${ globalData.notices[sort] } &nbsp; | &nbsp;
                ${ globalData.copiedObjects.cuboides.length } Cuboids  &nbsp; | &nbsp;
                ${ objects.pcds[targetPcdIndex].originalFileName }
            `;
            break;
        case "noObjectsToCopy":
            text = ` ${ globalData.notices[sort] } &nbsp; | &nbsp; ${ objects.pcds[targetPcdIndex].fileName }`;
            break;
        case "noObjectsToSelect":
            text = ` ${ globalData.notices[sort] } &nbsp; | &nbsp; ${ objects.pcds[targetPcdIndex].fileName }`;
            break;
        case "noPcd":
            text = "This Frame does not have a PCD File, try an other frame.";
            break;
        case "lastPcdList":
            text = "This is the last frame list.";
            clearTimeout(globalData.timers.noticeTimer);
            globalData.timers.noticeTimer = setTimeout(()=>{ noticeWrap.classList.remove('on'); },2000);
            break;
        case "firstPcdList":
            text = "This is the first frame list.";
            clearTimeout(globalData.timers.noticeTimer);
            globalData.timers.noticeTimer = setTimeout(()=>{ noticeWrap.classList.remove('on'); },2000);
            break;
    }

    noticeWrap.innerHTML = text;
    noticeWrap.classList.add('on');

    // clearTimeout(globalData.timers.noticeTimer);
    // globalData.timers.noticeTimer = setTimeout(()=>{ noticeWrap.classList.remove('on'); },2000);

}

export { setNotices }