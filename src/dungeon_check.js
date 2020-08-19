// room parameter is full room with all coordinates. object of objects with the x coordinate
// that opens the object and y coordinate that opens the inner object and lets the checker know if the tile is safe or not
// will never change

// [cX, cY] parameter is current position. array [x,y]
// [pX, pY] parameter is previous position. array [x,y]
// [eX, eY] parameter is coordinates of exit.  is also where the checker will start. array [x,y]
// [sX, sY] parameter is coords of starting point.  will never change. array [x,y]
// direction parameter is what direction checker is currently moving. integer 0 = up, 1 = right, 2 = down, 3 = left
// tileSize parameter is how big each tile is in pixels. integer
// [xMax, yMax] parameter is max size on x and y axis

const checker = (room, [cX, cY], [pX, pY], [eX, eY], [sX, sY], direction, tileSize, [xMax, yMax])=>{
  const upOne = room[cX]?.[cY - tileSize];
  const rightOne = room[cX + tileSize]?.[cY];
  const leftOne = room[cX - tileSize]?.[cY];
  const downOne = room[cX]?.[cY + tileSize];
  const move = (x, y, dir = direction, xX = cX, yY = cY) => checker(room, [x, y], [xX, yY], [eX, eY], [sX, sY], dir, tileSize, [xMax, yMax], i+1);
  const back = ([x,y], dir, j=1) => {
    if(!dir){
      if(room[x][y+tileSize] && room[x+tileSize][y+tileSize])return move(x+tileSize,y+tileSize, 0, x+tileSize,y)
      if(room[x][y+tileSize*j] && room[x+tileSize][y+tileSize*j]) return back([x,y+tileSize*j],0,j+1);
    }
    if(dir== 1){
      if(room[x-tileSize][y] && room[x-tileSize][y+tileSize])return move(x-tileSize,y+tileSize, 1, x-tileSize,y)
      if(room[x-tileSize*j][y] && room[x-tileSize*j][y+tileSize]) return back([x-tileSize*j,y],1,j+1);
    }
    if(dir==2){
      if(room[x][y-tileSize] && room[x-tileSize][y-tileSize])return move(x-tileSize,y-tileSize, 2, x-tileSize,y)
      if(room[x][y-tileSize*j] && room[x-tileSize][y-tileSize*j]) return back([x,y-tileSize*j],2,j+1);
    }
    if(room[x+tileSize][y] && room[x+tileSize][y-tileSize])return move(x+tileSize,y-tileSize, 3, x+tileSize,y)
    if(room[x+tileSize*j][y] && room[x+tileSize*j][y-tileSize]) return back([x+tileSize*j,y],3,j+1);
  }
  
  // checks first to see if exit coords are reached.  if so dungeon exit can be reached.  return true
  if(eX == cX && eY == cY) return true;

  // next checks if we've at least made one move from the starting point 
  // or if we're trapped in a single cell at the start.
  // if so and we are back to the starting point we've traveled all the way around the board
  // return false since we never found the exit and are back at the start
  if(((cX != pX || cY != pY) && cX == sX && cY == sY) ||
    (!upOne && !rightOne && !leftOne && !downOne))return false;

  //checks if moving up
  if(!direction){
    //check to see if we made it to the end of the column and start a different direction if so
    if(cY - tileSize < 0)return move(cX, cY, 1);
    
    // if we have moved at least one square up since the las time we moved right,
    // then check to see if we can move left and do it if we can
    if(leftOne && cX && cX == pX && cY <= pY - tileSize && pX != cX - tileSize)return move(cX - tileSize, cY);
    
    // if we can move left and we moved left last time do it again
    if(leftOne && cX == pX - tileSize)return move(cX - tileSize, cY);
    
    // move up if a tile is available
    if(upOne)return move(cX, cY - tileSize);
    
    // move right if a tile is available
    if(rightOne)return move(cX + tileSize, cY);
    
    // if none of the other scenarios hit then we need to backtrack until
    // we find a good tile to restart the same direction from
    return back([cX, cY], 0)
  }
  if(direction == 1){
    
    //check to see if we made it to the end of the column and start a different direction if so
    if(cX + tileSize > xMax)return move(cX, cY, 2);
    
    // if we have moved at least one square right since the last time we moved down,
    // then check to see if we can move up and do it if we can
    if(upOne && cY && cY == pY && cX >= pX + tileSize && pY != cY - tileSize)return move(cX, cY - tileSize);
    
    // if we can move up and we moved up last time do it again
    if(upOne && cY == pY - tileSize)return move(cX, cY - tileSize);
    
    // if we can move right do it
    if(rightOne && pX != cX + tileSize)return move(cX + tileSize, cY);
    
    // move down if we can
    if(downOne)return move(cX, cY + tileSize);
    
    // if none of the other scenarios hit then we need to backtrack until
    // we find a good tile to restart the same direction from
    return back([cX, cY], 1);
  }
  if(direction == 2){
    //check to see if we made it to the end of the column and start a different direction if so
    if(cY + tileSize > yMax)return move(cX, cY, 3);
    
    // if we have moved at least one square down since the last time we moved left,
    // then check to see if we can move right and do it if we can
    if(rightOne && cX != xMax && cX == pX && cY >= pY + tileSize && pX != cX + tileSize)return move(cX + tileSize, cY);
    
    // if we can move right and we moved right last time do it again
    if(rightOne && cX == pX + tileSize)return move(cX + tileSize, cY);
    
    // move down if we can
    if(downOne)return move(cX, cY + tileSize);
    
    // move left if we can
    if(leftOne)return move(cX - tileSize, cY);
    
    // if none of the other scenarios hit then we need to backtrack until
    // we find a good tile to restart the same direction from
    return back([cX, cY], 2)
  }
  
  //check to see if we made it to the end of the column and start a different direction if so
  if(cX - tileSize < 0)return move(cX, cY, 0);
  
  // if we have moved at least one square left since the last time we moved up,
  // then check to see if we can move down and do it if we can
  if(downOne && cY != yMax && cY == pY && cX <= pX - tileSize && pY != cY + tileSize)return move(cX, cY + tileSize);
  
  // if we can move down and we moved down last time do it again
  if(downOne && cY == pY + tileSize)return move(cX, cY + tileSize);
  
  // move left if we can
  if(leftOne)return move(cX - tileSize, cY);
  
  // move up if we can
  if(upOne)return move(cX, cY - tileSize);
  
  // if none of the other scenarios hit then we need to backtrack until
  // we find a good tile to restart the same direction from
  return back([cX, cY], 3)
  
}