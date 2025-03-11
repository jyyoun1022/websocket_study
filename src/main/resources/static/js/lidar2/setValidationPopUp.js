
import * as THREE from "./build/three.module.js";
import { normalPopUpUI } from './normalPopUpUI.js';
import { controlPopUp } from './controlPopUp.js';
import { objects } from './variables.js';

// function setValidationPopUp(datas, controlData) {
//     $(".VC-check li").remove();
//     if(datas.task.validatorList != null) {
//         datas.task.validatorList.forEach(function (obj) {
//             if (_common.isNotEmpty(obj.workRuleType) && "11/21/31/41/51/61/71/81/91/101".includes(obj.workRuleType)) {
//                 $("#forRuleType_" + obj.workRuleType + " span").hide();
//                 if (obj.workRuleType == '61') {
//                     let typeList = [];
//                     if (obj.numbering == "Y") {
//                         typeList.push(datas.message.numbering);
//                     }
//                     if (obj.letter == "Y") {
//                         typeList.push(datas.message.letter);
//                     }
//                     if (obj.specialCharacter == "Y") {
//                         typeList.push(datas.message.specialCharacter);
//                     }
//                     obj.typeList = typeList;
//                     if (_common.isEmpty(obj.tagClassName)) {
//                         obj.tagClassName = obj.tagName;
//                     }
//                 } else if (obj.workRuleType == '71') {
//                     if (_common.isNotEmpty(obj.numbering)) {
//                         obj.tagValType = datas.message.numbering;
//                     } else if (_common.isNotEmpty(obj.letter)) {
//                         obj.tagValType = datas.message.letter;
//                     } else if (_common.isNotEmpty(obj.specialCharacter)) {
//                         obj.tagValType = datas.message.specialCharacter;
//                     }
//                 }
//                 $("#forRuleType_" + obj.workRuleType).append(_common.template.parseObject("tmpl-vcModal-ruleType_" + obj.workRuleType, obj));
//             }
//         })
//     }
// }
//
// export { setValidationPopUp }