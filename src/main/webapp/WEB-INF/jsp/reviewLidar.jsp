\\<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@taglib prefix="aistudio" uri="/WEB-INF/taglibs/aistudio.tld" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@taglib uri="/WEB-INF/taglibs/aistudio.tld" prefix="aistudio" %>
<aistudio:setPageEnveriment />
<c:set var="nowD" value="<%=new java.util.Date()%>" />
<c:set var="now"><fmt:formatDate value="${nowD}" pattern="yyyyMMddHHmmss" /></c:set>
<html>
<head>
    <title>AI-STUDIO - 3D Annotation</title>
    <meta name="_csrf" content="${_csrf.token}"/>
    <meta name="_csrf_header" content="${_csrf.headerName}"/>
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons|Material+Icons+Outlined|Material+Icons+Outlined|Material+Icons+Round|Material+Icons+Sharp">
    <link rel="stylesheet" type="text/css" href="${staticPrefix}/css/tool/lidar2/jquery-ui.min.css"/>
    <link rel="stylesheet" type="text/css" href="${staticPrefix}/css/tool/reviewLidar/reviewLidar_style.css"/>
    <script src="${staticPrefix}/lib/jquery/jquery-3.6.0.min.js"></script>
    <script src="${staticPrefix}/js/tool/lidar2/lib/jquery-ui.min.js"></script>
    <script src="${staticPrefix}/js/tool/moment.min.js"></script>
    <script src="${staticPrefix}/js/tool/common.js"></script>
    <script src="${staticPrefix}/js/tool/log.js"></script>
    <script src="${staticPrefix}/js/tool/render_3d.js"></script>
    <script src="${staticPrefix}/js/tool/reviewLidar/lib/localForage.js"></script>
    <script type="module" src="${staticPrefix}/js/tool/pre_loader_lidar_tool.js"></script>
    <script type="module">
        let page = {};
        page.constants = {};
        page.constants.staticServer = "${staticPrefix}";
        page.constants.hotkeyType = {
            defaultKey: "default"
            , tagForImage: "tagForImage"
            , classesForImage: "classesForImage"
            , tagForObject: "tagForObject"
            , tagForPoint: "tagForPoint"
            , classesForObject: "classesForObject"
        }
        page.constants.workType = {
            annotator: "worker"
            , reviewer: "reviewer"
            // , inspector: "inspector"
            // , manager: "inspector"
            // , owner: "owner"
            , master : "master"
            , demo : "demo"
            // , co : "co"
        }

        page.data = {};

        page.param = {};
        page.param.token = "${token}";
        page.param.projectId = "${param.projectId}";
        page.param.taskId = "${param.taskId}";
        page.param.reqType = "${param.reqType}"; //_common.nvl(data.param.reqType, "worker");
        page.param.pageNum = _common.nvl("${param.pageNum}", 1); //
        page.constants.env = "${activeProfile}";
        page.param.workTicketId = _common.nvl("${param.workTicketId}", "");

        page.data.task = {};
        page.data.task.taskInfo = {};
        page.data.task.taskInfo.guideTitle = "<spring:message code="label.tool.image.ann.toolTipTitle" />";
        // html코드가 들어오는 곳은 역슬래쉬로 string처리 해야함
        <%--page.data.task.taskInfo.taskDesc = "<c:out value="${ taskInfo.taskDesc }" />";--%>
        page.data.task.taskInfo.downloadFile = "<spring:message code="label.tool.image.ann.guide.downloadFile" />";
        page.data.task.taskInfo.downloadGuide = "<spring:message code="button.tool.image.ann.downloadGuide" />";
        // page.data.task.taskInfo.isSegmentation = true; //true=Seg처리 함/false=Seg처리 안함



        page.data.paging = {
            totalCount : 0
        };



        page.message = {
            confirmAllDeleteObject  : '<spring:message code="message.tool.image.ann.confirmAllDeleteObject" />'
            , allDeleteObject       : '<spring:message code="message.tool.image.ann.allDeleteObject" />'
            , oneDeleteObject       : '<spring:message code="message.tool.image.ann.oneDeleteObject" />'
            , initImage             : '<spring:message code="label.tool.lidar.initImage" />'
            , noHaveHistory         : '<spring:message code="message.tool.image.ann.noHaveHistory" />'
            , isInvalidEdit         : '<spring:message code="message.tool.image.ann.isInvalidEdit" />'
            , failOfLoadImages      : '<spring:message code="label.tool.lidar.failOfLoadImages" />'
            , imageIconTitleValid   : '<spring:message code="message.tool.image.ann.imageIconTitleValid" />'
            , imageIconTitleInValid : '<spring:message code="message.tool.image.ann.imageIconTitleInValid" />'
            , statusNameWorking     : '<spring:message code="message.tool.image.ann.statusNameWorking" />'
            , statusNameReviewedFail: '<spring:message code="message.tool.image.ann.statusNameReviewedFail" />'
            , statusNameReviewedPass: '<spring:message code="message.tool.image.ann.statusNameReviewedPass" />'
            <%--, statusNameReviewedOK  : '<spring:message code="label.tool.status.inspection.ok" />'--%>
            <%--, statusNameReviewedNG  : '<spring:message code="label.tool.status.inspection.ng" />'--%>
            , statusNameWorked      : '<spring:message code="message.tool.image.ann.statusNameWorked" />'
            , statusNameOpen        : '<spring:message code="message.tool.image.ann.statusNameOpen" />'
            , statusNameReviewing   : '<spring:message code="message.tool.image.ann.statusNameReviewing" />'
            , changeObjectTagValue  : '<spring:message code="message.tool.image.ann.changeObjectTagValue" />'
            , confirmRefresh        : '<spring:message code="message.tool.image.ann.confirmRefresh" />'
            , changeClass           : '<spring:message code="message.tool.image.ann.changeClass" />'
            , changeShape           : '<spring:message code="message.tool.image.ann.changeShape" />'
            , haveNoSaveData        : '<spring:message code="message.tool.image.ann.haveNoSaveData" />'
            , resultSaveTempSuccess : '<spring:message code="message.tool.image.ann.resultSaveTempSuccess" />'
            , resultSaveTempFail    : '<spring:message code="message.tool.image.ann.resultSaveTempFail" />'
            , errorAuth             : '<spring:message code="message.tool.image.ann.errorAuth" />'
            , addObject             : '<spring:message code="message.tool.image.ann.addObject" />'
            , notFoundObject        : '<spring:message code="message.tool.image.ann.notFoundObject" />'
            , errorMagin            : '<spring:message code="message.tool.image.ann.errorMagin" />'
            , cancleDrawing         : '<spring:message code="message.tool.image.ann.cancleDrawing" />'
            , cancleDrawingMin      : '<spring:message code="message.tool.image.ann.cancleDrawingMin" />'
            , cancleDrawingMinP      : '<spring:message code="message.tool.image.ann.cancleDrawingMinP" />'
            , startDrawing          : '<spring:message code="message.tool.image.ann.startDrawing" />'
            , drawMagicPin          : '<spring:message code="message.tool.image.ann.drawMagicPin" />'
            , drawMagicBox          : '<spring:message code="message.tool.image.ann.drawMagicBox" />'
            , drawPolygon           : '<spring:message code="message.tool.image.ann.drawPolygon" />'
            , drawPolyline          : '<spring:message code="message.tool.image.ann.drawPolyline" />'
            , drawKeypoint          : '<spring:message code="message.tool.image.ann.drawKeypoint" />'
            , drawRect              : '<spring:message code="message.tool.image.ann.drawRect" />'
            , drawRect4p            : '<spring:message code="message.tool.image.ann.drawRect4p" />'
            , drawPointGroup        : '<spring:message code="message.tool.image.ann.drawPointGroup" />'
            , changeSortObject      : '<spring:message code="message.tool.image.ann.changeSortObject" />'
            , copyNoSelected        : '<spring:message code="message.tool.image.ann.copyNoSelected" />'
            , copyToClipboard       : '<spring:message code="message.tool.image.ann.copyToClipboard" />'
            , copyToClipboardAll    : '<spring:message code="message.tool.image.ann.copyToClipboardAll" />'
            , copyNoExists          : '<spring:message code="message.tool.image.ann.copyNoExists" />'
            , copyNoData            : '<spring:message code="message.tool.image.ann.copyNoData" />'
            , copiedList            : '<spring:message code="message.tool.image.ann.copiedList" />'
            , movedObject           : '<spring:message code="message.tool.image.ann.movedObject" />'
            , hotkeyObjectClass     : "<spring:message code="message.tool.image.ann.hotkeyObjectClass" />"
            , hotkeyImageTag        : '<spring:message code="message.tool.image.ann.hotkeyImageTag" />'
            , hotkeyObjectTag       : '<spring:message code="message.tool.image.ann.hotkeyObjectTag" />'
            , noExistsObjectTag     : '<spring:message code="message.tool.image.ann.noExistsObjectTag" />'
            , imageCompleteSuccess  : '<spring:message code="message.tool.image.ann.imageCompleteSuccess" />'
            , imageCompleteFail     : '<spring:message code="message.tool.image.ann.imageCompleteFail" />'
            , imageCompleteConfirm  : '<spring:message code="message.tool.image.ann.imageCompleteConfirm" />'
            , serverError           : '<spring:message code="message.tool.image.ann.serverError" />'
            <%--, imageGiveupConfirm    : "<spring:message code="label.tool.lidar.imageGiveupConfirm" />"--%>
            <%--, imageGiveupSuccess    : "<spring:message code="label.tool.lidar.imageGiveupSuccess" />"--%>
            , imageListPaging       : "<spring:message code="label.tool.lidar.imageListPaging" />"
            , deletePoint           : "<spring:message code="label.tool.lidar.deletePoint" />"
            , addPoint              : '<spring:message code="message.tool.image.ann.addPoint" />'
            , newPoint              : '<spring:message code="message.tool.image.ann.newPoint" />'
            , changePointStatus     : '<spring:message code="message.tool.image.ann.changePointStatus" />'
            , pointStatusDefault    : '<spring:message code="message.tool.image.ann.pointStatusDefault" />'
            , pointStatusInvisible  : '<spring:message code="message.tool.image.ann.pointStatusInvisible" />'
            , pointStatusDelete     : '<spring:message code="message.tool.image.ann.pointStatusDelete" />'
            , completeCheckbox      : '<spring:message code="message.tool.image.ann.completeCheckbox" />'
            , doSomethingRefresh    : '<spring:message code="message.tool.image.ann.doSomethingRefresh" />'
            , doSomethingChangeImage: '<spring:message code="message.tool.image.ann.doSomethingChangeImage" />'
            , noMoreAssignImage     : '<spring:message code="message.tool.image.ann.noMoreAssignImage" />'
            , pagingText            : '<spring:message code="message.tool.image.ann.pagingText" />'
            , pagingTooltip         : '<spring:message code="message.tool.image.ann.pagingTooltip" />'
            , warnChangeBrowserZoom : '<spring:message code="message.tool.image.ann.warnChangeBrowserZoom" />'
            , noSelectedOfSelect    : '<spring:message code="message.tool.image.ann.noSelectedOfSelect" />'
            , notAddedHotkey        : '<spring:message code="message.tool.image.ann.notAddedHotkey" />'
            , imageTagOfHotkeyType  : '<spring:message code="message.tool.image.ann.imageTagOfHotkeyType" />'
            , objectTagOfHotkeyType : '<spring:message code="message.tool.image.ann.objectTagOfHotkeyType" />'
            , objectClassOfHotkeyType:'<spring:message code="message.tool.image.ann.objectClassOfHotkeyType" />'
            , titleReject           : '<spring:message code="message.tool.image.ann.titleReject" />'
            , subTitleReject_1      : '<spring:message code="message.tool.image.ann.subTitleReject_1" />'
            , subTitleReject_2      : '<spring:message code="message.tool.image.ann.subTitleReject_2" />'
            , cantRemovePoint       : '<spring:message code="message.tool.image.ann.cantRemovePoint" />'

            , playerStart           : "<spring:message code="label.tool.lidar.playerStart" />"
            , playerStop            : "<spring:message code="label.tool.lidar.playerStop" />"
            , framesLoading         : "<spring:message code="label.tool.lidar.framesLoading" />"
            , confirmPlayFromFirst  : "<spring:message code="label.tool.lidar.confirmPlayFromFirst" />"

            , objectNotExists       : "<spring:message code="label.tool.lidar.objectNotExists" />"

            , bboxOutsideOnCamera   : "<spring:message code="label.tool.lidar.bboxOutsideOnCamera" />"
            , confirmNotInCamera    : "<spring:message code="label.tool.lidar.confirmNotInCamera" />"

            , inputReason           : "<spring:message code="placeholder.tool.image.review.inputReason" />"
            , noMoreRvassigned      : "<spring:message code="alert.tool.image.review.noMoreRvassigned" />"
            , fullRvAssignImage     : "<spring:message code="alert.tool.image.review.fullNewAssign" />"
        };
        page.message.dropdown = {};
        page.message.dropdown.allSelect     ="<spring:message code="option.tool.image.review.dropdown.allSelect" />";
        page.message.dropdown.allDeSelect   ="<spring:message code="option.tool.image.review.dropdown.allDeSelect" />";
        page.message.dropdown.allSelected   ="<spring:message code="option.tool.image.review.dropdown.allSelected" />";
        page.message.dropdown.allDeSelected ="<spring:message code="option.tool.image.review.dropdown.allDeSelected" />";
        page.message.dropdown.selected      ="<spring:message code="option.tool.image.review.dropdown.selected" />";
        page.message.confirmNg              ="<spring:message code="confirm.tool.image.review.ng" />";
        page.constants.message = {
            denyPermission 	: '<spring:message code="message.tool.image.ann.denyPermission" />'
            , initStart 	: '<spring:message code="message.tool.image.ann.initStart" />'
            , initEnd 		: '<spring:message code="message.tool.image.ann.initEnd" />'
        }

        page.message.confirm = {};
        page.message.confirm.allPass            = "<spring:message code="confirm.tool.image.review.allPass" />";
        page.message.confirm.allOK              = "<spring:message code="confirm.tool.image.review.allOK" />";
        page.message.confirm.ng                 = "<spring:message code="confirm.tool.image.review.ng" />";

        page.message.alert = {};
        page.message.alert.notExistsRvAssigned  = "<spring:message code="alert.tool.image.review.notExistsRvAssigned" />";
        page.message.alert.requiredFailReason   = "<spring:message code="alert.tool.image.review.requiredFailReason" />";
        page.message.alert.notSelectedImage     = "<spring:message code="alert.tool.image.review.notSelectedImage" />";
        page.message.alert.noHavePermission     = "<spring:message code="alert.tool.image.review.noHavePermission" />";
        page.message.alert.failOfImagePass      = "<spring:message code="alert.tool.image.review.failOfImagePass" />";
        page.message.alert.failOfImageFail      = "<spring:message code="alert.tool.image.review.failOfImageFail" />";
        page.message.alert.noMoreRvassigned     = "<spring:message code="alert.tool.image.review.noMoreRvassigned" />";
        page.message.alert.fullRvAssignImage    = "<spring:message code="alert.tool.image.review.fullNewAssign" />";
        page.message.alert.failOfImageOK        = "<spring:message code="alert.tool.image.review.failOfImageOK" />";
        page.message.alert.failOfImageNG        = "<spring:message code="alert.tool.image.review.failOfImageNG" />";
        page.message.alert.failOfAllPass        = "<spring:message code="alert.tool.image.review.failOfAllPass" />";
        page.message.alert.failOfAllOK          = "<spring:message code="alert.tool.image.review.failOfAllOK" />";
        page.message.alert.inspNoSelectedCode   = "<spring:message code="alert.tool.image.review.inspNoSelectedCode" />";
        page.message.alert.preLoadConfirm       = "<spring:message code="alert.tool.image.review.preLoadConfirm" />";

        page.data.fileList = [];
        page.data.countLoading = 0;
        page.existData = {};
        page.allExistData = [];
        page.fn = {};
        page.data.currentPcd = 0;


        page.fn.alert = function(msg) {
            alert(msg);
        }

        page.fn.requestFileAssign = function(paramAssign) {
            let url = "/apis/v1/workspace/review/assign"
            if(page.data.permissionCode == "reviewer") {
                url = "/apis/v1/workspace/review/assign";
            }
            // else if(page.data.permissionCode == "inspector") {
            //     url = "/apis/v1/workspace/inspect/assign";
            // }
            else if(page.data.permissionCode == "master") {
                url = "/apis/v1/workspace/master/assign";
            }
            _common.ajax.syncJSON2({
                url: url
                , param: paramAssign
                , returnFunction: function (r) {
                }
            });
        }

        page.fn.getPcdList = function(addAssignImage) {
            log.info(addAssignImage,"page.fn.getPcdList");
            // 새로운 PCD 작업파일을 요청할 것인가?
            addAssignImage = addAssignImage == null ? false : addAssignImage;
            let param = {
                projectId       : page.param.projectId
                , taskId    : page.param.taskId
                , addAssignImage: addAssignImage
                , pageIndex     : globalData.currentPage // 목록 조회할 페이지 번호
                , reqType       : page.data.reqType
            };
            let status;
            if(param.addAssignImage) {
                page.fn.requestFileAssign(param);
            }

            //page 처음 open시 status 처리
            if(globalData.searchData.statusOptions === undefined){
                if(page.data.permissionCode == "reviewer"){
                    // status = "filter_status_rvassign";
                    status = "filter_status_all_reviewer";
                }
                // else if(page.data.permissionCode == "inspector") {
                //     // status = "filter_status_pass";
                //     status = "filter_status_all";
                // }
                else{
                    status = "filter_status_all";
                }
            }else{
                status = globalData.searchData.statusOptions;
            }
            let url = "/apis/v1/workspace/review/lidarList"
            if(page.data.permissionCode == "reviewer" || page.data.permissionCode == "master") {
                if(page.data.permissionCode == "reviewer") {
                    url = "/apis/v1/workspace/review/lidarList";
                    param.reqType = "reviewer";
                }
                // else if(page.data.permissionCode == "inspector") {
                //     url = "/apis/v1/workspace/inspect/lidarList";
                //     param.reqType = "inspector";
                // }
                else if(page.data.permissionCode == "master") {
                    url = "/apis/v1/workspace/master/lidarList";
                    param.reqType = "master";
                }
                // 검색조건
                param.objectCount  = globalData.searchData.objectQtyOptions;
                param.filterStatus = status;

                if(globalData.searchData.classOptions != null
                    && globalData.searchData.classOptions.length != page.data.task.classes.length){
                    param.classes  = globalData.searchData.classOptions;
                } else {
                    param.classes  = []
                }
                param.sort         = globalData.searchData.sortImageOptions;
                param.annotatorId  = globalData.searchData.searchWorkerId;
                param.reviewerId   = globalData.searchData.searchReviewerId;
                // param.inspectorId  = globalData.searchData.searchInspectorId;
                param.rawFileName     = globalData.searchData.searchFileName;
            }

            // 한번에 받아올 총 pcd 수
            param.perPaging = 1000;
            param.pageSize = 1000;

            page.fn.showLoading();
            _common.ajax.asyncJSON2({
                url: url
                , param : param
                , returnFunction : function (r) {
                    log.info(r, url);
                    page.data.fileList = [];
                    if(r.data && r.data.length > 0) {
                        page.data.fileList = r.data;
                    }
                    //console.log(page.data.fileList)
                    // if(_common.isNotEmpty(page.data.fileList) && _common.isNotEmpty(globalData.pcdTarget)) {
                    //     globalData.pcdTarget = page.data.fileList[0].workTicketId;
                    // }
                    //controlData("makePcdData");
                    controlData("getAllExistData");

                    //page.data.paging.totalCount = r.paging.totalCount;
                    //page.data.paging.perPaging = r.paging.pageSize;

                    // 마지막 페이지 번호
                    //let max = Math.ceil(page.data.paging.totalCount / page.data.paging.perPaging);
                    // select 의 option 전부 삭제하고 max만큼 생성하고 현재 페이지를 selected

                   // controlData("setPaging");

                    page.fn.hideLoading();
                    loaderWrap.style.display = "none";
                }, errorFunction : function(r) {
                    log.error(r, "page.fn.getPcdList");
                    page.fn.hideLoading();
                }
            });

        }

        page.fn.getExistData = function(fileNumber) {
            log.info(fileNumber, "page.fn.getExistData, fileNumber");
            page.fn.showLoading();
            let url = "/apis/v1/workspace/review/lidarGet"
            if(page.data.permissionCode == "reviewer") {
                url = "/apis/v1/workspace/review/lidarGet";
            }
            // else if(page.data.permissionCode == "inspector") {
            //     url = "/apis/v1/workspace/inspect/lidarGet";
            // }
            else if(page.data.permissionCode == "master") {
                url = "/apis/v1/workspace/master/lidarGet";
            }
            _common.ajax.asyncJSON2({
                url: url
                , param : {
                    projectId : page.param.projectId
                    , taskId : page.param.taskId
                    , workTicketId : fileNumber
                    , reqType : page.data.reqType
                }, returnFunction : function (r) {
                    //console.log(r);
                    page.allExistData.push(r);
                    page.fn.getNextExistData();
                    page.fn.hideLoading();
                }, errorFunction : function(r) {
                    log.error(r, "page.fn.getExistData");
                    page.fn.hideLoading();
                }
            });
        }

        page.fn.getNextExistData = function() {
            if(page.data.currentPcd < page.data.fileList.length){
                page.fn.getExistData(page.data.fileList[page.data.currentPcd].workTicketId);
                page.data.currentPcd++;
                dataLoaderCount.innerHTML = "DATA LOADING<br>" + page.data.currentPcd + " / " + page.data.fileList.length;

            }else{
                objects.allExistData = [...page.allExistData];
                //console.log(objects.allExistData)
                controlData("makePcdData");
                //controlData("makeExistData");
            }
        }

        page.fn.getSavedData = function(fileNumber) {
            page.fn.showLoading();
            let url = "/apis/v1/workspace/review/lidarGet"
            if(page.data.permissionCode == "reviewer") {
                url = "/apis/v1/workspace/review/lidarGet";
            }
            // else if(page.data.permissionCode == "inspector") {
            //     url = "/apis/v1/workspace/inspect/lidarGet";
            // }
            else if(page.data.permissionCode == "master") {
                url = "/apis/v1/workspace/master/lidarGet";
            }
            _common.ajax.asyncJSON2({
                url: url
                , param : {
                    projectId : page.param.projectId
                    , taskId : page.param.taskId
                    , workTicketId : fileNumber
                    , reqType : page.data.reqType
                }, returnFunction : function (r) {
                    page.savedData = {};
                    page.savedData = {...r};
                    controlData("changeStatusAfterSave");
                    page.fn.hideLoading();
                }, errorFunction : function(r) {
                    log.error(r, "page.fn.getSavedData");
                    page.fn.hideLoading();
                }
            });
        }

        page.fn.saveTemp = function(nextFunction) {
            /*
            *
            * tagVoList : [
            *   {
            *       //'imgObjectDivCd': "IMG"
            *       , tagTypeCd: "IMG"
            *       , tagValTypeCd: "30"
            *   }
            * ]
            * */
            let url = "/apis/v1/workspace/review/save"
            if(page.data.permissionCode == "reviewer") {
                url = "/apis/v1/workspace/review/save";
            }
            // else if(page.data.permissionCode == "inspector") {
            //     url = "/apis/v1/workspace/inspect/save";
            // }
            else if(page.data.permissionCode == "master") {
                url = "/apis/v1/workspace/master/save";
            }
            //let url = "/apis/v1/workspace/review/save";
            let param = JSON.parse(JSON.stringify(globalData.saveData));
            param.reqType = page.data.reqType;
            // console.log(JSON.stringify(param));
            page.fn.showLoading();
            _common.ajax.asyncJSON2({
                url: url
                , param: JSON.stringify(param)
                , contentType: "application/json"
                , isLoading: false
                , returnFunction: function (r) {
                    // Ajax 200

                    if(typeof(nextFunction) == 'function') {
                        nextFunction();
                    } else {
                        //controlData("getPcdList");
                        controlData("getSavedData");
                    }
                    page.fn.hideLoading();
                }, errorFunction: function (err) {
                    // Ajax 500
                    log.error(err, "page.fn.saveTemp");
                    page.fn.hideLoading();
                }
            });
        }

        //작업자 작업완료 처리
        page.fn.userComplete = function () {
            log.debug("page.fn.userComplete()");
            /*if ($("#confirmModalCheckbox").prop("checked")) {
                _common.cookie.set(page.constants.cookieKeys.confirmPass, "yes");
            }
            page.fn.hideConfirmModal();*/

            page.fn.saveTemp(function () {
                page.fn.showLoading();
                _common.ajax.asyncJSON2({
                    url: "/apis/v1/workspace/review/complete"
                    , param: {
                        projectId : page.param.projectId
                        , taskId : page.param.taskId
                        , workTicketId: globalData.pcdTarget
                    }, returnFunction: function (r) {
                        if (r && r.result) {
                            page.fn.alert(page.message.imageCompleteSuccess);
                        } else {
                            page.fn.alert(page.message.imageCompleteFail);
                        }
                        page.fn.getPcdList(true);
                        page.fn.hideLoading();
                    }, isLoading: true
                    , errorFunction: function () {
                        page.fn.alert(page.message.serverError);
                        page.fn.getPcdList(false);
                        // log.error(r, "page.fn.userGiveup");
                        page.fn.hideLoading();
                    }
                });
            });
        }

        // //작업자 작업포기 처리
        // page.fn.userGiveup = function (pcdName) {
        //     if (confirm(_common.template.parseMessage(page.message.imageGiveupConfirm, {originalFileName: pcdName}))) {
        //         page.fn.showLoading();
        //         _common.ajax.asyncJSON2({
        //             url: "/apis/v1/workspace/review/giveup"
        //             , param: {
        //                 projectId : page.param.projectId
        //                 , taskId : page.param.taskId
        //                 , workTicketId: globalData.pcdTarget
        //             }, returnFunction: function (r) {
        //                 if (r && r.result) {
        //                     page.fn.alert(page.message.imageGiveupSuccess);
        //                 } else {
        //                     page.fn.alert(page.message.imageCompleteFail);
        //                 }
        //                 page.fn.getPcdList(true);
        //                 page.fn.hideLoading();
        //             }, isLoading: true
        //             , errorFunction: function (r) {
        //                 log.error(r, "page.fn.userGiveup");
        //                 page.fn.alert(page.message.serverError);
        //                 page.fn.getPcdList(false, true);
        //                 page.fn.hideLoading();
        //             }
        //         });
        //     }
        // }

        //리뷰어 패스처리
        page.fn.reviewProcPass = function() {
            page.fn.showLoading();
            _common.ajax.asyncJSON2({
                url: "/apis/v1/workspace/review/pass"
                , param: {
                    projectId : page.param.projectId
                    , taskId : page.param.taskId
                    , workTicketId: globalData.pcdTarget
                }, returnFunction : function(rv) {
                    if(rv && rv.result) {
                        page.fn.saveTemp(function(){
                            //page.param.workTicketId = page.data.currentFrame.workTicketId;
                            page.fn.getPcdList(true);
                        });
                    } else {
                        page.fn.alert(page.message.alertReviewPass);
                    }
                    page.fn.hideLoading();
                }, errorFunction : function(r) {
                    log.error(r, "page.fn.reviewProcPass");
                    page.fn.alert(page.message.alertReviewPass);
                    page.fn.hideLoading();
                }
            });
        }

        // 리뷰어 all pass 처리
        page.fn.procAllPass = function() {
            if(confirm(page.message.confirm.allPass)) {
                page.fn.showLoading();
                _common.ajax.asyncJSON2({
                    url     : "/apis/v1/workspace/review/passAll"
                    , param : {
                        projectId       : page.param.projectId
                        , taskId    : page.param.taskId
                    }, returnFunction : function(r) {
                        if(r && r.result) {
                            page.fn.getPcdList(true);
                        } else if(r && r.message == "auth") {
                            page.fn.alert(page.message.alert.noHavePermission);
                        } else if(r && _common.isNotEmpty(r.message)) {
                            page.fn.alert(r.message);
                        } else {
                            page.fn.alert(page.message.alert.failOfAllPass);
                        }
                        page.fn.hideLoading();
                    }, errorFunction : function() {
                        page.fn.alert(page.message.alert.failOfAllPass);
                        page.fn.hideLoading();
                    }
                });
            }
        }

        //리뷰어 반려처리
        page.fn.reviewProcFail = function() {
            //TODO 반려사유
            let rejectReason = globalData.failData.reviewMessage;

            if(_common.isEmpty(rejectReason)) {
                page.fn.alert(page.message.inputReason);
                return false;
            }
            //Object / Tag 선택한 체크박스를 전달
            let detailData = {
                objectList: []
                , tagList: []
            };
            // $("input.chkReviewRejectData:checked").each(function(i, o){
            //     o = $(o);
            //     if(o.attr("data-type") == "object") {
            //         detailData.objectList.push(o.attr("data-imgObjectNumber"));
            //     } else if(o.attr("data-type") == "tag") {
            //         detailData.tagVoList.push({
            //             imgObjectNumber: o.attr("data-imgObjectNumber")
            //             , tagId : o.attr("data-tagId")
            //         });
            //     }
            // });
            let url = "/apis/v1/workspace/review/fail";
            page.fn.showLoading();
            _common.ajax.asyncJSON2({
                url: url
                , param: {
                    projectId : page.param.projectId
                    , taskId : page.param.taskId
                    , workTicketId: globalData.pcdTarget
                    , reviewMessage   : rejectReason
                    , reviewFailData: JSON.stringify(detailData)
                    , reqType: page.data.reqType
                }, returnFunction : function(rv) {
                    if(rv && rv.result) {
                        //page.param.workTicketId = page.data.currentFrame.workTicketId;
                        page.fn.getPcdList(false);
                    } else {
                        page.fn.alert(page.message.alertReviewFail);
                    }
                    page.fn.hideLoading();
                }, errorFunction : function() {
                    page.fn.alert(page.message.alertReviewFail);
                    log.error(r, "page.fn.reviewProcFail");
                    page.fn.hideLoading();
                }
            });
        }

        // 리뷰어 작업파일 추가할당요청
        page.fn.newReviewAssign = function() {
            page.fn.showLoading();
            let url = "/apis/v1/workspace/review/assign";
            // if("insp/manager/inspector".includes(page.data.reqType)) {
            //     url = "/apis/v1/workspace/inspect/assign";
            // }
            log.info(page.data.reqType, "page.data.reqType");
            _common.ajax.asyncJSON2({
                url: url
                , param : {
                    projectId : page.param.projectId
                    , taskId : page.param.taskId
                }, returnFunction : function(r) {
                    if(r.data == -1) {
                        page.fn.alert(page.message.fullRvAssignImage);
                    } else if(r.data == 0) {
                        page.fn.alert(page.message.noMoreRvassigned);
                    } else {
                        //페이징 처리를 1번 페이지로 강제 이동
                        //page.param.pageNum = 1;
                        page.fn.getPcdList(false);
                    }
                    page.fn.hideLoading();
                }, errorFunction : function(r) {
                    log.error(r, "page.fn.newReviewAssign");
                    page.fn.hideLoading();
                }
            });
        }

        // // 인스펙션 OK 수행
        // page.fn.reviewProcOK = function() {
        //     let url = "/apis/v1/workspace/inspect/ok";
        //     let param = {
        //         projectId : page.param.projectId
        //         , taskId : page.param.taskId
        //         , workTicketId: globalData.pcdTarget
        //     };
        //     page.fn.showLoading();
        //     _common.ajax.asyncJSON2({
        //         url: url
        //         , param: param
        //         , returnFunction: function (r) {
        //             page.fn.getPcdList(false, true);
        //             page.fn.hideLoading();
        //         }, errorFunction : function(r) {
        //             log.error(r, "page.fn.reviewProcOK");
        //             page.fn.hideLoading();
        //         }
        //     });
        // }
        //
        // // 인스펙션 All OK 수행
        // page.fn.procAllOK = function () {
        //     if(confirm(page.message.confirm.allOK)){
        //         page.fn.showLoading();
        //         _common.ajax.asyncJSON2({
        //             url     : "/apis/v1/workspace/inspect/okAll"
        //             , param : {
        //                 projectId       : page.param.projectId
        //                 , taskId    : page.param.taskId
        //             }, returnFunction : function(r) {
        //                 if(r && r.result) {
        //                     page.fn.getPcdList(true);
        //                 } else if(r && r.message == "auth") {
        //                     page.fn.alert(page.message.alert.noHavePermission);
        //                 } else if(r && _common.isNotEmpty(r.message)) {
        //                     page.fn.alert(r.message);
        //                 } else {
        //                     page.fn.alert(page.message.alert.failOfAllOK);
        //                 }
        //                 page.fn.hideLoading();
        //             }, errorFunction : function() {
        //                 page.fn.alert(page.message.alert.failOfAllOK);
        //                 page.fn.hideLoading();
        //             }
        //         });
        //     }
        // }
        //
        // // 인스펙션 NG 수행
        // page.fn.procInspectionNG = function() {
        //     //TODO 반려사유 선택(CHECKBOX)
        //     //let errs = [];
        //     let errs = globalData.NGData.errorCode;
        //
        //     if(!confirm(page.message.confirmNg)) {
        //         return false;
        //     }
        //     let inspNgMessage = globalData.NGData.reviewMessage; //NG 사유 (TEXTAREA)
        //
        //     //로딩바 보여주고
        //     page.fn.showLoading();
        //     _common.ajax.asyncJSON2({
        //         url     : "/apis/v1/workspace/inspect/ng"
        //         , param : {
        //             projectId : page.param.projectId
        //             , taskId : page.param.taskId
        //             , workTicketId: globalData.pcdTarget
        //             , errorCodeList : errs
        //             , inspNgMessage : inspNgMessage
        //         }, returnFunction : function(r) {
        //             if(r && r.result) {
        //                 page.fn.getPcdList();
        //             } else if(r && r.message == "auth") {
        //                 page.fn.alert(page.message.alert.noHavePermission);
        //             } else if(r && _common.isNotEmpty(r.message)) {
        //                 page.fn.alert(r.message);
        //             } else {
        //                 page.fn.alert(page.message.alert.failOfImageNG);
        //             }
        //             page.fn.hideLoading();
        //         }, errorFunction : function() {
        //             page.fn.alert(page.message.alert.failOfImageNG);
        //             page.fn.hideLoading();
        //         }
        //     });
        // }

        //TODO 로딩바 보여주기
        page.fn.showLoading = function () {
            page.data.countLoading++;
            dataLoaderWrap.style.display = "flex";
        }
        //TODO 로딩바 숨기기
        page.fn.hideLoading = function () {
            page.data.countLoading--;
            if(page.data.countLoading == 0) {
                dataLoaderWrap.style.display = "none";
            }
        }



        page.fn.gotoBefore = function() {
            let param = "?projectId=" + page.param.projectId;
            param += "&taskId=" + page.param.taskId;
            param += "&workTicketId=" + globalData.pcdTarget;
            param += "&reqType=" + page.data.reqType;
            param += "&pageNum=" + page.param.pageNum;
            param += "&viewType=";
            log.info(page.data, "page.data");
            log.info(page.param, "page.param");
            window.location = window.location.pathname + param;
        }

        // btnChangeTool.addEventListener('click', function(e){
        //     page.fn.gotoBefore();
        // });

        function _pre_loader_data(data) {

            try {
                page.constants.isCO = _common.nvl(data.isCO, false);
                page.constants.taskTalkYn = _common.nvl(data.taskTalkYn, "N");
                page.constants.bboxRotateYn = _common.nvl(data.bboxRotateYn, "N");
                page.constants.serverCoApiAddQna = _common.nvl(data.serverCoApiAddQna, "");
                page.constants.co = {
                    coProjectKey: _common.nvl(data.coProjectKey, "")
                    , coTaskKey: _common.nvl(data.coTaskKey, "")
                    , coUserId: _common.nvl(data.coUserId, "")
                    , coProjectName: _common.nvl(data.coProjectName, "")
                    , coTaskName: _common.nvl(data.coTaskName, "")
                };
                page.constants.drawMin = {
                    x: _common.nvl(data.minPixelX, -1)
                    , y: _common.nvl(data.minPixelY, -1)
                    , isUse: _common.nvl(data.minPixelType, "N")
                };
                page.constants.reviewSystemHost = _common.nvl(data.reviewSystemHost, "N");
                page.constants.userLocation = _common.nvl(data.userLocation, "");
                page.constants.currentLocale = _common.nvl(data.country, "kor");
                page.constants.isReviewer = _common.nvl(data.isReviewer, true);
                page.constants.imageServer = [];
                for (let i = 0; i < data.imageServerUrls.length; i++) {
                    let imgServerUrl = data.imageServerUrls[i];
                    let imgServerName = data.imageServerNames[i];
                    page.constants.imageServer.push({
                        name: imgServerName
                        , url: imgServerUrl
                        , title: imgServerName
                    });
                    if(page.constants.currentLocale.toUpperCase() == imgServerName.toUpperCase()) {
                        page.constants.imageServerURL = imgServerUrl;
                    }
                }
                page.constants.imageServerDefault = page.constants.imageServer[0].url; // Error가 발생 할 경우 대체 서버
                page.constants.imageServerURL = page.constants.imageServer[0].url; // 기본으로 호출할 스트림 서버

                try {
                    for(let imgServer of page.constants.imageServer) {
                        // 2023-07-03 조성옥 이미지 URL 오류 수정
                        if(imgServer.name.toUpperCase() == page.constants.userLocation.toUpperCase()) { // page.constants.userLocation = "jp";
                            //page.constants.imageServerDefault = imgServer.url;
                            page.constants.imageServerURL = imgServer.url;
                        }
                    }
                } catch(E) {
                    console.error(E);
                }

                page.data.imageServer = page.constants.imageServerURL;
                <%--page.constants.edgeServerURL = '${edgeImageServerUrl}'--%>
                page.constants.authToken = _common.nvl(data.authToken, "");
                page.data.task.projectId = _common.nvl(data.projectId, "");
                page.data.task.projectName = _common.nvl(data.projectName, "");
                page.data.task.taskId = _common.nvl(data.taskId, "");
                page.data.task.taskName = _common.nvl(data.taskName, "");
                page.data.task.taskCode = _common.nvl(data.taskCode, "");
                page.data.task.defaultClassNumber = _common.nvl(data.defTaskClassNumber, "");
                page.data.task.rejectYN = _common.nvl(data.reworkYn, "");
                page.data.task.taskType = _common.nvl(data.taskType, "");
                // page.data.task.taskDesc = _common.nvl(data.taskDesc, "");
                page.data.task.reworkYn = _common.nvl(data.reworkYn, "N");
                page.data.task.limitWorkCnt = _common.nvl(data.limitWorkCnt, 0);
                page.data.task.attachedFileSrc = data.uploadLinkUrl + data.desFile;
                page.data.task.attachedFileName = data.desOrgnFile;
                page.data.task.isExistsGuide = false;
                if(_common.isNotEmpty(page.data.task.taskDesc) || _common.isNotEmpty(page.data.task.attachedFileName)) {
                    // page.data.task.isExistsGuide = true;
                }
                page.data.task.workPoint = _common.nvl(data.workPoint, "");
                page.data.task.reviewPoint = _common.nvl(data.reviewPoint, "");
                page.data.task.camList = [];


                if(_common.isNotEmpty(data.camList)) {
                    data.camList.forEach(function(cam){
                        log.info(cam, "data.camList.cam");
                        page.data.task.camList.push({
                            camId   : cam.camId
                            , name      : cam.cameraName
                            , position  : cam.position
                            , fov       : cam.fov
                            , lookat    : cam.lookat
                            , far       : cam.far
                            , near      : cam.near
                            , up        : cam.up
                            , aspect    : cam.aspect
                            , path      : cam.rawFilePath
                            , fileExt   : cam.fileExt
                            , sort      : cam.near
                            , isInit    : false
                            , domId     : "wrapCam_" + cam.camId
                            , rotation  : cam.rotation
                            , isUseControl: false
                            , calibrationTxt  : cam.calibration
                        });
                    });
                }
                log.info(page.data.task, "page.data.task");

                page.data.task.taskInfo.taskCode = page.data.task.taskCode;
                page.data.task.taskInfo.taskName = page.data.task.taskName;
                // page.data.task.taskInfo.taskDesc = page.data.task.taskDesc;
                page.data.task.taskInfo.desFiles = data.desFile;
                page.data.task.taskInfo.uploadLinkUrl = data.uploadLinkUrl;
                page.data.task.taskInfo.desOrgnFile = page.data.task.attachedFileName;
                page.data.task.taskInfo.isSegmentation = data.prjWorkType == "3D" ? true : false;

                page.data.permissionCode = _common.nvl(data.permissionCode, "");
                page.data.permissionName = _common.nvl(data.permissionName, "");
                page.data.reqType = _common.nvl(data.reqType, "");

                page.param.projectId    = _common.nvl(data.projectId, "");
                page.param.taskId   = _common.nvl(data.taskId, "");

                page.constants.env = _common.nvl(data.activeProfile, "local");
                page.data.task.tool = [];
                page.data.useMagicAI = "N";
                if(data.drawingToolList != null) {
                    for (let i = 0; i < data.drawingToolList.length; i++) {
                        let tool = data.drawingToolList[i];
                        page.data.task.tool.push(tool);
                        if (tool == "MagicAI") {
                            page.data.useMagicAI = "Y";
                        }
                    }
                }
                page.data.task.classes = [];
                page.data.rejectReason = [];
                page.data.task.classMap = new HashMap();
                page.hotkey = [];
                for (let i = 0; i < data.classVoList.length; i++) {
                    let cls = data.classVoList[i];
                    page.hotkey.push({
                        keyCode : cls.hotkey
                        , keyName : cls.hkName
                        , excuteFunction : function() {
                            $("#chkToggleClass_"+cls.classId).click();
                        }, description : _common.template.parseMessage(page.message.hotkeyObjectClass, {className: cls.className})
                        , isVisible: true
                        , type: page.constants.hotkeyType.classesForObject
                        , isCheckPermission: false
                    });

                    page.data.task.classes.push({
                        classId: cls.classId
                        , className: cls.className
                        , hotkey: cls.hk
                        , hotkeyName: cls.hkName
                        , color: cls.color
                        , width     : Number.parseFloat(_common.nvl(cls.width, 2))
                        , height    : Number.parseFloat(_common.nvl(cls.height, 4))
                        , depth     : Number.parseFloat(_common.nvl(cls.depth, 2))
                    });

                    page.data.task.classMap.put(cls.classId, {
                        classId: cls.classId
                        , className: cls.className
                        , hotkey: cls.hk
                        , hotkeyName: cls.hkName
                        , color: cls.color
                    });

                    if(page.data.task.defaultClassNumber == cls.classId) {
                        page.data.task.defaultClassName = cls.className;
                    }
                }


                page.data.task.tags = [];
                if(data.tagVoList != null) {
                    for (let i = 0; i < data.tagVoList.length; i++) {
                        let tag = data.tagVoList[i];
                        let tagData = {
                            tagId: tag.tagId
                            , name: tag.tagName
                            , hotkey: tag.hk
                            , hotkeyName: tag.hkName
                            , color: tag.color
                            , tagTypeCd: tag.tagTypeCd
                            , tagValTypeCd: tag.tagValTypeCd
                            , tagSelectValueVoList: []
                            , matchClasses: tag.matchClass
                            , valueFilterNumber: tag.numbering
                            , valueFilterLetter: tag.letter
                            , valueFilterSpecial: tag.specialCharacter
                            , lengthNumber: tag.numberingLength
                            , lengthLetter: tag.letterLength
                            , lengthSpecial: tag.specialCharacterLength
                        };
                        if (tag.tagSelectValueVoList != null) {
                            for (let i = 0; i < tag.tagSelectValueVoList.length; i++) {
                                let tv = tag.tagSelectValueVoList[i];
                                tagData.tagSelectValueVoList.push({
                                    name: tv.selectName
                                    , value: tv.selectVal
                                    , color: tv.color
                                    , tagValueIdx: i + 1
                                });
                            }
                        }
                        page.data.task.tags.push(tagData);
                    }
                }
                // page.data.task.errorCodeList = null;
                // if (data.inspectionErrorList != null) {
                //     page.data.task.errorCodeList = data.inspectionErrorList;
                // } else {
                //     page.data.task.errorCodeList = [];
                // }
                page.data.authToken = _common.nvl(data.authToken, "");

                if(page.data.permissionCode != 'worker') {
                    page.data.paging.perPaging = 1000;
                } else {
                    page.data.paging.perPaging = 10;
                }
                log.info(page);
                let taskTitle = "";
                if(page.data.permissionCode != page.constants.workType.co) {
                    taskTitle = "[" + page.data.permissionName + "]";
                }
                taskTitle += " <span>"
                    + page.data.task.projectName + "</span> > <span>"
                    + page.data.task.taskName + "</span>";
                $("#taskTitle").html(taskTitle);
                initFunction();
            } catch (E) {
                log.error(E, "_pre_loader_data()");
            }
        }

        $(document.body).ready(function() {
            _common.ajax.api_host = "${apisUrl}";
            _common.ajax.token_front = "${token}";
            let param = {
                url : "/apis/v1/workspace/task/get"
                , param : {
                    "projectId"     : page.param.projectId
                    , "taskId"  : page.param.taskId
                    , "reqType"     : page.param.reqType
                }, returnFunction : function(rev){
                    if(rev && rev.result) {
                        _pre_loader_data(rev.data);
                    }
                }
            };
            _common.ajax.asyncJSON2(param);
        });

        const initFunction = function(){

            const result = getQuery();
            function getQuery(){
                var url = document.location.href;
                var qs = url.substring(url.indexOf('?') + 1).split('&');
                for(var i = 0, result = {}; i < qs.length; i++){
                    qs[i] = qs[i].split('=');
                    result[qs[i][0]] = decodeURIComponent(qs[i][1]);
                }
                return result;
            }

            //고도화 버전에서는 workTicketId가 ""가 들어오는 경우가 있어서 추가함(2023.03.13)
            //if(result.workTicketId !== undefined) globalData.pcdTarget = result.workTicketId;
            if(result.workTicketId !== undefined && result.workTicketId !== "") globalData.pcdTarget = result.workTicketId;
            if(result.pageNum !== undefined) globalData.currentPage = result.pageNum;

            globalData.pageParam = page.param;
            globalData.imageServerDefault = page.constants.imageServerDefault;
            globalData.imageServerURL = page.constants.imageServerURL;
            // globalData.edgeServerURL = page.constants.edgeServerURL;
            globalData.staticServer = page.constants.staticServer;

            svgData.rectMinSize.x =  page.constants.drawMin.width;
            svgData.rectMinSize.y =  page.constants.drawMin.height;

            // get cookie
            for(let key of Object.keys(settingData)){
                if(key === "pcdColor" || key === "wireFrameColor" || key === "frontCubeColor" || key === "planeShape" || key === "planeColor"){
                    settingData[key] = _common.cookie.get(key, defaultSettingData[key]);
                }else{
                    settingData[key] = JSON.parse(_common.cookie.get(key, defaultSettingData[key]));
                }
            }

            controlData("makeTaskData");
        }


        /////////////////////////////////////////////////////////////////////////////////////////////////////

        import { makePcdData } from '${staticPrefix}/js/tool/reviewLidar/review_makePcdData.js';
        import { makeTaskData } from '${staticPrefix}/js/tool/reviewLidar/review_makeTaskData.js';
        import { makeExistData } from '${staticPrefix}/js/tool/reviewLidar/review_makeExistData.js';
        import { changeStatusAfterSave } from '${staticPrefix}/js/tool/reviewLidar/review_changeStatusAfterSave.js';
        import { objects, globalData, svgData, settingData, defaultSettingData } from '${staticPrefix}/js/tool/reviewLidar/review_variables.js';


        function controlData(sort){
            switch( sort ) {
                case "makeTaskData":
                    // paqe UI 구성하는 부분이라서 페이지 열릴때 1번만실행됨
                    //console.log(page.data)
                    makeTaskData(page.data, controlData);
                    break;
                case "getPcdList":
                    page.fn.getPcdList(true);
                    break;
                case "makePcdData":
                    //console.log(page.data.fileList)
                    makePcdData(page.data.fileList, controlData);
                    break;
                case "getExistData":
                    page.fn.getExistData(globalData.pcdTarget);
                    break;
                case "getAllExistData":
                    page.fn.getNextExistData();
                    break;
                case "makeExistData":
                    const targetIndex = page.data.fileList.findIndex((list)=>{
                        return list.workTicketId === globalData.pcdTarget;
                    });
                    //console.log(objects.allExistData[targetIndex])
                    makeExistData(objects.allExistData[targetIndex]);
                    break;
                case "save":
                    page.fn.saveTemp();
                    break;
                case "getSavedData":
                    page.fn.getSavedData(globalData.pcdTarget);
                    break;
                case "changeStatusAfterSave":
                    changeStatusAfterSave(page.savedData, controlData);
                // case "giveUp":
                //     // page.fn.userGiveup(globalData.pcdTargetName);
                //     break;
                case "complete":
                    // page.fn.userComplete();
                    break;
                case "pass":
                    // page.fn.reviewProcPass();
                    break;
                case "allPass":
                    // page.fn.procAllPass();
                    break;
                case "fail":
                    // page.fn.reviewProcFail();
                    break;
                case "OK":
                    // page.fn.reviewProcOK();
                    break;
                case "allOK":
                    // page.fn.procAllOK();
                    break;
                case "NG":
                    // page.fn.procInspectionNG();
                    break;
                case "morePcds":
                    // page.fn.newReviewAssign();
                    break;
                case "modify":
                    // page.fn.saveTemp();
                    break;
                case "search":
                    // page.fn.getPcdList(true);
                    break;
                case "setPaging":
                    // setPaging(page.data.paging, controlData);
                    break;
            }
        }



    </script>

</head>



<body>

<!-- dataLoaderWrap -->
<div id="dataLoaderWrap">
    <div class="loadingText">
        <p id="dataLoaderCount"></p>

        <img src="${staticPrefix}/image/tool/lidar2/loading.gif">
    </div>
</div>
<!-- dataLoaderWrap -->

<!-- loaderWrap -->
<div id="loaderWrap">
    <div class="progress">
        <p>
            <img src="${staticPrefix}/image/tool/lidar2/logo01.png">
        </p>
        <div id="progressbar"></div>
    </div>
</div>
<!-- loaderWrap -->

<div id="filterPopUpWrap" class="normalPopUp"></div>
<div id="guidePopUpWrap" class="normalPopUp"></div>
<div id="searchPopUpWrap" class="normalPopUp"></div>
<div id="reviewPopUpWrap" class="normalPopUp"></div>
<div id="inspectPopUpWrap" class="normalPopUp"></div>
<div id="failPopUpWrap" class="normalPopUp"></div>


<div id="alertPopUpWrap">
    <div class="alertContent">
        <p id="alertMessage"></p>
        <div class="btns">
            <button id="btnConfirm">confirm</button>
            <button id="btnCancel">cancel</button>
        </div>
    </div>
</div>


<div id="canvas"></div>
<div id="topWrap">
    <ul id="logoWrap">
        <li>
            <img src="${staticPrefix}/image/tool/lidar2/logo01.png">
        </li>
        <li><span id="titleIcon" class="material-icons-outlined">description</span></li>
        <li id="taskTitle">
            <c:if test="${!isCO}">[${permissionName}] </c:if><span>
                <c:if test="${project != null}">
                    <c:out value="${project.projectName}" /></span> > <span><c:out value="${project.taskName}" /></span>
            </c:if>
            <c:if test="${taskInfo != null}">
                <c:out value="${taskInfo.projectName}" /></span> > <span><c:out value="${taskInfo.taskName}" /></span>
            </c:if>
        </li>
        <li>
            <button id="btnChangeTool" >change Tool</button>
        </li>
    </ul>
    <ul id="btnTapWrap2">
        <li id="btn2D" class="on" title="2D">2D</li>
        <li id="btn3D" title="3D">3D</li>
    </ul>
</div>
<div id="mainWrap">
    <div id="leftWrap">
        <ul>
            <li>
                <a class="material-icons" id="btnFilter" title="[1] key : Filter ">search</a>
            </li>
        </ul>
        <%--        <ul>--%>
        <%--            <li>--%>
        <%--                <a class="material-icons on"  id="btnMoveScreen" title="[1] key : Deselect">open_with</a>--%>
        <%--            </li>--%>
        <%--            <li>--%>
        <%--                <a class="material-icons-outlined"  id="btnChangeCubeDimension" title="change cube dimension">chevron_right</a>--%>
        <%--                <a class="material-icons-outlined"  id="btnCubeGuideBox" title="[2] key : Add Cube">token</a>--%>
        <%--                <p id="cubeDimensionName">자동차</p>--%>
        <%--            </li>--%>
        <%--            <li>--%>
        <%--                <a class="material-icons-outlined"  id="btnCylinderGuideBox" title="[3] key : Add Cylinder">panorama_vertical</a>--%>
        <%--            </li>--%>
        <%--            <li>--%>
        <%--                <a class="material-icons" id="btnMakeObjectForOnlyRect" title="[4] key : Add Rect">flip_to_front</a>--%>
        <%--            </li>--%>
        <%--            <li>--%>
        <%--                <a class="material-icons" id="btnFindObject" title="[5] key : Choose Object ">ads_click</a>--%>
        <%--            </li>--%>
        <%--            <li>--%>
        <%--                <a class="material-icons" id="btnFindPcdPoints" title="[6] key : Find Pcd Points ">invert_colors</a>--%>
        <%--            </li>--%>
        <%--            <li>--%>
        <%--                <a class="material-icons" id="btnSetDefaultView" title="[Space] key : Set default view for the main camera ">center_focus_strong</a>--%>
        <%--            </li>--%>
        <%--            <li>--%>
        <%--                <a class="material-icons" id="btnHelp" title="[9] key : Help ">help</a>--%>
        <%--            </li>--%>
        <%--            <li>--%>
        <%--                <a class="material-icons" id="btnSearchPcd" title="[7] key : Search ">search</a>--%>
        <%--            </li>--%>
        <%--            <li>--%>
        <%--                <a class="material-icons-outlined" id="btnReview" title="[8] key : Review ">fact_check</a>--%>
        <%--            </li>--%>
        <%--        </ul>--%>
    </div>
    <div id="centerWrap">
        <div id="mainViewWrap">

            <div id="view1">
                <select id="rgbSelect"></select>
                <div id="svgWrap">
                    <canvas id="rgbCanvas"></canvas>
                    <svg id="svgSpace" name="svgSpace"></svg>
                    <img id="rgbImage" />
                </div>
            </div>

            <div id="view2"></div>
        </div>
        <%--        <ul id="childViewWrap">--%>
        <%--            <li id="view3"></li>--%>
        <%--            <li id="view4">--%>
        <%--                <div id="cuboideInfo"></div>--%>
        <%--            </li>--%>
        <%--            <li id="view5">--%>
        <%--                <div id="rectInfo"></div>--%>
        <%--            </li>--%>
        <%--        </ul>--%>
    </div>
    <%--    <div class="gutter" id="gutter1"></div>--%>
    <div class="gutter" id="gutter2"></div>
    <%--    <div class="gutter type2" id="gutter3"></div>--%>

    <div id="rightWrap">
        <ul id="btnTapWrap1">
            <li id="btnWork" class="on" title="Work Space">work</li>
            <li id="btnSetting" title="Setting Space">settings</li>
            <li id="btnHotKey" title="Hotkey Space">hotKey</li>
        </ul>
        <div id="settingTapWrap" class="modify-scroll">
        </div>
        <div id="hotkeyTapWrap" class="modify-scroll">
        </div>
        <div id="workTapWrap">
            <div class="titleWrap">
                FRAME
                <div id="pagingWrap"></div>
            </div>
            <div id="frameWrap" class="modify-scroll"> </div>
            <div class="titleWrap">FRAME Information</div>
            <div id="frameInformationWrap" class="modify-scroll"></div>

<%--                <div class="titleWrap">FRAME TAG</div>--%>
<%--                <ul class="headWrap">--%>
<%--                    <li><span class="circle"></span></li>--%>
<%--                    <li>tag</li>--%>
<%--                    <li>value</li>--%>
<%--                    <li>hotKey</li>--%>
<%--                </ul>--%>
<%--                <div id="frameTagWrap" class="modify-scroll"></div>--%>



                <div class="titleWrap">OBJECTS</div>
                <ul class="objectHeadWrap">
                    <li>
                        <input type="checkbox" id="checkBoxObejctAll" disabled>
                        <label for="checkBoxObejctAll"></label>
                    </li>
                    <li>Class</li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
<%--                    <li><a class='material-icons' id="btnAutoMakeAllSvg" title="Make All BBox Auto">fit_screen</a></li>--%>
<%--                    <li><a class='material-icons' id="btnChangeAllClass" title="Change Class">more_horiz</a></li>--%>
<%--                    <li><a class='material-icons' id="btnObjectAllVisibility" title="Show/Hide All Objects">visibility</a></li>--%>
<%--                    <li><a class='material-icons' id="btnObjectAllDelete" title="Delete All Objects">delete</a></li>--%>
                </ul>
            <div id="objectWrap" class="modify-scroll"></div>
            <div class="titleWrap">OBJECTS TAG</div>
            <ul class="headWrap">
                <li><span class="circle"></span></li>
                <li>tag</li>
                <li>value</li>
                <li>hotKey</li>
            </ul>
            <div id="objectTagWrap" class="modify-scroll"></div>




        </div>

    </div>
</div>
<div id="footerWrap">
    <ul>
        <li>
            <div id="noticeWrap"></div>
        </li>
        <li>
            <div id="workerBtnWrap">
<%--                <button id="btnGiveUp">Give Up</button>--%>
                <button id="btnSave">Save</button>
<%--                <button id="btnComplete">Complete</button>--%>
            </div>
            <%--            <div id="noneWorkerBtnWrap">--%>
            <%--                <button id="btnAllPass">All Pass</button>--%>
            <%--                <button id="btnAllOK">All OK</button>--%>
            <%--                <button id="btnModify">Modify</button>--%>
            <%--                <button id="btnMorePcds">Get More Pcds</button>--%>
            <%--            </div>--%>
        </li>
    </ul>
</div>


</body>





</html>
