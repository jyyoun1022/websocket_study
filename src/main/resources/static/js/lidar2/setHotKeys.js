import { changeClass } from './setClassPopUp.js';
import { changeTag } from './makeTags.js';
import { objects, globalData } from './variables.js';


function setHotKeys(key){

    if(!globalData.allowAllEvents){
        return;
    }
   
    let hotKeyIndex, hotKeyNumber, hotKeySort, hotKeyTarget;

    const systemKeys = [
        " ", "1", "2", "3", "4", "5", "6", "7", "8", "9",
        "W", "A", "S", "D", "Z", "X", "Q", "E","T","G","F","H",
        "ARROWLEFT", "ARROWRIGHT",
        "Shift+W", "Alt+W", "Shift+A", "Alt+A", "Shift+S", "Alt+S", "Shift+D", "Alt+D", "Shift+Z", "Alt+Z", "Shift+X", "Alt+X",
        "Shift+Q", "Shift+E",
        "Ctrl+C", "Ctrl+Shift+C", "Ctrl+V",
        "TAB", "DELETE", "PAGEDOWN", "PAGEUP",
        "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8",
        "ENTER", "ESCAPE",
    ];

    // hotKey와 systemkey가 중복되면 무시함
    for(let i=0 ; i<systemKeys.length ; i++){
        if(systemKeys[i] === key.keyName){
            return;
            break;
        }
    }

    // 입력된 key값으로 hotKey의 classId or tagId를 뽑아내기
    hotKeyIndex = objects.classes.findIndex((list)=>{ return list.hotkeyName === key.keyName });
    if(hotKeyIndex > -1){
        hotKeyNumber = objects.classes[hotKeyIndex].classId;
        globalData.class.number = hotKeyNumber;
        globalData.class.color = objects.classes[hotKeyIndex].color;
        globalData.class.name = objects.classes[hotKeyIndex].className;
        hotKeySort = "class";
    }else{
        hotKeyIndex = objects.tags.findIndex((list)=>{ return list.hotkeyName === key.keyName });
        if(hotKeyIndex > -1){
            hotKeyNumber = objects.tags[hotKeyIndex].tagId;
            hotKeySort = "tag";
        }
    }


    // hotkey가 등록되어 있지 않은 key값을 입력받았을 경우에는 제외시킴
    if(hotKeyNumber !== undefined){

        // hotKey가 tag일 경우 해당 tag가 object인지 frame인지 알아내서 select 찾아냄
        // select의 selectedIndex값을 증가시켜서 tag를 변경시킴
        if(hotKeySort === "tag"){
            for(let i=0 ; i<frameTagWrap.children.length ; i++){
                if(hotKeyNumber === frameTagWrap.children[i].tagId){
                    hotKeyTarget = frameTagWrap.children[i];
                    break;
                }
            }
            for(let i=0 ; i<objectTagWrap.children.length ; i++){
                if(hotKeyNumber === objectTagWrap.children[i].tagId){
                    hotKeyTarget = objectTagWrap.children[i];
                    break;
                }
            }
            const select = hotKeyTarget.children[2].children[0];
            const optionLength = select.options.length;
            let selectedIndex = select.selectedIndex;
            if(selectedIndex < optionLength-1){
                selectedIndex++;
            }else{
                selectedIndex = 0;
            }
            select.selectedIndex = selectedIndex;
            changeTag(select);

        // hotKey가 class일 경우
        }else{

            changeClass();

        }
    }
        
}


export { setHotKeys }

