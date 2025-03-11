let _UUID_CNT = 0;
function getUUID() { // UUID v4 generator in JavaScript (RFC4122 compliant)
//    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
//        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 3 | 8);
//        return v.toString(16);
//    });
//	return Math.floor(Math.random() * 1000) + "" + _UUID_CNT++;
    return Number.parseInt(Date.now() + "" + _UUID_CNT++).toString(32);

}

function resetUUID() {
    _UUID_CNT = 0;
}
var message = {};
Number.prototype.format = function(){
    if(this==0) return 0;

    var reg = /(^[+-]?\d+)(\d{3})/;
    var n = (this + '');

    while (reg.test(n)) n = n.replace(reg, '$1' + ',' + '$2');

    return n;
};
String.prototype.format = function(){
    var num = parseFloat(this);
    if( isNaN(num) ) return "0";

    return num.format();
};

$(document).ready(function(){
    $.ajaxSettings.traditional = true;
    _common.style.selectpickerHeight();
});
_common = {
    changeFileExt : function(originalFileName, newExt) {
        return originalFileName.substr(0, originalFileName.lastIndexOf(".")) + "." + newExt;
    }, isNotEmpty : function(_str){
        obj = String(_str);
        if(obj == null || obj == undefined) {
            return false;
        } else if (typeof(obj) == "string") {
            obj = obj.replace(/ /gi, '');
            if(obj == 'null' || obj == 'undefined' || obj == '') {
                return false;
            }else{
                return true;
            }
        } else {
            return true;
        }
    },
    isEmpty : function(_str){
        return !_common.isNotEmpty(_str);
    }
    , nvl : function(_str, defaultVal) {
        defaultVal = defaultVal ? defaultVal : "";
        if(_str == null) {
            _str = defaultVal;
        }else if(_str == undefined) {
            _str = defaultVal;
        }else if(_str == NaN) {
            _str = defaultVal;
        }

        return _str;
    }
};
_common.escapeHtml = function(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
_common.layerPop = {
    open: function( targetID ){
        targetID = $('.'+targetID);

        var scrollTemp = $(window).scrollTop();
        var wrap = targetID.parents('.layerPop'),
            bg = wrap.find('.dim');

        // �붾㈃�� 以묒븰�� �덉씠�대� �꾩슫��.
        if (targetID.outerHeight() < $(document).height() ) targetID.css('margin-top', '-'+targetID.outerHeight()/2+'px');
        else targetID.css('top', '0px');
        if (targetID.outerWidth() < $(document).width() ) targetID.css('margin-left', '-'+targetID.outerWidth()/2+'px');
        else targetID.css('left', '0px');

        //bg.show().css('height', $('.pop-wrapper').height());
        bg.show().css('height', '100vh').height();
        targetID.show();
        wrap.show();
        _common.layerPop.action(targetID, scrollTemp);
    },
    openId: function (targetID) {
        targetID = $('#' + targetID);

        var scrollTemp = $(window).scrollTop();
        var wrap = targetID.parents('.layerPop'),
            bg = wrap.find('.dim');

        // �붾㈃�� 以묒븰�� �덉씠�대� �꾩슫��.
        if (targetID.outerHeight() < $(document).height()) targetID.css('margin-top', '-' + targetID.outerHeight() / 2 + 'px');
        else targetID.css('top', '0px');
        if (targetID.outerWidth() < $(document).width()) targetID.css('margin-left', '-' + targetID.outerWidth() / 2 + 'px');
        else targetID.css('left', '0px');

        bg.show().css('height', $('.pop-wrapper').height());
        targetID.show();
        wrap.show();
        _common.layerPop.action(targetID, scrollTemp);
    },
    close: function(){
        $('.dim').hide();
        $('.layerPop').hide();
        $('.layerPop').find('.popup-wrapper').hide();
        if ($('.naviArea').is(':visible') || $('.expansion').is(':visible')) {

        } else {
            $(window).scroll().off();
        }

        $('#footer_tab').removeClass('type');
    },
    action: function(targetID, scrollTemp){
        if ( targetID.height() > $(window).height() ){ //popup height�� window.height�� �섏뼱媛��� 寃쎌슦(top�먯꽌 50px)
            targetID.css({'top': scrollTemp+30,'position':'absolute'});
            $(window).on('scroll', function(e){

                if ( $(window).scrollTop() < scrollTemp+30 ) { //scrollTop�� popup�� �꾩튂�� �붾㈃�� �섏뼱媛��� 寃쎌슦 媛뺤젣�곸쑝濡� popupTop�쇰줈 scroll�� �대룞
                    $('html,body').scrollTop(scrollTemp);
                    e.preventDefault();
                };

            });
        } else { //popup height�� window.height�� �덈꽆�닿컧 (媛��대� �뺣젹)
            targetID.css('margin-top',(-targetID.height()/2)+'px');
            _common.layerPop.reSize(targetID);
        }

    },
    reSize: function(targetID){
        $( window ).resize(function() {
            targetID.css('margin-top',(-targetID.height()/2)+'px');
        });
    }
};
// _common.hotkey = ["27", "13", "112", "113", "114", "65", "82", "80", "76", "32", "46", "88", "90", "71", "67"];
//_common.hotkey = ["27", "112", "116", "32", "46", "82", "ctrl_90", "ctrl_26", "shift_73", "shift_79", "shift_77", "shift_65", "shift_82", "shift_80", "shift_76", "shift_88", "shift_84", "shift_75", "shift_67", "shift_90"];
// _common.hotkey = ["27", "112", "113", "114", "115", "116", "32", "ctrl_67", "ctrl_shift_67", "ctrl_86", "46", "ctrl_90", "116", "49", "50", "51", "81", "87", "69", "82", "65", "83", "90", "88", "67", "8", "20", "13", "shift_16", "ctrl_17"];
_common.hotkey = ["8", "27", "112", "113", "114", "115", "116", "120", "121", "123", "32", "ctrl_83", "ctrl_67"
    , "ctrl_shift_67", "ctrl_86", "ctrl_71", "46", "ctrl_90", "49", "50", "51", "81", "87", "69", "82", "65", "83"
    , "68", "70", "71", "52", "53", "97", "98", "99", "100"
    , "alt_80", "alt_81", "alt_87", "alt_69", "alt_69", "ctrl_219", "ctrl_221", "alt_ctrl_37", "alt_ctrl_39"
    , "alt_37", "alt_39", "13"
    , "45", "34", "33", "35", "36"
    , "alt_33", "alt_34", "alt_35", "alt_36"
];
_common.getKeyboard = function(event) {
    var keyCode = "", keyName = "";
    if(event.altKey) {
        keyCode += "alt_";
        keyName += "Alt+";
    }
    if(event.ctrlKey) {
        keyCode += "ctrl_";
        keyName += "Ctrl+";
    }

    if(event.shiftKey) {
        keyCode += "shift_";
        keyName += "Shift+";
    }
    // console.log("key: " + key);
    keyCode += event.which ? event.which:event.keyCode;
    if(event.key != null){
        keyName += event.key.toUpperCase();
    }
    return {keyCode : keyCode, keyName : keyName};
}


_common.getKeyboardCompany = function(event) {
    var keyCode = "", keyName = "";
    if(event.altKey) {
        keyCode += "alt_";
        keyName += "Alt+";
    }
    if(event.ctrlKey) {
        keyCode += "ctrl_";
        keyName += "Ctrl+";
    }

    if(event.shiftKey) {
        keyCode += "shift_";
        keyName += "Shift+";
    }
    var chkKeyCode = event.keyCode;
    if (event.keyCode >= 97 && event.keyCode <= 122) {
        if (event.shiftKey) {
        }else{
            chkKeyCode = (event.keyCode - 32);
        }
    }
    keyCode += chkKeyCode;
    keyName += event.key.toUpperCase();

    if(keyName == "PROCESS" || keyName == "BACKSPACE" || keyName == "META" || keyName == "HANJAMODE"){
        keyCode = "";
        keyName = "";
    }

    return {keyCode : keyCode, keyName : keyName};
}

_common.getKeyName = function(hk) {
    var keyName = "";
    if(hk.includes("alt_")) {
        keyName += "Alt+";
    }
    if(hk.includes("ctrl_")) {
        keyName += "Ctrl+";
    }
    if(hk.includes("shift_")) {
        keyName += "Shift+";
    }
    var k = hk.replace(/alt_/gi, "").replace(/ctrl_/gi, "").replace(/shift_/gi, "");
    keyName += k;
    return keyName;
}
_common.refreshStorageUsage = function() {
    _common.ajax.asyncJSON("/common/getStorageUsage", null, function(r){
        if(r && r.result) {
            var usage = _common.readAbleSize(r.data.useStorage);
            var max;
            if(r.data.maxStorage == 0) {
                max = "Unlimited";
            }else{
                max = _common.readAbleSize(r.data.maxStorage);
            }
            $("#userUsageStorage").text(usage);
            $("#userMaxStorage").text(max);
        }
    }, null, false);
}
_common.readAbleSize = function (x) {
    var e = false;
    var a = [
        "B",
        "KB",
        "MB",
        "GB",
        "TB",
        "PB",
        "EB"
    ];
    for (var y = 0; y < a.length; y++) {
        if (x > 1024) {
            x = x / 1024;
        } else {
            if (e === false) {
                e = y;
            }
        }
    }
    if (e === false) {
        e = a.length - 1;
    }
    return Math.round(x * 100) / 100 + " " + a[e];
}
_common.random = {
    getRange : function(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}
_common.template = {
    parseObject : function (templateId, data) {
        var tmpl = $("#"+templateId).text();
        if(data != null) {
            try {
                Object.keys(data).forEach(function(k){
                    tmpl = tmpl.replace(new RegExp("#"+k+"#", "gi"), data[k]);
                });
            } catch (E) {
                log.error(E);
            }
        }
        return tmpl;
    }, parseMessage : function(message, data) {
        if(data != null) {
            try {
                Object.keys(data).forEach(function(k){
                    message = message.replace(new RegExp("#"+k+"#", "gi"), data[k]);
                });
            } catch (E) {
                log.error(E);
            }
        }
        return message;
    }, parseList : function (templateId, list) {
        var r = [];
        if(list != null && list.length > 0) {
            list.forEach(function(o){
                r.push(_common.template.parseObject(templateId, o));
            });
        }
        return r;
    }
}
_common.attachFileDownload = function (fileId){
    window.location.assign('/common/attachFileDownload/'+fileId);
};
_common.cookie = {
    get : function (key, defaultValue) {
        let nameEQ = key + "=";
        let ca = document.cookie.split(';');
        let val = null;
        for(let i=0;i < ca.length;i++) {
            let c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) val = c.substring(nameEQ.length,c.length);
        }
        if(val == null || val == "null" || val == "") {
            val = defaultValue;
        }
        return val;
    }, set : function (key, value) {
        var expires = "";
        var date = new Date();
        date.setTime(date.getTime() + (365*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
        document.cookie = key + "=" + value + expires + "; path=/";
    }
    , getNumber : function (key, value) {
        let val = _common.cookie.get(key);
        if(val == null) {
            return value;
        }else {
            return Number.parseFloat(val);
        }
    }
    , remove : function(key) {
        document.cookie = key + "=; expires=0; path=/";
    }
};
_common.msg = function(msg, title, errorCode) {
    errorCode = errorCode ? "[�ㅻ쪟肄붾뱶:"+errorCode+"] " : "";
    msg = msg.replace(/#errorCode#/gi, errorCode);
    if($("#commonNotificationTitle").length == 1) {
        if(_common.isNotEmpty(title)) {
            $("#commonNotificationTitle").text(title);
        }else{
            $("#commonNotificationTitle").text("Notification");
        }
        $("#commonNotificationMassage").html(msg);

        $('#commonModal').modal('show');
    } else if($("#footerMsgTitle").length == 1) {
        $("#footerMsgTitle").text(msg);
        $("#footerMsg").fadeIn(1000).fadeOut(1000).fadeIn(1000);
        let popHist = $("#popMsgHisContents");
        popHist.append("<p>["+moment().format('YYYY-MM-DD HH:mm:ss')+"] "+msg+"</p>");
        popHist.scrollTop(popHist.prop('scrollHeight'));
    } else {
        alert(msg);
    }
}
_common.searchForm = function() {
    if($("#searchFormCompany").length == 1) {
        var companyList = _common.data.getCompanyList();
        if(companyList != null) {
            for(var i = 0; i < companyList.length; i++) {
                $("#searchFormCompany").append(new Option(companyList[i].name, companyList[i].cpNo));
            }
//			$("#searchFormCompany option").attr("selected", "selected");

            $("#searchFormCompany").on("change", function(){
                _common.data.onChangeCompany(false, true, "#searchFormCompany", "#searchFormTeam");
            });
        }else{
            log.info("search form, company data is not exists.");
        }
        $('#searchFormCompany').selectpicker();
        if($('#searchFormCompany option').length > 0) {
            try {
                $('#searchFormCompany').selectpicker('deselectAll');
            } catch (e) {

            }
        }
    }else{
        log.info("search form, select-company is not exists.");
    }

    $('#searchFormTeam').selectpicker();
}

_common.style = {
    selectpickerHeight : function () {
        log.info("_common.style.selectpickerHeight();");

        $("div.bootstrap-select button.dropdown-toggle").attr("onclick", "_common.style.clickedSelectPickerButton(this);");
    }
    , clickedSelectPickerButton : function (obj) {
        $(obj).parent().children("div[role='combobox']").children("div[role='listbox']").css("maxHeight", 300);
    }
}
_common.checkLogin = function() {
    if(!window.location.pathname.startsWith("/annotation/")) {
        var token = $("meta[name='_csrf']").attr("content");
        var header = $("meta[name='_csrf_header']").attr("content");

        var isLogined = $.ajax({
            url : "/common/isLogined"
            , cache : false
            , type: "POST"
            , dataType : "json"
            , async: false
            , contentType : 'application/json'
            , beforeSend : function (xhr) {
                xhr.setRequestHeader(header, token);
            }
        });
        if(isLogined.status == 200){
            if(isLogined.responseJSON.result) {
                return true;
            } else {
                if(confirm("濡쒓렇�꾩썐�섏뿀�듬땲��.\n吏�湲� �ㅼ떆 濡쒓렇�명븯�쒓쿋�듬땲源�?")){
                    window.location = "/login";
                }
            }
        } else {
            alert("�쒕쾭濡쒕��� �묐떟�� �щ컮瑜댁� �딆뒿�덈떎. �ㅼ떆 �쒕룄�댁＜�몄슂.");
            return false;
        }
    } else {
        return true;
    }

}
_common.ajax = {
    isCheckLogin : true
    , asyncHTML : function(rurl, param, returnFunction) {
        var token = $("meta[name='_csrf']").attr("content");
        var header = $("meta[name='_csrf_header']").attr("content");

        if(_common.checkLogin() == false) {
            return false;
        }

        $.ajax({
            url : rurl
            , async : true
            , cache : false
            , data : param
            , type: "POST"
            , dataType : "html"
            , success : function (retv) {
                if($.type(returnFunction) == "function") {
                    returnFunction(retv);
                }
            }, error : function (err) {
                try {
                    if($("#div_loading").hasClass("on")) {
                        $("#div_loading").removeClass("on");
                    }

                    alert(err);
                } catch (e) {
                    log.error(e);
                }
            }, beforeSend : function (xhr) {
                xhr.setRequestHeader(header, token);
                if(typeof(loadingDiv) == "function"){
                    loadingDiv(true);
                }
            }, complete : function () {
                if(typeof(loadingDiv) == "function"){
                    loadingDiv(false);
                }
            }
        });
    }
    , syncHTML : function(rurl, param) {
        var token = $("meta[name='_csrf']").attr("content");
        var header = $("meta[name='_csrf_header']").attr("content");

        if(_common.checkLogin() == false) {
            return false;
        }
        var retv = $.ajax({
            url : rurl
            , async : false
            , cache : false
            , data : param
            , type: "POST"
            , dataType : "html"
            , error : function (err) {
                console.log(err);
            }, beforeSend : function (xhr) {
                xhr.setRequestHeader(header, token);
            }
        });
        return retv;
    }
    , asyncMultipart : function (rurl, formSelector, returnFunction) {
        var token = $("meta[name='_csrf']").attr("content");
        var header = $("meta[name='_csrf_header']").attr("content");

        if(_common.checkLogin() == false) {
            return false;
        }
        $.ajax({
            url : rurl
            , async : true
            , cache : false
            , data : new FormData($(formSelector)[0])
            , type: "POST"
            , enctype : "multipart/form-data"
            , processData : false
            , contentType : false
            , success : function (retv) {
                if($.type(returnFunction) == "function") {
                    returnFunction(retv);
                }
            }, error : function (err) {
                try {
                    if($("#div_loading").hasClass("on")) {
                        $("#div_loading").removeClass("on");
                    }
                    alert(err);
                } catch (e) {
                    log.error(e);
                }
            }, beforeSend : function (xhr) {
                xhr.setRequestHeader(header, token);
                if(typeof(loadingDiv) == "function"){
                    loadingDiv(true);
                }
            }, complete : function () {
                if(typeof(loadingDiv) == "function"){
                    loadingDiv(false);
                }
            }
        });
    }
    /**
     param = {
            , url : URL
            , param : null
            , returnFunction : null
            , errorFunction : null
            , isLoading : true
            , contentType : "application/x-www-form-urlencoded;charset=UTF-8"
            , isCheckLogin : true
        }
     **/
    , asyncJSON2 : function(param) {
        if(param && param != null && _common.isNotEmpty(param)) {
            param.isLoading = param.isLoading == false ? false : true;
            param.isCheckLogin = param.isCheckLogin == false ? false : true;
            param.contentType = _common.nvl(param.contentType, "application/x-www-form-urlencoded;charset=UTF-8");
            _common.ajax.asyncJSON(
                param.url
                , param.param
                , param.returnFunction
                , param.errorFunction
                , param.isLoading
                , param.contentType
                , param.isCheckLogin
            );
        }else{
            log.error("_common.ajax.asyncJSON2(), your parameter is wrong!");
        }
    }
    , asyncJSON : function(rurl, param, returnFunction, errorFunction, isLoading, contentType, isCheckLogin) {
        var token = $("meta[name='_csrf']").attr("content");
        var header = $("meta[name='_csrf_header']").attr("content");
        if(isCheckLogin != true && isCheckLogin != false) {
            isCheckLogin = _common.ajax.isCheckLogin;
        }
        if(!isCheckLogin) {
            log.info("skip check logined");
        }else{
            if(_common.checkLogin() == false) {
                log.info("need login");
                return false;
            }else{
                log.info("logined");
            }
        }
        contentType = contentType == null ? "application/x-www-form-urlencoded;charset=UTF-8" : contentType;
//		log.info("contentType="+contentType);
        isLoading = isLoading == false ? false : true;
        $.ajax({
            url : rurl
            , async : true
            , cache : false
            , data : param
            , type: "POST"
            , dataType : "json"
            , contentType : contentType
            , success : function (retv) {
                if($.type(returnFunction) == "function") {
                    returnFunction(retv);
                }
            }, error : function (request,status,error) {
                if($("#div_loading").hasClass("on")) {
                    $("#div_loading").removeClass("on");
                }

                if($.type(errorFunction) == "function") {
                    errorFunction(param);
                }else{
                    try {
                        //_common.msg(JSON.stringify(err));
                        log.info("request.status : " + request.status);
                        log.info("request.responseText : " + request.responseText);
                        log.info("request.responseText : " + request.error);
                    } catch (e) {
                        log.error(e);
                    }
                }
            }, beforeSend : function (xhr) {
                xhr.setRequestHeader(header, token);
                if(isLoading && typeof(loadingDiv) == "function"){
                    loadingDiv(true);
                }
            }, complete : function () {
                if(isLoading && typeof(loadingDiv) == "function"){
                    loadingDiv(false);
                }
            }
        });
    }
    , notUserAsyncJSON : function(rurl, param, returnFunction, errorFunction, isLoading, contentType) {
        var token = $("meta[name='_csrf']").attr("content");
        var header = $("meta[name='_csrf_header']").attr("content");

        contentType = contentType == null ? "application/x-www-form-urlencoded;charset=UTF-8" : contentType;
//		log.info("contentType="+contentType);
        isLoading = isLoading == false ? false : true;
        $.ajax({
            url : rurl
            , async : true
            , cache : false
            , data : param
            , type: "POST"
            , dataType : "json"
            , contentType : contentType
            , success : function (retv) {
                if($.type(returnFunction) == "function") {
                    returnFunction(retv);
                }
            }, error : function (request,status,error) {
                if($("#div_loading").hasClass("on")) {
                    $("#div_loading").removeClass("on");
                }

                if($.type(errorFunction) == "function") {
                    errorFunction(param);
                }else{
                    try {
                        //_common.msg(JSON.stringify(err));
                        log.info("request.status : " + request.status);
                        log.info("request.responseText : " + request.responseText);
                        log.info("request.responseText : " + request.error);
                    } catch (e) {
                        log.error(e);
                    }
                }
            }, beforeSend : function (xhr) {
                xhr.setRequestHeader(header, token);
                if(typeof(loadingDiv) == "function"){
                    loadingDiv(true);
                }
            }, complete : function () {
                if(typeof(loadingDiv) == "function"){
                    loadingDiv(false);
                }
            }
        });
    }
    , asyncJSONString : function(rurl, param, returnFunction, isCheckLogin) {
        var token = $("meta[name='_csrf']").attr("content");
        var header = $("meta[name='_csrf_header']").attr("content");

        if(isCheckLogin != true && isCheckLogin != false) {
            isCheckLogin = _common.ajax.isCheckLogin;
        }
        if(!isCheckLogin) {
            log.info("skip check logined");
        }else{
            if(_common.checkLogin() == false) {
                return false;
            }
        }
        $.ajax({
            url : rurl
            , async : true
            , cache : false
            , data : JSON.stringify(param)
            , type: "POST"
            , contentType: 'application/json'
            , success : function (retv) {
                if($.type(returnFunction) == "function") {
                    returnFunction(retv);
                }
            }, error : function (err) {
                try {
                    if($("#div_loading").hasClass("on")) {
                        $("#div_loading").removeClass("on");
                    }

                    alert(JSON.stringify(err));
                } catch (e) {
                    log.error(e);
                }
            }, beforeSend : function (xhr) {
                xhr.setRequestHeader(header, token);
                if(typeof(loadingDiv) == "function"){
                    loadingDiv(true);
                }
            }, complete : function () {
                if(typeof(loadingDiv) == "function"){
                    loadingDiv(false);
                }
            }
        });
    }
    , syncJSON : function(rurl, param, contentType, isCheckLogin) {
        var token = $("meta[name='_csrf']").attr("content");
        var header = $("meta[name='_csrf_header']").attr("content");
        if(isCheckLogin != true && isCheckLogin != false) {
            isCheckLogin = _common.ajax.isCheckLogin;
        }
        if(!isCheckLogin) {
            log.info("skip check logined");
        }else{
            log.info("check logined, rurl="+rurl);
            if(_common.checkLogin() == false) {
                return false;
            }
        }
        contentType = contentType == null ? "application/x-www-form-urlencoded;charset=UTF-8" : contentType;
//		log.info("contentType="+contentType);
        var retv = $.ajax({
            url : rurl
            , async : false
            , cache : false
            , data : param
            , type: "POST"
            , dataType : "json"
            , contentType : contentType
            , error : function (err) {
                _common.msg(err);
            }, beforeSend : function (xhr) {
                xhr.setRequestHeader(header, token);
                if(typeof(loadingDiv) == "function"){
                    loadingDiv(true);
                }
            }, complete : function () {
                if(typeof(loadingDiv) == "function"){
                    loadingDiv(false);
                }
            }
        });
        return retv.responseJSON;
    }
    , asyncJSONFtooterLoading : function(rurl, param, returnFunction, errorFunction, isLoading, contentType, isCheckLogin) {
        var token = $("meta[name='_csrf']").attr("content");
        var header = $("meta[name='_csrf_header']").attr("content");
        if(isCheckLogin != true && isCheckLogin != false) {
            isCheckLogin = _common.ajax.isCheckLogin;
        }
        if(!isCheckLogin) {
            log.info("skip check logined");
        }else{
            if(_common.checkLogin() == false) {
                return false;
            }
        }
        contentType = contentType == null ? "application/x-www-form-urlencoded;charset=UTF-8" : contentType;
//		log.info("contentType="+contentType);
        isLoading = isLoading == false ? false : true;
        $.ajax({
            url : rurl
            , async : true
            , cache : false
            , data : param
            , type: "POST"
            , dataType : "json"
            , contentType : contentType
            , success : function (retv) {
                if($.type(returnFunction) == "function") {
                    returnFunction(retv);
                }
            }, error : function (request,status,error) {

                if($.type(errorFunction) == "function") {
                    errorFunction(param);
                }else{
                    try {
                        //_common.msg(JSON.stringify(err));
                        log.info("request.status : " + request.status);
                        log.info("request.responseText : " + request.responseText);
                        log.info("request.responseText : " + request.error);
                    } catch (e) {
                        log.error(e);
                    }
                }
            }, beforeSend : function (xhr) {
                xhr.setRequestHeader(header, token);
            }, complete : function () {
            }
        });
    }	, noAsyncJSON : function(rurl, param, returnFunction, errorFunction, isLoading, contentType, isCheckLogin) {
        var token = $("meta[name='_csrf']").attr("content");
        var header = $("meta[name='_csrf_header']").attr("content");
        if(isCheckLogin != true && isCheckLogin != false) {
            isCheckLogin = _common.ajax.isCheckLogin;
        }
        if(!isCheckLogin) {
            log.info("skip check logined");
        }else{
            if(_common.checkLogin() == false) {
                return false;
            }
        }
        contentType = contentType == null ? "application/x-www-form-urlencoded;charset=UTF-8" : contentType;
//		log.info("contentType="+contentType);
        isLoading = isLoading == false ? false : true;
        $.ajax({
            url : rurl
            , async : true
            , cache : false
            , data : param
            , type: "POST"
            , dataType : "json"
            , contentType : contentType
            , success : function (retv) {
                if($.type(returnFunction) == "function") {
                    returnFunction(retv);
                }
            }, error : function (request,status,error) {
                if($("#div_loading").hasClass("on")) {
                    $("#div_loading").removeClass("on");
                }

                if($.type(errorFunction) == "function") {
                    errorFunction(param);
                }else{
                    try {
                        //_common.msg(JSON.stringify(err));
                        log.info("request.status : " + request.status);
                        log.info("request.responseText : " + request.responseText);
                        log.info("request.responseText : " + request.error);
                    } catch (e) {
                        log.error(e);
                    }
                }
            }, beforeSend : function (xhr) {
                xhr.setRequestHeader(header, token);
                if(typeof(loadingDiv) == "function"){
                    loadingDiv(true);
                }
            }, complete : function () {
                if(typeof(loadingDiv) == "function"){
                    loadingDiv(false);
                }
            }
        });
    }
};
_common.memo = {
    isView : false
    , isInit : false
    , window : null
    , updateDate : null
    , interval : 1000
    , dataView: null
    , pkno : null
    , view : function () {
        _common.memo.isView = true;
        if(!_common.memo.isInit) {
            var popupHeight = 500;
            var underHeight = 30;
            var width = 245;
            _common.memo.isInit = true;
            var dWin = new dhtmlXWindows();
            _common.memo.window = dWin.createWindow("PopupMemo", 2, 2, width, popupHeight, $(".wrap"));
            _common.memo.window.setText("Memo");
            _common.memo.window.denyResize();
            _common.memo.window.attachEvent("onClose", function(win){
                _common.memo.window.hide();
                _common.memo.isView = false;
            });
            $("div.dhxwin_active").css("z-index", 999999);
            var layout = _common.memo.window.attachLayout({
                pattern:    "2E"
                , offsets : {
                    top:    0
                    , right:  0
                    , bottom: 0
                    , left:   0
                }, cells: [
                    {
                        id:             "a",        // id of the cell you want to configure
                        text:           "Memos",     // header text
                        collapsed_text: "Memos",   // header text for a collapsed cell
                        header:         false,      // hide header on init
                        width:          width,        // cell init width
                        height:         (popupHeight - underHeight),        // cell init height
                        collapse:       false,        // collapse on init
                        fix_size:       [true,true] // fix cell's size, [width,height]
                    }, {
                        id:             "b",        // id of the cell you want to configure
                        text:           "Add",     // header text
                        collapsed_text: "Add",   // header text for a collapsed cell
                        header:         false,      // hide header on init
                        width:          width,        // cell init width
                        height:         underHeight,        // cell init height
                        collapse:       false,        // collapse on init
                        fix_size:       [true,true] // fix cell's size, [width,height]
                    }
                ]
            });
            layout.cells("a").attachHTMLString("<div id='wrapMemoList'></div>");
            layout.cells("b").attachHTMLString("<div class='memoBtns'><textarea name='memoTextarea'></textarea><button onclick='_common.memo.add();'>Send</button></div>");
        }else{
            _common.memo.window.show();
        }
        $(".dhxwin_active").css("z-index", "1600");
        _common.memo.get();
    }, hide : function () {
        _common.memo.window.hide();
        _common.memo.isView = false;
    }, toggle : function () {
        if(_common.memo.isView) {
            _common.memo.hide();
        }else{
            _common.memo.view();
        }
    }, add : function() {
        var txt = $("textarea[name='memoTextarea']").val();
        txt = txt.replace(/\n/gi, "<br/>");
        _common.ajax.asyncJSON(
            "/common/addMemo"
            , {"contents":txt, "categoryNo":0}
            , function(){
                $("textarea[name='memoTextarea']").val("");
            }
            , null
            , false
        );
    }, get : function () {
        if(!_common.memo.isView) {
            return false;
        }
        _common.ajax.asyncJSON(
            "/common/listMemo"
            , {categoryNo:0, pkno: _common.memo.pkno}
            , function(r){
                if(r.result && r.data != null) {
                    var isBottom = ($("#wrapMemoList").prop("scrollHeight") - $("#wrapMemoList").prop("scrollTop") - $("#wrapMemoList").height()) == 0 ? true : false;

                    _common.memo.updateDate = r.data[0].updateDate;
                    for(var i = 1; i < r.data.length; i++) {
                        $("#wrapMemoList").append("<p>"+r.data[i].regDate+" "+r.data[i].name+"<br/><span class='contents'>"+r.data[i].contents+"</span></p>");
                        _common.memo.pkno = r.data[i].pkno;
                    }
                    if(isBottom) {
                        $("#wrapMemoList").scrollTop($("#wrapMemoList").prop("scrollHeight"));
                    }
                }
                setTimeout(_common.memo.get, _common.memo.interval);
            }
            , function(){
                setTimeout(_common.memo.get, _common.memo.interval);
            }
            , false
        );
    }
};
//$(document.body).ready(function(){
//	$(window).keydown(function(EVT){
//		var key = EVT.which?EVT.which:event.keyCode;
//		log.info(key);
//CTRL+M
//		if(EVT.ctrlKey && key == 77) {
//			_common.memo.toggle();
//		}
//	});
//});
_common.time = {
    toTextByNow : function(compareTime) {
        var now = new Date() - new Date(compareTime);
        return _common.time.toTextByCompare(compareTime, now);
    }, toTextByCompare : function(previusTime, nextTime) {
        var r = "";
        try {
            var now = new Date(nextTime) - new Date(previusTime);
            now = now / 1000;
            if(now > 60) {
                //遺꾨떒��
                now = now / 60;
                if(now > 60) {
                    //�쒓컙�⑥쐞
                    now = now / 60;
                    if(now > 24) {
                        //�� �⑥쐞
                        now = now / 24;
                        if(now > 30) {
                            //�붾떒��
                            now = now / 30;
                            if(now > 12) {
                                //�곕떒��
                                now = now / 12;
                                r = Math.round(now) + "Years";
                            } else {
                                r = Math.round(now) + "Months";
                            }
                        } else {
                            r = Math.round(now) + "Days";
                        }
                    }else{
                        r = Math.round(now) + "Hours";
                    }
                }else{
                    r = Math.round(now) + "Minutes";
                }
            } else {
                r = Math.round(now) + "Seconds";
            }
        } catch (E) {
            r = "";
        }
        return r;
    }
};
_common.error = {
    img : function(el, imgUrl){
        var url = "/image/tool/empty.png";

        $(el).on("error", function (){
            $(el).unbind("error");
            $(el).attr("src", url);
            return false;
        });

        $(el).attr("src", imgUrl);

    }
};

_common.drawPage = {
    page :	function(page, pageId = "div_page"){

        let $pageId = $("#" + pageId);
        $pageId.html("");
        if(page.nextGroupIndex > 1){
            if(page.nowPageGroup == 1) {
                $pageId.append(`<a href="javascript:void(0);" class="page-prev" style="cursor:default">keyboard_arrow_left</a>`);
            } else {
                $pageId.append(`<a href="javascript:paging(${page.startPage - 1});" class="page-prev on">keyboard_arrow_left</a>`);
            }

            for(var i = page.startPage; i < (page.endPage + 1); i++) {
                if(i == page.pageIndex) {
                    $pageId.append(`<a href="javascript:paging('${i}');" class="on">${i}</a>`);
                } else {
                    $pageId.append(`<a href="javascript:paging('${i}');" >${i}</a>`);
                }
            }

            if(page.nowPageGroup >= page.pageGroupCount) {
                $pageId.append(`<a href="javascript:void(0);" class="page-next" style="cursor:default">keyboard_arrow_right</a>`);
            } else {
                $pageId.append(`<a href="javascript:paging('${page.endPage + 1}');" class="page-next on">keyboard_arrow_right</a>`);
            }
        }
    },

    pageFunc :	function(page, pageId = "div_page", funcName = "paging"){

        let $pageId = $("#" + pageId);

        $pageId.html("");
        if(page.nowPageGroup == 1) {
            $pageId.append(`<a href="javascript:void(0);" class="page-prev" style="cursor:default">keyboard_arrow_left</a>`);
        } else {
            $pageId.append(`<a href="javascript:${funcName}(${page.startPage - 1});" class="page-prev">keyboard_arrow_left</a>`);
        }

        for(var i = page.startPage; i < (page.endPage + 1); i++) {
            if(i == page.pageIndex) {
                $pageId.append(`<a href="javascript:${funcName}('${i}');" class="on">${i}</a>`);
            } else {
                $pageId.append(`<a href="javascript:${funcName}('${i}');" >${i}</a>`);
            }
        }

        if(page.nowPageGroup >= page.pageGroupCount) {
            $pageId.append(`<a href="javascript:void(0);" class="page-next" style="cursor:default">keyboard_arrow_right</a>`);
        } else {
            $pageId.append(`<a href="javascript:${funcName}('${page.endPage + 1}');" class="page-next">keyboard_arrow_right</a>`);
        }
    }
}

_common.hexToRgb = function(hex) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function lpad(str, padLen, padStr) {
    if (padStr.length > padLen) {
        console.log("�ㅻ쪟 : 梨꾩슦怨좎옄 �섎뒗 臾몄옄�댁씠 �붿껌 湲몄씠蹂대떎 �쎈땲��");
        return str;
    }
    str += ""; // 臾몄옄濡�
    padStr += ""; // 臾몄옄濡�
    while (str.length < padLen)
        str = padStr + str;
    str = str.length >= padLen ? str.substring(0, padLen) : str;
    return str;
}

function copyToClipboard(str) {
    var t = document.createElement("textarea");
    document.body.appendChild(t);
    t.value = str;
    t.select();
    document.execCommand('copy');
    document.body.removeChild(t);
}
try {
    dhtmlXForm.prototype.getButton = function(name){
        return this.doWithItem(name, "getButton");
    };

    dhtmlXForm.prototype.items.button.getButton = function(item){
        return item.firstChild;
    };

} catch (E) {

}
function getUrlParams() {
    var params = {};
    window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (str, key, value) {
        params[key] = value;
    });

    return params;
}

HashMap = function(){
    this.map = new Array();
};
HashMap.prototype = {
    getAllDataToList : function() {
        let list = [];
        for(i in this.map){
            list.push(this.map[i]);
        }
        return list;
    },
    length : function() {
        return this.keySet().length;
    },
    createKey : function() {
        return moment().format('YYYYMMDDHHmmssSSS');
    },
    getLastKey : function() {
        let keys = this.keySet();
        return keys[keys.length - 1];
    },
    getLastData : function() {
        let keys = this.keySet();
        return this.get(keys[keys.length - 1]);
    },
    put : function(key, value){
        key = key == null ? this.createKey() : key;
        key += "";
        this.map[key] = value;
    },
    get : function(key){
        key += "";
        return this.map[key];
    },
    getAll : function(){
        return this.map;
    },
    clear : function(){
        this.map = new Array();
    },
    isEmpty : function(){
        return (this.map.size() == 0);
    },
    remove : function(key){
        key += "";
        delete this.map[key];
    },
    toString : function(){
        var temp = '';
        for(i in this.map){
            temp = temp + ',' + i + ':' +  this.map[i];
        }
        temp = temp.replace(',','');
        return temp;
    },
    keySet : function(){
        var keys = new Array();
        for(i in this.map){
            keys.push(i);
        }
        return keys;
    }
};

Number.prototype.toFixedSpecial = function(n) {
    var str = this.toFixed(n);
    if (str.indexOf('e+') === -1)
        return str;

    // if number is in scientific notation, pick (b)ase and (p)ower
    str = str.replace('.', '').split('e+').reduce(function(b, p) {
        return b + Array(p - b.length + 2).join(0);
    });

    if (n > 0)
        str += '.' + Array(n + 1).join(0);

    return str;
};

let rgbToHex = function (rgb) {
    let hex = Number(rgb).toString(16);
    if (hex.length < 2) {
        hex = "0" + hex;
    }
    return hex;
};

let fullColorHex = function(r,g,b) {
    let red = rgbToHex(r);
    let green = rgbToHex(g);
    let blue = rgbToHex(b);
    return red+green+blue;
};

_common.convertData = function(dateStr) {
    dateStr = dateStr == null ? "" : dateStr;
    return dateStr.replace(".0", '');
}

_common.postForm = function(path, params, method) {
    method = method || 'post';

    let form = document.createElement('form');
    form.setAttribute('method', method);
    form.setAttribute('action', path);

    let hiddenField = document.createElement('input');
    hiddenField.setAttribute('type', 'hidden');
    hiddenField.setAttribute('name', "_csrf");
    hiddenField.setAttribute('value', $("meta[name='_csrf']").attr("content"));

    form.appendChild(hiddenField);
    for (let key in params) {
        if (params.hasOwnProperty(key)) {
            let hiddenField = document.createElement('input');
            hiddenField.setAttribute('type', 'hidden');
            hiddenField.setAttribute('name', key);
            hiddenField.setAttribute('value', params[key]);

            form.appendChild(hiddenField);
        }
    }

    document.body.appendChild(form);
    form.submit();
}