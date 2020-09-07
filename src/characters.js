const weapons = [
	["Brass knuckles", "Fists"],
	[""],
	["Pistol", "Rifle", "Sniper"],
];
const enemyType = ["Skeleton 💀", "Vampire 🧛", "Wizard 🧙", "Demon 👹"];

// melee
// range
//magic
// const weapons = ['melee','range','magic']

// playable character constructor
const Character = function (name, clas) {
	const C = this;
	// 0 = melee, 1 = magic, 2 = ranged
	C.class = clas;
	C.name = name;
	C.xp = 0;
	C.nextLvl = 1;
	C.lvl = 1;
	C.hp = !clas ? 100 : clas == 1 ? 50 : 75;

	C.attackStrength = !clas || clas == 1 ? rng() + 3 : rng(3) + 1;
	C.def = !clas ? rng() + 2 : clas == 1 ? rng(2) + 1 : rng(3) + 1;

	C.agility = !clas ? rng() + 2 : clas == 1 ? rng(2) + 1 : rng(5) + 3;

	C.actionsPerTurn = !clas ? rng() + 4 : clas == 1 ? rng(2) + 3 : rng() + 4;
	C.actionsLeft = C.actionsPerTurn;
    C.attackSpeed = ~~(C.attackStrength / 2) || 1;

    C.fov = !clas ? rng(2) + 2 : rng() + 4, 2
    C.fov = Math.ceil(Math.sqrt(C.fov * C.fov + C.fov * C.fov));

	C.accuracy = !C.class
    ? 65 + rng(26)
    : C.class == 1
    ? 60 + rng(41)
    : 75 + rng(6);
	C.items = [];
	C.awaitingUser = false;
	C.checkIfNextLvl = function () {
		C.nextLvl - C.xp <= 0 && C.lvlUp();
	};
	C.lvlUp = function () {
		C.nextLvl += C.nextLvl + Math.pow(C.lvl, 3);
		C.lvl++;
		C.awaitingUser = true;
		_playerLvl.textContent = C.lvl;
		_expToNextLvl.textContent = player.nextLvl;
		_lvlUp.classList.remove("invisible");
		levelUpSound.play()
		window.onkeypress = null;
	};
	C.weapons = weapons[C.class];
	C.addStat = function (stat) {
		/////////////// TO DO //////////////
		// Needs functionality to
		// bring up modal and prompt user
		// to choose which stat to upgrade
		/////////////// TO DO //////////////
		if (!stat) {
			console.log("you leveled up attack strength");
			C.attackStrength = Math.ceil(C.attackStrength * 1.2);
			_playerAttackStrength.innerHTML = C.attackStrength;
		} else if (stat == 1) {
			console.log("you leveled up agility");
			C.agility = Math.ceil(C.agility * 1.1);
			_playerAgility.innerHTML = C.agility;
		} else if (stat == 2) {
			console.log("you leveled up defense");
			C.def = Math.ceil(C.def * 1.15);
			_playerDefense.innerHTML = C.def;
		} else if (stat == 3) {
			console.log("you leveled up fov");
			C.actionsPerTurn = Math.ceil(C.actionsPerTurn * 1.1);
			_actionsTotal.innerHTML = C.actionsPerTurn;
            _actionsLeft.innerHTML = C.actionsPerTurn;
		}

		_lvlUp.classList.add("invisible");
		C.awaitingUser = false;
		window.onkeypress = handleKeyPress;
	};
    C.coords = playerCoord;
	C.highlighted = 0;
	
	C.hiliteFOV = function () {
		const [cX,cY] = getCenterOfCoords(C);
		ctx.fillStyle = colors.fovHighlight
        ctx.beginPath();
        ctx.arc(cX,cY,C.fov * TILE_HEIGHT, 0, Math.PI * 2);
        // ctx.clip()
		// ctx.closePath();
        ctx.fill();
	}

	C.hiliteMoveArea = function () {
        const checkerCoord = [C.coords];
        for (let i = 0; i < C.actionsLeft; i++) {
            checkerCoord.forEach(([cX,cY]) => {
                const potentialHighlights = [
                    [cX, cY - TILE_HEIGHT],
                    [cX + TILE_HEIGHT, cY],
                    [cX, cY + TILE_HEIGHT],
                    [cX - TILE_HEIGHT, cY],
                ];
                
                potentialHighlights.filter(([x, y]) => 
                    COORDINATES[x]?.[y]?.walkable &&
                    !COORDINATES[x]?.[y]?.occupied &&
                    !COORDINATES[x]?.[y]?.highlighted &&
                    !COORDINATES[x]?.[y]?.exit &&
                    (COORDINATES[x]?.[y]?.hasBeenSeen || inRange([x,y],C.coords, C.fov))
                ).forEach(([x,y]) =>{
                    if(x == C.coords[0] && y == C.coords[1]) return;
					COORDINATES[x][y].highlighted = 1;
                    checkerCoord.push([x, y])
                });
            })
        }
        
        checkerCoord.forEach(([x,y], notStart) => {
            if(notStart){
                ctx.clearRect(x,y,TILE_HEIGHT,TILE_HEIGHT)
                ctx.fillStyle = colors.walkHighlight;
                ctx.fillRect(x, y, TILE_HEIGHT, TILE_HEIGHT);
            }
        })
    };
	C.attackEnemy = async function (enemy, i) {
        if(C.attackSpeed > C.actionsLeft) return "You don't have enough energy left to attack!  Try another action";

		const willHit = (C.accuracy - enemy.agility) >= rng(100) && C.attackStrength > enemy.def;
        C.actionsLeft -= C.attackSpeed;
        _actionsLeft.innerHTML = C.actionsLeft;
        willHit && (enemy.hp -= C.attackStrength + enemy.def);
        showEnemyDetails(enemy, i);
        
        if(enemy.hp < 1){
            const [x,y] = enemy.coords;
            COORDINATES[x][y].occupied = 0;
            enemies.splice(i,1);
            C.xp += enemy.xp;
            _enemyDetails.innerHTML = '';
            if(!enemies.length) C.actionsLeft = C.actionsPerTurn;
            C.checkIfNextLvl();
        }
        
        if(willHit){
            paintCanvas();
            C.hiliteMoveArea();
        }

        if(C.actionsLeft == 0){
            while(C.awaitingUser){
                const waiting = await checkIfWaiting();
                if(waiting) continue;
            }
            enemyTurn(exits)
        }

		return willHit && enemy.hp < 1 ?
            `You defeated the ${enemy.name}!` :
            willHit ? `You hit the ${enemy.name} for ${C.attackStrength - enemy.def}!` :
			`You missed the ${enemy.name}!`;
	};

	C.inRange = [];
	C.checkFOV = function () {
        C.inRange = []
		enemies.forEach((enemy) => {
			if (inRange(C.coords, enemy.coords, C.fov)) {
                C.inRange.push(enemy);
			}
        });
	};

	C.block;
	C.resetActions = function () {
		C.actionsLeft = C.actionsPerTurn;
		_actionsLeft.innerHTML = C.actionsLeft;
	};
	C.defStance = async function () {
        C.block = C.actionsLeft;
        while(C.awaitingUser){
            const waiting = await checkIfWaiting();
            if(waiting) continue;
        }
        enemyTurn();
	};
};

// enemy constructor
// difficulty === portion of totalEnemyPower
const Enemy = function (coords, enemyPower) {
	const E = this;
	const newClass = rng(100);
	E.coords = coords;
	// 0 = melee, 1 = magic, 2 = ranged
	E.class = newClass < 60 ? 0 : newClass < 85 ? 2 : 1;
	E.name = enemyType[rng(3)];
    E.hp = Math.floor(Math.sqrt(enemyPower)) + ~~(enemyPower / 10);
    E.agility = !E.class ? rng() + 2 : E.class == 1 ? rng(2) + 1 : rng(5) + 3;

	E.attack =
		!E.class || E.class == 1
			? Math.ceil(enemyPower / (rng(11) + 10))
			: ~~(enemyPower / (rng(11) + 20));
	E.accuracy = !E.class
		? 65 + rng(26)
		: E.class == 1
		? 60 + rng(41)
		: 75 + rng(6);
	E.def = !E.class ? ~~(enemyPower / (rng(21) + 40)) : 0;
	E.fov = !E.class ? rng(2) + 2 : rng() + 4;
	E.speed = E.class == 0 ? 6 : E.class == 1 ? 3 : 4;
	E.playerSpotted = 0;
	E.xp = enemyPower / 5;
	E.atkChar = function () {
		const willHit =
			E.accuracy - player.agility > rng(100) && player.def < E.attack;
		willHit ? (player.hp = player.hp - E.attack + ~~player.def) : 0;
		return player.def >= E.attack
			? `You blocked ${E.name}'s attack!`
			: willHit
			? `${E.name} hit for ${E.attack}!`
			: `${E.name} missed!`;
	};

	E.handleTurn = function () {
		const [x, y] = E.coords;

		const isExit = ([a, b]) => {
			for (let i = 0; i < exits.length; i++) {
				if (exits[i][0] == a && exits[i][1] == b) return true;
			}
		};

		const surroundings = [
			{
				pos: "top",
				coord: [x, y - TILE_WIDTH],
				available: COORDINATES[x]?.[y - TILE_WIDTH]?.walkable,
				occupied: COORDINATES[x]?.[y - TILE_WIDTH]?.occupied,
				checkIfExit: isExit("top", [x, y - TILE_WIDTH]),
			},
			{
				pos: "right",
				coord: [x + TILE_WIDTH, y],
				available: COORDINATES[x + TILE_WIDTH]?.[y]?.walkable,
				occupied: COORDINATES[x + TILE_WIDTH]?.[y]?.occupied,
				checkIfExit: isExit("right", [x + TILE_WIDTH, y]),
			},
			{
				pos: "bottom",
				coord: [x, y + TILE_WIDTH],
				available: COORDINATES[x]?.[y + TILE_WIDTH]?.walkable,
				occupied: COORDINATES[x]?.[y + TILE_WIDTH]?.occupied,
				checkIfExit: isExit("bottom", [x, y + TILE_WIDTH]),
			},
			{
				pos: "left",
				coord: [x - TILE_WIDTH, y],
				available: COORDINATES[x - TILE_WIDTH]?.[y]?.walkable,
				occupied: COORDINATES[x]?.[y - TILE_WIDTH]?.occupied,
				checkIfExit: isExit("left", [x - TILE_WIDTH, y]),
			},
		];

		let availableSurroundings = surroundings.filter(
			(c) => c.available && !c.checkIfExit && !c.occupied
		);

		player.checkFOV();

		if (!E.checkFOV(E.playerSpotted ? 2 : 1)) {
			if (E.checkFOV()) return E.atkChar();

			if (E.playerSpotted) {
				console.log(availableSurroundings);
				const [subX, subY] = [playerCoord[0] - x, playerCoord[1] - y];
				console.log(`DIFF COORD: ${[subX, subY]}`);

				availableSurroundings = availableSurroundings.filter((c) => {
					if (c.pos == "left") return subX < 0;
					if (c.pos == "right") return subX > 0;
					if (c.pos == "top") return subY < 0;
					if (c.pos == "bottom") return subY > 0;
				});

				console.log(availableSurroundings);
			}
			const newCoords = rng(availableSurroundings.length);
			COORDINATES[x][y].occupied = 0;

			E.coords =
				availableSurroundings.length > 0
					? availableSurroundings[newCoords].coord
					: E.coords;
			const {coords: [newX, newY]} = E;
			eMove.play()
            COORDINATES[newX][newY].occupied = 1;
            return paintCanvas();
		}
	};
	E.checkFOV = function (spotRange = 1) {
		if (inRange(E.coords,player.coords,E.fov)) {
			if (spotRange == 2) E.playerSpotted = 1;
			_enemySeesPlayer.innerHTML = "Gotcha!";
			return 1;
		} else {
			E.playerSpotted = 0;
			_enemySeesPlayer.innerHTML = "Where'd you go??";
			return 0;
		}
	};
};

//========================= PLAYER ======================
// EXPERIENCE DETAILS
// experience to next level = prevousLevelExperience + level^3 (to 1: 100, to 2: 203, to 3: 311, to 4: 438, to 5: 602,etc.)
// EXPERIENCE GAIN:
// completing 10 levelS = level up with minimum needed to get to next "player level" to compensate for *RARE* occassion when player does NOT encounter anymies those 10 levels
// destroying an enemy = enemyPower / 5

// HP
// MELEE: LVL1: 100, LVL2: 110, LVL3: 121, LVL4: 133
// RANGED: LVL1: 50, LVL2: 55, LVL3: 61, LVL4: 68
// MAGIC: LVL1: 75, LVL2: 83, LVL3: 92, LVL4: 102

// ATTACK STRENGTH
// MELEE/MAGIC: 3-6 AP (initial)
// RANGED: 1-3

// DEFENSE
// melee: [2,5]
// ranged: [1,3]
// magic: [1,2]

// SPEED
// attacking speed: |SPEED - ATTACK STRENGTH|

// AGILITY
// (agility roll - DND) MODIFIER TO ENEMY'S "ACCURACY"
// decides whether player can esxape enemy attack
// dodge
// melee ((MID AGILITY)) AGILITY = [2,5]
// range ((HIGH AGILITY)) AGILITY = [3,7]
// magic ((LOW AGILITY)) AGILITY = [1,2]

// CHANCE TO HIT WOULD BE "ENEMY_ACC - AGILITY"

// FOV
// MELEE: [2,3]
// RANGE: [4,7]
// MAGIC: [4,7]

//========================= ENEMY ======================

// HP
// LEVEL1-5:
// 1 ENEMY: 10 + 10 = 20
// 2 ENEMIES: 7 + 5 = 12 * 2 = 24
// LEVEL6-10:
// 1 ENEMY: 12 + 15 = 27
// 2 ENEMIES: 8 + 7 = 15 * 2 = 30
// 3 ENEMIES: 7 + 5 = 12 * 3 = 36

// ATTACK STRENGTH
// LEVEL1-5
// MELEE/MAGIC:
// 1 enemy: [5,10]
// 2 enemy: [3,5]
// RANGED:
// 1 enemy: [4,5]
// 2 enemies: [2,3]
// LEVEL6-10
// MELEE/MAGIC:
// 1 enemy: [8,15]
// 2 enemy: [4,8]
// 3 enemy: [3,5]
// RANGED:
// 1 enemy: [5,8]
// 2 enemies: [3,4]
// 3 enemies: [2,3]

// DEFENSE
// LEVEL1-5
// MELEE:
// 1 enemy: [1,2]
// 2 enemy: [0,1]
// MAGE/RANGED:
// 1 enemy: 0
// 2 enemies: 0
// LEVEL6-10
// MELEE:
// 1 enemy: [2,3]
// 2 enemy: [1,1]
// 3 enemy: [0,1]
// MAGE/RANGED:
// 1 enemy: 0
// 2 enemies: 0
// 3 enemies: 0
// FOV
// MELEE: [2,3]
// RANGE: [4,7]
// MAGIC: [4,7]

// ACCURACY
// MELEE: [65%-90%]
// RANGED: [75-80%]
// MAGE: [60-100%]

// SPEED
// MELEE: 6
// MAGE: 3
// RANGE: 4

// EXPERIENCE ON DESTRUCTION

// ==================
// IMPLEMENTATION
// ==================

// 0. add UI for player creation & additional options for user during game (attack, use item, etc.)

// DESKTOP ONLY (min-width: 1280px)

//* landing page (optional)
//! player create page

/* 4 components for game
		* 1. canvas
		* 2. player stats
		? 3. player actions
		* 4. enemy stats
	*/
///////////////////////////////////

//! add modal for stat update

////////////// CHECK. DONE ////////////////
// 1. get the player funct done with auto level up every 10 levels (before taking into account enemy interactions)
// implement formulas for calculating data
// add experience = to room # on room completion
// level up every 10 levels with experience total
// UPGRADE 1 STAT
////////////// CHECK. DONE ////////////////

// 2. assign enemy characteristics for each generated enemy (still no player/enemy interaction)
//* 1. split power between amount of random number of enemies
//* 2. Each generated enemy gets pushed into global Array
//* 3. Loop over enemy array to set init coords(find index of enemy)
//* 4. Save current coords in enemy constructor for access later(onclick for stats)
//* 5. Loop over enemy array to do movements/attacks for each enemy after player turn(find index of enemy)

// 3. get enemies to follow player once player enters Field of Vision (fov)
// set ENTERED_VISION (per enemy) to TRUE - then the enemy will move toward player
//* 1. Get difference on both axis and divide each by tile size then add together for distance
//* 2. If in FOV, prefer attack over moving
// 3. If player has been spotted by certain enemies always move toward player instead of random movement

// 3a. If player has been spotted by certain enemies always move toward player instead of random movement
// 1. check player coords and subtract from enemy coords on each axis. difference will show what direction to move
// 2. if more than one way to go choose randomly
// 3. if stuck pick a direction that enemy can move in until we can start moving back to player

// 4. add turn "speed" funct (how many moves/attacks player can make before an enemy makes a move/attacks)
//* 1. every move or attack we need to subtract speed
//* 2. will need current speed property on user and enemy

// 5. add funct for player to attack enemy
// 6. add funct for enemy to attack player
// 1. when attack is chosen, subtract player attack from enemy hp and add enemy defense
// 2. potential animation on enemy and/or enemy stat block

// 7. add allowable move area to hightlight canvas on player turn
    // 1. store current coords on player
    // 2. loop however many times total speed is and for each direction subtract/add tiles
    // 3. use these coords for highlighting area around player to show where they can move
    // 4. make user confirm before before setting coords of new position
    // 5. if user can make the move with the amount of speed left store new current on player
    // 6. if user can't make the move give a notification and leave player in current position


    /*
        get all possible moves in each direction from start position coords and push into array
        
    */