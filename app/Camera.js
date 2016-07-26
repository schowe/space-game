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
                setTimeout(function(){
                    Camera().doOrbit();
                },20000);
            }else{
                crosses[pos].visible = true;
                camera.setTarget('Target');
            }
        },
        
        endOrbit:function(){
            crosses[pos].visible = true;
            camera.setTarget('Target');
        }
    }
    
}

function orbit(){

    pos1();
   setTimeout(function(){
        pos2();
    },5000);
    setTimeout(function(){
        pos3();
    },10000);
    setTimeout(function(){
        pos4();
    },15000);
    setTimeout(function(){
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

