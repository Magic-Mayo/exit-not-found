// ==========================
// BUILDING OUT THE DUNGEON
// ==========================

const buildDungeon = (
	cHeight,
	cWidth,
	columns,
	rows,
	tHeight,
	tWidth,
	[pExitX, pExitY]
) => {
    // clear board of previous paint...if any
    ctx.clearRect(0, 0, cWidth, cHeight);
    const [sX, sY] = inverseCoords([pExitX, pExitY], xyMax);
    exits = generateRandomEndpoint([sX, sY], tHeight, xyMax);

  // SET UP COORDINATE PLANE
	columns.forEach((vX, x, col) => {
    const newX = x;
		x = x * tWidth;
		COORDINATES[x] = {};

		rows.forEach((vY, y, row) => {
      let eX, eY;
      const newY = y;
			y = y * tHeight;
			const cellChance = Math.random();
      const newStartIsHere = sX === x && sY === y;
      exits.forEach(([a,b]) => {
        if(a == x && b == y){
          eX = a;
          eY = b;
        }
      })
      COORDINATES[x][y] = {
        seen: false
      };

      if(eX == x){
        COORDINATES[x][y].walkable = 1;
        COORDINATES[x][y].exit = 1;
        
        ctx.fillStyle = getExitGradient(x,y);
        ctx.fillRect(x,y,tWidth,tHeight)
      } else if(newX == 0 || newY == 0 || y == xyMax || x == xyMax){
        COORDINATES[x][y].walkable = sX == x && sY == y ? 1 : 0;
        ctx.fillStyle = sX == x && sY == y ? colors.player : colors.unwalkable
        ctx.fillRect(x,y,tWidth,tHeight)
        
      } else if(x <= xyMax && y <= xyMax){
        COORDINATES[x][y].walkable =
        cellChance <= WALKABLE_TILE_CHANCE || newStartIsHere ? 1 : 0;
        COORDINATES[x][y].walkable ? null : COORDINATES[x][y].occupied = 1;
        
        ctx.fillStyle = COORDINATES[x][y].walkable === 0 ? colors.unwalkable : COORDINATES[x][y].seen ? colors.walkable.seen : colors.walkable.unseen;
        ctx.fillRect(x, y, tWidth, tHeight);
      }

		});
	});

  
	// checks to make sure the dungeon can be completed.
  // if not build another one until you get one that can be
    if (!checker([sX, sY])) return (
        buildDungeon(cHeight, cWidth, columns, rows, tHeight, tWidth, [pExitX,pExitY])
    );
  
  generatePlayer([sX, sY], COORDINATES, tHeight);
  generateEnemies(lvl, xyMax, COORDINATES);

  _dungeon.innerHTML = dungeon++;
};


// STEPS TO REPRODUCE ABOVE TO PRODUCE CANVAS ELEMENT WITH TILES\
// 1. initiate the canvas element with a width & a height.
// 2. set up coordinate plane relative to canvas element size considering the # number of rows & colummns
