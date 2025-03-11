
import { normalPopUpUI } from './normalPopUpUI.js';
import { controlPopUp } from './controlPopUp.js';
import { objects, globalData } from './variables.js';

function setSearchPopUp(datas, controlData){


    const user = globalData.permissionCode;

    // search 목록 구성
    const searchItems  = {
        statusOptions                  : "Status",
        classOptions                   : "Select Class",
        objectQtyOptions               : "Oboject Qty.",
        sortImageOptions               : "Sort Image",
        searchFileName                 : "File Name",
        // selectValidation               : "Select Validation",
        searchWorkerId                 : "Worker ID",
        searchReviewerId               : "Reviewer ID",
        // searchInspectorId              : "Inspector ID"
    };
    /////////////////////////////////////////



    const defaultStatusOptions = {
        filter_status_all              : "All",
        filter_status_open             : "Open",
        filter_status_assign           : "Assign",
        filter_status_worked           : "worked",
        filter_status_rvassign         : "Review Assign",
        filter_status_pass             : "Review Pass",
        filter_status_fail             : "Review Fail",
        // filter_status_insp             : "Inspected",
        // filter_status_insp_ok          : "Inspection OK",
        // filter_status_insp_ng          : "Inspection NG",
    }

    const reviewerStatusOptions = {
        filter_status_all_reviewer     : "All",
        filter_status_rvassign         : "Review Assign",
        filter_status_pass             : "Review Pass",
        filter_status_fail             : "Review Fail",
        // filter_status_insp             : "Inspected",
        // filter_status_insp_ok          : "Inspection OK",
        // filter_status_insp_ng          : "Inspection NG",
    };

    // const inspectorStatusOptions = {
    //     filter_status_all              : "All",
    //     filter_status_pass             : "Review Pass",
    //     // filter_status_insp             : "Inspected",
    //     // filter_status_insp_ok          : "Inspection OK",
    //     // filter_status_insp_ng          : "Inspection NG",
    // };


    const options = {};
    options.statusOptions ={};
    options.classOptions ={};
    options.classOptions['null'] = "All";

    // options의 status 셋팅 및 search 항목 설정
    // if(user === "compReviewer"){
    if(user === "reviewer"){
        options.statusOptions = reviewerStatusOptions;
        delete searchItems.searchReviewerId;
        // delete searchItems.searchInspectorId;
    }
    // else if(user === "inspector"){
    //     options.statusOptions = inspectorStatusOptions;
    //     delete searchItems.searchInspectorId;
    // }
    else if(user === "manager" || user === "master"){
        options.statusOptions = defaultStatusOptions;
    }

    // options의 class 셋팅
    for(let i=0 ; i<objects.classes.length ; i++){
        const key = objects.classes[i].classId;
        const value = objects.classes[i].className;
        options.classOptions[key] = value;
    }
    // <button type="button" className="btn-m-vc setTooltip btn-invalid-co" title="VALIDATION CHECK LIST 보기"
    //         onClick="page.fn.toggleVcModal();">VC</button>


    options.objectQtyOptions = {
        0      : "All",
        1      : "0",
        2      : "1",
        3      : "2",
        4      : "3",
        5      : "4",
        6      : "5",
        7      : "6",
        8      : "7",
        9      : "8",
        10      : "9",
        11     : "More than 10"
    }


    options.sortImageOptions = {
        orgnFileName           : "Image File Name Order",
        workerId               : "By Worker ID(abc)",
        workedDatetimeAsc      : "Old Worked Order",
        workedDatetime         : "Recent Worked Order",
        reviewedDatetime       : "Recent Reviewed Order",
        // inspDatetime           : "Recent Inspection Order"
    }

    // options.selectValidation = datas.taskWorkRuleType;

    searchPopUpWrap.innerHTML = normalPopUpUI;
    searchPopUpWrap.style.top = "300px";
    searchPopUpWrap.style.left = "75px";
    
    const title = searchPopUpWrap.querySelector('.title');
    title.children[0].innerText = "Search";
    const contentWrap = searchPopUpWrap.querySelector('.normalContentWrap');
    const table = document.createElement( 'table' );
    const colgroup = document.createElement( 'colgroup' );
    colgroup.innerHTML = `
                        <col width="40%">
                        <col width="*">
                        `;
    table.append(colgroup);



    // select와 input 구성
    for(let [key, value] of Object.entries(searchItems)){

        const tr = document.createElement( 'tr' );
        const td1 = document.createElement( 'td' );
        const td2 = document.createElement( 'td' );
        td1.innerHTML = value;

        if(key === "statusOptions" || key === "objectQtyOptions"
            || key === "sortImageOptions" || key === "reviewSystemOptions"/* || key === "selectValidation"*/) {
            const select = document.createElement('select');
            select.id = key;
            for (let [key1, value1] of Object.entries(options[key])) {
                const option = document.createElement("option");
                option.value = key1;
                option.appendChild(document.createTextNode(value1));
                select.appendChild(option);
                td2.append(select);
            }
        }
        // else if(key === "selectValidation" && options.selectValidation != null) {
        //     const div = `<div id='multiDropDown' class='multiDropDown' data-control='checkbox-dropdown' style="width: 100%;"></div>`;
        //     td2.innerHTML = div;
        //     const subDiv = `<div class="dropdown-label" style="width: 100%;"></div>`;
        //     $(td2).children("#multiDropDown").html(subDiv);
        //     const listDiv = `<div id='forValidationCheckList' class='dropdown-list'></div>`;
        //     $(td2).children("#multiDropDown").append(listDiv);
        //     for (let [key1, value1] of Object.entries(options[key])) {
        //         if(!"81/91".includes(key1)) {
        //             let optionDiv =
        //                 `<label class="multiDropdownItem">${value1}
        //                 <input type="checkbox" id='ruleType_${key1}' name='vcOption' value='${key1}'>
        //             </label>`;
        //             $(td2).children("#multiDropDown").children(".dropdown-list").append(optionDiv)
        //         }
        //     }
        //     $(document).on("click", "#multiDropDown .dropdown-label", function() {
        //         this.parentNode.classList.toggle('on');
        //     })
        // }
        else if(key === "classOptions"){

            const div1 = document.createElement("div");
            div1.id = "searchClassItemWrap";
            div1.classList.add("modify-scroll2");

            for (let [key1, value1] of Object.entries(options[key])) {
                const label = document.createElement("label");
                label.className = "searchClassItem";
                const input = document.createElement("input");
                label.innerText = value1;
                input.value = key1;
                input.setAttribute("type", "checkbox");
                label.appendChild(input);
                div1.append(label);
            }

            td2.append(div1);

        }else{
            const input = document.createElement("input");
            input.id = key;
            input.setAttribute("type", "text");
            input.addEventListener('focus', function(e){
                globalData.allowInputEvent = true;
                globalData.inputTextAreaTarget = this;
            });
            input.addEventListener('blur', function(e){
                globalData.allowInputEvent = false;
                globalData.inputTextAreaTarget = null;
            });
            td2.append(input);
        }

        tr.append(td1,td2);
        table.append(tr);
    }

    contentWrap.append(table);

    // class 멀티 체크 박스
    globalData.searchData.classOptions = [];

    for(let i=0 ; i<searchClassItemWrap.children.length ; i++){

        const input1 = searchClassItemWrap.children[i].querySelector('input');

        input1.addEventListener('change', function(e){

            if(input1.checked){
                if(input1.value === "null"){
                    globalData.searchData.classOptions = [];
                    for(let j=1 ; j<searchClassItemWrap.children.length ; j++){
                        const input2 = searchClassItemWrap.children[j].querySelector('input');
                        input2.checked = true;
                        globalData.searchData.classOptions.push(input2.value);
                    }
                }else{
                    globalData.searchData.classOptions.push(input1.value);
                }
            }else{
                if(input1.value === "null"){
                    for(let j=1 ; j<searchClassItemWrap.children.length ; j++){
                        const input2 = searchClassItemWrap.children[j].querySelector('input');
                        input2.checked = false;
                        globalData.searchData.classOptions = [];
                    }
                }else{
                    const input3 = searchClassItemWrap.children[0].querySelector('input');
                    input3.checked = false;

                    const findIndex = globalData.searchData.classOptions.findIndex((option)=>{
                        return option === input1.value;
                    });
                    globalData.searchData.classOptions.splice(findIndex,1);

                }
            }
        });

    }

    // 모든 class checked 되게 설정
    for(let i=0 ; i<searchClassItemWrap.children.length ; i++) {
        const input = searchClassItemWrap.children[i].querySelector('input');
        input.checked = true;
        if(input.value !== "null") {
            globalData.searchData.classOptions.push(input.value);
        }
    }

    // 권한별 statusOptions 셋팅
    for(let i=0; i<contentWrap.children[0].children.length ; i++){
        const select = contentWrap.children[0].children[i].querySelector('select');
        if( select !== null && select.id === "statusOptions") {
            // if(user === "compReviewer"){
            if(user === "reviewer"){
                select.selectedIndex = 1;
            }
            // else if(user === "inspector"){
            //     select.selectedIndex = 1;
            // }
            else if(user === "master"){
                select.selectedIndex = 0;
            }
        }
    }





    const buttonWrap = searchPopUpWrap.querySelector('.buttonWrap');

    // 하단 버튼 추가
    const button1 = document.createElement( 'button' );
    const button2 = document.createElement( 'button' );
    button1.innerText = "Search";
    button2.innerText = "Reset";
    button1.id = "btnSearch";
    button2.id = "btnReset";
    buttonWrap.append(button1, button2);


    button1.addEventListener('click', function(e){
        setSearchData(controlData);
    });

    // reset 버튼
    button2.addEventListener('click', function(e){
        const contentWrap = searchPopUpWrap.querySelector('.normalContentWrap');
        const selects = $(contentWrap).children().eq(0).find('select');
        const inputs = $(contentWrap).children().eq(0).find('input');
        selects.each(function (idx, select) {
            $(select).children().eq(0).prop("selected", true);
            if(select !== null && select.id === "statusOptions") {
                // if(user === "compReviewer"){
                if(user === "reviewer"){
                    select.selectedIndex = 1;
                }
                // else if(user === "inspector"){
                //     select.selectedIndex = 1;
                // }
                else if(user === "master"){
                    select.selectedIndex = 0;
                }
            }
        })
        inputs.each(function (idx, input) {
            // if($(input).attr("name") == "vcOption") {
            //     $(input).prop("checked", false);
            // } else
                if($(input).attr("type") == "checkbox") {
                $(input).prop("checked", true);
            } else {
                $(input).val("");
            }
        })
        $(contentWrap).find('.dropdown-label').html(datas.message.dropdown.allDeSelected);
    });

    controlPopUp(searchPopUpWrap);
}


function setSearchData(controlData){

    const contentWrap = searchPopUpWrap.querySelector('.normalContentWrap');

    for(let i=0; i<contentWrap.children[0].children.length ; i++){
        const select = contentWrap.children[0].children[i].querySelector('select');
        const input = contentWrap.children[0].children[i].querySelector('input');
        let value;
        if(select !== null) {
            if(select.value === "null" || select.value === ""){
                value = null;
            }else{
                value = select.value;
            }
            globalData.searchData[select.id] = value;
        }else if(input !== null) {
            if(input.value === "null" || input.value === ""){
                value = null;
            }else{
                value = input.value;
            }
            globalData.searchData[input.id] = value;
        }
    }

    globalData.searchData.objectQtyOptions = Number(globalData.searchData.objectQtyOptions) - 1;
    if( globalData.searchData.objectQtyOptions < 0 ){
        globalData.searchData.objectQtyOptions = null;
    }

    controlData("search");
}

export { setSearchPopUp, setSearchData }