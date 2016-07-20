/**
 * FUNCTIONS FOR COUNTER
 */

var counterID;

function startCounter() {
	counterID = setInterval(function() { addScore(1); }, 1000);
}

function stopCounter() {
	clearInterval(counterID);
}

/**
 * FUNCTIONS FOR HIGHSCORE
 */

var tempScore = document.getElementById('score'); 

function addScore(value) {   
    tempScore.innerHTML = parseInt(tempScore.innerHTML) + parseInt(value);
}

function subScore(value) {   
    tempScore.innerHTML = parseInt(tempScore.innerHTML) - parseInt(value);
}

function getScore() {
	return parseInt(tempScore.innerHTML);
}

function setScore(value) {
    tempScore.innerHTML = parseInt(value);
}

/**
 * FUNCTIONS FOR MONEY	
 */

var tempMoney = document.getElementById('money'); 

function addMoney(value) {   
    tempMoney.innerHTML = parseInt(tempMoney.innerHTML) + parseInt(value);
}

function subMoney(value) {  
    tempMoney.innerHTML = parseInt(tempMoney.innerHTML) - parseInt(value);
}

function setMoney(value) {   
    tempMoney.innerHTML = parseInt(value);
}

function getMoney() {
	return parseInt(tempMoney.innerHTML);
}



/**
 * FUNCTIONS FOR AMMO
 */

var ammoWeapon = 60;
var ammoPerShot = 1;

//Reload der waffe
function reload(){
	var actual = document.getElementById('currentAmmo'); 
	var max = document.getElementById('maxAmmo');
	var diff = ammoWeapon - parseInt(actual.innerHTML);

	if(diff>parseInt(max.innerHTML)){
		//FEHLERBEHANDLUNG PLS!
	}else{
		maxAmmo.innerHTML = parseInt(max.innerHTML)-diff;
		actual.innerHTML = ammoWeapon;
	}
}

//Zum minuszählen der ammo beim shot der waffe
function shot(){
	var actual = document.getElementById('currentAmmo');
	if(parseInt(actual.innerHTML)<=0){
		//FEHLERBEHANDLUNG PLS!
		//evtl automatisches reloaden nach upgradekauf
	}else{
		actual.innerHTML = parseInt(actual.innerHTML)-ammoPerShot;
	}
}

//zum parameter laden der waffen
//temp1 = ammo pro magazin
//temp2 = 
function switchWeapon(temp1, temp2, name){

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

/**
 * FUNCTIONS FOR HP
 */
 
	var maxhp = 200;

	var hpBox = document.getElementById('hpBoxValue');
	var style = window.getComputedStyle(hpBox);
	var currentHP = parseInt(style.getPropertyValue('width'));

	var hpBox1 = document.getElementById('hpBox');
	var style1 = window.getComputedStyle(hpBox1);
	var maxHpBox = parseInt(style1.getPropertyValue('width'));

function addHP(value) {	

	var i = 1;
	value = parseInt(value);

	var p = value/maxhp;
	var anzahlPixel = p * maxHpBox;

	var tempID = setInterval(frame, 1);

	function frame() {
		if (i <= anzahlPixel) {
			if(currentHP<maxHpBox){
				currentHP++;
				var percent = currentHP/maxHpBox*100;
				hpBox.style.width = percent + "%";
				updateHpDisplay(percent);
				i++;
				if(percent >= 66.6) {
					hpSetColor(2);	
				} else if(percent >= 33.3) {
					hpSetColor(1);
				}
			}
		} else {
			clearInterval(tempID);
		}				
			
	}	
}

function updateHpDisplay(value){
	var trueHP = value/100*maxhp;

	var temp = document.getElementById('currentHP'); 
  
    temp.innerHTML = parseInt(trueHP);
}

function subHP(value) {
	
	var i = 1;
	value = parseInt(value);

	var p = value/maxhp;
	var anzahlPixel = p * maxHpBox;

	var tempID = setInterval(frame, 1);

	function frame() {
		if (i < anzahlPixel) {
			if(currentHP>0){
				currentHP--;
				var percent = currentHP/maxHpBox*100;
				hpBox.style.width = percent + "%";
				updateHpDisplay(percent);
				i++;
				if(percent <= 33.3) {
					hpSetColor(0);	
				} else if(percent <= 66.6) {
					hpSetColor(1);
				}
			}
		} else {
			//GAME OVER MESSAGE
			clearInterval(tempID);
		}				
			
	}		
}

function hpSetColor(color) {
	if (color == 0) {
		hpBox.classList.remove("hpOrange");	
		hpBox.classList.add("hpRed");			
	} else if (color == 1) {
		hpBox.classList.remove("hpRed");	
		hpBox.classList.remove("hpGreen");	
		hpBox.classList.add("hpOrange");	
	} else if (color == 2) {
		hpBox.classList.remove("hpOrange");	
		hpBox.classList.add("hpGreen");
	}
}

/**
 * FUNCTIONS FOR LEVEL (Proof of concept)
 */
 
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

/**
 * FUNCTIONS FOR SPEED
 */
 
var maxSpeed = 230;

function updateSpeed (newSpeed) {
	var speedBox = document.getElementById("speedBarValue");	
	speedBox.style.height = 100 - (parseInt(newSpeed) / maxSpeed) * 100 + "%";
}
