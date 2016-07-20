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

/**
 * FUNCTIONS FOR HIGHSCORE AND MONEY
 */

var counterID;

function startCounter() {
	counterID = setInterval(function() { addPoints(1); }, 1000);
}

function stopCounter() {
	clearInterval(counterID);
}

function addPoints(value) {
    var tempscore = document.getElementById('score');    
    tempscore.innerHTML = parseInt(tempscore.innerHTML) + parseInt(value);
}

function subPoints(value) {
    var tempscore = document.getElementById('score');    
    tempscore.innerHTML = parseInt(tempscore.innerHTML) - parseInt(value);
}

function addMoney(value) {
    var tempscore = document.getElementById('money');    
    tempscore.innerHTML = parseInt(tempscore.innerHTML) + parseInt(value);
}

function subMoney(value) {
    var tempscore = document.getElementById('money');    
    tempscore.innerHTML = parseInt(tempscore.innerHTML) - parseInt(value);
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
		currentAmmo.innerHTML = ammoWeapon;
	}
}

//Zum minuszählen der ammo beim shot der waffe
function shot(){
	var actual = document.getElementById('currentAmmo');
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

/**
 * FUNCTIONS FOR HP
 */
 
var hpBox = document.getElementById('hpBoxValue');
var style = window.getComputedStyle(hpBox);
var currentHP = parseInt(style.getPropertyValue('width'));
 
function addHP(value) {	
	var i = 0;
	var tempID = setInterval(frame, 1);

	function frame() {
		if (i < value) {
			currentHP++;
			hpBox.style.width = currentHP + "px";
			if (currentHP == 222) {
				hpSetColor(1);			
			}
			if (currentHP == 444) {
				hpSetColor(2);
			}
			i++;
		} else {
			clearInterval(tempID);
		}
	}	
}

function subHP(value) {
	var i = 0;
	var tempID = setInterval(frame, 1);

	function frame() {
		if (i < value) {
			currentHP--;
			hpBox.style.width = currentHP + "px";
			if (currentHP == 444) {
				hpSetColor(1);			
			}
			if (currentHP == 222) {
				hpSetColor(0);
			}
			i++;
		} else {
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
