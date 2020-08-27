_btn.addEventListener('click', e => {
    e.preventDefault();

    _container.classList.remove('invisible')
    _landing.classList.add('invisible')
    _btn.classList.add('invisible')

    const player = new Character("slimey",0 )
    console.log(player);

    _healthpoints.innerHTML = player.hp
    _lvl.innerHTML = player.lvl
    _attack.innerHTML = player.attack
    _defense.innerHTML = player.def
})

// STATS
// 1. healthpoints
// 2. exp points
// 3. dungeon lvl
// 4. total steps walked