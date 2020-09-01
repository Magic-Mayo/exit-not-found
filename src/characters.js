const weapons = [
	["Brass knuckles", "Fists"],
	[""],
	["Pistol", "Rifle", "Sniper"],
];
// const enemies = [["Skeleton", "Vampire"], [""], [""]];

// melee
// range
//magic
// const weapons = ['melee','range','magic']

// playable character constructor
const Character = function (name, clas) {
	// 0 = melee, 1 = magic, 2 = ranged
	this.class = clas;
	this.name = name;
  this.xp = 0;
  this.nextLvl = 100;
	this.lvl = 1;
	this.hp = !clas ? 100 : clas == 1 ? 50 : 75;

	this.attackStrength = !clas || clas == 1 ? rng() + 3 : rng(3) + 1;

	this.def = !clas ? rng() + 2 : clas == 1 ? rng(2) + 1 : rng(3) + 1;
	
	this.agility = !clas ? rng() + 2 : clas == 1 ? rng(2) + 1 : rng(5) + 3;
	
	this.speed = !clas ? rng() + 4 : clas == 1 ? rng(2) + 3 : rng() + 4;

	this.attackSpeed = Math.abs(this.attackStrength - this.speed)

	this.fov = !clas ? rng(2) + 2 : rng() + 4;

	// this.accuracy = TBD
	this.items = [];
	this.checkIfNextLvl = function () {
		this.nextLvl - this.xp <= 0 ? this.lvlUp() : null;
  };
  this.lvlUp = function(){
    this.nextLvl += this.nextLvl + Math.pow(this.lvl,3);
    this.lvl++;
    _playerLvl.textContent = this.lvl;
    _expToNextLvl.textContent = player.nextLvl;
    this.addStat();
  }
  this.autoLvl = function(){
    this.xp = this.nextLvl;
    this.lvlUp();
  }
	this.weapons = weapons[this.class];
	this.addStat = function (stat) {
    /////////////// TO DO //////////////
    // Needs functionality to 
    // bring up modal and prompt user
    // to choose which stat to upgrade
    /////////////// TO DO //////////////
		switch (stat) {
			case 0:
				(this.attack = Math.ceil(this.attack * 1.2));
        return _attack.textContent = this.attack;
			case 1:
        (this.agility = Math.ceil(this.agility * 1.1));
        return _agility.textContent = this.agility;
			case 2:
        (this.def = Math.ceil(this.def * 1.15));
        return _defense.textContent = this.def;
			case 3:
        (this.speed = Math.ceil(this.speed * 1.1));
        return _speed.textContent = this.speed;
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
// difficulty === portion of totalEnemyPower
const Enemy = function (coords, enemyPower) {
	const newClass = rng(100);
	this.coords = coords;
	// 0 = melee, 1 = magic, 2 = ranged
	this.class = newClass < 60 ? 0 : newClass < 85 ? 2 : 1;
	// this.name = enemies[this.class][rng(3)];
	this.hp =	Math.floor(Math.sqrt(enemyPower)) + ~~(enemyPower / 10);

	this.attack = !this.class || this.class == 1 ? Math.ceil(enemyPower / (rng(11) + 10)) : ~~(enemyPower / (rng(11) + 20));
	this.accuracy = !this.class ? 65 + rng(26) : this.class == 1 ? 60 + rng(41) : 75 + rng(6);
	this.def = !this.class ? ~~(enemyPower / (rng(21) + 40)) : 0;
	this.fov = !this.class ? rng(2) + 2 : rng() + 4;
	this.speed = this.class == 0 ? 6 : this.class == 1 ? 3 : 4;

	this.xp = enemyPower / 5;
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

	//! reset/quit button?
	//! add modal for stat update

  ////////////// CHECK. DONE ////////////////
  // 1. get the player funct done with auto level up every 10 levels (before taking into account enemy interactions)
	// implement formulas for calculating data
	// add experience = to room # on room completion
	// level up every 10 levels with experience total
	// UPGRADE 1 STAT
  ////////////// CHECK. DONE ////////////////


// 2. assign enemy characteristics for each generated enemy (still no player/enemy interaction)
      // 1. split power between amount of random number of enemies
			// 2. Each generated enemy gets pushed into global Array
			// 3. Loop over enemy array to set init coords(find index of enemy)
      // 4. Save current coords in enemy constructor for access later(onclick for stats)
			// 5. Loop over enemy array to do movements/attacks for each enemy after player turn(find index of enemy)


// 3. get enemies to follow player once player enters Field of Vision (fov)
	// set ENTERED_VISION (per enemy) to TRUE - then the enemy will move toward player

// 4. add turn "speed" funct (how many moves/attacks player can make before an enemy makes a move/attacks)



// 5. add funct for player to attack enemy

// 6. add funct for enemy to attack player
