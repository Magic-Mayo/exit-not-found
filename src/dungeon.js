// ==========================
// BUILDING OUT THE DUNGEON
// ==========================

// init constraints for dungeon size
const CANVAS_HEIGHT = 256;
const CANVAS_WIDTH = 256;

const NUMBER_OF_ROWS = 16;
const NUMBER_OF_COLUMNS = 16;

const ROWS = new Array(NUMBER_OF_ROWS).fill();
const COLUMNS = new Array(NUMBER_OF_COLUMNS).fill();

const TILE_HEIGHT = CANVAS_HEIGHT / NUMBER_OF_ROWS;
const TILE_WIDTH = CANVAS_WIDTH / NUMBER_OF_ROWS;
// init constraint for tile-type ratio between walkable & nonwalkable
const WALKABLE_TILE_CHANCE = 0.8;

buildDungeon(
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  COLUMNS,
  ROWS,
  TILE_HEIGHT,
  TILE_WIDTH
);
  
  function buildDungeon(cHeight, cWidth, columns, rows, tHeight, tWidth) {
    const game = document.getElementById("game");
    const ctx = game.getContext("2d")
    console.log(game)
    const COORDINATES = {};
    // SET UP COORDINATE PLANE
    columns.forEach((vX, x) => {
      x = x * tWidth;
      COORDINATES[x] = {};
      
      rows.forEach((vY, y) => {
        y = y * tHeight;
        const cellChance = Math.random();
        
        COORDINATES[x][y] = cellChance <= WALKABLE_TILE_CHANCE ? 1 : 0
        ctx.fillStyle = COORDINATES[x][y] === 1 ? "green" : "red";
        ctx.fillRect(x, y, tWidth, tHeight)
      });
    });
    // console.log(COORDINATES);
    
    // console.log(COORDINATES[0])
    // console.log(COORDINATES[1])
    // console.log(COORDINATES[2])
    // console.log(COORDINATES[3])
    
    //////////////////////////////////////////
    // these next two functions, start and end,
    // can go away once we have a system in
    // place for picking a start and exit
    ///////////////////////////////////////////
    const start = (x=0,y=0) => COORDINATES[x][y] ? [x,y]:start(x+TILE_WIDTH, y)
    const end = (x=0, y = 160) => COORDINATES[x][y] ? [x,y]:end(x, y-TILE_HEIGHT)

    // checks to make sure the dungeon can be completed.
    // if not build another one until you get one that can be
    if(!checker(COORDINATES, start(), start(), end(), start(), 1, TILE_HEIGHT, [CANVAS_WIDTH - TILE_WIDTH, CANVAS_HEIGHT - TILE_HEIGHT]))
      return buildDungeon(cHeight, cWidth, columns, rows, tHeight, tWidth);
  console.log("this is the dungeon");
}

// STEPS TO REPRODUCE ABOVE TO PRODUCE CANVAS ELEMENT WITH TILES\
// 1. initiate the canvas element with a width & a height.
// 2. set up coordinate plane relative to canvas element size considering the # number of rows & colummns
