
import { init } from './init.js';
import { resetPcdFileList } from './resetPcdFileList.js';
import { removeAllObjects } from './removeAllObjects.js';
import { resetMultiSelect } from './setObjectMultiSelect.js';
import { objects, globalData } from './variables.js';


function makePcdData(datas, controlData){

    // save, giveUp, complete, pass, fail, ng, ok 모든 이벤트는 pcd list를 서버에서 다시 받아야함
    // 그래서 makePcdData를 할때마다 기존의 큐브데이터, svg 데이터, 큐브리스트등을 다 지워야함
    // 그런데 task에 해당하는 정보(tag list, class)등 은 pcd 데이터를 받아오더라도 바뀌지 않기때문에 구분이 필요함
    // 그리고 pcd간의 이동때는 pcd list를 따로 서버에서 받아오지 않지만 화면에서 큐브데이터 등을 삭제해야함
    // 따라서 globalData.isResetPcdFileList 을 선언하여 true일때 removeAllObjects 함수에서 지워야 할것이랑 지우지 말아야할것들을 정함
    if(!globalData.isPageStart){
        globalData.isResetPcdFileList = true;
        removeAllObjects();
    }

    datas.forEach((file, index)=> {

        objects.pcds[index] = {};
        objects.pcds[index].PcdModel = null;
        objects.pcds[index].rgbImages = [];
        objects.pcds[index].fileName = file.rawFileName;
        objects.pcds[index].path = file.rawFilePath;
        objects.pcds[index].workTicketId = file.workTicketId;
        objects.pcds[index].rawFileId = file.rawFileId;
        objects.pcds[index].projectId = file.projectId;
        objects.pcds[index].taskId = file.taskId;
        objects.pcds[index].originalFileName = file.originalFileName;
        objects.pcds[index].tagList = [];
        objects.pcds[index].status = file.status;
        objects.pcds[index].statusReview = file.statusReview;
        // objects.pcds[index].statusInsp = file.statusInspect;
        objects.pcds[index].workedDatetime = file.workedDatetime;
        objects.pcds[index].annotatorId = file.annotatorId;
        objects.pcds[index].reviewerId = file.reviewerId;
        objects.pcds[index].reviewedDatetime = file.reviewedDatetime;
        // objects.pcds[index].inspectorId = file.inspectorId;
        // objects.pcds[index].inspDatetime = file.inspectedDatetime;
        objects.pcds[index].content = file.reviewMessage;
        // objects.pcds[index].inspNgMessage = file.inspectMessage;
        objects.pcds[index].currentDatetime = file.currentDatetime;
        objects.pcds[index].updateDatetime = file.updateDatetime;

        // rgb이미지를 load manager에 적용하기 위해서 이미지 파일을 로드한 다음 loadedImage에 저장함
        // load한 images를 기반으로 계산된 svg data를 loadedData에 삽입
        // viewerScale - 현재 view1의 크기
        // imageScale  - 로드된 이미지의 원래 크기
        // calcScale   - 원래 이미지 크기를 줄이거나 키웠을때 svgWrap크기
        // calcRate    - svg 이동 및 크기조절 비율

        if (file.cameraImageList !== null){
            file.cameraImageList.forEach((file1, index1) => {
                objects.pcds[index].rgbImages[index1] = {};
                objects.pcds[index].rgbImages[index1].camId = file1.camId;
                objects.pcds[index].rgbImages[index1].fileName = file1.rawFileName;
                objects.pcds[index].rgbImages[index1].path = file1.rawFilePath;
                objects.pcds[index].rgbImages[index1].loadedImage = null;
                objects.pcds[index].rgbImages[index1].loadedData = null;
            });
        }
    });



    // load된 pcd tag들을 pcd의 tagList에 할당함
    // 각 pcd의 tagList는 pcd의 tag값이 변경될때마다 tag을 저장하기 위해서 필요함
    // 각 cuboide의 tagList는 cuboide가 생성되고 난뒤에 할당 할 수 있으므로 cuboide.js에서 생성함
    objects.tags.forEach((list) => {
        if (list.tagTypeCd === "IMG") {
            objects.pcds.forEach((pcd) => {
                const tag = {};
                tag.tagId = list.tagId;
                tag.name = list.name;
                tag.tagTypeCd = list.tagTypeCd;
                tag.tagValTypeCd = list.tagValTypeCd;
                pcd.tagList.push(tag);
            });
        }
    });


    if(globalData.isPageStart){
        init(controlData);
    }else{
        resetPcdFileList(controlData);
    }

    resetMultiSelect();
}

export { makePcdData }