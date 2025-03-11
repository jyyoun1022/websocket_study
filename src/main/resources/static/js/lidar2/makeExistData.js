
import { setExistObjects } from './setExistObjects.js';
import { setPermission, initPermission } from './setPermission.js';
import { settingDefault } from './setSettings.js';
import { objects, globalData } from './variables.js';

function makeExistData(datas){
    objects.existData.projectId = datas.data.projectId;
    objects.existData.taskId = datas.data.taskId;
    objects.existData.workTicketId = datas.data.workTicketId;
    //objects.existData.objectList = datas.data.objectList;
    objects.existData.tagList = datas.data.tagList;
    objects.existData.objectList = [];

    // 고도화에서는 objectList가 null값으로 들어오는 경우가 있음
    // if(datas.data.objectList === null){
    //     objects.existData.objectList = [];
    // }


    // objectOrder 순서대로 objectList 배열을 재정렬함
    // objectOrder가 저장되어 있지 않은 기존데이터는 0으로 들어오기에 처리해야함
    // objectOrder가 제대로 저장안되는 경우도 처리해야함
    if(datas.data.objectList !== null){

        const tempObjectList = [...datas.data.objectList];

        for(let i=0 ; i<tempObjectList.length ; i++){
            for(let j=0 ; j<tempObjectList.length ; j++){
                const seq = Number(tempObjectList[j].objectOrder);
                if(isNaN(seq)){
                    i = tempObjectList.length;
                    objects.existData.objectList = [...datas.data.objectList];
                    break;
                }else if(seq === 0){
                    i = tempObjectList.length;
                    objects.existData.objectList = [...datas.data.objectList];
                    break;
                }else{
                    if((i+1) === seq){
                        objects.existData.objectList.push(tempObjectList[j]);
                        break;
                    }
                }
            }
        }
    }

    setExistObjects();


    // 전체 pcd permisson 셋팅
    for(let i=0; i<objects.pcds.length ; i++){
        const pcdUUID =  objects.pcds[i].workTicketId;
        setPermission(pcdUUID);
    }
    // 선택한 pcd permisson 셋팅
    setPermission();
    initPermission();

    const setttings = [
        "centerPointVisible", "labelsVisible", "ObejctSphereVisible", "PCDVisible", "PCDCounter", "PCDColor",
        "wireframeVisible", "wireframeColor", "frontCuboidVisible", "frontCuboidColor", "OPLCounter", "SRCounter",
        "MRCounter", "RRCounter", "SMRCounter", "planeVisible", "planeShape", "PPCounter", "PSCounter", "planeColor",
        "IBCounter", "ICCounter", "ROCounter", "CLWCounter", "RLWCounter", "RCSCounter", "PcdOriginColor",
    ];


    setttings.forEach((list)=> {
        settingDefault(list, "cookie");
    });


    globalData.isPageStart = false;
    globalData.isChangePcdList = true;


}

export { makeExistData }