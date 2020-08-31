_btn.addEventListener('click', e => {
    // goFullScreen();

    _container.classList.remove('invisible')
    _landing.classList.add('invisible')
    _btn.classList.add('invisible')

    player = new Character("slimey",0 )
    console.log(player);

    _healthpoints.innerHTML = player.hp
    _lvl.innerHTML = player.lvl
    _attack.innerHTML = player.attack
    _defense.innerHTML = player.def

    
    
  })
      buildDungeon(
          CANVAS_HEIGHT,
          CANVAS_WIDTH,
          COLUMNS,
          ROWS,
          TILE_HEIGHT,
          TILE_WIDTH,
          [0, 160]
      );

// STATS
// 1. healthpoints
// 2. exp points
// 3. dungeon lvl
// 4. total steps walked