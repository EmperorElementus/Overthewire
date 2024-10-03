document.addEventListener('DOMContentLoaded', () => {
    const character = {
        name: 'Pikachu',
        health: 100,
        maxHealth: 100,
        progressBar: document.getElementById('progressbar-character'),
        healthText: document.getElementById('health-character'),
    };

    const enemies = [
        {
            name: 'Charmander',
            health: 100,
            maxHealth: 100,
            progressBar: document.getElementById('progressbar-enemy'),
            healthText: document.getElementById('health-enemy'),
        },
        {
            name: 'Squirtle',
            health: 100,
            maxHealth: 100,
            progressBar: document.getElementById('progressbar-enemy2'),
            healthText: document.getElementById('health-enemy2'),
        },
    ];

    const updateHealthBar = (enemy) => {
        const healthPercentage = (enemy.health / enemy.maxHealth) * 100;
        enemy.progressBar.style.width = healthPercentage + '%';
        enemy.healthText.textContent = `${enemy.health} / ${enemy.maxHealth}`;
    };

    const attackEnemy = (enemy, damage) => {
        enemy.health -= damage;
        if (enemy.health < 0) enemy.health = 0;
        updateHealthBar(enemy);
    };

    const handleKick = () => {
        const damage = Math.floor(Math.random() * 20) + 1; // Random damage between 1 and 20
        enemies.forEach(enemy => attackEnemy(enemy, damage));
    };

    const handleKickStrong = () => {
        const damage = Math.floor(Math.random() * 30) + 1; // Random damage between 1 and 30
        enemies.forEach(enemy => attackEnemy(enemy, damage));
    };

    document.getElementById('btn-kick').addEventListener('click', handleKick);
    document.getElementById('btn-kick-strong').addEventListener('click', handleKickStrong);
});