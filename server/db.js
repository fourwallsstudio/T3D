'use strict'
const Sequelize = require('sequelize')

let db;

if (process.env.DATABASE_URL) {
  db = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    logging: false
  })
} else {
  db = new Sequelize('postgres://localhost:5432/T3D')
}

module.exports = db
