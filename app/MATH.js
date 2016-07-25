// Math-Klasse
MATH = {
	// Erzeugt exakte Kopie eines Vector3
	clone = function(v) {
		return new THREE.Vector3(v.x,v.y,v.z);
	},

	// Erzeugt am Urpsrung punktgespiegelte Kopie
	negated = function(v) {
		return new THREE.Vector3(-v.x,-v.y,-v.z);
	},

	// gibt Index des minimalen Werts aus
	getMinIndex = function(array) {
		var index = 0;
		var min = array[0];

		for(i=1; i<array.length; i++) {
			if(array[i] < min) {
				index = i;
				min = array[i];
			}
		}

		return index;
	}
};
