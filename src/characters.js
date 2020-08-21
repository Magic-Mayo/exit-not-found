const players = document.getElementById("gameFG");
const ctx2 = players.getContext("2d");


const rooms = [];
const lvl = 1;
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
};

// enemy constructor
const Enemy = function (difficulty) {
  const newClass = rng(100);
  // 0 = melee, 2 = ranged, 1 = magic
  this.class = newClass < 60 ? 0 : newClass < 85 ? 2 : 1;
  this.name = enemies[this.class][rng(3)];
  this.hp = Math.floor(Math.sqrt(difficulty * rng(100))) + difficulty * rng(10);
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

let playerCoord = []

const generatePlayer = (
  coord,
  color,
  room,
  tileSize
) => {
  playerCoord = coord;
  console.log(room)
  console.log(`The player will start at ${playerCoord} and will have the color ${color}`);
  ctx2.fillStyle = room[coord[0]][coord[1]] && color;
  ctx2.fillRect(coord[0], coord[1], tileSize, tileSize);

  window.addEventListener('keypress', e => handlePlayerMovement(e,room, tileSize, color))
}

const handlePlayerMovement = (event,room, tileSize, color) => {
  let { key } = event;
  let [playerX, playerY] = playerCoord
  console.log(playerX, playerY)
  key = key.toLowerCase()
  console.log(key)
  const dir = {
    up: {
      code: "w",
      coord: [playerX, playerY - tileSize]
    },
    right: {
      code: "d",
      coord: [playerX + tileSize, playerY]
    },
    down: {
      code: "s",
      coord: [playerX, playerY + tileSize]
    },
    left: {
      code: "a",
      coord: [playerX - tileSize, playerY]
    }
  }

  const dest = key == dir.up.code ? dir.up.coord : key == dir.right.code ? dir.right.coord : key == dir.down.code ? dir.down.coord : key == dir.left.code ? dir.left.coord : null;

  console.log(playerX,playerY);
  console.log(dest)
  
  ctx2.fillStyle = room[playerX][playerY] && "transparent";
  ctx2.fillRect(playerX, playerY, tileSize, tileSize);  

  ctx2.fillStyle = room[dest[0]][dest[1]] && color;
  ctx2.fillRect(dest[0], dest[1], tileSize, tileSize); 
  
  playerCoord = dest

}