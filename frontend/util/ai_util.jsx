export const aiGameMove = (game) => {
  let skyline = getSkyline(game.stillShapes);
  let currentMaxWeight;
  let rotations;
  let xPosition;

  game.currentShape.aiRotateDeltas.forEach((deltas, rotation) => {
    const len = 12 - deltas.length + 1;
    for (let i = 0; i < len; i++) {
      const pos = calcPosition(deltas, i, skyline);
      const weight = calcWeight(pos, i, skyline)

      if (!currentMaxWeight || weight > currentMaxWeight) {
        currentMaxWeight = weight;
        rotations = rotation;
        xPosition = i;
      }
    }
  })

  return {
    rotations,
    xPosition: xPosition - 5,
  };
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
