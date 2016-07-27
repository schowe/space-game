# Derzeitige Interface Methoden

##Level Funtionen:

Zeigt die Leveleinblendung mit @value als Level an.
Das derzeitige Level wird nicht im Interface gespeichert.

	displayLevel(value);


##Score Funktionen:

Score Counter erhöht Score passiv um 1.
changeScore ändert Score um einen positiven oder negativen Wert.

	startScoreCounter();
	
	stopScoreCounter();
	
	changeScore(value);
	
	setScore(value);
	
	getScore();
	
	
##Geld Funktionen:

changeMoney ändert das Geld um einen positiven oder negativen Wert.

	changeMoney(value);
	
	setMoney(value);
	
	getMoney();


##HP Funktionen:

changeHP ändert HP um einen positiven oder negativen Wert.

	changeHP(value);
	
	setHP(value);
	
	getHP();
	
	setMaxHP(value);
	
	getMaxHP();
	
	
##Waffen Funktionen:
	
Das Weapon Interface zeigt nur die Munition der Sekundärwaffe an.
Diese Funktion sollte immer gerufen werden wenn sich das Display ändern muss.
Zum Beispiel: Waffenwechsel, schießen, Munition einsammeln, nachladen.
*Noch nicht implementiert!*

	updateWeaponInterface();
	

##Speed Funktionen:

	setSpeed(newSpeed);
	
	setMaxSpeed(newMaxSpeed);
	
	
##PowerUp Funktionen:

powerUp ist eine Zahl korrespondierend mit der Leiste von links nach rechts.
removeOrAdd 0 für remove und 1 für add.

	setPowerUp(powerUp, removeOrAdd);
	
	
#Known Bugs:

	HP Bar kann in niedrigen Werten leicht über die Kanten hinaus gehen.