var THREE = require('three');
import * as Shape from './shapes_util';
import * as Game from './game_util';
import { values } from 'lodash';

let aiStillShapes;

const getAiStillShapes = () => {

  aiStillShapes = []

  for (let i = 0; i < 12; i++) {
    aiStillShapes.push(Game.stillShapes[(i - 5).toString()])
  }
}

const aiRows = Game.allCubes


// GENERATE MOVE
export const generateMove = (deltas, rotateDeltas) => {

  let newDeltas = deltas
  let rotations = 0

  if (flatnessMinReached()) {
    rotations = widestFlatSurface(deltas, rotateDeltas)
    newDeltas = getDeltas(rotations, deltas, rotateDeltas)
  }

  let layer = bottomSurfaceOfPiece(newDeltas)
  let moveToIndex = matchPieceToStillShapes(layer)

  return [moveToIndex, rotations]
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



// CONTINUOUS FLATNESS OF BOARD IS > 4 ?

const flatnessMinReached = () => {

    getAiStillShapes()

    let longestFlat = 0
    let currentY = 0
    let currentFlat = 0

    aiStillShapes.forEach( col => {
      let colMax = Math.max(...col)

      if (currentY !== colMax) {

        if (currentFlat > longestFlat) { longestFlat = currentFlat }
        currentY = colMax
        currentFlat = 1

      } else {

        currentFlat += 1
      }
    })

    if (currentFlat > longestFlat) { longestFlat = currentFlat }

    return longestFlat > 4
}



// FIND WIDEST FLAT SURFACE BY ROTATION

const widestFlatSurface = (deltas, rotateDeltas) => {

  let currentDeltas = deltas.map( delta => {
    return [delta[0], delta[1]]
  })

  let widestFlatSurface = 0
  let widestRotation = 0
  let rotations = 0

  for (let i = 0; i < rotateDeltas.length; i++) {

    let currentSurface = {}
    rotations += 1

    for (let j = 0; j < rotateDeltas[i].length; j++) {

      currentDeltas[j][0] += rotateDeltas[i][j][0]
      currentDeltas[j][1] += rotateDeltas[i][j][1]

      if (currentSurface[ currentDeltas[j][0] ]) {

        currentSurface[ currentDeltas[j][0] ] += 1

      } else {

        currentSurface[ currentDeltas[j][0] ] = 1
      }
    }

    let currentWidestSurface = values(currentSurface).length

    if (currentWidestSurface > widestFlatSurface) {

      widestFlatSurface = currentWidestSurface
      widestRotation = rotations
    }

    currentSurface = {}
  }

  return widestRotation
}


const getDeltas = (rotations, deltas, rotateDeltas) => {

  let currentDeltas = deltas.map( delta => {
    return [delta[0], delta[1]]
  })

  for (let i = 0; i < rotations; i++) {

    for (let j = 0; j < rotateDeltas[i].length; j++) {

      currentDeltas[j][0] += rotateDeltas[i][j][0]
      currentDeltas[j][1] += rotateDeltas[i][j][1]
    }
  }

  return currentDeltas
}


// MATCH PIECE SHAPE TO STILL SHAPES

const bottomSurfaceOfPiece = deltas => {

  let layer = []
  let currentX = null

  for (let i = 0; i < deltas.length; i ++) {

    if (deltas[i][0] != currentX) {

      currentX = deltas[i][0]
      layer.push(deltas[i][1])

    } else if (deltas[i][1] < layer[layer.length -1]) {

      layer[layer.length -1] = deltas[i][1]
    }

  }

  if (layer[0] === -1) {
    layer = layer.map( el => { return el === -1 ? 0 : 1 })
  }

  return layer
}


const matchPieceToStillShapes = (layer) => {

  getAiStillShapes()

  let lowestReference = null
  let lowestIndex = null
  let lowestRange = null
  let lowestRangeIndex = null


  for (let i = 0; i + layer.length - 1 < aiStillShapes.length; i++) {

    let aligned = false
    let reference = null
    let currentRange = 0

    for (let j = 0; j < layer.length; j++) {

      let colMaxHeight = Math.max(...aiStillShapes[i + j])
      currentRange += colMaxHeight


      if (j === 0) {

        reference = colMaxHeight

      } else {

        if ( reference + layer[j] === colMaxHeight ) {
          aligned = true

        } else {

          aligned = false
          reference = null
          break
        }

      }
    }

    if (aligned) {
      if (lowestReference === null || reference < lowestReference) {

        lowestReference = reference
        lowestIndex = i
      }
    }

    if (lowestRange === null || currentRange < lowestRange) {

      lowestRange = currentRange
      lowestRangeIndex = i
    }

    aligned = false
    reference = null
    currentRange = 0
  }

  return lowestIndex === null ? -5 + lowestRangeIndex : -5 + lowestIndex
}


const topSurfaceInRange = (start, range) => {

  let layer = []
  let reference = Math.max(...aiStillShapes[start])

  for (let i = start; i < start + range; i++) {

    let colHeight = Math.max(...aiStillShapes[i])
    let difference = (colHeight + 2) - (reference + 2)
    layer.push( difference )
  }

  return layer
}



// FIND MOVE THAT COMPLETES MOST ROWS

const numberOfCompleteRows = potentialMove => {
  let rows = 0

  for (var row in potentialMove) {
    if ( potentialMove[row].length === 12 ) {
      rows += 1
    }
  }

  return rows
}
