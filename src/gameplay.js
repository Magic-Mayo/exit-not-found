const generateEnemies = level => {
    count = level % 2 === 0 ? Math.pow(level,2) / 4 : count
    lvl++;
  
    console.log(`We are generating ${count} enemies`);
  }