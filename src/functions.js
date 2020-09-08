const asyncForEach = async (array, callback) => {
	for (let index = 0; index < array.length; index++) {
		await callback(array[index], index);
	}
};

const inverseCoords = ([x, y]) =>
	!x ? [xyMax, y] : !y ? [x, xyMax] : x == xyMax ? [0, y] : [x, 0];

const roundUp = (num) => {
	const split = num.toString().split(".")[1];
	return split
		? parseInt(split.split("")[0]) >= 5
			? Math.round(num)
			: num
		: num;
};

const checker = ([sX, sY]) => {
    const checkCOORDINATES = {...COORDINATES}
    const checkerCoord = [[sX, sY]];
    
	for(let i=0; i<100; i++){
		for(let j=0; j<checkerCoord.length;j++){
            const [cX, cY] = checkerCoord[j];
			const potentialHighlights = [
				[cX, cY - TILE_HEIGHT],
				[cX + TILE_HEIGHT, cY],
				[cX, cY + TILE_HEIGHT],
				[cX - TILE_HEIGHT, cY]
            ];

			for(let k=0; k<potentialHighlights.length;k++){
                const [x,y] = potentialHighlights[k]

                if(checkCOORDINATES[x]?.[y]?.walkable){
                    if(checkCOORDINATES[x][y].checked || x == sX && y == sY){
                        continue;
                    } else if(checkCOORDINATES[x][y].exit) {
                        return 1;
                    } else {
                        checkCOORDINATES[x][y].checked = 1;
                        checkerCoord.push(potentialHighlights[k]);
                    }
                }
            }
        };
            
        if (checkerCoord.length < 2) return;
    }

	return;
};

const inRange = ([aX,aY], [bX,bY], fov) => {
    const xDif = Math.abs(aX - bX) / TILE_HEIGHT;
    const yDif = Math.abs(aY - bY) / TILE_HEIGHT;
    return ~~Math.sqrt(xDif * xDif + yDif * yDif) <= fov;
}

const getCenterOfCoords = character => ([character.coords[0] + (TILE_WIDTH /2), character.coords[1] + (TILE_WIDTH /2)]);

const generatePlayer = (coord, room, tileSize) => {
	handleKeyPress = (e) => handlePlayerMovement(e, room, tileSize);

	playerCoord = coord;
	player.coords = coord;
	// console.log(
	// `The player will start at ${playerCoord} and will have the color ${color}`
    // );
	//   _moveBtn.addEventListener('click', player.hiliteMoveArea);
    
	if (!player.awaitingUser) {
        window.onkeypress = handleKeyPress;
	}
};

const generateEnemies = (lvl, max, room) => {
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
    }
    player.checkFOV();
    paintCanvas()
	player.hiliteMoveArea();
	player.hiliteFOV();
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

const handlePlayerMovement = async (event, room, tileSize) => {
	if (
		!(
			event.code == "KeyW" ||
			event.code == "KeyD" ||
			event.code == "KeyS" ||
			event.code == "KeyA"
		)
	)
		return;
	// pMove.play()
	zzfxP(pMove[rng(pMove.length -1)]); // playerMove
	// zzfx(...[,.25,144,,,.07,2,.1,-95.1,43.9,191,.1,.01,,,.1,.03,,.04])
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
    
    if (nextX == exit[0] && nextY == exit[1]) {
        game.classList.remove("e-turn");
        game.classList.add("p-turn");
        clearTimeout(moveTimer);
        // _moveBtn.removeEventListener('click', player.hiliteMoveArea);
        window.onkeypress = null;
        player.xp += lvl;
        lvl++;
        enemyPowerMult();
        if (lvl % 10 == 0) player.xp += 100;
        player.checkIfNextLvl();
        _expCurrent.textContent = player.xp;
        passDungeonSound.play()
        console.log("you win!");

        player.resetActions();
        return buildDungeon(
            CANVAS_HEIGHT,
            CANVAS_WIDTH,
            COLUMNS,
            ROWS,
            TILE_HEIGHT,
            TILE_WIDTH,
            exit
        );
    }

	if (room[nextX]?.[nextY]?.walkable && !room[nextX]?.[nextY]?.occupied) {
        if (enemies.length) player.actionsLeft--;
		room[playerX][playerY].occupied = 0;
		room[nextX][nextY].occupied = 1;
        
		_actionsLeft.innerHTML = player.actionsLeft;
        _steps.innerHTML = steps++;
        
		playerCoord = [nextX, nextY];
        player.coords = playerCoord;
        
		paintCanvas();
		player.hiliteMoveArea();
		player.checkFOV();

		// ADD CONDITIONAl TO ONLY RUN WHEN ACTIONSLEFT == 0
		if (!player.actionsLeft && enemies.length) {
			playersTurn = false;
			return enemyTurn();
		}
	}

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
const generateRandomEndpoint = ([sX,sY], tile) => {
    // Returned array so reduce can be used to get quadrant.
    // Goes in order 1-4(upper right to lower right CCW).
    // Takes in coords to return an array of objects that will be reduced to a single quadrant
    let potentialExits = [];
    for(let x in COORDINATES){
        for(let y in COORDINATES[x]){
            if(COORDINATES[x][y].border && (x != sX && y != sY) && !COORDINATES[x][y].corner) {
                potentialExits.push([parseInt(x),parseInt(y)])
            }

        }
    }
    potentialExits = potentialExits.filter(([pX,pY]) => COORDINATES[pX][pY].quadrant !== COORDINATES[sX][sY].quadrant)

    const actualExit = potentialExits[~~(Math.random() * potentialExits.length)]

    return actualExit
};

const paintCanvas = () => {
	for (let x in COORDINATES) {
		for (let y in COORDINATES[x]) {
            if(inRange(player.coords, [x,y],player.fov)){
                COORDINATES[x][y].hasBeenSeen = 1;
                COORDINATES[x][y].inSight = 1;
            } else COORDINATES[x][y].inSight = 0;
            
            let { highlighted, occupied, walkable, hasBeenSeen, inSight, border, exit } = COORDINATES[x][y];
            const current = player.coords[0] == x && player.coords[1] == y;
            
            ctx.clearRect(x, y, TILE_HEIGHT, TILE_HEIGHT);

			if (highlighted) {
                COORDINATES[x][y].highlighted = 0;
            }

            if(inSight){
                if (!walkable) {
                    ctx.fillStyle = colors.unseenOrUnwalkable;
                } else if(occupied){
                    ctx.fillStyle = colors.inSight.enemy;
                } else if (walkable) {
                    if (exit) {
                        ctx.fillStyle = getExitGradient(x, y);
                    } else if (hasBeenSeen) {
                        ctx.fillStyle = colors.inSight.walkable;
                    } else ctx.fillStyle = colors.unseenOrUnwalkable
                } 
            } else if(hasBeenSeen){
                if(!walkable){
                    ctx.fillStyle = colors.unseenOrUnwalkable;
                }
                else ctx.fillStyle = colors.outOfSight;
                
            } else {
                ctx.fillStyle = colors.unseenOrUnwalkable;
            }

            if(border && !exit){
                ctx.fillStyle = colors.unseenOrUnwalkable;
            }

            if(current){
                ctx.fillStyle = colors.player;
            }
            ctx.fillRect(x, y, TILE_HEIGHT, TILE_HEIGHT);
		}
    }
    player.hiliteFOV()
};

const enemyTurn = () => {
    window.onkeypress = null;
    game.classList.remove("p-turn");
    game.classList.add("e-turn");
    
	moveTimer = setTimeout(() =>
        asyncForEach(enemies, (enemy, i) => {
            showEnemyDetails(enemy);
            enemy.block = 0;
            return new Promise((resolve) => {
                const turn = setInterval(() => {
                    enemy.handleTurn();
                    if (enemy.speedLeft == 0) {
                        clearInterval(turn);
                        if (i == enemies.length - 1) {
                            window.onkeypress = handleKeyPress;
                            setTimeout(() => {
									playersTurn = true;
									game.classList.remove("e-turn");
									game.classList.add("p-turn");
                                    player.resetActions();
									player.hiliteMoveArea();
								}, 300);
							}

							setTimeout(() =>{
                                enemy.resetActions();
                                resolve()
                            }, 300);
						}
					}, 300);
            });
        })
    , 500);
};

const checkIfWaiting = () =>
	new Promise((resolve) =>
		setTimeout(
			() => (player.awaitingUser ? resolve(true) : resolve(false)),
			500
		)
	);

const getExitGradient = (x, y) => {
	let exit;
	if (x == 0) {
		exit = ctx.createLinearGradient(-20, 0, 20, 0);
	} else if (x == xyMax) {
		exit = ctx.createLinearGradient(240, 0, 260, 0);
	} else if (y == 0) {
		exit = ctx.createLinearGradient(0, -20, 0, 20);
	} else if (y == xyMax) {
		exit = ctx.createLinearGradient(0, 240, 0, 260);
	}

	if (x == 0 || y == 0) {
		exit.addColorStop(0.2, "black");
		exit.addColorStop(1, "yellow");
	} else {
		exit.addColorStop(1, "black");
		exit.addColorStop(0, "yellow");
	}

	return exit;
};

const gameOver = () => {
    
}