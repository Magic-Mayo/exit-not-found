////////// TO DO ///////////
// uncomment listener
////////// TO DO ///////////
// _btn.addEventListener('click', e => {
//     goFullScreen();

//     _container.classList.remove('invisible')
//     _landing.classList.add('invisible')
//     _btn.classList.add('invisible')

//     console.log(player);
    
    
    player = new Character("slimey",0 )
    _healthpoints.innerHTML = player.hp
    _lvl.innerHTML = player.lvl
    _attack.innerHTML = player.attackStrength
    _defense.innerHTML = player.def
    _agility.innerHTML = player.agility
    _speed.innerHTML = player.speed
    buildDungeon(
      CANVAS_HEIGHT,
      CANVAS_WIDTH,
      COLUMNS,
      ROWS,
      TILE_HEIGHT,
      TILE_WIDTH,
      [0, 160]
      );
      
      
  // })
      
      ////////// TO DO ///////////
      // uncomment listener
      ////////// TO DO ///////////
    
// STATS
// 1. healthpoints
// 2. exp points
// 3. dungeon lvl
// 4. total steps walked