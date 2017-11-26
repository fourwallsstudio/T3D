const _ = require('lodash');
const assert = require('assert');
const { aiGameMove, getBestMove, calcWeight } = require('../frontend/util/ai_util');
const Shape = require('./testing_shape');
const Game = require('./testing_game');

const weightOptions = {
  calcCompleteRows: true,
  calcConnections: false,
  calcGaps: true,
  calcHeight: true,
  accountForGapsOnCompleteRows: false,
  values: {
    row: 1000,
    connection: 100,
    gap: 1000,
    height: 1,
    heightExp: 4,
  }
}


describe('aiMove', function() {
  this.timeout(10000);

  xit ('picks shapes randomly', function() {
    const newGame = new Game();
    newGame.nextShapeRandom = true;
    const freq = {};
    _.forEach(_.range(0, 7, 1), n => freq[n] = 1);

    _.forEach(_.range(0, 1000000, 1), n => {
      newGame.createNextShape();
      freq[newGame.nextShapeIndex] += 1;
    });

    console.log('freq: ', freq);
  })

  xit ('logs game score', function() {
    const newGame = new Game();
    newGame.allCubes = allCubes();
    newGame.stillShapes = stillShapes();
    newGame.weights = weightOptions;
    newGame.nextShapeRandom = false;
    newGame.setUp()

    while(!newGame.over()) {
      newGame.play();
    }

    console.log(
      'score: ', newGame.score
    );
  })

  it ('gives correct gap weight', function() {
    const gapGame = new Game();
    const { stills, cubes } = genGapBoard();
    gapGame.allCubes = cubes;
    gapGame.stillShapes = stills;
    gapGame.weights = weightOptions;
    gapGame.nextShapeRandom = false;
    gapGame.nextShapeIndex = 1;
    gapGame.setUp()
    const move = aiGameMove(gapGame)

    console.log('move: ', move);
  })

  xit ('gives best positions for scenario A', function() {
    const gapGame = new Game();
    gapGame.allCubes = allCubesA();
    gapGame.stillShapes = stillShapesA();
    gapGame.weights = weightOptions;
    gapGame.nextShapeRandom = false;
    expected = [[1,6], [0,-1], [3,-1], [0,-1], [1,0], [0, 0], [1,1]]

    _.forEach(_.range(0,7,1), (idx) => {
      gapGame.nextShapeIndex = idx;
      gapGame.setUp()
      const move = aiGameMove(gapGame);
      // console.log('idx', idx, 'move: ', move)
      assert.equal(expected[idx][0], move.rotations);
      assert.equal(expected[idx][1], move.positionX);
    })
  })

  xit ('gives best positions for scenario B', function() {
    const gapGame = new Game();
    gapGame.allCubes = allCubesB();
    gapGame.stillShapes = stillShapesB();
    gapGame.weights = weightOptions;
    gapGame.nextShapeRandom = false;
    expected = [[1,6], [3,-3], [3,4], [0,4], [1,4], [3, -2], [1,-2]]

    _.forEach(_.range(0,7,1), (idx) => {
      gapGame.nextShapeIndex = idx;
      gapGame.setUp()
      const move = aiGameMove(gapGame);
      // console.log('idx', idx, 'move: ', move)
      assert.equal(expected[idx][0], move.rotations);
      assert.equal(expected[idx][1], move.positionX);
    })
  })
})


/*
----------------~~~~~~~~~~~~~~~~~~~~~~~~~~~~---------------------|
*/


const genGapBoard = () => {
  const stills = stillShapes();
  const cubes = allCubes();

  for(let i = -5; i < 7; i++) {
    if (i === 2) continue;
    for(let j = 0; j < 4; j++) {
      stills[i].push(j);
      cubes[j].push(i);
    }
  }

  return { stills, cubes }
}



const allCubes = () => ({
  '0': [], '1': [], '2': [], '3': [],
  '4': [], '5': [], '6': [], '7': [],
  '8': [], '9': [], '10': [], '11': [],
  '12': [], '13': [], '14': [], '15': [],
  '16': [], '17': [], '18': [], '19': [],
  '20': [], '21': [], '22': [], '23': [],
  '24': [], '25': [], '26': [], '27': [],
});

const stillShapes = () => ({
  '-5': [-1],
  '-4': [-1],
  '-3': [-1],
  '-2': [-1],
  '-1': [-1],
  '0': [-1],
  '1': [-1],
  '2': [-1],
  '3': [-1],
  '4': [-1],
  '5': [-1],
  '6': [-1]
});


const allCubesA = () => ({
  '0': ['c', 'c', 'c', 'c', 'c', 'c', 'c', 'c', 'c', 'c', 'c'],
  '1': ['c', 'c', 'c', 'c', 'c', 'c', 'c', 'c', 'c', 'c', 'c'],
  '2': ['c', 'c', 'c', 'c', 'c', 'c', 'c', 'c', 'c', 'c'],
  '3': ['c', 'c', 'c', 'c', 'c'],
  '4': ['c', 'c'], '5': ['c', 'c'],
  '6': [], '7': [],
  '8': [], '9': [], '10': [], '11': [],
  '12': [], '13': [], '14': [], '15': [],
  '16': [], '17': [], '18': [], '19': [],
  '20': [], '21': [], '22': [], '23': [],
  '24': [], '25': [], '26': [], '27': [],
});

const stillShapesA = () => ({
  '-5': [-1, 0, 1],
  '-4': [-1, 0, 1, 2, 3, 4, 5],
  '-3': [-1, 0, 1, 2, 3, 4, 5],
  '-2': [-1, 0, 1, 2, 3],
  '-1': [-1, 0, 1 ,2],
  '0': [-1, 0, 1, 2],
  '1': [-1, 0, 1],
  '2': [-1, 0, 1, 2],
  '3': [-1, 0, 1, 2, 3],
  '4': [-1, 0, 1, 2],
  '5': [-1, 0, 1, 2, 3],
  '6': [-1]
});


const allCubesB = () => ({
  '0': ['c', 'c', 'c', 'c', 'c', 'c', 'c', 'c', 'c', 'c', 'c'],
  '1': ['c', 'c', 'c', 'c', 'c', 'c', 'c', 'c', 'c', 'c'],
  '2': ['c', 'c', 'c', 'c', 'c', 'c', 'c', 'c', 'c', 'c', 'c'],
  '3': ['c', 'c', 'c', 'c', 'c', 'c', 'c', 'c', 'c', 'c', 'c'],
  '4': ['c', 'c', 'c', 'c', 'c', 'c', 'c', 'c', 'c', 'c'],
  '5': ['c', 'c', 'c', 'c', 'c', 'c', 'c', 'c', 'c'],
  '6': ['c', 'c', 'c', 'c', 'c', 'c', 'c', 'c', 'c'],
  '7': ['c', 'c', 'c', 'c', 'c', 'c'],
  '8': ['c', 'c'], '9': ['c'], '10': [], '11': [],
  '12': [], '13': [], '14': [], '15': [],
  '16': [], '17': [], '18': [], '19': [],
  '20': [], '21': [], '22': [], '23': [],
  '24': [], '25': [], '26': [], '27': [],
});

//[8,8,5,7,8,9,10,8,4,7,7,0]
const stillShapesB = () => ({
  '-5': [-1, 0, 1, 2, 3, 4, 5, 6, 7],
  '-4': [-1, 0, 1, 2, 3, 4, 5, 6, 7],
  '-3': [-1, 0, 1, 2, 3, 4],
  '-2': [-1, 0, 1, 2, 3, 4, 5, 6],
  '-1': [-1, 0, 1, 2, 3, 4, 5, 6, 7],
  '0': [-1, 0, 2, 3, 4, 5, 6, 7, 8],
  '1': [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  '2': [-1, 0, 1, 2, 3, 4, 5, 6, 7],
  '3': [-1, 0, 1, 2, 3],
  '4': [-1, 0, 1, 2, 3, 4, 5, 6],
  '5': [-1, 0, 1, 2, 3, 4, 5, 6],
  '6': [-1]
});
