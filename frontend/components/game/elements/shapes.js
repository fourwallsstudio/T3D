import { materials, deltas, rotateDeltas, aiRotateDeltas } from '../../../util/shape_material_util'
const THREE = require('three');

export default class Shape {
  constructor(idx) {
    this.cubes = this.createShape(materials[idx])
    this.deltas = deltas[idx]
    this.rotateDeltas = rotateDeltas[idx]
    this.aiRotateDeltas = aiRotateDeltas[idx];
    this.rotateIndex = 0
  }

  createShape(material) {
    const geometry = new THREE.BoxGeometry(1, 1, 1)

    const cube1 = new THREE.Mesh(geometry, material)
    const cube2 = new THREE.Mesh(geometry, material)
    const cube3 = new THREE.Mesh(geometry, material)
    const cube4 = new THREE.Mesh(geometry, material)

    return [ cube1, cube2, cube3, cube4 ]
  }

  putInPlayPosition() {
    this.cubes.forEach( (c, i) => {
      let d = this.deltas[i]
      c.position.set(d[0], 24 + d[1], 0);
    })
    return this
  }

  putNextInPlayPosition(xPosition) {
    this.cubes.forEach( (c, i) => {
      let d = this.deltas[i]
      c.position.set(xPosition + d[0], 22 + d[1], 0);
    })
    return this
  }

  moveDown(speed, boost) {
    this.cubes.forEach( cube => cube.position.y -= speed + boost )
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
