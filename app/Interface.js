// TODO: eventuell Refactoring?


var Interface = function() {
    var $overlay = $("#menu-overlay");
    var menuVisible = false;


    function showOverlay() {
        $overlay.show();
        menuVisible = true;
    }

    function hideOverlay() {
        $overlay.hide();
        menuVisible = false;
    }

    return {
        toggleMenuOverlay: function() {
            if (menuVisible) {
                hideOverlay();
            } else {
                showOverlay();
            }
        }
    }
    
};

function interfaceInit(){
	setMaxHP(200);
	setHP(100);
	setMaxHP(400);
}


/**
 * FUNCTIONS FOR HIGHSCORE
 */

var scoreCounterID;
var scoreReference = document.getElementById('score'); 

/* Starts the passive score counter */
function startScoreCounter() {
	scoreCounterID = setInterval(function() { addScore(1); }, 1000);
}

/* Stops the passive score counter */
function stopScoreCounter() {
	clearInterval(scoreCounterID);
}

/* Increases the score by @value */
function addScore(value) {   
    scoreReference.innerHTML = parseInt(scoreReference.innerHTML) + parseInt(value);
}

/* Decreases the score by @value */
function subScore(value) {   
    scoreReference.innerHTML = parseInt(scoreReference.innerHTML) - parseInt(value);
}

/* Sets the current score to @value */
function setScore(value) {
    scoreReference.innerHTML = parseInt(value);
}

/* Returns the current score */
function getScore() {
	return parseInt(scoreReference.innerHTML);
}

/**
 * FUNCTIONS FOR MONEY	
 */

var moneyReference = document.getElementById('money'); 

/* Increases the amount of money by @value */
function addMoney(value) {   
    moneyReference.innerHTML = parseInt(moneyReference.innerHTML) + parseInt(value);
}

/* Increases the amount of money by @value */
function subMoney(value) {  
    moneyReference.innerHTML = parseInt(moneyReference.innerHTML) - parseInt(value);
}

/* Sets the current amount of money to @value */
function setMoney(value) {   
    moneyReference.innerHTML = parseInt(value);
}

/* Returns the current amount of money */
function getMoney() {
	return parseInt(moneyReference.innerHTML);
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
//temp2 = ammo per shot
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
 
	var maxHP = 200;
	var hpBoxCurrent = document.getElementById('hpBoxValue');
	var hpBoxCStyle = window.getComputedStyle(hpBoxCurrent);
	var currentHPpx = parseInt(hpBoxCStyle.getPropertyValue('width'));
	
	var hpBoxMax = document.getElementById('hpBox');
	var hpBoxMStyle = window.getComputedStyle(hpBoxMax);
	var maxHPpx = parseInt(hpBoxMStyle.getPropertyValue('width'));



function changeHP(value){

	var i = 0;

	var ticks = 100;
	value = parseInt(value + 0.5);

	// Amount of pixels per tick
	var pxTick = value / maxHP * maxHPpx / ticks;

	var tempID = setInterval(frame, 10);
	
	function frame() {
		
		if(i < ticks) {
			if(currentHPpx>maxHPpx||currentHPpx<0){
				checkStuff();
				clearInterval(tempID);
				return;
			}
			currentHPpx += pxTick;
			// Change the HP bar width
			hpBoxCurrent.style.width = currentHPpx / maxHPpx * 100 + '%';	

			// Update displayed HP and color
			var currentHP = currentHPpx / maxHPpx * maxHP;			
			updateHPDisplay(currentHP);
			hpSetColor(currentHP);
			
			i++;

			//document.write('D');
			
		} else {
			checkStuff();
			clearInterval(tempID);
		}
	}

	function checkStuff(){
		if(value<0){
			setHP(getHP()-1);
		}
		if(getHP()<=0){
			
		}
	}

}

function gameOver(){

}


/* Sets HP to @value */
function setHP(value) {
	hpBoxCurrent.style.width = value / maxHP * 100 + '%';
	updateHPDisplay(value);
	hpSetColor(value);
}

/* Returns HP */
function getHP() {
	currentHPpx = parseInt(hpBoxCStyle.getPropertyValue('width'));
	return currentHPpx / maxHPpx * maxHP;
}

/* Sets maxHP to @value */
function setMaxHP(value) {
	maxHP = parseInt(value + 0.5);
}

/* Returns maxHP */
function getMaxHP() {
	return maxHP;
}

/* Sets the HP bar to a calculated color-gradient. */
function hpSetColor(currentHP) {
	
	if(currentHP <= (maxHP / 2)) {
		// Color gradient in hex from 0% to 50%
		var temp = parseInt((510 * currentHP / maxHP) + 0.5);
		hpBoxCurrent.style.background = '#FF' + padHex(temp.toString(16)) + '00';
	} else {
		// Color gradient in hex from 50% to 100%
		var temp = parseInt(255.5 - 255 * (2 * currentHP / maxHP - 1));
		hpBoxCurrent.style.background = '#' + padHex(temp.toString(16)) + 'FF00';
	}
}

/* Updates the displayed HP */
function updateHPDisplay(currentHP) {
	var temp = document.getElementById('currentHP');
	temp.innerHTML = parseInt(currentHP + 0.5);
}

/**
 * FUNCTIONS FOR LEVEL (Proof of concept)
 */
 
var currentLevel = 0;

function updateLevel () {
	currentLevel = parseInt(currentLevel) + 1;
	var levelText = document.getElementById('levelDisplay');
	document.getElementById('currentLevel').innerHTML = currentLevel;
	//levelText.style.display = 'visible';
	levelText.style.color = 'purple';
	//setTimeout(function(){ levelText.style.display = 'none'; }, 3500);
	setTimeout(function(){ levelText.style.color = 'transparent'; }, 2500);
}

/**
 * FUNCTIONS FOR SPEED
 */
 
var maxSpeed = 100;

/* Sets the displayed speed value and bar to @newSpeed */
function setSpeed(newSpeed) {	
	// Set height of the speed bar
	var speedBox = document.getElementById('speedBarValue');	
	speedBox.style.height = Number(newSpeed) / maxSpeed * 100 + '%';
	
	// Set the color of the speed bar
	var temp = parseInt(255.5 - Number(newSpeed) / maxSpeed * 255);
	speedBox.style.background = '#FF' + padHex(temp.toString(16)) + '00';

	// Set the displayed speed value
	document.getElementById('speedValue').innerHTML = parseInt(newSpeed + 0.5);
}

/* Sets maxSpeed to @newMaxSpeed */
function setMaxSpeed(newMaxSpeed) {
	maxSpeed = parseInt(newMaxSpeed);
}

/**
 * FUNCTIONS FOR POWERUPS
 */
 
function setPowerUp(powerUp, removeOrAdd) {
/* mit Platzhalterelementen */
	var icon;
	switch(powerUp) {
		case 1:
			icon = document.getElementById('one');
			break;	
		case 2:
			icon = document.getElementById('two');
			break;
		case 3:
			icon = document.getElementById('three');
			break;

		case 4: 
			icon = document.getElementById('four');
			break;
		default:
	}

	if (removeOrAdd == 1) {
		icon.classList.remove('unactive');
	}
	if (removeOrAdd == 0) {
		icon.classList.add('unactive');
	}

}

/**
 * MISC FUNCTIONS
 */
 
/* Pads @hex if it is shorter than 2 digits */
function padHex(hex) {
	
	while(hex.length < 2) {
		hex = '0' + hex;
	}
	
	return hex;
}
