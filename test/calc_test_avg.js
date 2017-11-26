const _ = require('lodash');
const fs = require('fs');

fs.readFile('avg_score.csv', { encoding: 'utf8'}, (err, data) => {
  if (err) console.log('err: ', err);

  const cleanData = _.filter(data.split(`\n`), d => d !== undefined );
  _.forEach(cleanData, d => console.log('data: ', JSON.parse(d)) );
})
