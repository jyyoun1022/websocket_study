import { makeUUID } from './makeUUID.js';
import { objects, globalData } from './variables.js';

function makeTags(tag){

    const ul = document.createElement( 'ul' );
    const li1 = document.createElement( 'li' );
    const li2 = document.createElement( 'li' );
    const li3 = document.createElement( 'li' );
    const li4 = document.createElement( 'li' );
    const span = document.createElement( 'span' );
    const select = document.createElement( 'select' );
    const input = document.createElement( 'input' );
    input.setAttribute("type", "text");
    ul.className = "tagList";
    span.className = "circle";
    ul.tagTypeCd = tag.tagTypeCd;
    ul.tagValTypeCd = tag.tagValTypeCd;
    ul.tagId = tag.tagId;
    ul.matchClasses = tag.matchClasses;
    ul.valueFilterNumber = tag.valueFilterNumber;
    ul.valueFilterLetter = tag.valueFilterLetter;
    ul.valueFilterSpecial = tag.valueFilterSpecial;
    ul.lengthNumber = tag.lengthNumber;
    ul.lengthLetter = tag.lengthLetter;
    ul.lengthSpecial = tag.lengthSpecial;

    if(tag.tagValTypeCd === "30"){

        // 해당 tag의 option값 등록
        tag.tagSelectValueVoList.forEach((object)=>{
            const option = document.createElement("option");
            option.value = object.value;
            option.appendChild(document.createTextNode(object.name));
            select.appendChild(option);
        });

        // option이 변경되면 select의 종류에 따라서 option value값을 pcd의 tagList 및 cuboideGroup의 tagList에 저장한다
        select.addEventListener('change',function(e){ changeTag(this); });

    }else if(tag.tagValTypeCd === "20") {

        input.addEventListener('focus', function(e){
            globalData.allowInputEvent = true;
            globalData.inputTextAreaTarget = this;
        });
        input.addEventListener('blur', function(e){
            globalData.allowInputEvent = false;
            globalData.inputTextAreaTarget = null;
        });
        input.addEventListener('input', function(e){

            const number = /[^0-9]/gi;
            const letter = /[^ㄱ-힣a-zA-Z]/gi;
            const special = /[^!@\#$%^&*\()\-=+_'\;<>\/.\`:\"\\,\[\]?|{}]/gi;
            const numberLetter = /[^0-9ㄱ-힣a-zA-Z]/gi;
            const numberSpecial = /[^0-9!@\#$%^&*\()\-=+_'\;<>\/.\`:\"\\,\[\]?|{}]/gi;
            const letterSpecial = /[^ㄱ-힣a-zA-Z!@\#$%^&*\()\-=+_'\;<>\/.\`:\"\\,\[\]?|{}]/gi;

            if(ul.valueFilterNumber === "Y" && ul.valueFilterLetter === "N" && ul.valueFilterSpecial === "N"){
                this.value = this.value.replace(number, "");
                if(ul.lengthNumber>0) {
                    if(Number(this.value) > Number(ul.lengthNumber)) this.value = "";
                }
            }else if(ul.valueFilterNumber === "N" && ul.valueFilterLetter === "Y" && ul.valueFilterSpecial === "N"){
                this.value = this.value.replace(letter, "");
                if(ul.lengthLetter>0) this.value = this.value.slice(0, ul.lengthLetter);
            }else if(ul.valueFilterNumber === "N" && ul.valueFilterLetter === "N" && ul.valueFilterSpecial === "Y"){
                this.value = this.value.replace(special, "");
                if(ul.lengthSpecial>0) this.value = this.value.slice(0, ul.lengthSpecial);
            }else if(ul.valueFilterNumber === "Y" && ul.valueFilterLetter === "Y" && ul.valueFilterSpecial === "N"){
                this.value = this.value.replace(numberLetter, "");
            }else if(ul.valueFilterNumber === "Y" && ul.valueFilterLetter === "N" && ul.valueFilterSpecial === "Y"){
                this.value = this.value.replace(numberSpecial, "");
            }else if(ul.valueFilterNumber === "N" && ul.valueFilterLetter === "Y" && ul.valueFilterSpecial === "Y"){
                this.value = this.value.replace(letterSpecial, "");
            }

            changeTag(this);

        });

    }

    span.style.backgroundColor = tag.color;
    li1.appendChild(span);
    li2.innerHTML = `${ tag.name }`;
    li4.innerHTML = `${ tag.hotkeyName }`;

    if(tag.tagValTypeCd === "30"){
        li3.appendChild(select);
    }else if(tag.tagValTypeCd === "20"){
        li3.appendChild(input);
    }

    ul.append(li1, li2, li3, li4);

    return ul;

}

function changeTag(target){

    const cubeIndex = objects.object3Ds.findIndex((list)=>{ return list.objectUUID === globalData.objectTarget; });
    const pcdIndex = objects.pcds.findIndex((pcd)=>{ return pcd.workTicketId === globalData.pcdTarget; });
    const pcd = objects.pcds[pcdIndex];
    const group = objects.object3Ds[cubeIndex];
    const ul = target.parentNode.parentNode;
    let value;

    // select인경우 or input인 경우
    if(ul.tagValTypeCd === "30"){
        value = target.options[target.selectedIndex].value;
    }else if(ul.tagValTypeCd === "20") {
        value = target.value;
    }


    // tag값이 변경될때 uuid가 없으면 uuid를 추가함
    if(ul.tagTypeCd === "IMG"){
        pcd.tagList.forEach((list)=>{
            if(list.tagId === ul.tagId){
                list.val = value;
                if(list.objectTagId === undefined){
                    list.objectTagId = makeUUID();
                }
            }
        });
        
    }else if(ul.tagTypeCd === "OBJ"){
        group.tagList.forEach((list)=>{
            if(list.tagId === ul.tagId){
                list.val = value;
                if(list.objectTagId === undefined){
                    list.objectTagId = makeUUID();
                }
            }
        });
    }


}


export { makeTags, changeTag }