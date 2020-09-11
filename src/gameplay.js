////////// TO DO ///////////
// uncomment listener
////////// TO DO ///////////
_btnStart.addEventListener("click", startGame);

// _btnReset.addEventListener("click", (e) => {
// 	const didExit = confirm(
// 		"Are You Sure You Want To Quit? You're progress will not be saved"
// 	);
// 	didExit && location.reload();
// });

////////// TO DO ///////////
// uncomment listener
////////// TO DO ///////////

// STATS
// 1. healthpoints
// 2. exp points
// 3. dungeon lvl
// 4. total steps walked


const handleCanvasHover = (e) => {
	_cursorModal.style.transform = `translate(calc(-25% + ${e.clientX}px),calc(-25% + ${e.clientY}px))`
	const { top, left } = game.getBoundingClientRect();
	const percentDiff = game.width / e.target.clientWidth;

	const adjustedX = (e.clientX - left) * percentDiff;
	const adjustedY = (e.clientY - top) * percentDiff;

	// THIS SHOULD RETURN AN ARRAY OF ONE OR MORE ENEMIES THAT ARE IN THE CLICK LOCATION
	const [hoveredEnemy] = enemies.filter((enemy, i) => {
		if (checkIfEnemyCoord([adjustedX, adjustedY], enemy.coords)) {
			enemyIndex = i;
			return 1;
		}
	});

	if (hoveredEnemy) {
		_cursorModal.classList.remove('invisible')
		showEnemyDetails(hoveredEnemy, enemyIndex);

	} else {
        enemyIndex = 0
        _cursorModal.classList.add('invisible')
	}
}

game.addEventListener('mousemove', handleCanvasHover)

const playerAttack = async () => {
    const attack = await player.attackEnemy(enemies[enemyIndex])
    createChatMessage('player', player.name, attack)
};

const showEnemyDetails = enemy => {
	_cursorModal.innerHTML = ""
	// CREATE CONTAINER
	const _section = document.createElement("section");
	_section.classList.add("enemy-item");

	// CREATE 'H4' & APPEND TO CONTAINER
	const _h4 = document.createElement("h4");
	_h4.innerHTML = enemy.name;
	_section.append(_h4);

	// _section.append(createParSpanPair("❤ HP: ", enemy.hp));
	// _section.append(createParSpanPair("🔪 Attack: ", enemy.attackStrength));
	// _section.append(createParSpanPair("🛡 Defense: ", enemy.def));

	const _d = document.createElement('div')
	_d.classList.add('enemy-item-stats')
	_d.append(createParSpanPair("❤ HP: ", enemy.hp))
	_d.append(createParSpanPair("🔪 Attack: ", enemy.attackStrength))
	_d.append(createParSpanPair("🛡 Defense: ", enemy.def))

	// _section.innerHTML = `<div class="enemy-item-stats">${createParSpanPair("❤ HP: ", enemy.hp)}${createParSpanPair("🔪 Attack: ", enemy.attackStrength)}${createParSpanPair("🛡 Defense: ", enemy.def)}</div>`

	_section.append(_d)
	
	const _btn = document.createElement('button')
	_btn.classList.add('attack-btn', 'font-bold')
	_btn.innerText = "attack"
	
	// _section.append(_stats);
	_section.append(_btn)

	_cursorModal.append(_section)

	_btn.removeEventListener('click', playerAttack)
	_btn.addEventListener('click', playerAttack)
};

const typeName = e => {
    if(_createNameInput.textContent.length > 20  && e.keyCode != 8 && e.keyCode != 46) {
        e.preventDefault()
    } else if (e.key.match(/[A-Za-z0-9]/g) && e.key.length == 1) {
        console.log(e.key)
        _createNameInput.textContent = _createNameInput.textContent + e.key
    } else if (e.keyCode == 8) {
        _createNameInput.textContent = _createNameInput.textContent.substr(0,_createNameInput.textContent.length - 1)
    }

}

window.addEventListener('keydown', typeName)
const createParSpanPair = (title, data) => {
	const _p = document.createElement("p");
	const _span = document.createElement("span");
	_p.innerHTML = title;
	_span.innerHTML = data;
	_p.append(_span);
	return _p;
};

const checkIfEnemyCoord = ([clickX, clickY], [enX, enY]) =>
	clickX >= enX &&
	clickY >= enY &&
	clickX < enX + TILE_WIDTH &&
	clickY < enY + TILE_WIDTH
		? true
		: false;

_lvlUp.addEventListener("click", (e) => e.target.dataset.stat ? player.addStat(e.target.dataset.stat) : null);
_cursorModal.addEventListener("mouseleave", e => {
	enemyIndex = 0
	_cursorModal.classList.add('invisible')
})

_newGameBtn.addEventListener('click', e => {
	player = new Character(player.name,player.class)
	_playAgain.classList.add('invisible')
	_chatMessageGroup.innerHTML = ''
	startGame(true)
})

_newCharacterBtn.addEventListener('click', e => location.reload())