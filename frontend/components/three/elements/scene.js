import Borders from './borders'
import Light from './light'
const THREE = require('three')

export default class Scene {
  constructor() {
    this.scene = this.createScene()
  }

  createScene() {
    const scene = new THREE.Scene()
    const light = new Light
    const borders = new Borders

    scene.add(...light.light, ...borders.borders)

    return scene
  }

  addShape(shape) {
    this.scene.add(...shape.cubes)
  }

  removeShape(shape) {
    this.scene.remove(...shape.cubes)
  }

  remove(cube) {
    this.scene.remove(cube)
  }
}
