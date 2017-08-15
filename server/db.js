'use strict'
const Sequelize = require('sequelize')
const databaseURI = 'postgres://localhost:5432/T3D'

const db = new Sequelize(databaseURI)

module.exports = db
