

const aiGame = (game) => {
  let skyline = [3, 3, 0, 2, 2, 2, 0, 1, 0, 4, 1, 3];
  let weights = [];
  game.currentShape.aiRotateDeltas.forEach(deltas => {
    const len = 12 - deltas.length + 1;
    for (let i = 0; i < len; i++) {
      const pos = calcPosition(deltas, i, skyline);
      weights.push(calcWeight(pos, i, skyline));
    }
  })
  console.log('weights', weights);
}

const getSkyline = (stillShapes) => {
  const skyline = [];
  for(let i = -5; i < 7; i++) {
    skyline.push(Math.max(...stillShapes[i]))
  }
  return skyline;
}

const calcPosition = (deltas, idx, skyline) => {
  let pos = [];
  let currentY = skyline[idx];
  deltas.forEach((d, i) => pos.push(currentY + d))

  while(!validMove(pos, skyline, idx)) {
    currentY += 1;
    pos = [];
    deltas.forEach((d, i) => pos.push(currentY + d))
  }

  return pos;
}

const validMove = (pos, skyline, idx) => {
  for (let i = 0; i < pos.length; i++) {
    if (pos[i] <= skyline[idx + i]) return false;
  }
  return true;
}

const calcWeight = (pos, idx, skyline) => {
  console.log('pos', pos, 'idx', idx);
  let weight = 0;
  pos.forEach((p, i) => {
    const diff = p - skyline[idx + i];
    if (diff === 1) {
      weight += 200;
    } else {
      weight -= 40 * (diff - 1)
    }
  })
  return weight;
}



export default aiGame;
