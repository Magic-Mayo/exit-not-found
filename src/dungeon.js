// ==========================
// BUILDING OUT THE DUNGEON
// ==========================

const buildDungeon = (
	cHeight,
	cWidth,
	columns,
	rows,
	tHeight,
	tWidth,
	[pExitX, pExitY]
) => {
	const inverseCoords = ([x, y]) =>
		!x ? [240, y] : !y ? [x, 240] : x == 241 ? [0, y] : [x, 0];

	// clear board of previous paint...if any
	ctx.clearRect(0, 0, cWidth, cHeight);
	const xMax = cWidth - tWidth;
	const yMax = cHeight - tHeight;
	const [sX, sY] = inverseCoords([pExitX, pExitY]);
	// SET UP COORDINATE PLANE
	columns.forEach((vX, x) => {
		x = x * tWidth;
		COORDINATES[x] = {};

		rows.forEach((vY, y) => {
			y = y * tHeight;
			const cellChance = Math.random();
			const newStartIsHere = sX === x && sY === y;

			console.log(newStartIsHere);

			COORDINATES[x][y] =
				cellChance <= WALKABLE_TILE_CHANCE || newStartIsHere ? 1 : 0;

			ctx.fillStyle = COORDINATES[x][y] === 1 ? "transparent" : "#2b2b2b";
			ctx.fillRect(x, y, tWidth, tHeight);
		});
	});

	//////////////////////////////////////////
	// these next two functions, start and end,
	// can go away once we have a system in
	// place for picking a start and exit
	///////////////////////////////////////////

	const generateRandomEndpoint = () => {
		const first = Math.floor(Math.random() * NUMBER_OF_ROWS) * TILE_HEIGHT;
		const second = 0;
		const firstIsX = Math.random() > 0.5 ? true : false;

		if (firstIsX) return [first, second];
		else return [second, first];
	};

	const randEnd = generateRandomEndpoint();
	// TO GENERATE A NEW EXIT COORDINATE:
	// 1. RULES:
	//     A. since exit will always be on the perimeter, one value MUST be zero (either X or Y)
	//     B. exit cannot be straight across from the exit

	// const end = (x, y) => (COORDINATES[x]?.[y] ? [x, y] : end(x, y - tHeight));

	// const [eX, eY] = end(randEnd[0], randEnd[1]);
	let dir = () => {
		if (sX == 0) {
			if (sY > 0) return 0;
			else return 1;
		} else if (sY == 0) {
			if (sX < 240) return 1;
			else return 2;
		} else if (sX == 240) {
			if (sY < 240) return 2;
			else return 3;
		}
	};
	console.log(COORDINATES);
	// checks to make sure the dungeon can be completed.
	// if not build another one until you get one that can be
	if (
		!checker(
			COORDINATES,
			[sX, sY],
			// [0,240],
			[sX, sY],
			[0, 240],
			// [eX, eY],
			[sX, sY],
			// [0,240],
			dir(),
			tHeight,
			[xMax, yMax]
		)
	) {
		return buildDungeon(cHeight, cWidth, columns, rows, tHeight, tWidth, [
			pExitX,
			pExitY,
		]);
	}
};

buildDungeon(
	CANVAS_HEIGHT,
	CANVAS_WIDTH,
	COLUMNS,
	ROWS,
	TILE_HEIGHT,
	TILE_WIDTH,
	[0, 160]
);

// STEPS TO REPRODUCE ABOVE TO PRODUCE CANVAS ELEMENT WITH TILES\
// 1. initiate the canvas element with a width & a height.
// 2. set up coordinate plane relative to canvas element size considering the # number of rows & colummns
