var THREE = require('three');
import * as Shape from './shapes_util';



// VARIABLES

export const allCubes = {
  '0': [], '1': [], '2': [], '3': [], '4': [],
  '5': [], '6': [], '7': [], '8': [], '9': [],
  '10': [], '11': [], '12': [], '13': [], '14': [],
  '15': [], '16': [], '17': [], '18': [], '19': [],
  '20': [], '21': [], '22': [], '23': [], '24': [],
}

export const stillShapes = {
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
  '6': [-1],
}

let totalShapes = 0;
export let levelStatus = 1;
export let score = 0;


// ACTIONS

const level = lvl => {
  switch (lvl.toString()) {

    case '0':
    levelStatus = 1;
    return 0.05;
    break;

    case '1':
    levelStatus = 2;
    return 0.08;
    break;

    case '2':
    levelStatus = 3;
    return 0.1;
    break;

    case '3':
    levelStatus = 4;
    return 0.12;
    break;

    case '4':
    levelStatus = 5;
    return 0.15;
    break;

    case '5':
    levelStatus = 6;
    return 0.18
    break;

    default:
    levelStatus = 7;
    return 0.2;
  }

}

const addScore = rowAmount => {
  switch (rowAmount) {

    case 1:
    score += 100;
    break;

    case 2:
    score += 400;
    break;

    case 3:
    score += 600;
    break;

    case 4:
    score += 800;
    break;
  }

}

export const addStillShape = (stillShape, scene) => {
  stillShape.forEach(s => {
    s.position.y = Math.ceil(s.position.y);

    if (!stillShapes[s.position.x].includes(s.position.y)) {

      let yPosition = s.position.y === -0 ? 0 : s.position.y
      allCubes[yPosition].push( s );
      stillShapes[s.position.x].push( yPosition );

    } else {

      scene.remove( s )
    }
  })
}

export const moveCubes = (newShape, speed, boost) => {
  newShape.forEach( cube => cube.position.y -= speed + boost )
}


export const moveLeft = shape => {
  if (moveValid(shape, 'left')) {
    shape.forEach( c => c.position.x -= 1);
  }
}

export const moveRight = shape => {
  if (moveValid(shape, 'right')) {
    shape.forEach( c => c.position.x += 1);
  }
}

const moveValid = (shape, direction) => {
  const step = direction === 'left' ? -1 : 1
  const inBounds = direction === 'left' ?
    shape.every( c => c.position.x > -5) :
    shape.every( c => c.position.x < 6 )

  return (
    !shape.some( c => stillShapes[c.position.x + step] &&
    stillShapes[c.position.x + step]
      .includes(Math.floor(c.position.y))) && inBounds
  )
}

export const rotateShape = (newShape, newRotateDeltas, shapeDeltaIndex) => {
  let newDeltas = newRotateDeltas[shapeDeltaIndex % newRotateDeltas.length]

    for (let i = 0; i < newShape.length; i++) {
      let d = newDeltas[i];
      newShape[i].position.x += d[0];
      newShape[i].position.y += d[1];
    }

}

export const rotatable = (newShape, newRotateDeltas, shapeDeltaIndex) => {
  let newDeltas = newRotateDeltas[shapeDeltaIndex % newRotateDeltas.length]
  let newXPosition = [];

  for (let i = 0; i < newShape.length; i++) {
    let d = newDeltas[i];
    let newX = newShape[i].position.x + d[0];

    if (newX > 6 || newX < -5) {
      return false

    } else if (stillShapes[newX]
        .includes(Math.ceil(newShape[i].position.y + d[1]) - 1)) {

          return false
    }
  }

    return true;
}

export const nextShape = idx => {

  let newShape = Shape.shapes[idx % 7]();
  let newDeltas = Shape.deltas[idx % 7];

  for (let i = 0; i < newShape.length; i++ ) {
    let d = newDeltas[i]
    newShape[i].position.set(d[0], 24 + d[1], 0);
  }

  totalShapes += 1;

  return newShape;
}


export const over = () => {
  return stillShapes[0].includes(21) ? true : false
}


export const fullRow = (scene) => {
  let rows = []

  for (var row in allCubes) {
    if ( allCubes[row].length === 12 ) {
      rows.push(row);
    }
  }

  if (rows.length > 0) {
    addScore(rows.length);

    removeRows(allCubes, rows, scene)
    .then( rows => reassembleCubes(rows) )
    .then( () => reassembleStillShapes() )
  }
}


const removeRows = (allCubes, rows, scene) => {

  return new Promise((resolve, reject) => {

    rows.forEach( row => {
      allCubes[row].forEach( c => scene.remove( c ) );
      allCubes[row] = [];
    })

    resolve( () => rows );
  })
}


const reassembleCubes = rows => {

  return new Promise((resolve, reject) => {
    rows = rows();

    for (let l = 0; l < rows.length; l++) {

      for (let i = 0; i < 23; i++) {
        let j = i + 1;

        if (allCubes[i].length === 0) {
          allCubes[i] = allCubes[j];
          allCubes[i].forEach( c => c.position.y -= 1 )
          allCubes[j] = [];
        }
      }
    }

    resolve();
  })
}

const reassembleStillShapes = () => {
  for (var col in stillShapes) { stillShapes[col] = [-1] }
  for (var row in allCubes) {
    allCubes[row].forEach( c => {
      stillShapes[c.position.x].push(c.position.y)
    })
  }
}

export const speed = () => {
  return level( Math.floor(totalShapes / 7) );
}
