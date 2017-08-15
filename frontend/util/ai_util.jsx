var THREE = require('three');
// import Shape from '../components/three/elements/shapes';
import * as Game from './game_util';
import { values } from 'lodash';

let aiStillShapes;

const getAiStillShapes = () => {

  aiStillShapes = []

  for (let i = 0; i < 12; i += 1) {
    aiStillShapes.push(Game.stillShapes[(i - 5).toString()])
  }
}

const aiRows = {}

for (var y in Game.allCubes) {
  aiRows[y] = [ ...Game.allCubes[y] ]
}


// GENERATE MOVE
export const generateMove = (deltas, rotateDeltas) => {

  let highestScore = 0
  let bestRotations = 0
  let moveToIndex = null
  let newDeltas, layer, rotations;

  getAiStillShapes()

  newDeltas = deltas.map( delta => {
    return [delta[0], delta[1]]
  })

  for (rotations = 0; rotations < rotateDeltas.length; rotations += 1) {

    if (rotations > 0) {
      newDeltas = getDeltas(rotations, deltas, rotateDeltas)
    }

    layer = bottomSurfaceOfPiece(newDeltas)

    for (let start = 0; start + layer.length - 1 < aiStillShapes.length; start += 1) {

        let deltasAtStart = moveDeltasToStart(start, newDeltas)

        let currentScore = getScore(start, layer, deltasAtStart)

        if (currentScore > highestScore) {

          highestScore = currentScore
          bestRotations = rotations
          moveToIndex = start -5
        }
    }
  }

  // console.log("Game stillShapes", Game.stillShapes)
  // console.log("aiStillShapes", aiStillShapes)
  // console.log("moveToIndex", moveToIndex, "bestRotations", bestRotations, "highestScore", highestScore)

  if (bestRotations > 2) { debugger }

  return [moveToIndex, bestRotations]
}


// GET SCORE
const getScore = (start, layer, newDeltas) => {

  let score = 0
  let fitDeltas = getFitDeltas(start, layer, newDeltas)

  score += numberOfCompleteRows(start, fitDeltas)
  score += getFitScore(start, layer, fitDeltas)

  return score
}


// GET FIT DELTAS

const getFitDeltas = (start, layer, deltas) => {

  let validHeight = 0
  let refOffset = 0
  let refIndex = 0

  for (let i = start; i < start + layer.length; i += 1) {

    let currentHeightRef = Math.max(...aiStillShapes[i]) + 1
    let offset = layer[i - start] * -1
    let valid = true

    for (let j = start; j < start + layer.length; j += 1) {
      if(j !== i) {
        let colHeight = currentHeightRef + layer[j - start] + offset

        if (colHeight <= Math.max(...aiStillShapes[j])) valid = false;
      }
    }

    if (valid) {
      validHeight = currentHeightRef
      refOffset = offset
      refIndex = i
      break;
    }
  }

  let newDeltas = deltas.map( delta => [delta[0], delta[1]] )

  newDeltas.forEach( delta => {
    if (delta[1] === refIndex) {
      delta[1] += validHeight
    } else {
      delta[1] += validHeight + refOffset
    }
  })

  return newDeltas
}



// GET FIT SCORE
const getFitScore = (start, layer, fitDeltas) => {

  let totalGaps = 0
  let heightMax = 0

  let fitColumns = {}

  fitDeltas.forEach( delta => {

    if (fitColumns[delta[0]]) {

      if (delta[1] < fitColumns[delta[0]]) {
        fitColumns[delta[0]] = delta[1]
      }

    } else {

      fitColumns[delta[0]] = delta[1]
    }
  })

  for (let i = start; i < start + layer.length; i += 1) {

    let colHeight = fitColumns[i]
    let gaps = colHeight - (aiStillShapes[i].length - 1)

    if (colHeight > heightMax) heightMax = colHeight;
    totalGaps += gaps
  }

  let heightScore = (24 - (heightMax + 2)) * 2

  return heightScore - totalGaps + layer.length
}


// FIND FURTHEST LEFT CUBE
export const findFurthestLeft = newShape => {
  let mostLeftX = 0
  let mostLeftIndex = 0

  newShape.forEach( (cube, i) => {
    if (cube.position.x < mostLeftX) {
      mostLeftX = cube.position.x
      mostLeftIndex = i
    }
  })

  return mostLeftIndex
}



const getDeltas = (rotations, deltas, rotateDeltas) => {

  let currentDeltas = deltas.map( delta => {
    return [delta[0], delta[1]]
  })

  for (let i = 0; i < rotations; i += 1) {

    for (let j = 0; j < rotateDeltas[i].length; j += 1) {

      currentDeltas[j][0] += rotateDeltas[i][j][0]
      currentDeltas[j][1] += rotateDeltas[i][j][1]
    }
  }

  return currentDeltas
}


const moveDeltasToStart = (start, deltas) => {

  let newDeltas = deltas.map( delta => [delta[0], delta[1]] )

  let furthestLeft = 0
  let furthestDown = 0

  newDeltas.forEach( delta => {
    if (delta[0] < furthestLeft) { furthestLeft = delta[0] }
    if (delta[1] < furthestDown) { furthestDown = delta[1] }
  })

  newDeltas.forEach( delta => {
    delta[0] = delta[0] + Math.abs(furthestLeft) + start
    delta[1] = delta[1] + Math.abs(furthestDown)
  })

  return newDeltas
}


// MATCH PIECE SHAPE TO STILL SHAPES

const bottomSurfaceOfPiece = deltas => {

  let layer = []
  let seenX = {}

  for (let i = 0; i < deltas.length; i += 1) {

    if (!seenX[deltas[i][0]]) {

      seenX[deltas[i][0]] = true
      layer.push(deltas[i][1])

    } else if (deltas[i][1] < layer[layer.length -1]) {

      layer[layer.length -1] = deltas[i][1]
    }
  }


  if (layer.length === 1) layer = [0];


  if (layer.some( el => el === -1 ) ) {

    layer = layer.map( el => el + 1 )

  } else if (layer.some( el => el === -2 ) ) {

    layer = layer.map( el => el + 2 )
  }

  return layer
}




// FIND MOVE THAT COMPLETES MOST ROWS

const numberOfCompleteRows = (start, newDeltas) => {

  let potentialMove = {}

  Object.keys(Game.allCubes).forEach( col => {
    potentialMove[col] = [ ...Game.allCubes[col] ]
  })

  newDeltas.forEach( delta => potentialMove[delta[1]].push(delta[0]) )

  let rows = 0

  Object.keys(potentialMove).forEach( row => {
    if ( potentialMove[row].length === 12 ) {
      rows += 1
    }
  })

  return rows * 100
}
