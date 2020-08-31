
/* ==================================
HTML ELEMENTS
==================================== */
const getEl = document.querySelector;
const game = document.querySelector("#gameBG");
const ctx = game.getContext("2d");
const body = document.querySelector('body')

const _btn = document.querySelector('.toggle-game')
const _container = document.querySelector('.container')
const _landing = document.querySelector('.headline')
const _healthpoints = document.querySelector('#healthpoints')
const _attack = document.querySelector('#attack')
const _defense = document.querySelector('#defense')
const _lvl = document.querySelector('#lvl')
const _expCurrent = document.querySelector('#exp-current')
const _expToNextLvl = document.querySelector('#exp-next')
const _dungeon = document.querySelector('#dungeon')
const _steps = document.querySelector('#steps')


/* ==================================
CONSTANTS USED TO DEFINE THE DUNGEON CONSTRAINTS
==================================== */
const NUMBER_OF_ROWS = 16;
const NUMBER_OF_COLUMNS = 16; 
const CANVAS_HEIGHT = NUMBER_OF_COLUMNS * NUMBER_OF_COLUMNS;
const CANVAS_WIDTH = NUMBER_OF_ROWS * NUMBER_OF_ROWS;
const ROWS = new Array(NUMBER_OF_ROWS).fill();
const COLUMNS = new Array(NUMBER_OF_COLUMNS).fill();
const TILE_HEIGHT = (CANVAS_HEIGHT / NUMBER_OF_ROWS);
const TILE_WIDTH = (CANVAS_WIDTH / NUMBER_OF_ROWS);
const WALKABLE_TILE_CHANCE = 0.8;
/* ==================================
==================================== */

game.setAttribute('width', CANVAS_WIDTH)
game.setAttribute('height', CANVAS_HEIGHT)

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

let player;
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