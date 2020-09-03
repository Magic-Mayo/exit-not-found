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
  C.nextLvl = 100;
	C.lvl = 1;
	C.hp = !clas ? 100 : clas == 1 ? 50 : 75;

	C.attackStrength = !clas || clas == 1 ? rng() + 3 : rng(3) + 1;

	C.def = !clas ? rng() + 2 : clas == 1 ? rng(2) + 1 : rng(3) + 1;
	
	C.agility = !clas ? rng() + 2 : clas == 1 ? rng(2) + 1 : rng(5) + 3;
	
	C.actionsPerTurn = !clas ? rng() + 4 : clas == 1 ? rng(2) + 3 : rng() + 4;
	C.actionsLeft = C.actionsPerTurn
	C.attackSpeed = Math.abs(C.attackStrength - C.actionsPerTurn)

	C.fov = !clas ? rng(2) + 2 : rng() + 4;

	// C.accuracy = TBD
	C.items = [];
	C.checkIfNextLvl = function () {
		C.nextLvl - C.xp <= 0 ? C.lvlUp() : null;
  };
  C.lvlUp = function(){
    C.nextLvl += C.nextLvl + Math.pow(C.lvl,3);
    C.lvl++;
    _playerLvl.textContent = C.lvl;
    _expToNextLvl.textContent = player.nextLvl;
    C.addStat();
  }
	C.weapons = weapons[C.class];
	C.addStat = function (stat) {
    /////////////// TO DO //////////////
    // Needs functionality to 
    // bring up modal and prompt user
    // to choose which stat to upgrade
    /////////////// TO DO //////////////
		switch (stat) {
			case 0:
				(C.attack = Math.ceil(C.attack * 1.2));
        return _attack.textContent = C.attack;
			case 1:
        (C.agility = Math.ceil(C.agility * 1.1));
        return _agility.textContent = C.agility;
			case 2:
        (C.def = Math.ceil(C.def * 1.15));
        return _defense.textContent = C.def;
			case 3:
        (C.actionsPerTurn = Math.ceil(C.actionsPerTurn * 1.1));
        return _speed.textContent = C.actionsPerTurn;
		}
	};
	C.move = function (squares) {
		const actionsPerTurn = C.actionsPerTurn;
		// take amount of squares moved and see if character's speed is enough to cover
		// if it is, subtract that amount from speed
	};
	C.attackEnemy = function (enemy) {
		const willHit = enemy.agility < rng(100) && C.attack > enemy.def;
		willHit ? (enemy.hp = enemy.hp - C.attack + enemy.def) : 0;
		return willHit
			? `You hit for ${C.attack - enemy.def}!`
			: `${C.name} missed!`;
	};

	C.inRange = [];
	C.checkFOV = function(){
		C.inRange = [];
		enemies.forEach(enemy => {
			const xDif = Math.abs(enemy.coords[0] - playerCoord[0])/TILE_HEIGHT;
			const yDif = Math.abs(enemy.coords[1] - playerCoord[1])/TILE_HEIGHT;
			const difTrig = (Math.sqrt(xDif*xDif + yDif*yDif));
			
			if(difTrig <= C.fov){
				return C.inRange.push(enemy);
			}
		})
		console.log('enemies in range', C.inRange)
	}

	C.block;
	C.resetActions = function(){
		C.actionsLeft = C.actionsPerTurn;
		_actionsLeft.innerHTML = C.actionsLeft
	}
	C.turn = function(action, enemy = 0, coords){
		C.block = 0;
		if(!action){
			C.block += C.turnSpeed;
		} else if(action == 1){
			C.attackEnemy(enemy)
		} else if(action == 2){
			C.move(coords)
		}
	}
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
	E.hp =	Math.floor(Math.sqrt(enemyPower)) + ~~(enemyPower / 10);
	
	E.attack = !E.class || E.class == 1 ? Math.ceil(enemyPower / (rng(11) + 10)) : ~~(enemyPower / (rng(11) + 20));
	E.accuracy = !E.class ? 65 + rng(26) : E.class == 1 ? 60 + rng(41) : 75 + rng(6);
	E.def = !E.class ? ~~(enemyPower / (rng(21) + 40)) : 0;
	E.fov = !E.class ? rng(2) + 2 : rng() + 4;
	E.speed = E.class == 0 ? 6 : E.class == 1 ? 3 : 4;
	
	E.xp = enemyPower / 5;
	E.atkChar = function () {
		const willHit = E.accuracy - player.agility > rng(100) && player.def < E.attack;
		willHit ? player.hp = player.hp - E.attack + ~~player.def : 0;
		return player.def >= E.attack
		? `You blocked ${E.name}'s attack!`
		: willHit
		? `${E.name} hit for ${E.attack}!`
		: `${E.name} missed!`;
	};

	E.handleEnemyMovement = function (exits) {
			const [x,y] = E.coords;
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
		
			const availableSurroundings = surroundings.filter(
				(c) => c.available && !c.checkIfExit && !c.occupied
			);
			player.checkFOV();
			if(!E.checkFOV()){
				const newCoords = rng(availableSurroundings.length);
				COORDINATES[x][y].occupied = 0;
		
				ctx.clearRect(x, y, TILE_WIDTH, TILE_HEIGHT);
				E.coords =
					availableSurroundings.length > 0
						? availableSurroundings[newCoords].coord
						: E.coords;
				const {
					coords: [newX, newY],
				} = E;
		
				ctx.fillStyle = COORDINATES[newX]?.[newY] ? "#94040466" : "transparent";
				ctx.fillRect(newX, newY, TILE_WIDTH, TILE_HEIGHT);
				return COORDINATES[newX][newY].occupied = 1;
			}
		
			E.atkChar();
		};
	E.checkFOV = function(){
		const xDif = Math.abs(E.coords[0] - playerCoord[0])/TILE_HEIGHT;
		const yDif = Math.abs(E.coords[1] - playerCoord[1])/TILE_HEIGHT;
		const difTrig = ~~(Math.sqrt(xDif*xDif + yDif*yDif));

		if(difTrig <= this.fov){
			return 1;
		}
	}
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
		// 3. 

// 4. add turn "speed" funct (how many moves/attacks player can make before an enemy makes a move/attacks)
		// 1. every move or attack we need to subtract speed
		// 2. will need current speed property on user and enemy
		// 3. enemy will 


// 5. add funct for player to attack enemy

// 6. add funct for enemy to attack player
