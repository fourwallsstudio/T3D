'use strict'
const express = require('express')
const app = express()
const db = require('./db')
const HighScore = require('./high_score_model')
const bodyParser = require('body-parser')

const router = express.Router()


router.route('/')
  .get((req, res) => {
    HighScore.findAll({ order: [['score', 'DESC']], limit: 10 })
      .then( highScores => res.json(highScores),
        err => res.json(err.stack) )
  })
  .post((req, res) => {
    HighScore.create(req.body)
      .then( highScore => res.json(highScore),
        err => res.json(err.stack) )
  })

router.route('/:id')
  .delete((req, res) => {
    HighScore.findById(req.params.id)
      .then( highScores => res.json(highScores),
        err => res.json(err.stack) )
  })



// body parsing
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.use('/highscores', router)
app.use(express.static('public'))


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public'))
})


const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log('example app')
  db.sync({force: true})
    .then( () => console.log('db up') )
})
