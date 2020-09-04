const asyncForEach = async (array, callback) => {
	for (let index = 0; index < array.length; index++) {
		await callback(array[index], index);
	}
};

const inverseCoords = ([x, y], max) =>
	!x ? [max, y] : !y ? [x, max] : x == max ? [0, y] : [x, 0];
const roundUp = (num) => {
	const split = num.toString().split(".")[1];
	return split
		? parseInt(split.split("")[0]) >= 5
			? Math.round(num)
			: num
		: num;
};

const generatePlayer = (coord, color, room, tileSize, exit) => {
	handleKeyPress = (e) =>
		handlePlayerMovement(e, room, tileSize, color, exit);

	playerCoord = coord;
	// console.log(
	// `The player will start at ${playerCoord} and will have the color ${color}`
	// );
	ctx.fillStyle = room[coord[0]][coord[1]] && color;
	ctx.fillRect(coord[0], coord[1], tileSize, tileSize);

	if (!player.currentlyLevelingUp) {
		window.addEventListener("keypress", handleKeyPress);
	}
};

const generateEnemies = (lvl, max, room, exits) => {
	enemies = [];

	enemyCount = rng(lvl / 2 + 2);
	// console.log("ENEMY COUNT: " + enemyCount);
	for (let i = 0; i < enemyCount; i++) {
		const enemy = new Enemy(
			getEnemyStartCoordinate(max, room),
			~~(totalEnemyPower / enemyCount)
		);
		enemies.push(enemy);
		const {
			coords: [x, y],
		} = enemy;

		COORDINATES[x][y].occupied = 1;
		ctx.fillStyle = room[x][y] && "#94040466";
		ctx.fillRect(x, y, TILE_WIDTH, TILE_HEIGHT);
	}
	player.checkFOV();
};

const getEnemyStartCoordinate = (max, room) => {
	const x = rng(NUMBER_OF_ROWS) * TILE_HEIGHT;
	const y = rng(NUMBER_OF_ROWS) * TILE_HEIGHT;
	return x != 0 &&
		y != 0 &&
		x != max &&
		y != max &&
		room[x]?.[y]?.walkable &&
		!room[x]?.[y]?.occupied
		? [x, y]
		: getEnemyStartCoordinate(max, room);
};

const handlePlayerMovement = async (event, room, tileSize, color, exits) => {
	if (
		!(
			event.code == "KeyW" ||
			event.code == "KeyD" ||
			event.code == "KeyS" ||
			event.code == "KeyA"
		)
	)
		return;
	let { key } = event;
	key = key.toLowerCase();
	let [playerX, playerY] = playerCoord;

	const dir = {
		w: [playerX, playerY - tileSize],
		d: [playerX + tileSize, playerY],
		s: [playerX, playerY + tileSize],
		a: [playerX - tileSize, playerY],
	};

	const [nextX, nextY] = dir[key];
	let moveTimer;

	if (room[nextX]?.[nextY].walkable && !room[nextX]?.[nextY].occupied) {
		if (enemies.length) player.actionsLeft--;
		_actionsLeft.innerHTML = player.actionsLeft;
		ctx.clearRect(playerX, playerY, tileSize, tileSize);
		room[playerX][playerY].occupied = 0;

		ctx.fillStyle = room[nextX][nextY].walkable && color;
		ctx.fillRect(nextX, nextY, tileSize, tileSize);
		room[nextX][nextY].occupied = 1;
		_steps.innerHTML = steps++;
		playerCoord = [nextX, nextY];

		// ADD CONDITIONAl TO ONLY RUN WHEN ACTIONSLEFT == 0
		if (!player.actionsLeft && enemies.length) {
			window.removeEventListener("keypress", handleKeyPress);
			player.resetActions();
			moveTimer = setTimeout(
				() =>
					asyncForEach(enemies, (enemy, i) => {
						let turns = enemy.speed;
						// const turn =
						return new Promise((resolve) => {
							const turn = setInterval(() => {
								enemy.handleTurn(exits);
								turns--;
								if (turns < 1) {
									clearInterval(turn);
									if (i == enemies.length - 1) {
										window.addEventListener(
											"keypress",
											handleKeyPress
										);
									}
									resolve();
								}
							}, 300);
						});
					}),
				500
			);
		}
	}
	for (let i = 0; i < exits.length; i++) {
		if (nextX == exits[i][0] && nextY == exits[i][1]) {
			clearTimeout(moveTimer);
			window.removeEventListener("keypress", handleKeyPress);
			player.xp += lvl;
			lvl++;
			enemyPowerMult();
			if (lvl % 10 == 0) player.xp += 100;
			player.checkIfNextLvl();
			_expCurrent.textContent = player.xp;

			console.log("you win!");

			player.resetActions();
			return buildDungeon(
				CANVAS_HEIGHT,
				CANVAS_WIDTH,
				COLUMNS,
				ROWS,
				TILE_HEIGHT,
				TILE_WIDTH,
				[exits[i][0], exits[i][1]]
			);
		}
	}
	player.checkFOV();
};

const goFullScreen = () => {
	if (body.requestFullscreen) {
		body.requestFullscreen();
	} else if (body.mozRequestFullScreen) {
		/* Firefox */
		body.mozRequestFullScreen();
	} else if (body.webkitRequestFullscreen) {
		/* Chrome, Safari and Opera */
		body.webkitRequestFullscreen();
	} else if (body.msRequestFullscreen) {
		/* IE/Edge */
		body.msRequestFullscreen();
	}
};

// must not be in a corner
// must not be on the same side as another exit or the start
const generateRandomEndpoint = ([sX, sY], tile, max, exit) => {
	const exitStart =
		exit.length > 0
			? [[sX, sY], ...exit.filter(([a, b]) => a != sX && b != sY)]
			: [[sX, sY]];
	const x = rng(tile) * tile;
	const y = x == 0 || x == max ? rng(tile) * tile : rng() > 1 ? 0 : max;
	// console.log(exitStart);

	const newExit = exitStart.some(([eX, eY]) => {
		if (
			((x == max || x == 0) && x == eX) ||
			((y == max || y == 0) && y == eY)
		)
			return true;

		return false;
	});

	if (!newExit) return [x, y];

	return generateRandomEndpoint([sX, sY], tile, max, exitStart);
};

const dir = ([sX, sY], tile, max) => {
	if (sX == 0) {
		if (sY > 0) return 0;
		else return 1;
	} else if (sY == 0) {
		if (sX < max + tile) return 1;
		else return 2;
	} else if (sX == max) {
		if (sY < max + tile) return 2;
		else return 3;
	}
};
