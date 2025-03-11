let _UUID_CNT = 0;
function makeUUID() { 
    return Number.parseInt(Date.now() + "" + _UUID_CNT++).toString(32);

}

export { makeUUID }


