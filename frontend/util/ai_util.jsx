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

export const generateMove = (deltas, rotateDeltas) => {
  // console.log("deltas", deltas)
  let rotations = widestFlatSurface(deltas, rotateDeltas)
  let newDeltas = getDeltas(rotations, deltas, rotateDeltas)
  let layer = bottomSurfaceOfPiece(newDeltas)
  return topSurfaceInRange(layer, rotations)
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

  console.log("layer", layer)
  return layer
}


const topSurfaceInRange = (layer, rotations) => {
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

  let lowestIdx = lowestIndex === null ? -5 + lowestRangeIndex : -5 + lowestIndex

  return [lowestIdx, rotations]
}



// FIND LOWEST MOVE






const fullRows = (rows) => {
  let completeRows = []

  for (var row in rows) {
    if ( rows[row].length === 12 ) {
      completeRows.push(row);
    }
  }

  completeRows.length
}
