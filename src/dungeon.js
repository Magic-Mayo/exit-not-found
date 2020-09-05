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
    const xyMax = tHeight * tWidth - tHeight;
    const [sX, sY] = inverseCoords([pExitX, pExitY], xyMax);
    const exits = generateRandomEndpoint([sX, sY], tHeight, xyMax);

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
      COORDINATES[x][y] = {};

      if(eX == x){
        COORDINATES[x][y].walkable = 1;
        let exit;
        if(eX == 0){
          exit = ctx.createLinearGradient(-20,0,20,0);
        } else if(eX == xyMax){
          exit = ctx.createLinearGradient(240,0,260,0);
        } else if(eY == 0){
          exit = ctx.createLinearGradient(0,-20,0,20);
        } else if(eY == xyMax){
          exit = ctx.createLinearGradient(0,240,0,260);
        }
        
        if(x == 0 || y == 0){
          exit.addColorStop(0.2, 'black');
          exit.addColorStop(1, 'yellow');
        } else {
          exit.addColorStop(1, 'black');
          exit.addColorStop(0, 'yellow');
        }
        
        ctx.fillStyle = exit;
        ctx.fillRect(x,y,tWidth,tHeight)
      } else if(newX == 0 || newY == 0 || y == xyMax || x == xyMax){
        COORDINATES[x][y].walkable = sX == x && sY == y ? 1 : 0;
        ctx.fillStyle = sX == x && sY == y ? 'white' : '#1c1c1c'
        ctx.fillRect(x,y,tWidth,tHeight)
        
      } else if(x <= xyMax && y <= xyMax){
        COORDINATES[x][y].walkable =
        cellChance <= WALKABLE_TILE_CHANCE || newStartIsHere ? 1 : 0;
        COORDINATES[x][y].walkable ? null : COORDINATES[x][y].occupied = 1;
        
        ctx.fillStyle = COORDINATES[x][y].walkable === 1 ? "transparent" : "#2b2b2b";
        ctx.fillRect(x, y, tWidth, tHeight);
      }

		});
	});

  
	// checks to make sure the dungeon can be completed.
  // if not build another one until you get one that can be
    if (!checker(exits,[sX, sY])) return (
        buildDungeon(cHeight, cWidth, columns, rows, tHeight, tWidth, [pExitX,pExitY])
    );
  
  generatePlayer([sX, sY], "white", COORDINATES, tHeight, exits);
  generateEnemies(lvl, xyMax, COORDINATES, exits);

  _dungeon.innerHTML = dungeon++;
};


// STEPS TO REPRODUCE ABOVE TO PRODUCE CANVAS ELEMENT WITH TILES\
// 1. initiate the canvas element with a width & a height.
// 2. set up coordinate plane relative to canvas element size considering the # number of rows & colummns
