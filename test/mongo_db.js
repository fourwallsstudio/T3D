const _ = require('lodash');
const fs = require('fs');
const { aiGameMove, resultsData } = require('../frontend/util/ai_util');
const Shape = require('./testing_shape');
const Game = require('./testing_game');
const MongoClient = require('mongodb').MongoClient;

// const weightOptions = {
//   calcCompleteRows: true,
//   calcConnections: false,
//   calcGaps: true,
//   calcHeight: true,
//   calcShapeHeight: false,
//   accountForGapsOnCompleteRows: false,
//   values: {
//     row: 100,
//     connection: 100,
//     gap: 100,
//     height: 50,
//     heightExp: 1,
//     shapeHeightExp: 3,
//   }
// }

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

const playGame = () => {
  const newGame = new Game();
  newGame.allCubes = allCubes();
  newGame.stillShapes = stillShapes();
  newGame.nextShapeRandom = true;
  newGame.setUp()

  while(!newGame.over()) {
    newGame.play();
  }

  return {
    score: newGame.score,
    totalShapes: newGame.totalShapes,
    weightOptions: newGame.weightOptions,
    freqOfShapes: newGame.stats.freqOfShapes,
    completeRowsByShape: newGame.stats.completeRowsByShape,
    gapsByShape: newGame.stats.gapsByShape,
  }
}


var uri = "mongodb://fourwallsstudio:t3ddbpw@cluster0-shard-00-00-zmea4.mongodb.net:27017,cluster0-shard-00-01-zmea4.mongodb.net:27017,cluster0-shard-00-02-zmea4.mongodb.net:27017/t3d?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin";
MongoClient.connect(uri, function(err, db) {

  const tThreeDB = db.collection('ai_results');

  _.forEach(_.range(0, 10, 1), () => {
    const data = playGame();

    tThreeDB.insertOne(data, function(err, result) {
      if (err) {
        console.log('err: ', err)
      } else {
        console.log('success: ', result);
      }
    })
  })

  // const avgScore = tThreeDB.aggregate({ $match: { "weightOptions.accountForGapsOnCompleteRows": true, "weightOptions.values.heightExp": { $eq: 1 } }}, { $group: { _id: null, avg_score: { $avg : "$score"} }});
  // avgScore.each(function(err, doc) {
  //   console.log(doc.score);
  // })

  db.close();
});
