const rooms = [];
const lvl = 1;

const rng = (n = 4) => Math.floor(Math.random() * n);
// playable character constructor
const Character = function (name, clas) {
  this.class = clas;
  this.hp = clas === 0 ? 100 : clas === 1 ? 50 : 75;
  this.xp = 0;
  this.lvl = 1;
  this.lvlUp = function () {
    xp >= Math.sqrt(lvl) * 404;
  };
};
// enemy constructor
const Enemy = function (difficulty) {
  // 0 = melee, 2 = ranged, 1 = magic
  this.class = rng(3);
  this.hp = Math.floor(Math.sqrt(difficulty * rng(80))) + difficulty * rng(10);
  this.attack = difficulty + rng(10) + 1 - this.class * 2;
  this.def = difficulty * rng() + difficulty;
  this.fov = this.class * 2 + difficulty;
  this.speed = this.class === 0 ? 6 : this.class === 1 ? 3 : 4;
};

const Cell = function () {
  this.tile = rng(100) <= 90 ? 1 : 0;
  this.enemies = enemy ? new Enemy(difficulty) : null;
  this.treasure = rng(100) === 1 ? true : false;
};

// Room building function
const roomBuilder = function (
  difficulty = 1,
  directions = [rng(), rng()],
  cellNum
) {
  this.paths = directions || directions[1].map(() => rng());
  this.cells = cellNum;
};

// put level together
const buildLevel = (numCells = 10) => {};
// let i = 0;
// while(i<100){
//     console.log(new Enemy(i+1))
//     i++
// 