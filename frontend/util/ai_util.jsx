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


  if (moveToIndex === null) {

    for (rotations = 1; rotations <= rotateDeltas.length; rotations++) {

      newDeltas = getDeltas(rotations, deltas, rotateDeltas)
      layer = bottomSurfaceOfPiece(newDeltas)
      moveToIndex = matchPieceToStillShapes(layer)

      if (moveToIndex !== null) {
        break
      }
    }
  }

  if (moveToIndex === null) {
    rotations = narrowestSurface(deltas, rotateDeltas)
    newDeltas = getDeltas(rotations, deltas, rotateDeltas)
    layer = bottomSurfaceOfPiece(newDeltas)
    moveToIndex = findLowestInRange(layer.length)
  }

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



// CONTINUOUS FLATNESS OF BOARD IS > 4 && TALLEST UNDER 5?

const flatnessMinReached = () => {

    getAiStillShapes()

    let longestFlat = 0
    let currentY = 0
    let currentFlat = 0

    aiStillShapes.forEach( col => {
      let colMax = Math.max(...col)

      if (colMax > 4) { return false }

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


const findLowestInRange = range => {
  let lowestRange = null
  let lowestRangeIndex = 0

  for (let i = 0; i + range < aiStillShapes; i++) {
    let currentRangeMax = 0

    for (let j = 0; j < range; j++) {
      let colHeight = Math.max(...aiStillShapes[i + j])
      if (colHeight > currentRangeMax) { currentRangeMax = colHeight }
    }

    if (lowestRange === null || currentRangeMax < lowestRange) {
      lowestRange = currentRangeMax
      lowestRangeIndex = i
    }
  }

  return -5 + lowestRangeIndex
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

    let currentSurfaceLength = values(currentSurface).length

    if (currentSurfaceLength > widestFlatSurface) {

      widestFlatSurface = currentSurfaceLength
      widestRotation = rotations
    }

    currentSurface = {}
  }

  return widestRotation
}


const narrowestSurface = (deltas, rotateDeltas) => {

  let currentDeltas = deltas.map( delta => {
    return [delta[0], delta[1]]
  })

  let narrowest = null
  let narrowestRotation = 0
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

    let currentSurfaceLength = values(currentSurface).length

    if (narrowest === null || currentSurfaceLength < narrowest) {

      narrowest = currentSurfaceLength
      narrowestRotation = rotations
    }

    currentSurface = {}
  }

  return narrowestRotation
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
  let seenX = {}

  for (let i = 0; i < deltas.length; i ++) {

    if (!seenX[deltas[i][0]]) {

      seenX[deltas[i][0]] = true
      layer.push(deltas[i][1])

    } else if (deltas[i][1] < layer[layer.length -1]) {

      layer[layer.length -1] = deltas[i][1]
    }

  }

  if (layer.length === 1) { layer = [0] }

  if (layer[0] === -1) {
    layer = layer.map( el => { return el + 1 })
  } else if (layer[0] === 1) {
    layer = layer.map( el => { return el - 1 })
  }

  return layer
}


const matchPieceToStillShapes = (layer) => {

  getAiStillShapes()

  let lowestReference = null
  let lowestIndex = null


  for (let i = 0; i + layer.length - 1 < aiStillShapes.length; i++) {

    let aligned = false
    let topSurfaceResult, rangeLayer, reference;

    topSurfaceResult = topSurfaceInRange(i, layer.length)
    rangeLayer = topSurfaceResult[0]
    reference = topSurfaceResult[1]

    aligned = isAligned(layer, rangeLayer)

    if (aligned) {
      if (lowestReference === null || reference < lowestReference) {

        lowestReference = reference
        lowestIndex = i
      }
    }
  }

  return lowestIndex === null ? null : -5 + lowestIndex
}


const topSurfaceInRange = (start, range) => {

  let layer = []
  let reference = Math.max(...aiStillShapes[start])

  for (let i = start; i < start + range; i++) {

    let colHeight = Math.max(...aiStillShapes[i])
    let difference = (colHeight + 2) - (reference + 2)
    layer.push( difference )
  }

  return [layer, reference]
}


const isAligned = (layer, rangeLayer) => {
  let aligned = true

  if (layer.length !== rangeLayer.length) { return false }

  layer.forEach( (el, i) => {
    if (el !== rangeLayer[i]) { aligned = false }
  })

  return aligned
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
