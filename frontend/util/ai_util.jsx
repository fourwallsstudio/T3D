import * as _ from 'lodash';

const weightValues = {
  row: 1100,
  connection: 250,
  space: -40,
  height: -10,
}

export const aiGameMove = (game) => {
  let skyline = getSkyline(game.stillShapes);
  let currentMaxWeight;
  let rotations;
  let positionX;

  game.currentShape.aiRotateDeltas.forEach((deltas, rotation) => {
    const len = 12 - deltas.length + 1;
    for (let i = 0; i < len; i++) {
      const posY = calcPositionY(deltas, i, skyline);
      const weight = calcWeight(posY, i, rotation, skyline, game.currentShape, game.allCubes);

      if (!currentMaxWeight || weight > currentMaxWeight) {
        currentMaxWeight = weight;
        rotations = rotation;
        positionX = i;
      }
    }
  })

  return {
    rotations,
    positionX: positionX - 5,
  };
}

const getSkyline = (stillShapes) => {
  const skyline = [];
  for(let i = -5; i < 7; i++) {
    skyline.push(Math.max(...stillShapes[i]))
  }
  return skyline;
}

const calcPositionY = (deltas, idx, skyline) => {
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

const validMove = (posY, skyline, idx) => {
  for (let i = 0; i < posY.length; i++) {
    if (posY[i] <= skyline[idx + i]) return false;
  }
  return true;
}

const calcWeight = (posY, idx, rotation, skyline, shape, cubes) => {
  let weight = 0;

  weight += surfaceWeight(posY, idx, skyline);
  const cubePositions = getCubePositions(posY, idx, rotation, shape);
  weight += completeRowsWeight(cubePositions, cubes);
  weight += heightWeight(cubePositions);

  return weight;
}

const surfaceWeight = (posY, idx, skyline) => {
  let weight = 0;
  posY.forEach((p, i) => {
    const diff = p - skyline[idx + i];
    if (diff === 1) {
      weight += weightValues.connection;
    } else {
      weight -= weightValues.space * (diff - 1);
    }
  })
  return weight;
}

//TODO: refactor !!!
const getCubePositions = (posY, posX, rot, shape) => {
  const cubePos = [];
  shape.cubes.forEach(c => cubePos.push([c.position.x - 4, c.position.y])); // offset so all x positions less than 0
  for (let i = 0; i < rot; i++) {
    cubePos.forEach((pos, j) => {
      pos[0] += shape.rotateDeltas[i][j][0];
      pos[1] += shape.rotateDeltas[i][j][1];
    })
  }

  while (!inPositionX(cubePos, posX)) {
    cubePos.forEach(c => c[0] += 1)
  }

  const mostLeftIdx = getMostLeftIdx(cubePos);

  while (cubePos[mostLeftIdx][1] > posY[0]) {
    cubePos.forEach(c => c[1] -= 1)
  }

  return cubePos;
}

const inPositionX = (cubePos, posX) => _.every(cubePos, c => c[0] >= posX);

// left bottom idx
const getMostLeftIdx = (cubePos) => {
  let leftX = null;
  let bottomY = null;
  let idx = null;

  _.forEach(cubePos, (c, i) => {
    if (leftX === null || c[0] < leftX) {
      leftX = c[0];
      bottomY = c[1];
      idx = i;
    } else if (c[0] === leftX && c[1] < bottomY) {
      leftX = c[0];
      bottomY = c[1];
      idx = i;
    }
  })

  return idx;
}


const completeRowsWeight = (cubePositions, cubes) => {
  const freq = {};
  let rows = 0;

  _.forEach(cubePositions, c => {
    if (freq[c[1]]) {
      freq[c[1]] += 1;
    } else {
      freq[c[1]] = 1;
    }
  })

  _.forEach(freq, (val, key) => {
    if ((cubes[key].length + val) === 12 ) rows += 1;
  })

  return rows * weightValues.row;
}

const heightWeight = (cubePositions) => {
  let weight = 0;
  _.forEach(cubePositions, c => weight += ((c[1]**3) * weightValues.height));
  return weight;
}
