import { getRandomLog } from './logs.js';

export class Pokemon {
    constructor(name, health, progressBarId, healthTextId, addLog) {
        this.name = name;
        this.health = health;
        this.maxHealth = health;
        this.progressBar = document.getElementById(progressBarId);
        this.healthText = document.getElementById(healthTextId);
        this.addLog = addLog;
        this.updateHealthBar();
    }

		updateHealthBar() {
			this.health = Math.max(this.health, 0);
			const healthPercentage = (this.health / this.maxHealth) * 100;
			this.progressBar.style.width = `${healthPercentage}%`;
			this.healthText.textContent = `${this.health} / ${this.maxHealth}`;
			this.changeHealthColor();
		}

		changeHealthColor() {
			this.progressBar.classList.remove('low', 'critical');
			if (this.health <= 20) {
				this.progressBar.classList.add('critical');
			} else if (this.health <= 60) {
				this.progressBar.classList.add('low');
			}
		}

    receiveDamage(damage, enemyName) {
        this.health -= damage;
        this.updateHealthBar();
        const logMessage = getRandomLog(this.name, enemyName);
        this.addLog(`${logMessage} ${this.name} отримав ${damage} пошкоджень. Залишилось ${this.health} HP.`);
    }
}