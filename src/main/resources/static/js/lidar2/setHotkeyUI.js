import { hotkeyUI } from './hotkeyUI.js';
import { objects } from './variables.js';


function setHotkeyUI(){

    hotkeyTapWrap.innerHTML = hotkeyUI;

    let trArray = [];
    let index = 0;



    objects.tags.forEach((obj)=>{

        if(obj.hotkeyName !== ""){
            const tr = document.createElement( 'tr' );
            const td1 = document.createElement( 'td' );
            const td2 = document.createElement( 'td' );

            td1.innerHTML = `<div class='hotkey task'>${ obj.hotkeyName }</div>`;
            td2.innerHTML = `<div class="hotkeyDesc"> ${ obj.name }</div>`;

            tr.append(td1, td2);

            trArray[index] = tr;
            index++;
        }

    });

    objects.classes.forEach((obj)=>{

        if(obj.hotkeyName !== ""){
            const tr = document.createElement('tr');
            const td1 = document.createElement('td');
            const td2 = document.createElement('td');

            td1.innerHTML = `<div class='hotkey task'>${obj.hotkeyName}</div>`;
            td2.innerHTML = `<div class="hotkeyDesc"> ${obj.className}</div>`;

            tr.append(td1, td2);

            trArray[index] = tr;
            index++;
        }

    });

    trArray.reverse();

    trArray.forEach((tr)=>{
        hotkeyTable.prepend(tr);
    });

}

export { setHotkeyUI }