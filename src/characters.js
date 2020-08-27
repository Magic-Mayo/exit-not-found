const weapons = [
	["Brass knuckles", "Fists"],
	[""],
	["Pistol", "Rifle", "Sniper"],
];
const enemies = [["Skeleton", "Vampire"], [""], [""]];

const rng = (n = 4) => Math.floor(Math.random() * n);
const roundUp = (num) => {
	const split = num.toString().split(".")[1];
	return split
		? parseInt(split.split("")[0]) >= 5
			? Math.round(num)
			: num
		: num;
};

// playable character constructor
const Character = function (name, clas) {
	// 0 = melee, 2 = ranged, 1 = magic
	this.class = clas;
	this.name = name;
	this.xp = 0;
	this.lvl = 1;
	this.hp = !clas ? 100 : clas == 1 ? 50 : 75;

	this.attack = !clas ? rng() + 3 : clas == 1 ? rng(3) + 1 : rng() + 3;

	this.def = !clas ? rng() + 2 : clas == 1 ? rng(2) + 1 : rng(3) + 1;

	this.agility = !clas ? rng(2) + 1 : clas == 1 ? rng(2) + 1 : rng() + 1;

	this.speed = !clas ? rng() + 4 : clas == 1 ? rng(2) + 3 : rng() + 4;

	this.fov = !clas ? rng(2) + 2 : clas == 1 ? rng() + 4 : rng() + 4;

	// this.accuracy = TBD
	this.items = [];
	this.lvlUp = function () {
		xp >= lvl * 404 ? this.addStat() : null;
	};
	this.weapons = weapons[this.class];
	this.addStat = function (stat) {
		// add code to prompt user to enter a stat to increase
		switch (stat) {
			case 0:
				return (this.attack = roundUp(this.attack * 1.2));
			case 1:
				return (this.agility = roundUp(this.agility * 1.1));
			case 2:
				return (this.def = roundUp(this.def * 1.15));
			case 3:
				return (this.speed = roundUp(this.speed * 1.1));
		}
	};
	this.move = function (squares) {
		const speed = this.speed;
		// take amount of squares moved and see if character's speed is enough to cover
		// if it is, subtract that amount from speed
	};
	this.attackEnemy = function (enemy) {
		const willHit = enemy.agility < rng(100) && this.attack > enemy.def;
		willHit ? (enemy.hp = enemy.hp - this.attack + enemy.def) : 0;
		return willHit
			? `You hit for ${this.attack - enemy.def}!`
			: `${this.name} missed!`;
	};
	this.handlePlayerMovement;
};

// enemy constructor
const Enemy = function (difficulty) {
	const newClass = rng(100);
	// 0 = melee, 2 = ranged, 1 = magic
	this.class = newClass < 60 ? 0 : newClass < 85 ? 2 : 1;
	this.name = enemies[this.class][rng(3)];
	this.hp =
		Math.floor(Math.sqrt(difficulty * rng(100))) + difficulty * rng(10);
	this.attack = difficulty + rng(10) + 1 - this.class * 2;
	this.def = difficulty * rng() + difficulty;
	this.fov = this.class * 2 + difficulty;
	this.speed = this.class == 0 ? 6 : this.class == 1 ? 3 : 4;
	this.xp = difficulty * 10 + rng(20);
	this.atkChar = function (char) {
		const willHit = char.agility < rng(100) && char.def < this.attack;
		willHit ? (char.hp = char.hp - this.attack + Math.floor(char.def)) : 0;
		return char.def >= this.attack
			? `You blocked ${this.name}'s attack!`
			: willHit
			? `${this.name} hit for ${this.attack}!`
			: `${this.name} missed!`;
	};
	this.move = function () {
		//pick random direction for each speed point
		const directions = new Array(this.speed).fill().map((dir) => rng());

		//check fov to see if it can spot character
	};
};

const rooms = [];
let lvl = 1;
let count = 1;
let enemyPosition = [];
let playerCoord = [];
let handleKeyPress;

const generatePlayer = (coord, color, room, tileSize, exit) => {
	handleKeyPress = (e) => {
		console.log("i clicked a button");
		handlePlayerMovement(e, room, tileSize, color, exit);
	};

	playerCoord = coord;
	console.log(room);
	console.log(
		`The player will start at ${playerCoord} and will have the color ${color}`
	);
	ctx.fillStyle = room[coord[0]][coord[1]] && color;
	ctx.fillRect(coord[0], coord[1], tileSize, tileSize);

	window.addEventListener("keypress", handleKeyPress);
};

const generateEnemies = (level, start, end, room) => {
	enemyPosition = []
	count = level % 2 === 0 ? Math.pow(level, 2) / 4 : count;
	lvl++;
	console.log("ENEMY COUNT: " + count)
	for (let i = 0; i < count; i++) {
		enemyPosition.push(getEnemyCoordinate(start, end, room))
		const [x, y] = enemyPosition[i];
		ctx.fillStyle = room[x][y] && "#940404";
		ctx.fillRect(x, y, TILE_WIDTH, TILE_HEIGHT);
		console.log(enemyPosition);
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
		w: {
			code: "w",
			coord: [playerX, playerY - tileSize],
		},
		d: {
			code: "d",
			coord: [playerX + tileSize, playerY],
		},
		s: {
			code: "s",
			coord: [playerX, playerY + tileSize],
		},
		a: {
			code: "a",
			coord: [playerX - tileSize, playerY],
		},
	};

	const [nextX, nextY] = dir[key].coord;

	if (room[nextX]?.[nextY]) {
		ctx.clearRect(playerX, playerY, tileSize, tileSize);

		ctx.fillStyle = room[nextX][nextY] && color;
		ctx.fillRect(nextX, nextY, tileSize, tileSize);

		_steps.innerHTML = steps++
		playerCoord = [nextX, nextY];
	}

	enemyPosition.forEach((pos,i) => handleEnemyMovement(room,pos,i))


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

const handleEnemyMovement = (room, [x,y],i) => {
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
