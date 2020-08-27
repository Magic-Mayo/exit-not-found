
/* ==================================
HTML ELEMENTS
==================================== */
const game = document.getElementById("gameBG");
const ctx = game.getContext("2d");

const _btn = document.body.querySelector('.toggle-game')
const _container = document.body.querySelector('.container')
const _landing = document.body.querySelector('.headline')
const _healthpoints = document.body.querySelector('#healthpoints')
const _lvl = document.body.querySelector('#lvl')
const _exp = document.body.querySelector('#exp')
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
const COORDINATES = {};
const WALKABLE_COORDINATES = []
let steps = 1;
let dungeon = 1;
/* ==================================
==================================== */



