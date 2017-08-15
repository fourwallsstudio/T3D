'use scrict'
const Sequelize = require('sequelize')
const db = require('./db')

const HighScore = db.define('highScore', {
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      len: [3],
    }
  },
  score: {
    type: Sequelize.INTEGER,
    allowNull: false,
  }
})

module.exports = HighScore
