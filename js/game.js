import { Pokemon } from './Pokemon.js';
import { getRandomLog } from './logs.js';
import { pokemons } from './pokemons.js';

export class Game {
    constructor() {
        this.character = null;
        this.enemies = [];
        this.logsDiv = document.createElement('div');
        this.logsDiv.id = 'logs';
        document.body.appendChild(this.logsDiv);
    }

    startGame() {
        this.character = new Pokemon('Pikachu', 100, 'progressbar-character', 'health-character', this.addLog.bind(this));
        this.enemies = this.createEnemies();
        this.updateEnemyUI();
    }

    resetGame() {
        this.character.health = this.character.maxHealth;
        this.character.updateHealthBar();
        this.enemies.forEach(enemy => {
            enemy.health = enemy.maxHealth;
            enemy.updateHealthBar();
        });
        this.logsDiv.innerHTML = '';
        this.startGame();
    }

    createEnemies() {
        return [this.createRandomEnemy(), this.createRandomEnemy()];
    }

    createRandomEnemy() {
        const randomIndex = Math.floor(Math.random() * pokemons.length);
        const enemyData = pokemons[randomIndex];
        return new Pokemon(enemyData.name, enemyData.hp, `progressbar-enemy`, `health-enemy`, this.addLog.bind(this));
    }

    updateEnemyUI() {
        this.enemies.forEach((enemy, index) => {
            document.getElementById(`name-enemy${index + 1}`).textContent = enemy.name;
        });
    }

    addLog(message) {
        const newLog = document.createElement('p');
        newLog.textContent = message;
        this.logsDiv.prepend(newLog);
    }

    checkGameOver() {
        const allEnemiesDefeated = this.enemies.every(({ health }) => health <= 0);
        const isCharacterDefeated = this.character.health <= 0;

        if (isCharacterDefeated && allEnemiesDefeated) {
            this.addLog('Нічия! Всі учасники бою втратили здоров\'я!');
            alert('Draw! Everyone lost!');
            location.reload();
        } else if (isCharacterDefeated) {
            this.addLog('Гра закінчена! Пікачу програв!');
            alert('Game Over! Pikachu has lost!');
            location.reload();
        } else if (allEnemiesDefeated) {
            this.addLog('Вітаємо! Пікачу переміг усіх ворогів!');
            alert('Congratulations! Pikachu has won!');
            location.reload();
        }
    }
}