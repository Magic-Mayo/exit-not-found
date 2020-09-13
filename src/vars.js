const rng = (n = 4) => Math.floor(Math.random() * n);


const colors = {
    player: '#fff',
    inSight: {
        walkable: "transparent",
        unwalkable: "#000",
        enemy: '#940404'
    },
    unseenOrUnwalkable: "#000",
    outOfSight: "#00000066",
    fovHighlight: "#3370d422",
    walkHighlight: '#08fa2555'
}

const narrator = {
    start: [
        name => `${name} has entered the dungeon...`,
        name => `but will ${name} find the exit?`,
        '...what was that voice?  Is someone there?',
        `Use the WASD keys to move your character. Hint: It's the White box ;)`,
        'ok....thanks?',
        '**whoever you are**',
        'the green squares are where you can move to on your turn',
        `you can also hover yourself and check your stats`,
        `you'll also notice a block button...that will use all the actions you have left and convert half of it to defense`,
        'use it wisely'
    ],
    fog: [
        "Tiles you have not explored yet are completely hidden by the fog of war.",
        "Tiles you've discovered will stay visible until they are out of your field of view (FOV).",
        "You'll remember the dungeon layout, but you'll no longer be able to see 'activity'",
        "So watch out!",
        "There could be vampires",
        "WHO ARE YOU?!"
    ],
    enemy: [
        'That....is an enemy',
        "If you want to check out it's stats or attack just look at it!",
        "....or hover your mouse over it for those that don't have extra sensory abilities",
        // `I'd almost rather die in here than having to keep hearing these "jokes"`,
        '....whelp.  Guess the "jokes" are just gonna keep coming'
    ],
    taunting: [
        `you're going the wrong way`,
        `you sure the exit is over there?`,
        `you're never leaving....muahahahaha`,
        `no don't go that way!!`,
        `good luck....`,
        `you sure you want to go that way?`,
        `don't leave me...ha you can't!`,
        `trust me....this is NOT a dream`,
        `I will always be here for you...whether or not you like it`,
        `I'm in your head and I'm not leaving....just like you aren't leaving here!`
    ],
    gameOver: [
        name => `....looks like ${name} was not able to find the exit`,
        name => `didn't think ${name} would`,
        "well at least the jokes can stop now"
    ],
    aoo: [
        name => `${name}....here's the deal`,
        `.....`,
        `you can try to run if you want`,
        `but if the enemy has seen you and you've seen them...`,
        `all you're doing by running is giving them a free shot at you`,
        `and if they hit you...your turn is OVER!`,
        `so you're better off sticking around for the fight...`,
        'if you can hack it',
        `you can have this one for free....next one won't be`
    ]
}

/* ==================================
HTML ELEMENTS
==================================== */

const _createNameInput = document.querySelector("#createName");

const game = document.querySelector("#gameBG");
const ctx = game.getContext("2d");
const body = document.querySelector('body')
const _btnStart = document.querySelector('.toggle-game')
const _btnReset = document.querySelector('.reset')
const _container = document.querySelector('.container')
const _landing = document.querySelector('.headline')
const _cursorModal = document.querySelector('#cursorModal')
const _help = document.querySelector('.help')
// ***** PLAYER STATS *****
// Level
const _lvlUpAtk = document.querySelector('#lvlUpAtk')
const _lvlUpDef = document.querySelector('#lvlUpDef')
const _lvlUpAgil = document.querySelector('#lvlUpAgil')
const _lvlUpActions = document.querySelector('#lvlUpActions')

// Fighting Details
const _lvlUp = document.querySelector('.level-up')

// ***** ENEMY STATS *****
const _enemyDetails = document.querySelector('.enemy-details')

// ACTIONS WINDOW
const _chatBox = document.querySelector('.chat-box')
const _chatMessageGroup = document.querySelector('.chat-message-group');
const _playAgain = document.querySelector('#playAgain');
const _newGameBtn = document.querySelector('.play-again-btn')
const _newCharacterBtn = document.querySelector('.new-character-btn')
/* ==================================
CONSTANTS USED TO DEFINE THE DUNGEON CONSTRAINTS
==================================== */
const NUMBER_OF_ROWS = 16;
const NUMBER_OF_COLUMNS = 16; 
const CHECKER_INT = Math.pow(NUMBER_OF_COLUMNS - 2, 2) + 2;
const CANVAS_HEIGHT = NUMBER_OF_COLUMNS * NUMBER_OF_COLUMNS;
const CANVAS_WIDTH = NUMBER_OF_ROWS * NUMBER_OF_ROWS;
const ROWS = new Array(NUMBER_OF_ROWS).fill();
const COLUMNS = new Array(NUMBER_OF_COLUMNS).fill();
const TILE_HEIGHT = (CANVAS_HEIGHT / NUMBER_OF_ROWS);
const TILE_WIDTH = (CANVAS_WIDTH / NUMBER_OF_ROWS);
const WALKABLE_TILE_CHANCE = 0.8;
const xyMax = TILE_HEIGHT * TILE_HEIGHT - TILE_HEIGHT;
/* ==================================
==================================== */


// game.setAttribute('width', CANVAS_WIDTH)
// game.setAttribute('height', CANVAS_HEIGHT)


/* ==================================
VARIABLES FOR HANDLING GAMEPLAY
==================================== */
// object of all 'tiles' on game-grid
const COORDINATES = {};
// object of all 'walkable tiles' on game-grid
const WALKABLE_COORDINATES = []
// total steps walked by player this game
let steps = 0;
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
// array of positions for each enemy
let enemies = [];

let handleKeyPress;
//   ENEMY POPULATION BY LEVEL:
// 1-10. [0,2]
// 11-20. [0,3]
let enemyCount;

// 	 ENEMY **TOTAL** POWER LVL BY LEVEL
// 1-5. 100 POINTS
// 6-10. 150 POINTS
// 11-15. 225 POINTS

let totalEnemyPower = 100;
const enemyPowerMult = () => lvl % 5 == 0 ? totalEnemyPower = ~~(totalEnemyPower * 1.5) : 0;

/* ==================================
==================================== */

// TIMER FOR ENEMY MOVEMENT
let moveTimer;

// EXITS FOR DUNGEON
let exit;

const start = [];

let walkableTiles = 0;

let enemyIndex = 0;

//change back to undefined
let firstEnemySpotted;

let startedTyping;

let firstAOO = 1;

let helpDisabled = 0;

_help.addEventListener('change', () => helpDisabled = !helpDisabled)