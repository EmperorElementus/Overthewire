document.addEventListener('DOMContentLoaded', () => {
    const character = {
        name: 'Pikachu',
        health: 100,
        maxHealth: 100,
        progressBar: document.getElementById('progressbar-character'),
        healthText: document.getElementById('health-character'),

        updateHealthBar() {
            const healthPercentage = (this.health / this.maxHealth) * 100;
            this.progressBar.style.width = healthPercentage + '%';
            this.healthText.textContent = `${this.health} / ${this.maxHealth}`;
        },

        receiveDamage(damage) {
            this.health -= damage;
            if (this.health < 0) this.health = 0;
            this.updateHealthBar();
        },
    };

    const enemies = [
        {
            name: 'Charmander',
            health: 100,
            maxHealth: 100,
            progressBar: document.getElementById('progressbar-enemy'),
            healthText: document.getElementById('health-enemy'),

            updateHealthBar() {
                const healthPercentage = (this.health / this.maxHealth) * 100;
                this.progressBar.style.width = healthPercentage + '%';
                this.healthText.textContent = `${this.health} / ${this.maxHealth}`;
            },

            receiveDamage(damage) {
                this.health -= damage;
                if (this.health < 0) this.health = 0;
                this.updateHealthBar();
            },
        },
        {
            name: 'Squirtle',
            health: 100,
            maxHealth: 100,
            progressBar: document.getElementById('progressbar-enemy2'),
            healthText: document.getElementById('health-enemy2'),

            updateHealthBar() {
                const healthPercentage = (this.health / this.maxHealth) * 100;
                this.progressBar.style.width = healthPercentage + '%';
                this.healthText.textContent = `${this.health} / ${this.maxHealth}`;
            },

            receiveDamage(damage) {
                this.health -= damage;
                if (this.health < 0) this.health = 0;
                this.updateHealthBar();
            },
        },
    ];

    const checkGameOver = () => {
        if (character.health === 0) {
            alert('Game Over! Pikachu has lost!');
            location.reload();
        }

        const allEnemiesDefeated = enemies.every(enemy => enemy.health === 0);
        if (allEnemiesDefeated) {
            alert('Congratulations! Pikachu has won!');
            location.reload();
        }
    };

    const handleKick = () => {
        enemies.forEach(enemy => {
            const damage = Math.floor(Math.random() * 20) + 1;
            enemy.receiveDamage(damage);
        });
        
        const characterDamage = Math.floor(Math.random() * 20) + 1;
        character.receiveDamage(characterDamage);

        checkGameOver();
    };

    const handleKickStrong = () => {
        enemies.forEach(enemy => {
            const damage = Math.floor(Math.random() * 30) + 1;
            enemy.receiveDamage(damage);
        });
        
        const characterDamage = Math.floor(Math.random() * 30) + 1;
        character.receiveDamage(characterDamage);

        checkGameOver();
    };

    document.getElementById('btn-kick').addEventListener('click', handleKick);
    document.getElementById('btn-kick-strong').addEventListener('click', handleKickStrong);
});
