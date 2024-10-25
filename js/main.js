import { Pokemon } from './Pokemon.js';
import { getRandomLog } from './logs.js';
import { pokemons } from './pokemons.js';

document.addEventListener('DOMContentLoaded', () => {
    const logsDiv = document.getElementById('logs');
    const startButton = document.getElementById('start-game');
    const victoryCountDisplay = document.getElementById('victory-count');
    let victoryCount = 0;
    let character, enemy;
    let attackCount = 0;
    const maxAttacks = 50;

    const addLog = (message) => {
        const newLog = document.createElement('p');
        newLog.textContent = message;
        logsDiv.prepend(newLog);
    };

    const updateHealthColor = (health, progressBar) => {
        if (health <= 20) {
            progressBar.style.backgroundColor = 'red';
        } else if (health <= 60) {
            progressBar.style.backgroundColor = 'yellow';
        } else {
            progressBar.style.backgroundColor = 'green';
        }
    };

    const startGame = () => {
        startButton.style.display = 'none';
        document.querySelector('.control').style.display = 'block';

        const randomIndex1 = Math.floor(Math.random() * pokemons.length);
        let randomIndex2;
        do {
            randomIndex2 = Math.floor(Math.random() * pokemons.length);
        } while (randomIndex1 === randomIndex2);

        character = new Pokemon(pokemons[randomIndex1].name, pokemons[randomIndex1].hp, 'progressbar-character', 'health-character', addLog);
        enemy = new Pokemon(pokemons[randomIndex2].name, pokemons[randomIndex2].hp, 'progressbar-enemy', 'health-enemy', addLog);

        document.querySelector('.character').style.display = 'block';
        document.querySelector('.enemy').style.display = 'block';
        document.getElementById('character-image').src = pokemons[randomIndex1].img;
        document.getElementById('enemy-image').src = pokemons[randomIndex2].img;
        document.getElementById('name-character').textContent = character.name;
        document.getElementById('name-enemy').textContent = enemy.name;
        character.updateHealthBar();
        enemy.updateHealthBar();
    };

    const checkGameOver = () => {
        if (character.health <= 0 && enemy.health <= 0) {
            addLog('Нічия! Всі учасники бою втратили здоров\'я!');
            alert('Draw! Everyone lost!');
            resetGame();
        } else if (character.health <= 0) {
            addLog(`Гра закінчена! ${character.name} програв!`);
            alert(`Game Over! ${character.name} has lost!`);
            resetGame();
        } else if (enemy.health <= 0) {
            addLog(`Вітаємо! ${character.name} переміг ${enemy.name}!`);
            victoryCount++;
            victoryCountDisplay.textContent = victoryCount;
            alert(`Congratulations! ${character.name} has won!`);
            character.health += 20;
            character.updateHealthBar();
            startNewEnemy();
        }
    };

    const startNewEnemy = () => {
        let newEnemyIndex;
        do {
            newEnemyIndex = Math.floor(Math.random() * pokemons.length);
        } while (pokemons[newEnemyIndex].name === enemy.name);

        enemy = new Pokemon(pokemons[newEnemyIndex].name, pokemons[newEnemyIndex].hp, 'progressbar-enemy', 'health-enemy', addLog);
        document.getElementById('enemy-image').src = pokemons[newEnemyIndex].img;
        document.getElementById('name-enemy').textContent = enemy.name;
        enemy.updateHealthBar();
    };

    const onKick = () => {
        if (attackCount >= maxAttacks) {
            addLog('Досягнуто максимальна кількість ударів!');
            return;
        }
        attackCount++;

        if (Math.random() < 0.7) {
            const damage = Math.floor(Math.random() * 11) + 5;
            enemy.receiveDamage(damage, character.name);
            const characterDamage = Math.floor(Math.random() * 11) + 5;
            character.receiveDamage(characterDamage, enemy.name);
        } else {
            addLog(`${character.name} промахнувся!`);
        }
        checkGameOver();
    };

    const onKickStrong = () => {
        if (attackCount >= maxAttacks) {
            addLog('Досягнуто максимальна кількість ударів!');
            return;
        }
        attackCount++;

        if (Math.random() < 0.5) {
            const damage = Math.floor(Math.random() * 11) + 10;
            enemy.receiveDamage(damage, character.name);
            const characterDamage = Math.floor(Math.random() * 11) + 10;
            character.receiveDamage(characterDamage, enemy.name);
        } else {
            addLog(`${character.name} промахнувся при сильному ударі!`);
        }
        checkGameOver();
    };

    startButton.addEventListener('click', startGame);
    document.getElementById('btn-kick').addEventListener('click', onKick);
    document.getElementById('btn-kick-strong').addEventListener('click', onKickStrong);
    
    const resetGame = () => {
        location.reload();
    };
});