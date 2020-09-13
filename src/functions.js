const asyncForEach = async (array, callback) => {
	for (let index = 0; index < array.length; index++) {
        if(player.hp < 1) return;
		await callback(array[index], index, array);
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

const startGame = (e,restart) => {
    window.removeEventListener('keydown', typeName)
    window.removeEventListener('keypress', handleKeyPress);
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

    if (!restart) {
        player = new Character(
            _createNameInput.textContent,
            parseInt(_createClassInput.value)
        );
    }

    game.classList.remove("p-turn");
    game.classList.remove('e-turn')
    game.classList.add("n-turn");
    if(!helpDisabled){
        player.awaitingUser = true;
        asyncForEach(narrator.start, (msg, i, arr) => 
            new Promise(resolve => {
                if(i != 0){
                    return setTimeout(() => {
                        i == 1 || i == 3 ?
                        createChatMessage('narrator','narrator', i == 3 ? msg : msg(player.name)) :
                        createChatMessage('player',player.name, msg);
                        if(i == arr.length - 1) {
                            player.awaitingUser = false;
                            game.classList.remove("n-turn");
                            game.classList.add("p-turn");
                        }
                        resolve();
                    }, rng(750) + 1500)
                }

                createChatMessage('narrator', 'narrator', msg(player.name))
                resolve();
            })
        )
    }
    
    buildDungeon([0, 160]);
}

const inRange = ([aX,aY], [bX,bY], fov) => {
    const xDif = Math.abs(aX - bX) / TILE_HEIGHT;
    const yDif = Math.abs(aY - bY) / TILE_HEIGHT;
    return ~~Math.sqrt(xDif * xDif + yDif * yDif) <= fov;
}

const getCenterOfCoords = character => ([character.coords[0] + (TILE_WIDTH /2), character.coords[1] + (TILE_WIDTH /2)]);

const generatePlayer = async (coord, room, tileSize) => {
	handleKeyPress = (e) => handlePlayerMovement(e, room, tileSize);

	playerCoord = coord;
	player.coords = coord;
    
	while(player.awaitingUser) {
        const waiting = await checkIfWaiting();
        if(waiting) continue;
    }

    window.addEventListener('keypress', handleKeyPress);
};

const generateEnemies = (lvl, max, room) => {
    enemies = [];
    
	enemyCount = rng(lvl / 2 + 2);
	for (let i = 0; i < enemyCount; i++){
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
	// player.hiliteFOV();
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
        // window.removeEventListener('keypress', handleKeyPress)
        if(await tryAOO()){
            return enemyTurn();
        }
        // window.addEventListener('keypress', handleKeyPress)
        game.classList.remove("e-turn");
        game.classList.add("p-turn");
        clearTimeout(moveTimer);
        window.removeEventListener('keypress', handleKeyPress);
        player.xp += lvl;
        lvl++;
        enemyPowerMult();
        if (lvl % 10 == 0) player.xp += 100;
        player.checkIfNextLvl();
        zzfxP(passDungeonSound[rng(passDungeonSound.length -1)]); // playerMove
        console.log("you win!");
        
        player.resetActions();
        
        createChatMessage('narrator','narrator', `${player.name} has reached level ${lvl} in ${steps} steps!`)
        
        return buildDungeon(exit);
    }
    
    if (room[nextX]?.[nextY]?.walkable && !room[nextX]?.[nextY]?.occupied) {
        player.awaitingUser = 1;
        if(await tryAOO()) return enemyTurn();

        while(player.awaitingUser){
            const waiting = await checkIfWaiting();
            if(waiting) continue;
        }

        if (enemies.length) player.actionsLeft--;
		room[playerX][playerY].occupied = 0;
		room[nextX][nextY].occupied = 1;    
        ++steps;
        
        if(steps % 30 == 0) createChatMessage('narrator', 'narrator', narrator.taunting[rng(narrator.taunting.length)])
		playerCoord = [nextX, nextY];
        player.coords = playerCoord;
        
		paintCanvas();
		player.hiliteMoveArea();
        player.checkFOV();

        if(steps == Math.ceil(player.fov) && !helpDisabled){
            window.removeEventListener('keypress', handleKeyPress);
            game.classList.remove("p-turn");
            game.classList.add("n-turn");
            player.awaitingUser = true;
            asyncForEach(narrator.fog, (msg, i, arr) => {
                return new Promise(resolve => {
                    if(i == 0){
                        createChatMessage('narrator', 'narrator', msg)
                        return resolve()
                    }
                    setTimeout(() => {
                        if(i != arr.length - 1){
                            createChatMessage('narrator', 'narrator', msg)
                            resolve();
                        } else {
                            createChatMessage('player', player.name, msg);
                            game.classList.remove("n-turn");
                            game.classList.add("p-turn");
                            player.awaitingUser = false;
                            resolve();
                        }
                    }, rng(750) + 2000)
                })
            })
            
            while(player.awaitingUser){
                const waiting = await checkIfWaiting();
                if(waiting) continue;
                else window.addEventListener('keypress', handleKeyPress);
            }
        }

        if(!firstEnemySpotted && player.inRange.length && !helpDisabled){
            window.removeEventListener('keypress', handleKeyPress);
            game.classList.remove("p-turn");
            game.classList.add("n-turn");
            player.awaitingUser = true;
            asyncForEach(narrator.enemy, (msg,i,arr) => 
                new Promise(resolve => {
                    if(i == 0){
                        createChatMessage('narrator', 'narrator', msg);
                        return resolve()
                    }
                    setTimeout(() => {
                        if(i == arr.length - 1){
                            game.classList.remove("n-turn");
                            game.classList.add("p-turn");
                            player.awaitingUser = false;
                            firstEnemySpotted = 1
                            createChatMessage('player', player.name, msg)
                        } else createChatMessage('narrator', 'narrator', msg)
                        resolve();
                    }, rng(750) + 1500)
                })
            )

            while(player.awaitingUser){
                const waiting = await checkIfWaiting();
                if(waiting) continue;
                else window.addEventListener('keypress', handleKeyPress);
            }
        }
        
		// ADD CONDITIONAl TO ONLY RUN WHEN ACTIONSLEFT == 0
		if (!player.actionsLeft && enemies.length) {
			enemyTurn();
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
    // player.hiliteFOV()
};

const enemyTurn = () => {
    const msg = [
        'you ready?',
        "it's my turn now!",
        "I'm gonna get ya..."
    ]
    window.removeEventListener('keypress', handleKeyPress);
    game.classList.remove("p-turn");
    game.classList.remove('n-turn')
    game.classList.add("e-turn");
    
	moveTimer = setTimeout(() =>
        asyncForEach(enemies, (enemy, i) => {
            const [eX, eY] = enemy.coords;
            if(player.inRange.some(({coords: [x,y]}) => x == eX && y == eY)){
                createChatMessage('enemy', `#${i} - ${enemy.name}`, msg[rng(msg.length)])
            }
            enemy.block = 0;
            return new Promise(async resolve => {
                while(enemy.speedLeft > 0){
                    await new Promise(resolve => enemy.handleTurn(resolve, i));
                }

                if (i == enemies.length - 1) {
                    setTimeout(() => {
                        window.addEventListener('keypress', handleKeyPress);
                        game.classList.remove("e-turn");
                        game.classList.add("p-turn");
                        player.resetActions();
                        player.hiliteMoveArea();
                    }, 300);
                }

                setTimeout(() =>{
                    enemy.resetActions();
                    resolve();
                }, 2000);
            });
        })
    , 500);
};

const checkIfWaiting = () =>
	new Promise((resolve) =>
		setTimeout(
			() => player.awaitingUser ? resolve(true) : resolve(false),
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
    const lastTimer = setTimeout(()=>0,0)

    for(let i=0;i<lastTimer;i++){
        clearTimeout(i)
    }

    // POTENTIALLY FADE CANVAS OUT OR SIMILAR EFFECT
    const tiles = [];
    for(let x in COORDINATES){
        for(let y in COORDINATES[x]){
            if(!COORDINATES[x][y].border && COORDINATES[x][y].hasBeenSeen){
                tiles.push([x,y])
            }
        }
    }

    const fadeCanvas = setInterval(() => {
        const randTile = rng(tiles.length);
        const [x,y] = tiles[randTile];
        tiles.splice(randTile, 1);
        ctx.fillStyle = 'black';
        ctx.fillRect(x,y,TILE_HEIGHT,TILE_HEIGHT);
        
        if (tiles.length < CANVAS_HEIGHT * .2) {
            _playAgain.classList.remove('invisible')
        }

        if(!tiles.length){
            ctx.fillRect(0,0,CANVAS_HEIGHT,CANVAS_HEIGHT)
            clearInterval(fadeCanvas);
        }
    }, 500/TILE_HEIGHT)

    window.removeEventListener('keypress', handleKeyPress)
    asyncForEach(narrator.gameOver, (msg, i, arr) => 
        new Promise(resolve =>
            setTimeout(() => {
                if(i != arr.length - 1){
                    createChatMessage('narrator', 'narrator', msg(player.name));
                    return resolve();
                }

                setTimeout(() => {
                    // call function to bring up modal to restart
                    return resolve();
                }, 5000)
            }, rng(1000) + 2000)
        )
    )
}

const setAttributes =(el,attr) => {
    for (let key in attr) {
        el.setAttribute(key,attr[key])
    }
}

// param: sender (either "player", "enemy", "narrator")
const createChatMessage = (sender, name, message) => {

    if (sender === "player") zzfxP(messageSound.player[rng(messageSound.player.length -1)]);
    else if (sender === "enemy") zzfxP(messageSound.enemy[rng(messageSound.enemy.length -1)]);
    else if (sender === "narrator") zzfxP(messageSound.narrator[rng(messageSound.narrator.length -1)]);


    const _box = document.createElement('div');
    _box.classList.add(`box`, `box-${sender}`)

    const _p = document.createElement('p');
    _p.classList.add(`message-box`, `font-regular`)
    _p.innerHTML = generateChatBorder() + message

    const _p2 = document.createElement('p')
    _p2.classList.add('author')
    _p2.innerText = name

    _box.append(_p,_p2)

    _chatMessageGroup.append(_box)
    _chatBox.scrollTo(0, _chatBox.scrollHeight)
}


const generateChatBorder = () => `<svg width="100%" height="100%"><rect width='100%' height='100%' fill='none' stroke='black' stroke-width='7' stroke-dasharray=${rng(41) + 40},${rng(31) + 30},${rng(11) + 20} stroke-dashoffset='84' stroke-linecap='square' /></svg>`

const attackOfOpp = async (enemy, i, arr) => {
    const msg = [
        'going somewhere?  take this with you!',
        'think you can just run do ya??',
        `You can run, ${player.name}....but you can't hide`
    ];
    let hit;
    
    if(!inRange(enemy.coords, player.coords, enemy.fov)) return new Promise(resolve => resolve());

    else {
        if(inRange(enemy.coords,player.coords, enemy.fov)){
            return new Promise(resolve => setTimeout(() => {
                if(player.actionsLeft == 0) return resolve();
                createChatMessage('enemy', `${enemy.name}`, msg[rng(msg.length)]);
                firstAOO = 0;
                setTimeout(() => {
                    enemy.atkChar(()=>1,i,wasHit => (hit = wasHit))
                    if(hit){
                        player.actionsLeft = 0;
                        setTimeout(() => {
                            paintCanvas();
                            resolve(1);
                        }, 2000)
                    } else resolve();
                }, 1000);
            }, 500))
        }
    }
}

const tryAOO = async () => {
    if(enemies.some(E => inRange(E.coords,player.coords,E.fov) && E.playerSpotted && E.hasBeenSpotted)){
        window.removeEventListener('keypress', handleKeyPress)
        if(firstAOO && !helpDisabled){
            asyncForEach(narrator.aoo, (msg, i, arr) =>
                new Promise(resolve =>
                    setTimeout(() => {
                        if(i == 0) createChatMessage('narrator', 'narrator', msg(player.name));
                        else if(i == 1) createChatMessage('player', player.name, msg);
                        else {
                            createChatMessage('narrator', 'narrator', msg)
                            if(i == arr.length - 1){
                                setTimeout(() => {
                                    player.awaitingUser = 0;
                                    firstAOO = 0;
                                    window.addEventListener('keypress', handleKeyPress)
                                    resolve();
                                }, 2000)
                            }
                        }
                        if(i != arr.length - 1) resolve();
                    }, i == 0 ? 1 : rng(1000) + 1500)
                )
            )
            return;
        }

        let hit;
        for(let i=0; i<enemies.length;i++){
            if(await attackOfOpp(enemies[i],i,enemies)) hit = 1;
        }
        window.addEventListener('keypress', handleKeyPress)
        if(!hit) return;
        else return 1;
    } else player.awaitingUser = 0;
}