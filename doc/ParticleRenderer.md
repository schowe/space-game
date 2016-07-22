# How To: ParticleRenderer

zwei Klassen:

1. ExplosionParticleRenderer
2. RayParticleRenderer


im gewünschten Scope (Variablen-Sichtbarkeitsbereich) erstellen mit:

## Explosion Particles:


```var color = 0xffc22;```

```var numberParticles = 100;```

```var texturePath = "../res/textures/particle.png";```

```var startVector = new THREE.Vector3(2, 1, 7);```


```var explosionParticleRenderer = new ExplosionParticleRenderer(color, numberParticles, texturePath, startVector);```
```

 

## Ray Particles:

### Erstellen

```var color = 0xffffff;```

```var numberParticles = 100;```

```var texturePath = "../res/textures/particle.png";```

```var startVector = new THREE.Vector3(2, 1, 7);```

```var endVector = new THREE.Vector3(5, 9, -10);```

```var rayParticleRenderer = new RayParticleRenderer(color, numberParticles, texturePath, startVector, endVector);```

### Animieren

```var newStart = new THREE.Vector3(0, 1, 0);````

```var newEnd = new THREE.Vector3(1, 0, 1);````

```rayParticleRenderer.startVector = newStart;```

```rayParticleRenderer.endVector = newEnd;```

