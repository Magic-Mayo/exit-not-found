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
  [xMax, yMax],
  counter = 0
) => {
  counter++;
  if(counter > 400) {
    console.log('over 400');
    return ;
  }
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

  // if (cX == sX && cY == sY) console.log(room);
  // console.log(`CURRENT  [${cX}, ${cY}], [${pX},${pY}],START [${sX}, ${sY}], EXIT: [${eX}, ${eY}], DIRECTION: ${direction}
  // WHAT IS AVAILABLE: [RIGHT: ${rightOneAvail}, DOWN: ${downOneAvail}, LEFT: ${leftOneAvail}, UP: ${upOneAvail}]
  // ------------------------------------------------`);
  const move = (x, y, dir = direction, xX = cX, yY = cY) =>
    setTimeout(
      () =>
        checker(room, [x, y], [xX, yY], [eX, eY], [sX, sY], dir, tileSize, [xMax,yMax], counter++)
      ,1
    );

    
  // const fromRight = () => {
  //   switch(direction){
  //     case 0: return move(
  //       upOneAvail ? cX : rightOneAvail ? cX + tileSize : downOneAvail ? cX : cX - tileSize,
  //       upOneAvail ? cY - tileSize : rightOneAvail ? cY : downOneAvail ? cY + tileSize : cX)
  //   }
  // }
  // checks first to see if exit coords are reached.  if so dungeon exit can be reached.  return true
  if (eX == cX && eY == cY) {
    console.log(counter);
    generatePlayer(
      [sX,sY],"white",room,tileSize, [eX,eY]
    )
    return true;
  }

  // next checks if we've at least made one move from the starting point
  // or if we're trapped in a single cell at the start.
  // if so and we are back to the starting point we've traveled all the way around the board
  // return  since we never found the exit and are back at the start
  if ((!upOneAvail && !rightOneAvail && !leftOneAvail && !downOneAvail))return ;

  //checks if moving up
  if (!direction) {

    // WE MADE IT TO TOP OF DUNGEON
    if (cY == 0) {
      if(movedLeft){
        if(downOneAvail){
          return move(cX, cY + tileSize)
        }
      }
      // WE ARE ON THE FAR LEFT OF THE DUNGEON
      if (cX == 0) {
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
        if (cX == 0) {
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
        if (cX == 0) {
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
    return 
  }
  if (direction == 1) {

    // WE MADE IT TO RIGHT OF THE DUNGEON
    if (cX == xMax) {
      // IF WE JUST MOVED UP CHECK LEFT AND MOVE THAT WAY IF WE CAN
      if(movedUp){
        console.log('it moved up');
        if(leftOneAvail){
          console.log("we're moving left");
          return move(cX - tileSize, cY)
        }
      }
      // WE ARE ON THE TOP OF THE DUNGEON
      if (cY == 0) {
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
      else return move(cX, cY + tileSize);
    }
  
    // MOVED UP OR DOWN
    else if (sameX) {
      // MOVED UP
      if (movedUp) {
        console.log("it moved up!");
  
        // WE ARE ON THE FARTHEST UP (WE CANNOT MOVE UP)
        if (cY == yMax) {
          // MOVE LEFT
          if (leftOneAvail) {
            console.log("we're moving right");
            return move(cX - tileSize, cY)
          }
          // MOVE RIGHT
          else if (rightOneAvail) {
            console.log("we're moving right");
            return move(cX + tileSize, cY)
          }
          // TURN AROUND AND GO DOWN
          else {
            console.log("we gotta move back down");
            return move(cX + tileSize, cY)
          }
        } 
        // WE ARE NOT ON THE FURTHEST UP (WE CAN MOVE UP)
        else {
          // MOVE LEFT
          if (leftOneAvail) {
            console.log("we're moving left");
            return move(cX - tileSize, cY)
          }
          // TURN AROUND AND GO BACK DOWN
          else if(upOneAvail) {
            console.log("we gotta move back up");
            return move(cX, cY - tileSize)
          }
          // MOVE RIGHT
          else if(rightOneAvail) {
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
        // TURN AROUND AND GO BACK LEFT
        else if(leftOneAvail){
          console.log("we gotta go back left")
          return move(cX - tileSize, cY)
        }
        else {
          console.log("we're going up");
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
        // WE ARE NOT ON THE FARTHEST RIGHT (WE CAN MOVE RIGHT), BUT WE CHECK TO SEE IF WE CAN MOVE UP FIRST TO AVOID GETTING STUCK IN A LOOP
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
    return 
  }
  if (direction == 2) {

    // WE MADE IT TO BOTTOM OF DUNGEON
    if (cY == yMax) {
      if(movedRight){
        if(upOneAvail){
          return move(cX, cY - tileSize)
        }
      }
      // WE ARE ON THE FAR RIGHT OF THE DUNGEON
      if (cX == xMax) {
        // CHANGE DIRECTION TO "LEFT"
        return move(cX, cY, 3);
      }
      // THERE IS AN AVAILABLE BLOCK TO THE RIGHT
      else if (rightOneAvail){
        console.log("we're moving right");
        return move(cX + tileSize, cY)
      }
      // else if(upOneAvail){
      //   console.log("we're moving up");
      //   return move(cX, cY - tileSize);
      // }
      // THERE IS NO AVAILABLE BLOCK TO THE RIGHT, SO CHANGE DIRECTION TO "LEFT"
      else return move(cX,cY,3)
    }

    // PREVIOUS COORDINATE & CURRENT COORDINATE ARE THE SAME, THEREFORE THIS DIRECTION CHECK HAS JUST STARTED
    if (sameX && sameY) {
      console.log("THIS IS THE BEGINNING");
      // THERE IS AN AVAILABLE BLOCK DOWN SO MOVE DOWN
      if (downOneAvail) return move(cX, cY + tileSize);

      // THERE IS NO AVAILABLE BLOCK DOWN, SO MOVE LEFT
      else return move(cX  - tileSize, cY);
    }

    // MOVED UP OR DOWN
    else if (sameX) {
      // MOVED UP
      if (movedUp) {
        console.log("it moved up!");

        // // WE ARE ON THE FARTHEST RIGHT (WE CANNOT MOVE RIGHT)
        // if (cX == xMax) {
        //   // MOVE UP
        //   if(upOneAvail) {
        //     console.log("we gotta move back up");
        //     return move(cX, cY - tileSize)
        //   }
        //   // MOVE LEFT
        //   else if (leftOneAvail) {
        //     console.log("we're moving left");
        //     return move(cX - tileSize, cY)
        //   }
        //   // MOVE DOWN
        //   else {
        //     console.log("we're moving down");
        //     return move(cX, cY + tileSize)
        //   }
        // } 
        // WE ARE NOT ON THE FURTHEST RIGHT (WE CAN MOVE RIGHT)
        // else {
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
      // }
      //MOVED DOWN
      else if (movedDown) {
        console.log("It moved down!");

        // WE ARE ON THE FARTHEST RIGHT (WE CANNOT MOVE RIGHT)
        if (cX == xMax) {
          // MOVE DOWN
          if(downOneAvail) {
            console.log("we're moving down")
            return move(cX,cY + tileSize)
          }
          // MOVE LEFT
          else if (leftOneAvail) {
            console.log("we're moving left")
            return move(cX - tileSize, cY)
          }
          // TURN AROUND AND GO BACK UP
          else {
            console.log("we gotta go back up")
            return move(cX, cY - tileSize)
          }
        }
        // WE ARE NOT ON THE FARTHEST RIGHT (WE CAN MOVE RIGHT), BUT WE CHECK TO SEE IF WE CAN MOVE RIGHT FIRST TO AVOID GETTING STUCK IN A LOOP
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
      // MOVED RIGHT
      else if (movedRight) {
        // WE ARE NOW ON THE FURTHEST RIGHT AND CANNOT MOVE RIGHT AGAIN
        if (cX == 0) {
          // MOVE UP
          if(upOneAvail) {
            console.log("we're moving up");
            return move(cX, cY - tileSize)
          }
          // TURN AROUND AND GO BACK RIGHT
          else if(rightOneAvail){
            console.log("we gotta move back right");
            return move(cX + tileSize, cY)
          }
          // MOVE DOWN
          else {
            console.log("we're moving down");
            return move(cX, cY + tileSize)
          }
        }
        // WE ARE NOT ON THE FURTHEST RIGHT
        else {
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
    }
    return 
  }
  if (direction == 3) {

    // WE MADE IT TO LEFT OF THE DUNGEON
    if (cX - tileSize < 0) {
      // WE ARE ON THE BOTTOM OF THE DUNGEON
      if(movedDown){
        if(rightOneAvail){
          return move(cX + tileSize, cY)
        }
      }
      if (cY == yMax) {
        // CHANGE DIRECTION TO "UP"
        return move(cX, cY, 0);
      }
      // THERE IS AN AVAILABLE BLOCK TO DOWN
      else if (downOneAvail){
        console.log("we're moving down");
        return move(cX, cY + tileSize)
      }
      // CHANGE DIRECTION TO "UP"
      else return move(cX,cY,0)
    }
  
    // PREVIOUS COORDINATE & CURRENT COORDINATE ARE THE SAME, THEREFORE THIS DIRECTION CHECK HAS JUST STARTED
    if (sameX && sameY) {
      console.log("THIS IS THE BEGINNING");
      // THERE IS AN AVAILABLE BLOCK TO THE LEFT SO MOVE LEFT
      if (leftOneAvail) return move(cX - tileSize, cY);
  
      // THERE IS NO AVAILABLE BLOCK TO THE LEFT, SO MOVE UP
      else return move(cX, cY - tileSize);
    }
  
    // MOVED UP OR DOWN
    else if (sameX) {
      // MOVED UP
      if (movedUp) {
        console.log("it moved up!");
        // MOVE LEFT
        if (leftOneAvail) {
          console.log("we're moving left");
          return move(cX - tileSize, cY)
        }
        // TURN AROUND AND GO BACK DOWN
        else if(upOneAvail) {
          console.log("we gotta move back up");
          return move(cX, cY - tileSize)
        }
        // MOVE RIGHT
        else if(rightOneAvail) {
            console.log("we're moving right");
            return move(cX + tileSize, cY)
        }
        // MOVE DOWN
        else {
          console.log("we're moving down");
          return move(cX, cY + tileSize)
        }
      }
      //MOVED DOWN
      else if (movedDown) {
        console.log("It moved down!");
  
        // WE ARE ON THE FARTHEST LEFT (WE CANNOT MOVE LEFT)
        if (cX == 0) {
          // MOVE DOWN AGAIN
          if (downOneAvail) {
            console.log("we're moving down");
            return move(cX, cY + tileSize)
          }
          // MOVE RIGHT
          else if (rightOneAvail) {
            console.log("we're moving right");
            return move(cX + tileSize, cY)
          }
          // TURN AROUND AND GO UP
          else {
            console.log("we gotta move back up");
            return move(cX, cY + tileSize)
          }
        } 

        else {
          // MOVE RIGHT
          if (rightOneAvail) {
            console.log("we're moving right")
            return move(cX + tileSize, cY)
          }
          // MOVE DOWN
          else if (downOneAvail) {
            console.log("we're moving down")
            return move(cX, cY + tileSize)
          }
          // TURN AROUND AND GO BACK LEFT
          else if(leftOneAvail){
            console.log("we're moving left")
            return move(cX - tileSize, cY)
          }
          else {
            console.log("we're moving up");
            return move(cX, cY - tileSize);
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
        if (cX == 0) {
          // MOVE DOWN
          if (downOneAvail) {
            console.log("we're moving down");
            return move(cX, cY + tileSize)
          }
          // MOVE RIGHT
          else if (rightOneAvail) {
            console.log("we're moving left");
            return move(cX - tileSize, cY)
          }
          // TURN AROUND AND GO BACK UP
          else {
            console.log("we gotta move back up");
            return move(cX, cY - tileSize)
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
    return 
  }
};