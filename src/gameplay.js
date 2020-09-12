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
		if (checkIfTargetCoord([adjustedX, adjustedY], enemy.coords)) {
			enemyIndex = i;
			return 1;
		}
    });

    const hoverPlayer = checkIfTargetCoord([adjustedX,adjustedY], player.coords);
    
	if (hoveredEnemy && inRange(hoveredEnemy.coords, player.coords, player.fov)) {
        console.log('enemy')
		_cursorModal.classList.remove('invisible')
		showHoveredDetails(hoveredEnemy);
        
    } else if(hoverPlayer){
        console.log('player')
        _cursorModal.classList.remove('invisible');
        showHoveredDetails(1,1);
    } else {
        enemyIndex = 0
        _cursorModal.classList.add('invisible')
        _cursorModal.innerHTML = ""
	}
}

game.addEventListener('mousemove', handleCanvasHover)

const playerAttack = async () => {
    const attack = await player.attackEnemy(enemies[enemyIndex])
    createChatMessage('player', player.name, attack)
};

const showHoveredDetails = (enemy, user) => {
    _cursorModal.innerHTML = ""
    const blkBtn = document.querySelector(`${user ? 'block' : 'attack'}-btn`)
    const atkBtn = document.querySelector(`${user ? 'block' : 'attack'}-btn`)
    if(blkBtn) blkBtn.removeEventListener('click', player.defStance)
    if(atkBtn) atkBtn.removeEventListener('click', playerAttack)
    const hovered = user ? {...player} : {...enemy}
	// CREATE CONTAINER
    
	const _section = document.createElement("section");
	_section.classList.add(`${user ? 'player' : 'enemy'}-item`);
    
	// CREATE 'H4' & APPEND TO CONTAINER
	const _h4 = document.createElement("h4");
	_h4.innerHTML = `${hovered.name} - ${!hovered.class ? 'Melee' : hovered.class == 1 ? 'Magic' : 'Ranged'}`;
	_section.append(_h4);
    
    const hp = user ? `${hovered.hp}/${hovered.maxHp}` : hovered.hp
	const _d = document.createElement('div')
    user && _d.append(createParSpanPair('XP:', `${player.xp}/${player.nextLvl}`))
    user && _d.append(document.createElement('br'))
	_d.classList.add(`${user ? 'player' : 'enemy'}-item-stats`)
	_d.append(createParSpanPair("❤ HP: ", hp))
	_d.append(createParSpanPair("🔪 Attack: ", hovered.attackStrength))
	_d.append(createParSpanPair("🔪 Attack Speed: ", hovered.attackSpeed))
	_d.append(createParSpanPair("🛡 Defense: ", hovered.def))
        
	_section.append(_d)
	
	const _btn = document.createElement('button')
	_btn.classList.add(`${user ? 'block' : 'attack'}-btn`, 'font-bold')
    _btn.innerText = user ? 'block' : "attack";
	
	_section.append(_btn)
	_cursorModal.append(_section)

	_btn.addEventListener('click', user ? player.defStance : playerAttack)
};

const typeName = e => {
    if(!startedTyping){
        _createNameInput.textContent = '';
        startedTyping = 1;
    }
    if(_createNameInput.textContent.length > 20  && e.keyCode != 8 && e.keyCode != 46) {
        e.preventDefault()
    } else if (e.key.match(/[A-Za-z0-9]/g) && e.key.length == 1){
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

const checkIfTargetCoord = ([hoverX, hoverY], [targetX, targetY]) =>
	hoverX >= targetX &&
	hoverY >= targetY &&
	hoverX < targetX + TILE_WIDTH &&
	hoverY < targetY + TILE_WIDTH
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