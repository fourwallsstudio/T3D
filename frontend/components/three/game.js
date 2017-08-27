import * as GameUtil from '../../util/game_util'
import Shape from './elements/shapes'
import { NextShape } from './elements/next_shape'
import Scene from './elements/scene'
import Camera from './elements/camera'
const THREE = require('three')

export default class Game {
  constructor() {
    this.scene = new Scene
    this.camera = new Camera
    this.renderer;
    this.allCubes = GameUtil.allCubes()
    this.stillShapes = GameUtil.stillShapes()
    this.totalShapes = 0
    this.currentShape;
    this.nextShape;
    this.nextShapeIndex = 0
    this.levelStatus = 1
    this.score = 0
    this.speed = 0.05
    this.boost = 0
    this.aniFrame;
    this.cameraDelta = 0
    this.rotateDisabled = false

    this.updateGameStatus;
    this.updateScore;
    this.updateLevel;

    this.play = this.play.bind(this)
    this.rotateCamera = this.rotateCamera.bind(this)
    this.wipeGrid = this.wipeGrid.bind(this)
  }


  newShape() {
    this.currentShape = new Shape(this.nextShapeIndex)
    this.currentShape.putInPlayPosition()
    this.scene.addShape(this.currentShape)
    this.totalShapes += 1
  }

  createNextShape() {
    if (this.nextShape) this.scene.removeShape(this.nextShape)
    const xPosition = this.levelStatus % 2 === 0 ? -13 : 13
    this.nextShapeIndex = Math.ceil(Math.random() * 6)

    this.nextShape = new NextShape( this.nextShapeIndex )
    this.nextShape.putNextInPlayPosition(xPosition)
    this.scene.addShape(this.nextShape)
  }

  setUp(renderer) {
    this.newShape()
    this.createNextShape()
    this.renderer = renderer
    this.updateScore(this.score);
    this.updateLevel(this.levelStatus);
  }

  play() {
    if (this.over()) {
      this.pause()
      this.endGame()
      return;
    }

    if (!this.shapeTouchBottom()) {
      this.currentShape.moveDown(this.speed, this.boost)

    } else {

      this.boost = 0
      this.pause()
      this.addStillShape()
      return;
    }

    this.aniFrame = requestAnimationFrame( this.play )
    this.renderer.render( this.scene.scene, this.camera.camera )
  }

  pause() {
    cancelAnimationFrame( this.aniFrame )
    this.aniFrame = undefined
  }

  endGame() {
    this.updateGameStatus("gameover")
  }

  addStillShape() {
    this.currentShape.cubes.forEach(cube => {
      cube.position.y = Math.ceil(cube.position.y)

      this.allCubes[cube.position.y].push( cube )
      this.stillShapes[cube.position.x].push( cube.position.y )
    })

    if (!this.rotateDisabled && this.totalShapes % 10 === 0) {
      this.nextLevel()

    } else {
      this.newShape()
      this.createNextShape()
      this.play()
    }

    if (this.completeRow()) {
      this.flashRows()
    }
  }

  nextLevel() {
    this.levelStatus += 1
    this.speed += 0.01
    this.updateLevel(this.levelStatus)
    this.scene.removeShape(this.nextShape)
    this.rotateCamera()
  }

  resetSpeed() {
    return GameUtil.levelSpeed[ this.levelStatus ]
  }

  shapeTouchBottom() {
    return this.currentShape.cubes.some( c => this.stillShapes[c.position.x]
        .includes(Math.ceil(c.position.y) - 1))
  }

  moveShapeHorizontal(direction) {
    this.currentShape.moveHorizontal(direction, this.stillShapes)
  }

  rotateShape() {
    if (this.currentShape.rotatable(this.stillShapes)) {
      this.currentShape.rotate()
    }
  }

  completeRow() {
    return Object.keys(this.allCubes)
      .some( row => this.allCubes[row].length === 12 )
  }

  flashRows() {
    const rows = [];

    Object.keys(this.allCubes).forEach( row => {

      if ( this.allCubes[row].length === 12 ) {
        rows.push(row)

        this.allCubes[row].forEach( cube => {
          cube.position.z = -0.25
        })
      }
    })

    setTimeout( () => {
      this.removeRows(rows)
        .then( rows => this.reassembleCubes(rows) )
        .then( () => this.reassembleStillShapes() )

        this.addScore(rows.length)
    }, 100)
  }

  addScore(rows) {
    this.score += (rows + rows) * 100
    this.updateScore(this.score)
  }

  removeRows(rows) {
    return new Promise((resolve, reject) => {
      rows.forEach( row => {
        this.allCubes[row].forEach( cube => this.scene.remove( cube ) )
        this.allCubes[row] = []
      })

      resolve( () => rows )
    })
  }

  reassembleCubes(rows) {
    return new Promise((resolve, reject) => {
      rows = rows()

      for (let l = 0; l < rows.length; l++) {

        for (let i = 0; i < 23; i++) {
          let j = i + 1

          if (this.allCubes[i].length === 0) {
            this.allCubes[i] = this.allCubes[j]
            this.allCubes[i].forEach( cube => cube.position.y -= 1 )
            this.allCubes[j] = []
          }
        }
      }

      resolve()
    })
  }

  reassembleStillShapes() {
    Object.keys(this.stillShapes).forEach( col => this.stillShapes[col] = [-1] )

    Object.keys(this.allCubes).forEach( row => {
      this.allCubes[row].forEach( cube => {
        this.stillShapes[cube.position.x].push(cube.position.y)
      })
    })
  }

  rotateCamera() {
    const evenLevel = this.levelStatus % 2 === 0
    const rotating = evenLevel
                      ? Math.sin(this.cameraDelta) >= 0
                      : Math.sin(this.cameraDelta) <= 0
    const vectorX = evenLevel ? 0.5 : -0.5
    const setZ = evenLevel ? -13 : 13

    if (rotating) {

      this.cameraDelta += 0.05
      this.camera.camera.lookAt( new THREE.Vector3(vectorX, 12, 0) )
      this.camera.camera.position.y = 12
      this.camera.camera.position.x = Math.sin(this.cameraDelta) * 13
      this.camera.camera.position.z = Math.cos(this.cameraDelta) * 13

    } else {

      this.camera.camera.position.set(0.5, 12, setZ)
      this.camera.camera.lookAt( new THREE.Vector3(0.5, 12, 0) )
      this.stopRotate()
      return;
    }

    this.aniFrame = requestAnimationFrame(this.rotateCamera)
    this.renderer.render(this.scene.scene, this.camera.camera)
  }

  stopRotate() {
    cancelAnimationFrame(this.aniFrame)
    this.aniFrame = undefined
    this.newShape()
    this.createNextShape()
    this.play()
  }

  toggleCameraView() {
    this.rotateDisabled = !this.rotateDisabled
    this.camera.toggleView()
  }

  over() {
    return this.stillShapes[0].includes(21) ? true : false
  }

  wipeGrid() {
    this.scene = new Scene
    this.camera = new Camera
    this.renderer = null
    this.allCubes = GameUtil.allCubes()
    this.stillShapes = GameUtil.stillShapes()
    this.totalShapes = 0
    this.currentShape = null
    this.nextShape = null
    this.nextShapeIndex = 0
    this.levelStatus = 1
    this.score = 0
    this.speed = 0.05
    this.boost = 0
    this.aniFrame = null
    this.cameraDelta = 0
    this.rotateDisabled = false
  }
}
