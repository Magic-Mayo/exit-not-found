
/* ==================================
HTML ELEMENTS
==================================== */
const game = document.getElementById("gameBG");
const ctx = game.getContext("2d");

const _btn = document.body.querySelector('.toggle-game')
const _container = document.body.querySelector('.container')
const _landing = document.body.querySelector('.headline')
const _healthpoints = document.body.querySelector('#healthpoints')
const _attack = document.body.querySelector('#attack')
const _defense = document.body.querySelector('#defense')
const _lvl = document.body.querySelector('#lvl')
const _expCurrent = document.body.querySelector('#exp-current')
const _expToNextLvl = document.body.querySelector('#exp-next')
const _dungeon = document.body.querySelector('#dungeon')
const _steps = document.body.querySelector('#steps')


/* ==================================
CONSTANTS USED TO DEFINE THE DUNGEON CONSTRAINTS
==================================== */
const CANVAS_HEIGHT = 256;
const CANVAS_WIDTH = 256;
const NUMBER_OF_ROWS = 16;
const NUMBER_OF_COLUMNS = 16; 
const ROWS = new Array(NUMBER_OF_ROWS).fill();
const COLUMNS = new Array(NUMBER_OF_COLUMNS).fill();
const TILE_HEIGHT = CANVAS_HEIGHT / NUMBER_OF_ROWS;
const TILE_WIDTH = CANVAS_WIDTH / NUMBER_OF_ROWS;
const WALKABLE_TILE_CHANCE = 0.8;
/* ==================================
==================================== */


/* ==================================
VARIABLES FOR HANDLING GAMEPLAY
==================================== */
// object of all 'tiles' on game-grid
const COORDINATES = {};
// object of all 'walkable tiles' on game-grid
const WALKABLE_COORDINATES = []
// total steps walked by player this game
let steps = 1;
// current dungeon the player is on
let dungeon = 1;
// total exp given to player for completing dungeon
let dungeonEXP = 20 + 10 * dungeon

// player level
let lvl = 1;
// current coordinate of the player
let playerCoord = [];

// ENEMY INFORMATION
// # of enemies this dungeon
let count = 1;
// array of positions for each enemy
let enemyPosition = [];

let handleKeyPress;
/* ==================================
==================================== */




// const rooms = []