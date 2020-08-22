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

const buildDungeon = (cHeight, cWidth, columns, rows, tHeight, tWidth, [pExitX, pExitY]) => {
  const xMax = cWidth - tWidth;
  const yMax = cHeight - tHeight;
  console.log(game);
  const COORDINATES = {};
  // SET UP COORDINATE PLANE
  columns.forEach((vX, x) => {
    x = x * tWidth;
    COORDINATES[x] = {};

    rows.forEach((vY, y) => {
      y = y * tHeight;
      const cellChance = Math.random();

      COORDINATES[x][y] = cellChance <= WALKABLE_TILE_CHANCE ? 1 : 0;
      ctx.fillStyle = COORDINATES[x][y] === 1 ? "green" : "red";
      ctx.fillRect(x, y, tWidth, tHeight);
    });
  });
  // console.log(COORDINATES[0])
  // console.log(COORDINATES[1])
  // console.log(COORDINATES[2])
  // console.log(COORDINATES[3])

  //////////////////////////////////////////
  // these next two functions, start and end,
  // can go away once we have a system in
  // place for picking a start and exit
  ///////////////////////////////////////////
  const inversePX = pX => {
    if(!pX) return 240;
    if(pX === 240) return 0;
    return pX;
  }

  const inversePY = pY => {
    if(!pY) return 240;
    if(pY == 240) return 0;
    return pY;
  }
  
  const start = (x, y) => (COORDINATES[x]?.[y] ? [x, y] : start(x + tWidth, y));
  const end = (x, y) => (COORDINATES[x]?.[y] ? [x, y] : end(x, y - tHeight));
  
  const [sX, sY] = start(inversePX(pExitX), inversePY(pExitY));
  const [eX, eY] = end(64, 240);
  // const dir = () => {
  //   if(sX == 0)
  // }
  // checks to make sure the dungeon can be completed.
  // if not build another one until you get one that can be
  if (
    !checker(
      COORDINATES,
      [sX, sY],
      // [0,240],
      [sX, sY],
      // [0,240],
      [eX, eY],
      [sX, sY],
      // [0,240],
      0,
      tHeight,
      [xMax, yMax]
      )
      ){
        return buildDungeon(cHeight, cWidth, columns, rows, tHeight, tWidth, [pExitX, pExitY]);
      }
  console.log("this is the dungeon");
};

buildDungeon(
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  COLUMNS,
  ROWS,
  TILE_HEIGHT,
  TILE_WIDTH,
  [0,240]
);

// STEPS TO REPRODUCE ABOVE TO PRODUCE CANVAS ELEMENT WITH TILES\
// 1. initiate the canvas element with a width & a height.
// 2. set up coordinate plane relative to canvas element size considering the # number of rows & colummns
