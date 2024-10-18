document.addEventListener('DOMContentLoaded', () => {
    const logs = [
        '[ПЕРСОНАЖ №1] згадав щось важливе, але раптово [ПЕРСОНАЖ №2], не пам\'ятаючи себе від страху, вдарив у передпліччя ворога.',
        '[ПЕРСОНАЖ №1] поперхнувся, і за це [ПЕРСОНАЖ №2] з переляку вдарив коліном у лоб ворога.',
        '[ПЕРСОНАЖ №1] задумався, але в цей час нахабний [ПЕРСОНАЖ №2], прийнявши вольове рішення, безшумно підійшов ззаду і вдарив.',
        '[ПЕРСОНАЖ №1] прийшов до тями, але раптово [ПЕРСОНАЖ №2] випадково завдав потужного удару.',
        '[ПЕРСОНАЖ №1] поперхнувся, але в цей час [ПЕРСОНАЖ №2] неохоче роздробив кулаком ворога.',
        '[ПЕРСОНАЖ №1] здивувався, а [ПЕРСОНАЖ №2] похитнувся і завдав підступного удару.',
        '[ПЕРСОНАЖ №1] висморкався, але раптово [ПЕРСОНАЖ №2] завдав дроблячого удару.',
        '[ПЕРСОНАЖ №1] похитнувся, і раптом нахабний [ПЕРСОНАЖ №2] без причини вдарив у ногу противника.',
        '[ПЕРСОНАЖ №1] засмутився, як раптом, несподівано [ПЕРСОНАЖ №2] випадково завдав удару в живіт суперника.',
        '[ПЕРСОНАЖ №1] намагався щось сказати, але раптом [ПЕРСОНАЖ №2] від нудьги розбив брову супротивнику.'
    ];

    class Pokemon {
        constructor(name, health, progressBarId, healthTextId) {
            this.name = name;
            this.health = health;
            this.maxHealth = health;
            this.progressBar = document.getElementById(progressBarId);
            this.healthText = document.getElementById(healthTextId);
            this.updateHealthBar();
        }

        updateHealthBar() {
            this.health = Math.max(this.health, 0);
            const healthPercentage = (this.health / this.maxHealth) * 100;
            this.progressBar.style.width = `${healthPercentage}%`;
            this.healthText.textContent = `${this.health} / ${this.maxHealth}`;
        }

        receiveDamage(damage, enemyName) {
            this.health -= damage;
            this.updateHealthBar();
            const logMessage = this.getRandomLog(this.name, enemyName);
            addLog(`${logMessage} ${this.name} отримав ${damage} пошкоджень. Залишилось ${this.health} HP.`);
        }

        getRandomLog(character1, character2) {
            const randomIndex = Math.floor(Math.random() * logs.length);
            return logs[randomIndex].replace('[ПЕРСОНАЖ №1]', character1).replace('[ПЕРСОНАЖ №2]', character2);
        }
    }

    const logsDiv = document.createElement('div');
    logsDiv.id = 'logs';
    document.body.appendChild(logsDiv);

    const addLog = (message) => {
        const newLog = document.createElement('p');
        newLog.textContent = message;
        logsDiv.prepend(newLog);
    };

    const character = new Pokemon('Pikachu', 100, 'progressbar-character', 'health-character');
    const enemies = [
        new Pokemon('Charmander', 100, 'progressbar-enemy', 'health-enemy'),
        new Pokemon('Squirtle', 100, 'progressbar-enemy2', 'health-enemy2')
    ];

    const checkGameOver = () => {
        const allEnemiesDefeated = enemies.every(({ health }) => health === 0);
        const isCharacterDefeated = character.health === 0;

        if (isCharacterDefeated && allEnemiesDefeated) {
            addLog('Нічия! Всі учасники бою втратили здоров\'я!');
            alert('Draw! Everyone lost!');
            location.reload();
        } else if (isCharacterDefeated) {
            addLog('Гра закінчена! Пікачу програв!');
            alert('Game Over! Pikachu has lost!');
            location.reload();
        } else if (allEnemiesDefeated) {
            addLog('Вітаємо! Пікачу переміг усіх ворогів!');
            alert('Congratulations! Pikachu has won!');
            location.reload();
        }
    };

    const createClickCounter = (button, limit) => {
        let clickCount = 0;
        return () => {
            if (clickCount < limit) {
                clickCount++;
                console.log(`Кнопка натиснута ${clickCount} разів. Залишилось ${limit - clickCount} натискань.`);
                return true;
            } else {
                console.log('Кнопка більше не активна.');
                return false;
            }
        };
    };

    const handleKick = createClickCounter(document.getElementById('btn-kick'), 6);
    const handleKickStrong = createClickCounter(document.getElementById('btn-kick-strong'), 6);

    const onKick = () => {
        if (handleKick()) {
            enemies.forEach(enemy => {
                const damage = Math.floor(Math.random() * 20) + 1;
                enemy.receiveDamage(damage, character.name);
            });

            const characterDamage = Math.floor(Math.random() * 20) + 1;
            character.receiveDamage(characterDamage, enemies[Math.floor(Math.random() * enemies.length)].name);
            checkGameOver();
        }
    };

    const onKickStrong = () => {
        if (handleKickStrong()) {
            enemies.forEach(enemy => {
                const damage = Math.floor(Math.random() * 30) + 1;
                enemy.receiveDamage(damage, character.name);
            });

            const characterDamage = Math.floor(Math.random() * 30) + 1;
            character.receiveDamage(characterDamage, enemies[Math.floor(Math.random() * enemies.length)].name);
            checkGameOver();
        }
    };

    document.getElementById('btn-kick').addEventListener('click', onKick);
    document.getElementById('btn-kick-strong').addEventListener('click', onKickStrong);
});
