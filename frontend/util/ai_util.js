const _ = require('lodash');

// gap & height are negative weights
const weightOptions = {
  calcCompleteRows: true,
  calcConnections: false,
  calcGaps: true,
  calcHeight: true,
  calcShapeHeight: false,
  accountForGapsOnCompleteRows: true,
  values: {
    row: 100,
    connection: 100,
    gap: 100,
    height: 50,
    heightExp: 1,
    shapeHeightExp: 3,
  }
}

const aiGameMove = (game) => {
  const opts = game.weightOptions || weightOptions;
  const { rotations, positionX, weight, weights } = getBestMove(game, opts);

  // recordStatus(game, weights);
  // const stats = resultsData(game);

  // logger(game, rotations, positionX, weight, weights);
  return { rotations, positionX, weight, weights };
}

const getBestMove = (game, opts) => {
  const skyline = getSkyline(game.stillShapes);
  let currentMaxWeight = null;
  let rotations;
  let positionX;
  let maxWeights;

  _.forEach(game.currentShape.aiRotateDeltas, (deltas, rotation) => {
    const len = 12 - deltas.length + 1;
    for (let posX = 0; posX < len; posX++) {
      const yDeltas = calcYDeltas(deltas, posX, skyline); // lowest y positions for each x
      const weights = calcWeight(posX, yDeltas, rotation, skyline, game, opts);
      const weight = _.reduce(weights, (sum, v, k) => sum + v, 0);

      // console.log('weights: ', weights);
      if (currentMaxWeight === null || weight > currentMaxWeight) {
        currentMaxWeight = weight;
        rotations = rotation;
        positionX = posX;
        maxWeights = weights;
      }
    }
  })

  return {
    rotations,
    positionX: positionX - 5,
    weight: currentMaxWeight,
    weights: maxWeights
  };
}

const getSkyline = (stillShapes) => {
  const skyline = [];
  for(let i = -5; i < 7; i++) {
    skyline.push(Math.max(...stillShapes[i]))
  }
  return skyline;
}

// returns aiRotateDeltas at furthest down Y  out: [y, y']
const calcYDeltas = (deltas, posX, skyline) => {
  let yDeltas = [];
  let currentY = skyline[posX];
  _.forEach(deltas, (d, i) => yDeltas.push(currentY + d))

  while(!validMove(yDeltas, skyline, posX)) {
    currentY += 1;
    yDeltas = [];
    _.forEach(deltas, (d, i) => yDeltas.push(currentY + d))
  }

  return yDeltas;
}

const validMove = (yDeltas, skyline, posX) => {
  for (let i = 0; i < yDeltas.length; i++) {
    if (yDeltas[i] <= skyline[posX + i]) return false;
  }
  return true;
}

const calcWeight = (posX, yDeltas, rotation, skyline, game, opts) => {
  const { currentShape: shape, allCubes: cubes } = game;
  const cubePositions = getCubePositions(posX, yDeltas, rotation, shape);
  const lowestCube = getLowestCube(cubePositions);
  const { connections, gaps } = getConnectionsAndGaps(posX, yDeltas, skyline);
  const weights = {
    completeRowsWeight: 0,
    connectionsWeight: 0,
    gapsWeight: 0,
    heightWeight: 0,
    shapeHeight: 0,
  };

  if (opts.calcCompleteRows) {
    const completeRows = getCompleteRows(cubePositions, cubes);

    if (opts.accountForGapsOnCompleteRows && completeRows > 0 && gaps > 0) {
      const xCount = getXCount(cubePositions, lowestCube);
      const totalRows = completeRows - xCount === 0 ? completeRows : 0;

      weights['completeRowsWeight'] += totalRows * opts.values.row;
    } else {
      weights['completeRowsWeight'] += completeRows * opts.values.row;
    }
  }

  if (opts.calcConnections) {
    weights['connectionsWeight'] += connections * opts.values.connection;
  }

  if (opts.calcGaps) {
    weights['gapsWeight'] -= gaps * opts.values.gap;
  }

  if (opts.calcHeight) {
    weights['heightWeight'] -= Math.pow(lowestCube[1], opts.values.heightExp) * opts.values.height;
  }

  if (opts.calcShapeHeight) {
    const shapeHeight = getShapeHeight(cubePositions, lowestCube);
    weights['shapeHeight'] -= Math.pow(shapeHeight, opts.values.shapeHeightExp)
  }

  return weights;
}

//TODO: refactor !!!
const getCubePositions = (posX, yDeltas, rotation, shape) => {
  const cubePos = [];
  _.forEach(shape.cubes, c => cubePos.push([c.position.x - 4, c.position.y]));   // offset so all x positions less than 0
  for (let i = 0; i < rotation; i++) {
    _.forEach(cubePos, (pos, j) => {
      pos[0] += shape.rotateDeltas[i][j][0];
      pos[1] += shape.rotateDeltas[i][j][1];
    })
  }

  while (!inPositionX(cubePos, posX)) {
    _.forEach(cubePos, c => c[0] += 1)
  }

  const mostLeftIdx = getMostLeftIdx(cubePos);

  while (cubePos[mostLeftIdx][1] > yDeltas[0]) {
    _.forEach(cubePos, c => c[1] -= 1)
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

const getCompleteRows = (cubePositions, cubes) => {
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

  return rows;
}

const getConnectionsAndGaps = (posX, yDeltas, skyline) => {
  let connections = 0;
  let gaps = 0;

  _.forEach(yDeltas, (p, i) => {
    const diff = p - skyline[posX + i];
    if (diff === 1) {
      connections += 1;
    } else {
      gaps += (diff - 1);
    }
  })

  return { connections, gaps };
}

const getLowestCube = (cubePositions) => {
  let lowestCube = null;

  _.forEach(cubePositions, c => {
    if (lowestCube === null || c[1] < lowestCube[1]) {
      lowestCube = c;
    }
  });

  return lowestCube;
}

const getXCount = (cubePositions, lowestCube) => {
  return _.filter(cubePositions, c => c[0] === lowestCube[0]).length;
}

const getShapeHeight = (cubePositions, lowestCube) => {
  const lowestY = lowestCube[1];
  let heighestY = null;
  _.forEach(cubePositions, c => {
    if (heighestY === null || c[1] > heighestY) heighestY = c[1];
  })

  return heighestY - lowestY + 1;
}

const completeRowsByShape = {};
const freqOfShapes = {};
const gapsByShape = {};
_.forEach(_.range(0, 7, 1), i => {
  completeRowsByShape[i] = 0;
  freqOfShapes[i] = 0;
  gapsByShape[i] = 0;
});

const recordStatus = (game, weights) => {
  if (game.currentShape.idx !== undefined) {
    completeRowsByShape[game.currentShape.idx] += (weights.completeRowsWeight / weightOptions.values.row);
    freqOfShapes[game.currentShape.idx] += 1;
    gapsByShape[game.currentShape.idx] += (weights.gapsWeight / weightOptions.values.gap) * -1;
  }
}

const logger = (game, rotations, positionX, weight, weights) => {
  const totalCubesAdded = game.totalShapes * 4;
  const totalCubesRemoved = _.reduce(completeRowsByShape, (sum, v, k) => sum + v, 0) * 12;

  console.group('game stats ------------------------------')
    console.log('rot: ', rotations, 'x: ', positionX, 'weight: ', weight, 'weights: ', weights);
    console.log('completeRowsByShape: ', completeRowsByShape);
    console.log('freqOfShapes: ', freqOfShapes);
    console.log('gapsByShape: ', gapsByShape);
    console.log('totalCubesAdded; ', totalCubesAdded);
    console.log('totalCubesRemoved; ', totalCubesRemoved);
    console.log('removed cubes per shape added on avg: ', totalCubesRemoved / game.totalShapes);
    console.log('removed cubes per cube added on avg: ', totalCubesRemoved / totalCubesAdded);
  console.groupEnd()
}

const resultsData = (game) => {
  return {
    score: game.score,
    totalShapes: game.totalShapes,
    weightOptions,
    freqOfShapes,
    completeRowsByShape,
    gapsByShape,
  }
}

module.exports = {
  aiGameMove,
  getBestMove,
  calcWeight,
  resultsData,
}
