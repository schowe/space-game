// Math-Klasse
MATH = {
	// Erzeugt exakte Kopie eines Vector3
	clone = function(v) {
		return new THREE.Vector3(v.x,v.y,v.z);
	},

	// Erzeugt am Urpsrung punktgespiegelte Kopie
	negated = function(v) {
		return new THREE.Vector3(-v.x,-v.y,-v.z);
	}
};
