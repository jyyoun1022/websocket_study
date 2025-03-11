
import { screen } from './variables.js';

function removeObject(object, target, sort){

    //console.log( 'before', screen.renderer.info.memory );

    if(sort === "mesh"){
        target.remove(object);
        object.geometry.dispose();
        object.material.dispose();
    }else if(sort == "control"){
        target.remove(object);
        object.dispose();
    }else if(sort === "groupTotal"){
        object.traverse(function(node){   
            if(node.isMesh || node.isLine){
                node.geometry.dispose();
                node.material.dispose();
            }
        });
        target.remove(object);
    }else if(sort === "groupEach"){
        object.parent.remove(object);
        object.geometry.dispose();
        object.material.dispose();
    }

    screen.renderer.renderLists.dispose();

    //console.log( 'after', screen.renderer.info.memory );

}

export { removeObject }

