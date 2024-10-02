// main.js
let characterHealth = 100;
let enemyHealth = 100;

const healthCharacterDisplay = document.getElementById("health-character");
const healthEnemyDisplay = document.getElementById("health-enemy");
const progressBarCharacter = document.getElementById("progressbar-character");
const progressBarEnemy = document.getElementById("progressbar-enemy");
const attackButton = document.getElementById("btn-kick");

function updateCharacterHealth() {
    healthCharacterDisplay.textContent = `${characterHealth} / 100`;
    progressBarCharacter.style.width = `${(characterHealth / 100) * 100}%`;
}

function updateEnemyHealth() {
    healthEnemyDisplay.textContent = `${enemyHealth} / 100`;
    progressBarEnemy.style.width = `${(enemyHealth / 100) * 100}%`;
}

attackButton.addEventListener("click", () => {
    const damageToEnemy = Math.floor(Math.random() * 20) + 1;
    enemyHealth -= damageToEnemy;

    if (enemyHealth < 0) enemyHealth = 0;

    updateEnemyHealth();

    if (enemyHealth === 0) {
        alert("Вы победили Charmander!");
        resetHealth();
    } else {
        attackCharacter();
    }
});

function attackCharacter() {
    const damageToCharacter = Math.floor(Math.random() * 20) + 1;
    characterHealth -= damageToCharacter;

    if (characterHealth < 0) characterHealth = 0;

    updateCharacterHealth();

    if (characterHealth === 0) {
        alert("Вам не повезло! Вы проиграли!");
        resetHealth();
    }
}

function resetHealth() {
    characterHealth = 100;
    enemyHealth = 100;
    updateCharacterHealth();
    updateEnemyHealth();
}

updateCharacterHealth();
updateEnemyHealth();