const inverseCoords = ([x, y], max) => !x ? [max, y] : !y ? [x, max] : x == max ? [0, y] : [x, 0];
const roundUp = (num) => {
  const split = num.toString().split(".")[1];
  return split ? parseInt(split.split("")[0]) >= 5 ? Math.round(num) : num : num;
};

const generatePlayer = (coord, color, room, tileSize, exit) => {
  handleKeyPress = (e) => handlePlayerMovement(e, room, tileSize, color, exit);

  playerCoord = coord;
  // console.log(
  // `The player will start at ${playerCoord} and will have the color ${color}`
  // );
  ctx.fillStyle = room[coord[0]][coord[1]] && color;
  ctx.fillRect(coord[0], coord[1], tileSize, tileSize);

  window.addEventListener("keypress", handleKeyPress);
};

const generateEnemies = (level, max, room) => {
  enemyPosition = [];

  enemyCount = rng(level/2 + 2)

  // console.log("ENEMY COUNT: " + enemyCount);
  for (let i = 0; i < enemyCount; i++) {
    // enemy.coords = getEnemyCoordinate(max, room)
	enemyPosition.push(getEnemyCoordinate(max, room));
    const [x, y] = enemyPosition[i];
    ctx.fillStyle = room[x][y] && "#94040466";
    ctx.fillRect(x, y, TILE_WIDTH, TILE_HEIGHT);
  }
};

const getEnemyCoordinate = (max, room) => {
  const x = rng(NUMBER_OF_ROWS) * TILE_HEIGHT;
  const y = rng(NUMBER_OF_ROWS) * TILE_HEIGHT;
  return x != 0 && y != 0 && x != max && y != max && room[x] ?. [y] ? [x, y] : getEnemyCoordinate(max, room);
};

const handlePlayerMovement = (event, room, tileSize, color, exits) => {
  if (!(event.code == "KeyW" || event.code == "KeyD" || event.code == "KeyS" || event.code == "KeyA")) 
    return;
  

  let {key} = event;
  key = key.toLowerCase();
  let [playerX, playerY] = playerCoord;

  const dir = {
    w: [
      playerX,
      playerY - tileSize
    ],
    d: [
      playerX + tileSize,
      playerY
    ],
    s: [
      playerX,
      playerY + tileSize
    ],
    a: [
      playerX - tileSize,
      playerY
    ]
  };

  const [nextX, nextY] = dir[key];

  if (room[nextX] ?. [nextY]) {
    ctx.clearRect(playerX, playerY, tileSize, tileSize);

    ctx.fillStyle = room[nextX][nextY] && color;
    ctx.fillRect(nextX, nextY, tileSize, tileSize);

    _steps.innerHTML = steps ++;
    playerCoord = [nextX, nextY];
    enemyPosition.forEach((pos, i) => handleEnemyMovement(room, pos, i, exits));
  }
  for (let i = 0; i < exits.length; i++) {
    if (nextX == exits[i][0] && nextY == exits[i][1]) {
      console.log(player);
      player.xp += lvl;
      lvl++;
      if(lvl % 10 == 0) player.autoLvl();
      player.checkIfNextLvl();
      _expCurrent.textContent = player.xp;

      console.log("you win!");
      window.removeEventListener("keypress", handleKeyPress);

      return buildDungeon(CANVAS_HEIGHT, CANVAS_WIDTH, COLUMNS, ROWS, TILE_HEIGHT, TILE_WIDTH, [
        exits[i][0],
        exits[i][1]
      ]);
    }
  }
};

const handleEnemyMovement = (room, [
  x, y
], i, exits) => {
  const isExit = (pos, [a, b]) => {

    for (let i = 0; i < exits.length; i++) {
      if (exits[i][0] == a && exits[i][1] == b) 
        return true;
      
    }
  };

  const surroundings = [
    {
      pos: "top",
      coord: [
        x,
        y - TILE_WIDTH
      ],
      available: room[x] ?. [y - TILE_WIDTH],
      checkIfExit: isExit("top", [
        x,
        y - TILE_WIDTH
      ])
    }, {
      pos: "right",
      coord: [
        x + TILE_WIDTH,
        y
      ],
      available: room[x + TILE_WIDTH] ?. [y],
      checkIfExit: isExit("right", [
        x + TILE_WIDTH,
        y
      ])
    }, {
      pos: "bottom",
      coord: [
        x,
        y + TILE_WIDTH
      ],
      available: room[x] ?. [y + TILE_WIDTH],
      checkIfExit: isExit("bottom", [
        x,
        y + TILE_WIDTH
      ])
    }, {
      pos: "left",
      coord: [
        x - TILE_WIDTH,
        y
      ],
      available: room[x - TILE_WIDTH] ?. [y],
      checkIfExit: isExit("left", [
        x - TILE_WIDTH,
        y
      ])
    },
  ];

  const availableSurroundings = surroundings.filter((c) => c.available && !c.checkIfExit);
  // console.log(availableSurroundings);

  ctx.clearRect(x, y, TILE_WIDTH, TILE_HEIGHT);
  enemyPosition[i] = availableSurroundings.length > 0 ? availableSurroundings[rng(availableSurroundings.length)].coord : enemyPosition[i]
  const [newX, newY] = enemyPosition[i];

  ctx.fillStyle = room[newX] ?. [newY] ? "#94040466" : 'transparent';
  ctx.fillRect(newX, newY, TILE_WIDTH, TILE_HEIGHT);
};

const goFullScreen = () => {
  if (body.requestFullscreen) {
    body.requestFullscreen();
  } else if (body.mozRequestFullScreen) { /* Firefox */
    body.mozRequestFullScreen();
  } else if (body.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
    body.webkitRequestFullscreen();
  } else if (body.msRequestFullscreen) { /* IE/Edge */
    body.msRequestFullscreen();
  }
}

// must not be in a corner
// must not be on the same side as another exit or the start
const generateRandomEndpoint = ([
  sX, sY
], tile, max, exit) => {
  const exitStart = exit.length > 0 ? [
    [
      sX, sY
    ],
    ...exit.filter(
      ([a, b]) => a != sX && b != sY
    )
  ] : [[sX, sY]];
  const x = rng(tile) * tile;
  const y = x == 0 || x == max ? rng(tile) * tile : rng() > 1 ? 0 : max;
  // console.log(exitStart);

  const newExit = exitStart.some(([eX, eY]) => {
    if (((x == max || x == 0) && x == eX) || ((y == max || y == 0) && y == eY)) 
      return true;
    
    return false;
  })

  if (! newExit) 
    return [x, y];
  
  return generateRandomEndpoint([
    sX, sY
  ], tile, max, exitStart)
};

const dir = ([
  sX, sY
], tile, max) => {
  if (sX == 0) {
    if (sY > 0) 
      return 0;
     else 
      return 1;
    
  } else if (sY == 0) {
    if (sX < max + tile) 
      return 1;
     else 
      return 2;
    
  } else if (sX == max) {
    if (sY < max + tile) 
      return 2;
     else 
      return 3;
    
  }
};