var p1,p2,p3,p4,ploop;
function Camera(){
    
    return {
        
        init:function(){
            camera.addTarget({
                name: 'Sphere1',
                targetObject: ship,
                cameraPosition: new THREE.Vector3(0, 10, 30),
                fixed: false,
                stiffness: 0.01,
                matchRotation: false
            });

            camera.addTarget({
                name: 'Sphere2', 
                targetObject: ship,
                cameraPosition: new THREE.Vector3(30, 10, 0),
                fixed: false,
                stiffness: 0.01,
                matchRotation: false
            });

            camera.addTarget({
                name: 'Sphere3',
                targetObject: ship,
                cameraPosition: new THREE.Vector3(0, 10, -30),
                fixed: false,
                stiffness: 0.01,
                matchRotation: false
            });
            camera.addTarget({
                name: 'Sphere4', 
                targetObject: ship, 
                cameraPosition: new THREE.Vector3(-30, 10, 0), 
                fixed: false, 
                stiffness: 0.01, 
                matchRotation: false
            });
        },
        
        doOrbit:function(){
            if(Pause){
                crosses[pos].visible = false;
                orbit();
                ploop = setTimeout(function(){
                        Camera().doOrbit();
                    },20000);
            }else{
                clearTimeout(ploop);
                clearTimeout(p1);
                clearTimeout(p2);
                clearTimeout(p3);
                clearTimeout(p4);
                crosses[pos].visible = true;
                camera.setTarget('Target');
            }
        },
        
        endOrbit:function(){
            crosses[pos].visible = true;
            clearTimeout(ploop);
            clearTimeout(p1);
            clearTimeout(p2);
            clearTimeout(p3);
            clearTimeout(p4);
            camera.setTarget('Target');
        }
    }
    
}


function orbit(){

    pos1();
   p2 = setTimeout(function(){
        pos2();
    },5000);
   p3 = setTimeout(function(){
        pos3();
    },10000);
   p4 = setTimeout(function(){
        pos4();
    },15000);
   p1 = setTimeout(function(){
        pos1();
    },20000);


}

function pos1(){
    camera.setTarget(Pause ? 'Sphere1' : 'Target');
}

function pos2(){
    camera.setTarget(Pause ? 'Sphere2' : 'Target');
}

function pos3(){
    camera.setTarget(Pause ? 'Sphere3' : 'Target');
}

function pos4(){
    camera.setTarget(Pause ? 'Sphere4' : 'Target');
}

