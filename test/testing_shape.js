const { deltas, rotateDeltas, aiRotateDeltas } = require('../frontend/util/shape_material_util');
const THREE = require('three');

class Cube {
  constructor() {
    this.position = {
      x: 0,
      y: 0,
      set: function(dX, dY) {
        this.x = dX;
        this.y = dY;
      }
    }
  }
}

class Shape {
  constructor(idx) {
    this.idx = idx;
    this.cubes = this.createShape()
    this.deltas = deltas[idx]
    this.rotateDeltas = rotateDeltas[idx]
    this.aiRotateDeltas = aiRotateDeltas[idx];
    this.rotateIndex = 0
  }

  createShape() {
    return [ new Cube(), new Cube(), new Cube(), new Cube() ]
  }

  putInPlayPosition() {
    this.cubes.forEach( (c, i) => {
      let d = this.deltas[i]
      c.position.set(d[0], 24 + d[1]);
    })
    return this
  }

  putNextInPlayPosition(xPosition) {
    this.cubes.forEach( (c, i) => {
      let d = this.deltas[i]
      c.position.set(xPosition + d[0], 22 + d[1]);
    })
    return this
  }

  moveDown() {
    this.cubes.forEach( cube => cube.position.y -= 1 )
  }

  moveHorizontal(direction, stillShapes) {
    if (this.moveValid(direction, stillShapes)) {
      const step = direction === 'left' ? -1 : 1
      this.cubes.forEach( c => c.position.x += step)
    }
  }

  moveValid(direction, stillShapes) {
    const step = direction === 'left' ? -1 : 1
    const inBounds = direction === 'left'
      ? this.cubes.every( c => c.position.x > -5)
      : this.cubes.every( c => c.position.x < 6 )

    return (
      !this.cubes.some( c => stillShapes[c.position.x + step] &&
      stillShapes[c.position.x + step]
        .includes(Math.floor(c.position.y))) && inBounds
    )
  }

  rotate() {
    const newDeltas = this.rotateDeltas[this.rotateIndex]

    for (let i = 0; i < newDeltas.length; i++) {
      let d = newDeltas[i];
      this.cubes[i].position.x += d[0];
      this.cubes[i].position.y += d[1];
    }

    this.rotateIndex = (this.rotateIndex + 1) % this.rotateDeltas.length
  }

  rotatable(stillShapes) {
    const newDeltas = this.rotateDeltas[this.rotateIndex]
    const newXPosition = [];

    for (let i = 0; i < this.cubes.length; i++) {
      const d = newDeltas[i];
      const newX = this.cubes[i].position.x + d[0];

      if (newX > 6 || newX < -5) {
        return false

      } else if (stillShapes[newX]
        .includes(Math.ceil(this.cubes[i].position.y + d[1]) - 1)) {

        return false
      }
    }

    return true;
  }

  mostLeft() {
    let x = null;
    this.cubes.forEach(c => {
      if (x === null || c.position.x < x) x = c.position.x;
    })
    return x;
  }
}

module.exports = Shape;
