// room parameter is full room with all coordinates. object of objects with the x coordinate
// that opens the object and y coordinate that opens the inner object and lets the checker know if the tile is safe or not
// will never change

// CANVAS ELEMENT
const game = document.getElementById("gameBG");
const ctx = game.getContext("2d");

// [cX, cY] parameter is current position. array [x,y]
// [pX, pY] parameter is previous position. array [x,y]
// [eX, eY] parameter is coordinates of exit.  is also where the checker will start. array [x,y]
// [sX, sY] parameter is coords of starting point.  will never change. array [x,y]
// direction parameter is what direction checker is currently moving. integer 0 = up, 1 = right, 2 = down, 3 = left
// tileSize parameter is how big each tile is in pixels. integer
// [xMax, yMax] parameter is max size on x and y axis

/////////////////////////////////////////
//// fix issue with getting trapped ////
///////////////////////////////////////

const checker = (
  room,
  [cX, cY],
  [pX, pY],
  [eX, eY],
  [sX, sY],
  direction,
  tileSize,
  [xMax, yMax]
) => {
  ctx.fillStyle = room[pX][pY] && "darkturquoise";
  ctx.fillRect(pX, pY, tileSize, tileSize);
  ctx.fillStyle = room[cX][cY] && "darkblue";
  ctx.fillRect(cX, cY, tileSize, tileSize);
  ctx.fillStyle = room[(sX, sY)] && "goldenrod";
  ctx.fillRect(sX, sY, tileSize, tileSize);
  ctx.fillStyle = room[(eX, eY)] && "hotpink";
  ctx.fillRect(eX, eY, tileSize, tileSize);

  const upOneAvail = room[cX]?.[cY - tileSize];
  const rightOneAvail = room[cX + tileSize]?.[cY];
  const leftOneAvail = room[cX - tileSize]?.[cY];
  const downOneAvail = room[cX]?.[cY + tileSize];

  const sameY = cY == pY;
  const sameX = cX == pX;

  const movedRight = cX == pX + tileSize;
  const movedLeft = cX == pX - tileSize;
  const movedDown = cY == pY + tileSize;
  const movedUp = cY == pY - tileSize;

  if (cX == sX && cY == sY) console.log(room);
  console.log(`CURRENT  [${cX}, ${cY}], [${pX},${pY}],START [${sX}, ${sY}], EXIT: [${eX}, ${eY}], DIRECTION: ${direction}
  WHAT IS AVAILABLE: [RIGHT: ${rightOneAvail}, DOWN: ${downOneAvail}, LEFT: ${leftOneAvail}, UP: ${upOneAvail}]
  ------------------------------------------------`);
  const move = (x, y, dir = direction, xX = cX, yY = cY) =>
    setTimeout(
      () =>
        checker(room, [x, y], [xX, yY], [eX, eY], [sX, sY], dir, tileSize, [
          xMax,
          yMax,
        ]),
      250
    );
  const back = ([x, y], dir, j = 1) => {
    console.log("back");
    if (!dir) {
      if (room[x][y + tileSize] && room[x + tileSize][y + tileSize])
        return move(x + tileSize, y + tileSize, 0, x, y + tileSize);
      // if(room[x][y+tileSize*j] && room[x+tileSize][y+tileSize*j])
      return back([x, y + tileSize * j], 0, j + 1);
    }
    if (dir == 1) {
      if (room[x - tileSize][y] && room[x - tileSize][y + tileSize])
        return move(x - tileSize, y + tileSize, 1, x - tileSize, y);
      // if(room[x-tileSize*j][y] && room[x-tileSize*j][y+tileSize])
      return back([x - tileSize * j, y], 1, j + 1);
    }
    if (dir == 2) {
      if (room[x][y - tileSize] && room[x - tileSize][y - tileSize])
        return move(x - tileSize, y - tileSize, 2, x, y - tileSize);
      // if(room[x][y-tileSize*j] && room[x-tileSize][y-tileSize*j])
      return back([x, y - tileSize * j], 2, j + 1);
    }
    if (room[x + tileSize][y] && room[x + tileSize][y - tileSize])
      return move(x + tileSize, y - tileSize, 3, x + tileSize, y);
    // if(room[x+tileSize*j][y] && room[x+tileSize*j][y-tileSize])
    return back([x + tileSize * j, y], 3, j + 1);
  };

  // checks first to see if exit coords are reached.  if so dungeon exit can be reached.  return true
  if (eX == cX && eY == cY) return true;

  // next checks if we've at least made one move from the starting point
  // or if we're trapped in a single cell at the start.
  // if so and we are back to the starting point we've traveled all the way around the board
  // return false since we never found the exit and are back at the start
  if (
    ((cX != pX || cY != pY) && cX == sX && cY == sY) ||
    (!upOneAvail && !rightOneAvail && !leftOneAvail && !downOneAvail)
  )
    return false;

  //checks if moving up
  if (!direction) {

    // WE MADE IT TO TOP OF DUNGEON
    if (cY - tileSize < 0) {
      // WE ARE ON THE FAR LEFT OF THE DUNGEON
      if (cX === 0) {
        if(movedLeft){
          if(downOneAvail){
            return move(cX, cY + tileSize)
          }
        }
        // CHANGE DIRECTION TO "RIGHT"
        return move(cX, cY, 1);
      }
      // THERE IS AN AVAILABLE BLOCK TO THE LEFT
      else if (leftOneAvail){
        return move(cX - tileSize, cY)
      }
      // THERE IS NO AVAILABLE BLOCK TO THE LEFT, SO CHANGE DIRECTION TO "RIGHT"
      else return move(cX,cY,1)
    }

    // PREVIOUS COORDINATE & CURRENT COORDINATE ARE THE SAME, THEREFORE THIS DIRECTION CHECK HAS JUST STARTED
    if (sameX && sameY) {
      // ASSUMPTION: WE ARE STARTING AT [0,240]
      console.log("THIS IS THE BEGINNING");
      // THERE IS AN AVAILABLE BLOCK ABOVE SO MOVE UP
      if (upOneAvail) return move(cX, cY - tileSize);

      // THERE IS NO AVAILABLE BLOCK ABOVE, SO MOVE RIGHT
      else return move(cX + tileSize, cY);
    }

    // MOVED UP OR DOWN
    else if (sameX) {
      // MOVED UP
      if (movedUp) {
        console.log("it moved up!");

        // WE ARE ON THE FARTHEST LEFT (WE CANNOT MOVE LEFT)
        if (cX === 0) {
          // MOVE UP AGAIN
          if (upOneAvail) {
            console.log("we're moving up");
            return move(cX, cY - tileSize)
          }
          // MOVE RIGHT
          else if (rightOneAvail) {
            console.log("we're moving right");
            return move(cX + tileSize, cY)
          }
          // TURN AROUND AND GO BACK DOWN
          else {
            console.log("we gotta move back down");
            return move(cX, cY + tileSize)
          }
        } 
        // WE ARE NOT ON THE FURTHEST LEFT (WE CAN MOVE LEFT)
        else {
          // MOVE LEFT
          if (leftOneAvail) {
            console.log("we're moving left");
            return move(cX - tileSize, cY)
          }
          // MOVE UP
          else if (upOneAvail) {
            console.log("we're moving up");
            return move(cX, cY - tileSize)
          }
          // MOVE RIGHT
          else if (rightOneAvail) {
            console.log("we're moving right");
            return move(cX + tileSize, cY)
          }
          // TURN AROUND AND GO BACK DOWN
          else {
            console.log("we gotta move back down");
            return move(cX, cY + tileSize)
          }
        }
      }
      //MOVED DOWN
      else if (movedDown) {
        console.log("It moved down!");

        // WE ARE ON THE FARTHEST LEFT (WE CANNOT MOVE LEFT)
        if (cX === 0) {
          // MOVE RIGHT
          if (rightOneAvail) {
            console.log("we're moving right")
            return move(cX + tileSize, cY)
          }
          // MOVE DOWN
          else if (downOneAvail) {
            console.log("we're moving down")
            return move(cX,cY + tileSize)
          }
          // TURN AROUND AND GO BACK UP
          else {
            console.log("we gotta go back up")
            return move(cX, cY - tileSize)
          }
        }
        // WE ARE NOT ON THE FARTHEST LEFT (WE CAN MOVE LEFT), BUT WE CHECK TO SEE IF WE CAN MOVE RIGHT FIRST TO AVOID GETTING STUCK IN A LOOP
        else {
          // MOVE RIGHT
          if (rightOneAvail) {
            console.log("we're moving right");
            return move(cX + tileSize, cY)
          }
          // MOVE DOWN
          else if (downOneAvail) {
            console.log("we're moving down");
            return move(cX, cY + tileSize)
          }
          // MOVE LEFT
          else if (leftOneAvail) {
            console.log("we're moving left");
            return move(cX - tileSize, cY)
          }
          // TURN AROUND AND GO BACK UP
          else {
            console.log("we gotta move back up");
            return move(cX, cY - tileSize)
          }
        }
      }
    }

    // MOVED LEFT OR RIGHT
    else if (sameY) {

      // MOVED LEFT
      if (movedLeft) {
        console.log("it moved left!");

        // WE ARE NOW ON THE FURTHEST LEFT AND CANNOT MOVE LEFT AGAIN
        if (cX === 0) {
          // MOVE DOWN
          if (downOneAvail) {
            console.log("we're moving down");
            return move(cX, cY + tileSize)
          }
          // MOVE UP
          else if (upOneAvail) {
            console.log("we're moving up");
            return move(cX, cY - tileSize)
          }
          // TURN AROUND AND GO BACK RIGHT
          else {
            console.log("we gotta move back right");
            return move(cX + tileSize, cY)
          }
        }
        // WE ARE NOT ON THE FURTHEST LEFT
        else {
          // MOVE DOWN
          if (downOneAvail) {
            console.log("we're moving down");
            return move(cX, cY + tileSize)
          }
          // MOVE LEFT
          else if (leftOneAvail) {
            console.log("we're moving left");
            return move(cX - tileSize, cY)
          }
          // MOVE UP
          else if (upOneAvail) {
            console.log("we're moving up");
            return move(cX, cY - tileSize)
          }
          // TURN AROUND AND GO BACK RIGHT
          else {
            console.log("we gotta move back right");
            return move(cX + tileSize, cY)
          }
        }

      } 
      // MOVED RIGHT
      else if (movedRight) {
        console.log("it moved right!");
        // MOVE UP
        if (upOneAvail) {
          console.log("we're moving up");
          return move(cX, cY - tileSize);
        } 
        // MOVE RIGHT
        else if (rightOneAvail) {
          console.log("we're moving right");
          return move(cX + tileSize, cY);
        } 
        // MOVE DOWN
        else if (downOneAvail) {
          console.log("we're moving down");
          return move(cX, cY + tileSize);
        }
        // TURN AROUND AND MOVE BACK LEFT
        else {
          console.log("we gotta go back left");
          return move(cX - tileSize, cY);
        }
      }
    } 
    // else return back([cX, cY], 0);

    // if we have moved at least one square up since the last time we moved right,
    // then check to see if we can move left and do it if we can or
    // if we can move left and we moved left last time do it again
    // if (leftOneAvail) {
    //   if (sameX || movedLeft) {
    //     if (movedUp || movedLeft) {
    //       if (pX != cX - tileSize) return move(cX - tileSize, cY);
    //     }
    //     // return move(cX - tileSize, cY);
    //   }
    // }

    // // if we just moved left check to see if we can move down,
    // // if so move down or if we just moved down check to see if
    // // we can move down again and do it
    // if (downOneAvail) {
    //   if (movedLeft || (movedUp && sameX)) return move(cX, cY + tileSize);
    // }

    // // move up if a tile is available
    // if (upOneAvail) {
    //   return move(cX, cY - tileSize);
    // }

    // // move right if a tile is available
    // if (rightOneAvail) {
    //   return move(cX + tileSize, cY);
    // }

    // if(leftOneAvail)return move(cX - tileSize, cY);
    // if none of the other scenarios hit then we need to backtrack until
    // we find a good tile to restart the same direction from
  }
  if (direction == 1) {

    // WE MADE IT TO RIGHT OF THE DUNGEON
    if (cX + tileSize > xMax) {
      // WE ARE ON THE TOP OF THE DUNGEON
      if (cY == 0) {
        if(movedUp){
          if(leftOneAvail){
            return move(cX - tileSize, cY)
          }
        }
        // CHANGE DIRECTION TO "DOWN"
        return move(cX, cY, 2);
      }
      // THERE IS AN AVAILABLE BLOCK TO ABOVE
      else if (upOneAvail){
        return move(cX, cY - tileSize)
      }
      // CHANGE DIRECTION TO "RIGHT"
      else return move(cX,cY,2)
    }
  
    // PREVIOUS COORDINATE & CURRENT COORDINATE ARE THE SAME, THEREFORE THIS DIRECTION CHECK HAS JUST STARTED
    if (sameX && sameY) {
      console.log("THIS IS THE BEGINNING");
      // THERE IS AN AVAILABLE BLOCK TO THE RIGHT SO MOVE RIGHT
      if (rightOneAvail) return move(cX + tileSize, cY);
  
      // THERE IS NO AVAILABLE BLOCK TO THE RIGHT, SO MOVE DOWN
      else return move(cX + tileSize, cY);
    }
  
    // MOVED UP OR DOWN
    else if (sameX) {
      // MOVED UP
      if (movedUp) {
        console.log("it moved up!");
  
        // WE ARE ON THE FARTHEST RIGHT (WE CANNOT MOVE RIGHT)
        if (cX == xMax) {
          // MOVE UP AGAIN
          if (upOneAvail) {
            console.log("we're moving up");
            return move(cX, cY - tileSize)
          }
          // MOVE LEFT
          else if (leftOneAvail) {
            console.log("we're moving right");
            return move(cX - tileSize, cY)
          }
          // TURN AROUND AND GO RIGHT
          else {
            console.log("we gotta move back down");
            return move(cX + tileSize, cY)
          }
        } 
        // WE ARE NOT ON THE FURTHEST UP (WE CAN MOVE UP)
        else {
          // TURN AROUND AND GO BACK DOWN
          if(upOneAvail) {
            console.log("we gotta move back up");
            return move(cX, cY - tileSize)
          }
          // MOVE LEFT
          else if (leftOneAvail) {
            console.log("we're moving left");
            return move(cX - tileSize, cY)
          }
          // MOVE RIGHT
          if (rightOneAvail) {
              console.log("we're moving right");
              return move(cX + tileSize, cY)
          }
          // MOVE DOWN
          else {
            console.log("we're moving down");
            return move(cX, cY + tileSize)
          }
        }
      }
      //MOVED DOWN
      else if (movedDown) {
        console.log("It moved down!");
  
        // MOVE RIGHT
        if (rightOneAvail) {
          console.log("we're moving right")
          return move(cX + tileSize, cY)
        }
        // MOVE DOWN
        else if (downOneAvail) {
          console.log("we're moving down")
          return move(cX,cY + tileSize)
        }
        // TURN AROUND AND GO BACK UP
        else {
          console.log("we gotta go back up")
          return move(cX, cY - tileSize)
        }
      }
    }
    
    // MOVED LEFT OR RIGHT
    else if (sameY) {
      // MOVED LEFT
      if (movedLeft) {
        console.log("it moved left!");
        
        // WE ARE NOW ON THE FURTHEST RIGHT AND CANNOT MOVE RIGHT AGAIN
        if (cX == xMax) {
          // MOVE UP
          if (upOneAvail) {
            console.log("we're moving up");
            return move(cX, cY - tileSize)
          }
          // MOVE LEFT
          else if (leftOneAvail) {
            console.log("we're moving left");
            return move(cX - tileSize, cY)
          }
          // TURN AROUND AND GO BACK RIGHT
          else {
            console.log("we gotta move back right");
            return move(cX + tileSize, cY)
          }
        }
        // WE ARE NOT ON THE FURTHEST RIGHT
        else {
          // MOVE DOWN
          if (downOneAvail) {
            console.log("we're moving down");
            return move(cX, cY + tileSize)
          }
          // MOVE LEFT
          else if (leftOneAvail) {
            console.log("we're moving left");
            return move(cX - tileSize, cY)
          }
          // MOVE UP
          else if (upOneAvail) {
            console.log("we're moving up");
            return move(cX, cY - tileSize)
          }
          // TURN AROUND AND GO BACK RIGHT
          else {
            console.log("we gotta move back right");
            return move(cX + tileSize, cY)
          }
        }
      } 
      // MOVED RIGHT
      else if (movedRight) {
        console.log("it moved right!");
        // WE ARE ON THE FARTHEST RIGHT (WE CANNOT MOVE RIGHT)
        if(cX == 0){
          // MOVE UP
          if (upOneAvail) {
            console.log("we're moving up");
            return move(cX, cY - tileSize);
          } 
          // MOVE RIGHT
          else if (rightOneAvail) {
            console.log("we're moving right");
            return move(cX + tileSize, cY);
          } 
          // MOVE DOWN
          else if (downOneAvail) {
            console.log("we're moving down");
            return move(cX, cY + tileSize);
          }
          // TURN AROUND AND MOVE BACK LEFT
          else {
            console.log("we gotta go back left");
            return move(cX - tileSize, cY);
          }
        }
        // WE ARE NOT ON THE FARTHEST RIGHT (WE CAN MOVE RIGHT), BUT WE CHECK TO SEE IF WE CAN MOVE DOWN FIRST TO AVOID GETTING STUCK IN A LOOP
        else {
          // MOVE UP
          if (upOneAvail) {
            console.log("we're moving down");
            return move(cX, cY - tileSize)
          }
          // MOVE RIGHT
          else if (rightOneAvail) {
            console.log("we're moving right");
            return move(cX + tileSize, cY)
          }
          // GO BACK DOWN
          else if (downOneAvail) {
            console.log("we gotta move back down");
            return move(cX, cY + tileSize)
          }
          // TURN AROUND AND MOVE LEFT
          else {
            console.log("we're moving left");
            return move(cX - tileSize, cY)
          }
        }
        
      }
    } 
  }
  if (direction == 2) {
    //check to see if we made it to the end of the column and start a different direction if so
    if (cY + tileSize > yMax) return move(cX, cY, 3);

    // if we have moved at least one square down since the last time we moved left,
    // then check to see if we can move right and do it if we can or
    // if we can move right and we moved right last time do it again
    if (
      rightOneAvail &&
      ((cX != xMax && sameX && movedDown && pX != cX + tileSize) || movedRight)
    )
      return move(cX + tileSize, cY);

    // if we just moved right check to see if we can move up,
    // if so move up or if we just moved up do it again if we can
    if (upOneAvail && (movedRight || (movedDown && sameX)))
      return move(cX, cY - tileSize);

    // move down if we can
    if (downOneAvail) return move(cX, cY + tileSize);

    // move left if we can
    if (leftOneAvail) return move(cX - tileSize, cY);

    // if(rightOneAvail)return move(cX + tileSize, cY);
    // if none of the other scenarios hit then we need to backtrack until
    // we find a good tile to restart the same direction from
    return back([cX, cY], 3);
  }

  //check to see if we made it to the end of the column and start a different direction if so
  if (cX - tileSize < 0) return move(cX, cY, 0);

  // if we have moved at least one square left since the last time we moved up,
  // then check to see if we can move down and do it if we can or
  // if we can move down and we moved down last time do it again
  if (
    downOneAvail &&
    ((cY != yMax && sameY && movedLeft && pY != cY + tileSize) || movedUp)
  )
    return move(cX, cY + tileSize);

  // if we just moved down check to see if we can move right
  // and do it or if we just moved right do it again if we can
  if (rightOneAvail && (movedUp || (movedRight && sameY)))
    return move(cX + tileSize, cY);

  // move left if we can
  if (leftOneAvail) return move(cX - tileSize, cY);

  // move up if we can
  if (upOneAvail) return move(cX, cY - tileSize);

  // if(downOneAvail)return move(cX, cY + tileSize);
  // if none of the other scenarios hit then we need to backtrack until
  // we find a good tile to restart the same direction from
  return back([cX, cY], 3);
};