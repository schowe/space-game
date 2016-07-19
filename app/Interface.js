function addPoint(){
    var tempscore = document.getElementById('score');    
    tempscore.innerHTML = parseInt(tempscore.innerHTML)+1;
}

function addPoints(temp){
    var tempscore = document.getElementById('score');    
    tempscore.innerHTML = parseInt(tempscore.innerHTML)+parseInt(temp);
}

function subPoints(temp){
    var tempscore = document.getElementById('score');    
    tempscore.innerHTML = parseInt(tempscore.innerHTML)-parseInt(temp);
}

function addGeld(temp){
    var tempscore = document.getElementById('geld');    
    tempscore.innerHTML = parseInt(tempscore.innerHTML)+parseInt(temp);
}

function subGeld(temp){
    var tempscore = document.getElementById('geld');    
    tempscore.innerHTML = parseInt(tempscore.innerHTML)-parseInt(temp);
}
