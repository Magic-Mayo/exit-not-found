const rooms = [];
const lvl = 1;
// const gameDiv = document.querySelector('.game');
const weapons = [['Brass knuckles', 'Fists', '', '', ''], [], ['Pistol', 'Rifle', 'Sniper']];
const enemies = [['Skeleton', 'Vampire'], [''], ['']]

const rng = (n = 4) => Math.floor(Math.random() * n);
const round = num => Math.round(num);

// playable character constructor
const Character = function(name, clas){
    // 0 = melee, 2 = ranged, 1 = magic
    this.class = clas;
    this.name = name;
    this.xp = 0;
    this.lvl = 1;
    this.hp =
        !clas ? 100 :
        clas == 1 ? 50 :
        75;

    this.attack =
        !clas ? rng() + 3 :
        clas == 1 ? rng(3) + 1 :
        rng() + 3;

    this.def =
        !clas ? rng() + 2 :
        clas == 1 ? rng(2) + 1 :
        rng(3) + 1;

    this.agility =
        !clas ? rng(2) + 1 :
        clas == 1 ? rng(2) + 1 :
        rng() + 1;

    this.speed =
        !clas ? rng() + 4 :
        clas == 1 ? rng(2) + 3 :
        rng() + 4;

    this.fov =
        !clas ? rng(2) + 2 :
        clas == 1 ? rng() + 4 :
        rng() + 4;

    this.lvlUp = function(){
        xp >= lvl * 404 ? this.addStat() : null;
    }
    this.weapons = weapons[this.class];
    this.addStat = function(){
        // add code to prompt user to enter a stat to increase
        switch(stat){
            case 0: return this.attack = round(this.attack * 1.2);
            case 1: return this.agility = round(this.agility * 1.1);
            case 2: return this.def = round(this.def * 1.15);
        }
    }
}

// enemy constructor
const Enemy = function(difficulty = 1){
    // 0 = melee, 2 = ranged, 1 = magic
    this.class = rng(3);
    this.hp = Math.floor(Math.sqrt(difficulty * rng(80))) + difficulty * rng(10);
    this.attack = ((difficulty + rng(10)) + 1) - (this.class * 2);
    this.def = difficulty * rng() + difficulty;
    this.fov = this.class * 2 + difficulty;
    this.speed = this.class == 0 ? 6 : this.class == 1 ? 3 : 4;
    this.xp = difficulty * 10 + rng(20);
    this.atkChar = function(char){
        const willHit = char.agility < rng(100);
        console.log(willHit)
        willHit ? char.hp - this.attack : 0;
        return willHit ? `${enemies[this.class][rng(3)]} hit for ${this.attack}!` : `${enemies[this.class][rng(3)]} missed!`;
    }
}

const Cell = function(enemy){
    this.tile = rng(100) <= 90 ? 1 : 0;
    this.danger = !this.tile ? rng() + 1 : 0;
    this.enemies = enemy == rng() ? new Enemy() : 0;
    this.treasure = rng(100) == 1 ? 1 : 0;
}

// Room building function
const RoomBuilder = function(directions, numCells = 10, difficulty = 1){
    this.paths = directions.map(() => rng());
    this.cells = [];
    this.addCells = function(){
        for(let i=0;i<numCells;i++){
                this.cells.push(
                    new Cell(rng(this.cells.filter(cell => cell.enemies).length < Math.sqrt(lvl * 2) ? 20 : -1))
                );
        }
    }
}

// put level together
const buildLevel = numRooms => {
    for(let i=0;i<numRooms;i++){
        const room = new RoomBuilder();
        room.addCells()
        rooms.push(room)
    }
}

buildLevel(5);
console.log(new Enemy(5).atkChar(new Character('mike', 1)));