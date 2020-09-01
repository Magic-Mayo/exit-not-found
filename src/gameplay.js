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
    _healthpointsCurrent.innerHTML = player.hp
    _healthpointsMax.innerHTML = player.hp
    _playerLvl.innerHTML = player.lvl
    _playerAttackStrength.innerHTML = player.attackStrength
    _playerAttackSpeed.innerHTML = player.speed
    _playerDefense.innerHTML = player.def
    _playerAgility.innerHTML = player.agility
    _playerFOV.innerHTML = player.fov
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