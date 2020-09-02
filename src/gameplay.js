////////// TO DO ///////////
// uncomment listener
////////// TO DO ///////////
_btnStart.addEventListener("click", (e) => {
	// goFullScreen();

	_container.classList.remove("invisible");
	_landing.classList.add("invisible");
	_btnStart.classList.add("invisible");

	console.log(player);

	player = new Character("slimey", 0);
	_healthpointsCurrent.innerHTML = player.hp;
	_healthpointsMax.innerHTML = player.hp;
	_playerLvl.innerHTML = player.lvl;
	_playerAttackStrength.innerHTML = player.attackStrength;
	_playerAttackSpeed.innerHTML = player.speed;
	_playerDefense.innerHTML = player.def;
	_playerAgility.innerHTML = player.agility;
	_playerFOV.innerHTML = player.fov;
	buildDungeon(
		CANVAS_HEIGHT,
		CANVAS_WIDTH,
		COLUMNS,
		ROWS,
		TILE_HEIGHT,
		TILE_WIDTH,
		[0, 160]
	);
});

_btnReset.addEventListener("click", (e) => {
	const didExit = confirm(
		"Are You Sure You Want To Quit? You're progress will not be saved"
	);
	didExit && location.reload();
});

////////// TO DO ///////////
// uncomment listener
////////// TO DO ///////////

// STATS
// 1. healthpoints
// 2. exp points
// 3. dungeon lvl
// 4. total steps walked

game.addEventListener("click", (e) => {
	const { top, left } = game.getBoundingClientRect();
	const percentDiff = game.width / e.target.clientWidth;

	const adjustedX = (e.clientX - left) * percentDiff;
	const adjustedY = (e.clientY - top) * percentDiff;
	console.log(`adjusted x: ${adjustedX}, adjusted y: ${adjustedY}`);
	console.log(enemies);

	// THIS SHOULD RETURN AN ARRAY OF ONE OR MORE ENEMIES THAT ARE IN THE CLICK LOCATION
	enemies.forEach((enemy) =>
		checkIfEnemyCoord([adjustedX, adjustedY], enemy.coords)
	);
});

const checkIfEnemyCoord = ([clickX, clickY], [enX, enY]) => {

	if (
		clickX >= enX &&
		clickY >= enY &&
		clickX < enX + TILE_WIDTH &&
		clickY < enY + TILE_WIDTH
	) {
        console.log('you clicked an enemy');
	}
};
