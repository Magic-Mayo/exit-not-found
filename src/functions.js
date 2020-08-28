const rng = (n = 4) => Math.floor(Math.random() * n);
const inverseCoords = ([x, y]) => !x ? [240, y] : !y ? [x, 240] : x == 241 ? [0, y] : [x, 0];
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
	console.log(
		`The player will start at ${playerCoord} and will have the color ${color}`
	);
	ctx.fillStyle = room[coord[0]][coord[1]] && color;
	ctx.fillRect(coord[0], coord[1], tileSize, tileSize);

	window.addEventListener("keypress", handleKeyPress);
};

const generateEnemies = (level, start, end, room) => {
	enemyPosition = [];
	count = level % 2 === 0 ? Math.pow(level, 2) / 4 : count;
	lvl++;
	console.log("ENEMY COUNT: " + count);
	for (let i = 0; i < count; i++) {
		enemyPosition.push(getEnemyCoordinate(start, end, room));
		const [x, y] = enemyPosition[i];
		ctx.fillStyle = room[x][y] && "#940404";
		ctx.fillRect(x, y, TILE_WIDTH, TILE_HEIGHT);
	}
};

const getEnemyCoordinate = (start, end, room) => {
	const x = Math.floor(Math.random() * NUMBER_OF_ROWS) * TILE_HEIGHT;
	const y = Math.floor(Math.random() * NUMBER_OF_ROWS) * TILE_HEIGHT;

	return x !== start[0] &&
		y !== start[1] &&
		x !== end[0] &&
		y !== end[1] &&
		room[x][y]
		? [x, y]
		: getEnemyCoordinate(start, end, room);
};

const handlePlayerMovement = (event, room, tileSize, color, exit) => {
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

	if (room[nextX]?.[nextY]) {
		ctx.clearRect(playerX, playerY, tileSize, tileSize);

		ctx.fillStyle = room[nextX][nextY] && color;
		ctx.fillRect(nextX, nextY, tileSize, tileSize);

		_steps.innerHTML = steps++;
		playerCoord = [nextX, nextY];
		enemyPosition.forEach((pos, i) => handleEnemyMovement(room, pos, i));
	}

	if (nextX == exit[0] && nextY == exit[1]) {
		console.log("you win!");
		window.removeEventListener("keypress", handleKeyPress);

		buildDungeon(
			CANVAS_HEIGHT,
			CANVAS_WIDTH,
			COLUMNS,
			ROWS,
			TILE_HEIGHT,
			TILE_WIDTH,
			[exit[0], exit[1]]
		);
	}
};

const handleEnemyMovement = (room, [x, y], i) => {
	const surroundings = [
		{
			pos: "top",
			coord: [x, y - TILE_WIDTH],
			available: room[x]?.[y - TILE_WIDTH],
		},
		{
			pos: "right",
			coord: [x + TILE_WIDTH, y],
			available: room[x + TILE_WIDTH]?.[y],
		},
		{
			pos: "bottom",
			coord: [x, y + TILE_WIDTH],
			available: room[x]?.[y + TILE_WIDTH],
		},
		{
			pos: "left",
			coord: [x - TILE_WIDTH, y],
			available: room[x - TILE_WIDTH]?.[y],
		},
	];
	const availableSurroundings = surroundings.filter((c) => c.available);
	ctx.clearRect(x, y, TILE_WIDTH, TILE_HEIGHT);
	enemyPosition[i] =
		availableSurroundings[
			Math.floor(Math.random() * availableSurroundings.length)
		].coord;
	const [newX, newY] = enemyPosition[i];

	ctx.fillStyle = room[newX][newY] && "#940404";
	ctx.fillRect(newX, newY, TILE_WIDTH, TILE_HEIGHT);
};


const goFullScreen = () => {
  if (body.requestFullscreen) {
    body.requestFullscreen();
  } else if (body.mozRequestFullScreen) { /* Firefox */
    body.mozRequestFullScreen();
  } else if (body.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
    body.webkitRequestFullscreen();
  } else if (body.msRequestFullscreen) { /* IE/Edge */
    body.msRequestFullscreen();
  }
}