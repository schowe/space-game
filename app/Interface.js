//
//FUNCTIONS FÜR HIGHSCORE & GELD
//

var counterID;

function startCounter(){
	counterID = setInterval(addPoint,1000);
}

function stopCounter() {
	clearInterval(counterID);
}

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

//
// FUNCTIONS FÜR AMMO
//

var ammoWeapon = 60;
var ammoPerShot = 1;

//Reload der waffe
function reload(){
	var actual = document.getElementById('actualAmmo'); 
	var max = document.getElementById('maxAmmo');
	var diff = ammoWeapon - parseInt(actual.innerHTML);

	if(diff>parseInt(max.innerHTML)){
		//FEHLERBEHANDLUNG PLS!
	}else{
		maxAmmo.innerHTML = parseInt(max.innerHTML)-diff;
		actualAmmo.innerHTML = ammoWeapon;
	}
}

//Zum minuszählen der ammo beim shot der waffe
function shot(){
	var actual = document.getElementById('actualAmmo');
	if(parseInt(actual.innerHTML)<=0){
		//FEHLERBEHANDLUNG 
		//evtl automatisches reloaden nach upgradekauf
	}else{
		actual.innerHTML = parseInt(actual.innerHTML)-ammoPerShot;
	}
}


//zum parameter laden der waffen
//temp1 = ammo pro magazin
//temp2 = 
function switchWeapon(temp1, temp2){

	//Speicherung von alten Waffen
	//Bearbeitungsbedarf!

	ammoWeapon = temp1;
	ammoPerShot = temo2;
}

//wenn munition erhalten wird (durch powerups/shop etc. )
function plusAmmo(temp){
	var max = document.getElementById('maxAmmo');
	max.innerHTML = parseInt(max.innerHTML) + temp;
}



