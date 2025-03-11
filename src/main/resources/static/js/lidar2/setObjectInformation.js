import { getBox3 } from "./getBox3.js";
import { box3Data } from "./variables.js";

function setObjectInformation(group){

    let shape = group.children[0].name;
    if(shape === undefined) shape = group.children[0].getAttribute('name');
    let info;
    if(shape === "cube"){

        const cube = group.getObjectByName("cube");
        getBox3(cube);
        info = `
                    3D &nbsp; | &nbsp;
                    W : ${ box3Data.box3X.toFixed(2) } ,
                    H : ${ box3Data.box3Z.toFixed(2) } ,
                    D : ${ box3Data.box3Y.toFixed(2) } &nbsp; | &nbsp;
                    X : ${ box3Data.objectBox3Center.x.toFixed(2) } ,
                    Y : ${ box3Data.objectBox3Center.y.toFixed(2) } ,
                    Z : ${ box3Data.objectBox3Center.z.toFixed(2) }  &nbsp; | &nbsp;
                    RZ : ${ Number(group.rotation.z).toFixed(2) } ,
                    RX : ${ Number(group.rotation.x).toFixed(2) }
                  `;
        cuboideInfo.innerHTML = info;

    }else if(shape === "cylinder"){

        const cylinder = group.getObjectByName("cylinder");
        getBox3(cylinder);
        info = `
                    3D &nbsp; | &nbsp;
                    W : ${ box3Data.box3X.toFixed(2) } , 
                    H : ${ box3Data.box3Z.toFixed(2) } , 
                    D : ${ box3Data.box3Y.toFixed(2) } &nbsp; | &nbsp; 
                    X : ${ box3Data.objectBox3Center.x.toFixed(2) } ,
                    Y : ${ box3Data.objectBox3Center.y.toFixed(2) } ,
                    Z : ${ box3Data.objectBox3Center.z.toFixed(2) }  &nbsp; | &nbsp; 
                    RZ : ${ Number(group.rotation.z).toFixed(2) } ,
                    RX : ${ Number(group.rotation.x).toFixed(2) }
                  `;
        cuboideInfo.innerHTML = info;

    }else if(shape === "rect"){

        const width = group.children[0].getAttribute('width');
        const height = group.children[0].getAttribute('height');

        info = `
                    2D &nbsp; | &nbsp;
                    W : ${  Number(width).toFixed(2) } , 
                    H : ${  Number(height).toFixed(2) } 
                  `;
        rectInfo.innerHTML = info;

    }






}

export { setObjectInformation }