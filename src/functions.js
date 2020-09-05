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

const checker = ([sX, sY]) => {
    const checkerCoord = [[sX,sY]];
    // let exitsFound = 0;
    while (checkerCoord.length < 200 ){
        checkerCoord.forEach(([cX,cY]) => {
            const potentialHighlights = [
                [cX, cY - TILE_HEIGHT],
                [cX + TILE_HEIGHT, cY],
                [cX, cY + TILE_HEIGHT],
                [cX - TILE_HEIGHT, cY],
            ];
            
            potentialHighlights
            .filter(([x, y]) => COORDINATES[x]?.[y]?.walkable)
            .filter(([x,y]) => checkerCoord.some(([cX,cY]) => x != cX ? 1 : y == cY ? 0 : 1))
            .forEach(([x,y]) =>{
                if(x == sX && y == sY) return;
                checkerCoord.push([x, y])
            });
        });

        if(checkerCoord.length < 2) break;
        
        for(let i=0; i<exits.length;i++){
            const [eX,eY] = exits[i];
            for(let j=0;j<checkerCoord.length;j++){
                const [cX,cY] = checkerCoord[j]
                if(cX == eX && cY == eY){
                    return 1;
                    // exitsFound++;
					// if (exitsFound == exits.length) return 1
                }
            }
        }
    }
    
    return;
}

const generatePlayer = (coord, color, room, tileSize) => {
	handleKeyPress = (e) =>
		handlePlayerMovement(e, room, tileSize, color);

  playerCoord = coord;
  player.currentCoord = coord;
	// console.log(
	// `The player will start at ${playerCoord} and will have the color ${color}`
	// );
	ctx.fillStyle = room[coord[0]][coord[1]] && color;
  ctx.fillRect(coord[0], coord[1], tileSize, tileSize);
  player.hiliteMoveArea();
  player.hiliteFOV();
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

const handlePlayerMovement = async (event, room, tileSize, color) => {
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
    
	if (room[nextX]?.[nextY].walkable && !room[nextX]?.[nextY].occupied) {
        removeHighlight();
        if (enemies.length) player.actionsLeft--;
		_actionsLeft.innerHTML = player.actionsLeft;
        ctx.clearRect(playerX, playerY, tileSize, tileSize);
        ctx.fillStyle = room[playerX][playerY].highlighted ? '#08fa2566' : 'transparent';
        ctx.fillRect(playerX, playerY, tileSize, tileSize);
		room[playerX][playerY].occupied = 0;

		ctx.fillStyle = room[nextX][nextY].walkable && color;
		ctx.fillRect(nextX, nextY, tileSize, tileSize);
		room[nextX][nextY].occupied = 1;
		_steps.innerHTML = steps++;
        playerCoord = [nextX, nextY];
        player.currentCoord = playerCoord;
        player.hiliteMoveArea();
        player.hiliteFOV();
        player.checkFOV();
        
		// ADD CONDITIONAl TO ONLY RUN WHEN ACTIONSLEFT == 0
		if (!player.actionsLeft && enemies.length) {
            playersTurn = false
            game.classList.remove('p-turn')
            game.classList.add('e-turn')
            return enemyTurn();
        }
    }
	for (let i = 0; i < exits.length; i++) {
		if (nextX == exits[i][0] && nextY == exits[i][1]) {
            game.classList.remove('e-turn')
            game.classList.add('p-turn')
            clearTimeout(moveTimer);
            // _moveBtn.removeEventListener('click', player.hiliteMoveArea);
			window.onkeypress = null;
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
const generateRandomEndpoint = (start, tile, max) => {
    let xZero = start[0] == 0 ? 1 : 0;
    let xMax = start[0] == max ? 1 : 0;
    let yZero = start[1] == 0 ? 1 : 0;
    let yMax = start[1] == max ? 1 : 0;
    const amountExits = rng(100) > 75 ? rng(3) + 1 : rng(2) + 1;
    const exits = [];

    const getRandCoord = () => {
        let coord = rng(tile) * tile;
        while(coord == max || coord == 0){
            coord = rng(tile) * tile;
        }
        return coord;
    }

    while(xMax + xZero + yMax + yZero <= amountExits){
        const randAxis = rng(4);
        if(!randAxis && !xZero){
            xZero++;
            exits.push([0,getRandCoord()]);
        } else if(randAxis == 1 && !xMax){
            xMax++;
            exits.push([max,getRandCoord()])
        } else if(randAxis == 2 && !yZero){
            yZero++;
            exits.push([getRandCoord(), 0]);
        } else if(randAxis == 3 && !yMax){
            yMax++;
            exits.push([getRandCoord(), max]);
        }
    }

    return exits;
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

const removeHighlight = () => {
    for(let x in COORDINATES){
        for(let y in COORDINATES[x]){
            let {highlighted, occupied, walkable} = COORDINATES[x][y]
            ctx.clearRect(x,y,TILE_HEIGHT,TILE_HEIGHT)
            if(highlighted){
                COORDINATES[x][y].highlighted = 0;
            }

            if(!walkable){
                ctx.fillStyle = 'transparent'
                ctx.fillRect(x,y,TILE_HEIGHT,TILE_HEIGHT)
            } else if(x == playerCoord[0] && y == playerCoord[1]){
                ctx.fillStyle = 'white'
                ctx.fillRect(x,y,TILE_HEIGHT,TILE_HEIGHT)
            } else if(walkable){
                if(occupied){
                    ctx.fillStyle = '#94040466'
                }
                else if(exits.some(([eX,eY]) => eX == x && eY == y)){
                    ctx.fillStyle = getExitGradient(x,y)
                } else {
                    ctx.fillStyle = '#2b2b2b'
                }
                ctx.fillRect(x,y,TILE_HEIGHT,TILE_HEIGHT)
            }
        }
    }
}

const enemyTurn = () => {
    window.onkeypress = null;
    player.resetActions();
    moveTimer = setTimeout(() =>
        asyncForEach(enemies, (enemy, i) => {
            let turns = enemy.speed;
            showEnemyDetails(enemy);
            return (
                new Promise((resolve) => {
                    const turn = setInterval(() => {
                        enemy.handleTurn();
                        turns--;
                        if (turns < 1) {
                            clearInterval(turn);
                            if (i == enemies.length - 1) {
                                window.onkeypress =handleKeyPress;
                                setTimeout(() =>{
									playersTurn = true
                                    game.classList.remove('e-turn')
                                    game.classList.add('p-turn')                                    
                                    player.hiliteMoveArea();
                                    player.hiliteFOV()
                                }, 300)
                            }
                            
                            resolve();
                        }
                    }, 300);
                })
            )
        }
    ), 500);
}

const checkIfWaiting = () => new Promise(resolve => setTimeout(() => player.awaitingUser ? resolve(true) : resolve(false), 500))

const getExitGradient = (x,y) => {
    let exit;
    if(x == 0){
        exit = ctx.createLinearGradient(-20,0,20,0);
    } else if(x == xyMax){
        exit = ctx.createLinearGradient(240,0,260,0);
    } else if(y == 0){
        exit = ctx.createLinearGradient(0,-20,0,20);
    } else if(y == xyMax){
        exit = ctx.createLinearGradient(0,240,0,260);
    }
    
    if(x == 0 || y == 0){
        exit.addColorStop(0.2, 'black');
        exit.addColorStop(1, 'yellow');
    } else {
        exit.addColorStop(1, 'black');
        exit.addColorStop(0, 'yellow');
    }

    return exit;
}