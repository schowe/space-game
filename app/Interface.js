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

//HP
//Ist noch viel doppelt, räumen wir nachher auf
function addHP (value) {
	var hpBox = document.getElementById("hpBoxValue");	
	var style = window.getComputedStyle(hpBox);
        var currentHP = parseInt(style.getPropertyValue("width"));
	
	var x = 0;
	var temp = setInterval(frame, 10);

	function frame() {
		if (x < value) {
			currentHP++;
			hpBox.style.width = currentHP + "px";
			if (currentHP == 60) {
				setColor(1);			
			}
			if (currentHP == 120) {
				setColor(2);
			}
			x++;
		} else {
			clearInterval(temp);
		}
	}	

	function setColor(color) {
		if (color == 0) {
			hpBox.classList.remove("hpOrange");	
			hpBox.classList.add("hpRed");			
		}
		else if (color == 1) {
			hpBox.classList.remove("hpRed");	
			hpBox.classList.remove("hpGreen");	
			hpBox.classList.add("hpOrange");	
		}
		else if (color == 2) {
			hpBox.classList.remove("hpOrange");	
			hpBox.classList.add("hpGreen");
		}
	}
}

function subHP (value) {
	var hpBox = document.getElementById("hpBoxValue");	
	var style = window.getComputedStyle(hpBox);
        var currentHP = parseInt(style.getPropertyValue("width"));
	
	var x = 0;
	var temp = setInterval(frame, 10);

	function frame() {
		if (x < value) {
			currentHP--;
			hpBox.style.width = currentHP + "px";
			if (currentHP == 120) {
				setColor(1);			
			}
			if (currentHP == 60) {
				setColor(0);
			}
			x++;
		} else {
			clearInterval(temp);
		}
	}

	

	function setColor(color) {
		if (color == 0) {
			hpBox.classList.remove("hpOrange");	
			hpBox.classList.add("hpRed");			
		}
		else if (color == 1) {
			hpBox.classList.remove("hpRed");	
			hpBox.classList.remove("hpGreen");	
			hpBox.classList.add("hpOrange");	
		}
		else if (color == 2) {
			hpBox.classList.remove("hpOrange");	
			hpBox.classList.add("hpGreen");
		}
	}	
}
//HP Ende

//Level - bis jetzt nur Proof of concept
var currentLevel = 0;

function updateLevel () {
	currentLevel = parseInt(currentLevel) + 1;
	var levelText = document.getElementById("levelDisplay");
	document.getElementById("currentLevel").innerHTML = currentLevel;
	//levelText.style.display = "visible";
	levelText.style.color = "purple";
	//setTimeout(function(){ levelText.style.display = "none"; }, 3500);
	setTimeout(function(){ levelText.style.color = "transparent"; }, 2500);
}

//Speed
var maxSpeed = 230;

function updateSpeed (speed) {
	var speedBox = document.getElementById("speedBarValue");	
	speedBox.style.height = 100 - (parseInt(speed)/maxSpeed) * 100 + "%";
}
