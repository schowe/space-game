function handleAsteroids() {

    for (var i = 0; i <= asteroids.length - 2; i++) {

        // Asteroidenkollision
        for (var j = i+1; j <= asteroids.length - 1; j++) {
            if (Collision.intersectSphereOther(getAsteroidHitbox(asteroids[i]),
                    getAsteroidHitbox(asteroids[j]))) {
                asteroidCollision(asteroids[i], asteroids[j]);
            }
        }

        // Kollision mit Player
        var playerHitboxes = getPlayerHitboxes();
        for (var j = 0; j <= playerHitboxes.length; j++) {
            if (Collision.intersectSphereBox(getAsteroidHitbox(asteroids[i]),
                    playerHitboxes[j])) {
                asteroidHitBySpaceship(asteroids[i]);
                playerHitByAsteroid();
            }
        }

        // Kollision mit Gegner
        // for (var j = 0; j < enemies.length - 1; j++) {
        //     var enemyHitboxes = getEnemyHitboxes(enemies[j]);
        //     for (var k = 0; i <= enemyHitboxes.length - 1; k++) {
        //         if (intersectSphereBox(asteroids[i], enemyHitboxes[k])) {
        //             asteroidHitBySpaceship(asteroids[i]);
        //             enemyHitbyAsteroid(enemies[j]);
        //         }
        //     }
        // }

    }
}

function handleProjectiles() {
    // for every projectile
    for (var i = 0; i <= projectiles.length - 1; i++) {

        // Asteroidentreffer
        for (var j = 0; j <= asteroids.length - 1; j++) {

            if (projectiles[i].name === "Laser") {
                if (Collision.intersectSphereCylinder(getAsteroidHitbox(asteroids[j]),
                        projectiles[i])) {
                    successLaser(projectiles[i]);
                    destroyAsteroid(asteroids[j]);
                }
            }

            else if (projectiles[i].name === "Rocket") {
                if (Collision.intersectSphereCylinder(getAsteroidHitbox(asteroids[j]),
                        projectiles[i])) {
                    successRocket(projectiles[i]);
                    destroyAsteroid(asteroids[j]);
                }
            }

            else if (projectiles[i].name === "Explosion") {
                if (Collision.intersectSphereOther(getAsteroidHitbox(asteroids[j]),
                        projectiles[i])) {
                    destroyAsteroid(asteroids[j]);
                }
            }

            else if (projectiles[i].name === "MachineGun") {
                if (Collision.intersectSphereOther(getAsteroidHitbox(asteroids[j]),
                        projectiles[i])) {
                    successMachineGunBullet(projectiles[i]);
                    destroyAsteroid(asteroids[j]);
                }
            }

        }

        // Gegner wird getroffen
        // for (var j = 0; j < enemies.length - 1; j++) {

        //     var enemyHitboxes = getEnemyHitboxes(enemies[j]);
        //     for (var k = 0; i <= enemyHitboxes.length - 1; k++) {

        //         if (projectiles[i].name === "Laser") {
        //             if (intersectBoxCylinder(enemyHitboxes[k], projectiles[i])) {
        //                 successLaser(projectiles[i]);
        //                 enemyHitByLaser(enemies[j]);
        //             }
        //         }

        //         else if (projectiles[i].name === "EnemyLaser") {
        //             if (intersectBoxCylinder(enemyHitboxes[k], projectiles[i])) {
        //                 successLaser(projectiles[i]);
        //                 enemyHitByLaser(enemies[j]);
        //             }
        //         }

        //         else if (projectiles[i].name === "Rocket") {
        //             if (intersectBoxCylinder(enemyHitboxes[k], projectiles[i])) {
        //                 successRocket(projectiles[i]);
        //             }
        //         }

        //         else if (projectiles[i].name === "Explosion") {
        //             if (intersectSphereBox(projectiles[i], enemyHitboxes[k])) {
        //                 enemyHitByExplosion(enemyHitboxes[k]);

        //             }
        //         }

        //         else if (projectiles[i].name === "MachineGun") {
        //             if (intersectSphereBox(projectiles[i], enemyHitboxes[k])) {
        //                 successMachineGunBullet(projectiles[i]);
        //                 enemyHitByMachineGun(enemies[j]);
        //             }
        //         }
        //     }

        // }

        // Player wird getroffen
        // Player kann nicht von den eigenen Projektilen getroffen werden,
        // da diese schneller fliegen (sollen!!!) als der Player selbst
        // var playerHitboxes = getPlayerHitboxes();
        // for (var j = 0; j < getPlayerHitboxes.length - 1; j++) {

        //     if (projectiles[i].name === "Explosion") {
        //         if (intersectSphereOther(getAsteroidHitbox(asteroids[j]),
        //                 projectiles[i])) {
        //             playerHitByExplosion();

        //         }
        //     }

        //     else if (projectiles[i].name === "EnemyLaser") {
        //         if (intersectBoxCylinder(getPlayerHitboxes[j], projectiles[i])) {
        //             successLaser(projectiles[i]);
        //             playerHitByLaser();
        //         }
        //     }

        // }


    }
}


function handlePlayerEnemyCollision() {
    // var playerHitboxes = getPlayerHitboxes();
    // for (var i = 0; i <= playerHitboxes.length - 1; i++) {
    //     for (var j = 0; j <= enemies.length; j++) {
    //         var enemyHitboxes = getEnemyHitboxes(enemies[j]);
    //         for (var k = 0; i <= enemyHitboxes.length - 1; k++) {
    //             if (intersectBoxBox(playerHitboxes[i], enemyHitboxes[k])) {
    //                 playerEnemyCollision();
    //                 enemyPlayerCollision(enemies[j]);
    //             }
    //         }
    //     }
    // }
}


function handleEnemyEnemyCollision() {
    // for (var i = 0; i <= enemies.length - 2; i++) {
    //     var enemyHitboxes1 = getEnemyHitboxes(enemies[i]); {
    //         for (var j = 0; j < enemyHitboxes1.length; j++) {
    //             for (var k = i+1; k <= enemies.length - 1; k++) {
    //                 var enemyHitboxes2 = getEnemyHitboxes(enemies[k]);
    //                 for (var l = 0; l < enemyHitboxes2.length; l++) {
    //                     if (intersectBoxBox(enemyHitboxes1[j], enemyHitboxes2[l])) {
    //                         enemyEnemyCollision(enemies[i], enemies[k]);
    //                     }
    //                 }
    //             }
    //         }

    //     }
    // }
}


function handleCollision() {

    //handleAsteroids();
    handleProjectiles();
    //handlePlayerEnemyCollision();
    //handleEnemyEnemyCollision();

}