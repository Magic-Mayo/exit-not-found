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
  const exits = [];
  // TO GENERATE A NEW EXIT COORDINATE:
  // 1. RULES:
  //     A. since exit will always be on the perimeter, one value MUST be zero (either X or Y)
  //     B. exit cannot be straight across from the exit
  for(let i = rng(3) + 1; i>0;i--) exits.push(generateRandomEndpoint([sX, sY], tHeight, xyMax, exits))

  console.log(exits);
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
      // console.log(x,y);
      console.log('coords',eX,eY);

			// console.log('newX', newX);

      if(eX == x){
        COORDINATES[x][y] = 1;
        let exit;
        if(eX == 0){
          exit = ctx.createLinearGradient(0,0,20,0);
        } else if(eX == 240){
          exit = ctx.createLinearGradient(256,0,280,0);
        } else if(eY == 0){
          exit = ctx.createLinearGradient(0,0,0,20);
        } else if(eY == 240){
          exit = ctx.createLinearGradient(0,256,0,280);
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
      } else if(sX == x && sY == y){}
      else if(newX == 0 || newY == 0 || y == xyMax || x == xyMax){
        COORDINATES[x][y] = 0;
        ctx.fillStyle = 'green'
        ctx.fillRect(x,y,tWidth,tHeight)
      } else if(x <= xyMax && y <= xyMax){
        COORDINATES[x][y] =
        cellChance <= WALKABLE_TILE_CHANCE || newStartIsHere ? 1 : 0;
        
        ctx.fillStyle = COORDINATES[x][y] === 1 ? "transparent" : "#2b2b2b";
        ctx.fillRect(x, y, tWidth, tHeight);
      }
      //  else {
      //   COORDINATES[x][y] = 0;
      // }
		});
	});

  console.log(COORDINATES)
  
	// checks to make sure the dungeon can be completed.
  // if not build another one until you get one that can be
  let exitReached;
  for(let i=0;i<exits.length;i++){
    if (
      checker(
        COORDINATES,
        [sX, sY],
        // [0,240],
        [sX, sY],
        // [0, 240],
        exits[i],
        [sX, sY],
        // [0,240],
        dir([sX, sY], tHeight, xyMax),
        tHeight,
        [xyMax, xyMax]
      )
    ) {
      exitReached = true;
      break;
    }
  }
  
  if(!exitReached){
    return buildDungeon(cHeight, cWidth, columns, rows, tHeight, tWidth, [
      pExitX,
      pExitY,
    ]);
  }
  
  generatePlayer([sX, sY], "white", COORDINATES, tHeight, exits);
  generateEnemies(lvl, [sX, sY], exits, COORDINATES);

  _dungeon.innerHTML = dungeon++;
};


// STEPS TO REPRODUCE ABOVE TO PRODUCE CANVAS ELEMENT WITH TILES\
// 1. initiate the canvas element with a width & a height.
// 2. set up coordinate plane relative to canvas element size considering the # number of rows & colummns
