# Interface Dokumentation

##Score Funktionen:

	#####Score Counter erhöht Score passiv um 1
	startScoreCounter();
	
	stopScoreCounter();
	
	addScore(value);
	
	subScore(value);
	
	setScore(value);
	
	getScore();
	
	
##Geld Funktionen:

	addMoney(value);
	
	subMoney(value);
	
	setMoney(value);
	
	getMoney();


##HP Funktionen:

	addHP(value);

	subHP(value);
	
	setHP(value);
	
	getHP();
	
	setMaxHP(value);
	
	getMaxHP();
	

##Speed Funktionen:

	setSpeed(newSpeed);
	
	setMaxSpeed(newMaxSpeed);
	
	
##PowerUp Funktionen:

	_@powerUp ist eine Zahl korrespondierend mit der Leiste von links nach rechts._
	_@removeOrAdd 0 für remove und 1 für add_
	setPowerUp(powerUp, removeOrAdd);
