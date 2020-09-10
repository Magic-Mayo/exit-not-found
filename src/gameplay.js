////////// TO DO ///////////
// uncomment listener
////////// TO DO ///////////
_btnStart.addEventListener("click", (e) => {
    window.removeEventListener('keydown', typeName)
	// goFullScreen();
	// *** CREATE PLAYER ELEMENTS***
	const _createClassInput = document.querySelector(
		'input[name="class"]:checked'
    );
    

	_landing.classList.add("invisible");
	_btnStart.classList.add("invisible");

	_container.classList.remove("invisible");
	game.classList.add("p-turn");
    
    player = new Character(
		_createNameInput.textContent,
		parseInt(_createClassInput.value)
    );
    
	_healthpointsCurrent.innerHTML = player.hp;
	_healthpointsMax.innerHTML = player.hp;
    _playerLvl.innerHTML = player.lvl;
    _playerName.innerHTML = player.name
    _playerClass.innerHTML = !player.class ? "melee" : player.class == 1 ? 'magic' : 'ranged'

	_playerAttackStrength.innerHTML = player.attackStrength;
	_playerAttackSpeed.innerHTML = player.attackSpeed;
	_playerDefense.innerHTML = player.def;
	_playerAgility.innerHTML = player.agility;
	_playerFOV.innerHTML = Math.round(player.fov);
	_actionsTotal.innerHTML = player.actionsPerTurn;
	_actionsLeft.innerHTML = player.actionsLeft;
	_expCurrent.innerHTML = player.xp;
    _expToNextLvl.innerHTML = player.nextLvl;
	createChatMessage('narrator','narrator',`${player.name} has entered the dungeon...`)
	
    _blockBtn.addEventListener('click', player.defStance)
	buildDungeon(
		CANVAS_HEIGHT,
		CANVAS_WIDTH,
		COLUMNS,
		ROWS,
		TILE_HEIGHT,
		TILE_WIDTH,
		[0, 160]
    );

    createChatMessage('player', 'heyooo', 'we up in this bitch')
});

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

	// CREATE 'CLASS' & APPEND TO CONTAINER
	// const enemyClass = !enemy.class ? 'melee' : enemy.class == 1 ? 'magic' : 'ranged'
	// _section.append(createParSpanPair('🧍 Class: ', enemyClass))
	// CREATE 'HP' & APPEND TO CONTAINER
	_section.append(createParSpanPair("❤ HP: ", enemy.hp));
	// CREATE 'ATTACK STRENGTH' & APPEND TO CONTAINER
	_section.append(createParSpanPair("🔪 Attack: ", enemy.attackStrength));
	// CREATE 'DEFENSE' & APPEND TO CONTAINER
	_section.append(createParSpanPair("🛡 Defense: ", enemy.def));
	// CREATE 'FOV' & APPEND TO CONTAINER
    _section.append(createParSpanPair("🔭 FOV: ", enemy.fov));
	
	const _btn = document.createElement('button')
	_btn.classList.add('attack-btn', 'font-bold')
	_btn.innerText = "attack"
	

	_cursorModal.append(_btn)
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
