const _ = require('lodash');
const fs = require('fs');
const { aiGameMove, resultsData } = require('../frontend/util/ai_util');
const Shape = require('./testing_shape');
const Game = require('./testing_game');

const weightOptions = {
  calcCompleteRows: true,
  calcConnections: false,
  calcGaps: true,
  calcHeight: true,
  calcShapeHeight: false,
  accountForGapsOnCompleteRows: false,
  values: {
    row: 100,
    connection: 100,
    gap: 100,
    height: 50,
    heightExp: 1,
    shapeHeightExp: 3,
  }
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

// const fileName = 'avg_score.csv';
//
// fs.open(fileName, 'a', (err, fd) => {
//   if (err) {
//     if (err.code === 'EEXIST') {
//       console.error('avg_score.csv already exists');
//       return;
//     }
//
//     throw err;
//   }
//
//   _.forEach(_.range(0,10,1), () => playGame());
// });

// const header = [
//   `calcCompleteRows: ${weightOptions.calcCompleteRows}`,
//   `calcConnections: ${weightOptions.calcConnections}`,
//   `calcGaps: ${weightOptions.calcGaps}`,
//   `calcHeight: ${weightOptions.calcHeight}`,
//   `accountForGapsOnCompleteRows: ${weightOptions.accountForGapsOnCompleteRows}`,
//   'weights: ',
//   `row: ${weightOptions.values.row}`,
//   `connection: ${weightOptions.values.connection}`,
//   `gap: ${weightOptions.values.gap}`,
//   `height: ${weightOptions.values.height}`,
//   'scores: '
// ].join('\n')

// const setHeader = () => {
//   fs.appendFile(fileName, `${header}\n`, (err) => {
//     if (err) console.log('err: ', err);
//     console.log('The header was appended to file!');
//   });
// }

const playGame = () => {
  const newGame = new Game();
  newGame.allCubes = allCubes();
  newGame.stillShapes = stillShapes();
  newGame.weightOptions = weightOptions;
  newGame.nextShapeRandom = true;
  newGame.setUp()

  while(!newGame.over()) {
    newGame.play();
  }

  console.log('stats: ', newGame.stats);

  // const data = JSON.stringify(newGame.stats);
  //
  // fs.appendFile(fileName, `${data}\n`, (err) => {
  //   if (err) console.log('err: ', err);
  //   console.log('The "data to append" was appended to file!');
  // });
}

_.forEach(_.range(0,10,1), () => playGame());
