import * as GameUtil from '../../util/game_util'
import Shape from './elements/shapes'
import { NextShape } from './elements/next_shape'
import Scene from './elements/scene'
import Camera from './elements/camera'
const { aiGameMove } = require('../../util/ai_util');
const THREE = require('three');

export default class Game {
  constructor(scene) {
    this.scene = scene || null;
    this.allCubes = GameUtil.allCubes();
    this.stillShapes = GameUtil.stillShapes();
    this.totalShapes = 0;
    this.currentShape;
    this.nextShape;
    this.nextShapeIndex = 0;
    this.nextShapeRandom = true;
    this.levelStatus = 1;
    this.score = 0;
    this.speed = 0.05;
    this.boost = 0;
    this.aniFrame;
    this.isPaused = true;
    this.isSetUp = false;

    this.aiMode = false;
    this.currentAiMove = null;

    // redux actions
    this.updateGameStatus;
    this.updateScore;
    this.updateLevel;
    this.toggleAiMode;
  }

  setUp = () => {
    if (this.nextShapeRandom) {
      this.nextShapeIndex = Math.floor(Math.random() * 7);
    }
    this.newShape()
    this.createNextShape()
    this.isSetUp = true;
  }

  newShape = () => {
    this.currentShape = new Shape(this.nextShapeIndex)
    this.currentShape.putInPlayPosition()
    this.scene.addShape(this.currentShape)
    this.totalShapes += 1;
  }

  createNextShape = () => {
    if (this.nextShape) this.scene.removeShape(this.nextShape)
    const xPosition = this.levelStatus % 2 === 0 ? -13 : 13;

    if (this.nextShapeRandom) {
      this.nextShapeIndex = Math.floor(Math.random() * 7)
    } else {
      this.nextShapeIndex = (this.nextShapeIndex + 1) % 7
    }


    this.nextShape = new NextShape( this.nextShapeIndex )
    this.nextShape.putNextInPlayPosition(xPosition)
    this.scene.addShape(this.nextShape)
  }

  togglePlayPause = () => {
    if (this.isPaused) {
      this.play()
    } else {
      this.pause()
    }
  }

  play = () => {
    if (!this.isSetUp) this.setUp();
    this.isPaused = false;
    this.updateGameStatus('playing');
    this.animate();
  }

  animate = () => {
    if (this.over()) {
      this.pause()
      this.endGame()
      return;
    }

    if (this.aiMode) {
      if (!this.currentAiMove) {
        this.currentAiMove = aiGameMove(this);
        this.boost = 0.7;
        this.aiMakeMove();
      }
    }

    if (!this.shapeTouchBottom()) {
      if (!this.isPaused) {
        this.currentShape.moveDown(this.speed, this.boost)
      }

    } else {
      this.nextTurn();
    }

    this.aniFrame = requestAnimationFrame( this.animate );
  }

  pause = () => {
    this.isPaused = true;
    this.updateGameStatus('paused');
    cancelAnimationFrame( this.aniFrame )
    this.aniFrame = null;
  }

  nextTurn = () => {
    this.currentAiMove = null;
    this.boost = 0;
    this.recordStillShape()

    if (!this.aiMode && this.totalShapes % 10 === 0) {
      this.nextLevel();
    }

    if (this.completeRows().length > 0) {
      const rows = this.completeRows();
      this.flashRows(rows);
      this.removeAndReassembleRows(rows);
    }

    this.newShape()
    this.createNextShape()
  }

  endGame = () => {
    this.updateGameStatus("gameover")
    if (this.aiMode) this.toggleAiMode();
  }

  recordStillShape = () => {
    this.currentShape.cubes.forEach(cube => {
      cube.position.y = Math.ceil(cube.position.y)

      this.allCubes[cube.position.y].push( cube )
      this.stillShapes[cube.position.x].push( cube.position.y )
    })
  }

  nextLevel = () => {
    this.levelStatus += 1;
    this.speed += 0.01;
    this.updateLevel(this.levelStatus)
  }

  resetSpeed = () => {
    return GameUtil.levelSpeed[ this.levelStatus ]
  }

  shapeTouchBottom = () => {
    return this.currentShape.cubes.some( c => this.stillShapes[c.position.x]
        .includes(Math.ceil(c.position.y) - 1))
  }

  aiMakeMove = () => {
    const { rotations, positionX } = this.currentAiMove;
    for (let i = 0; i < rotations; i++) {
      this.rotateShape();
    }

    while (this.currentShape.mostLeft() !== positionX) {
      if (positionX < this.currentShape.mostLeft()) {
        this.moveShapeHorizontal('left');
      } else if (positionX > this.currentShape.mostLeft()){
        this.moveShapeHorizontal('right');
      }
    }
  }

  enableBoost = () => {
    if (!this.isPaused) {
      this.boost = 0.3;
    }
  }

  moveShapeHorizontal = (direction) => {
    if (!this.isPaused) {
      this.currentShape.moveHorizontal(direction, this.stillShapes)
    }
  }

  rotateShape = () => {
    if (!this.isPaused
      && this.currentShape.rotatable(this.stillShapes)) {

      this.currentShape.rotate()
    }
  }

  completeRows = () => {
    const rows = [];

    Object.keys(this.allCubes).forEach( row => {
      if ( this.allCubes[row].length === 12 ) {
        rows.push(row)
      }
    })

    return rows;
  }

  flashRows = (rows) => {
    rows.forEach( row => {
      this.allCubes[row].forEach( cube => {
        cube.position.z = -0.25;
      })
    })
  }

  removeAndReassembleRows = (rows) => {
    setTimeout( () => {
      this.removeRows(rows)
      this.reassembleCubes(rows)
      this.reassembleStillShapes()
      this.addScore(rows.length)
    }, 100)
  }

  addScore = (rows) => {
    this.score += (rows + rows) * 100;
    this.updateScore(this.score)
  }

  removeRows = (rows) => {
    rows.forEach( row => {
      this.allCubes[row].forEach( cube => this.scene.remove( cube ) )
      this.allCubes[row] = [];
    })
  }

  reassembleCubes = (rows) => {
    for (let l = 0; l < rows.length; l++) {

      for (let i = 0; i < 23; i++) {
        let j = i + 1;

        if (this.allCubes[i].length === 0) {
          this.allCubes[i] = this.allCubes[j]
          this.allCubes[i].forEach( cube => cube.position.y -= 1 )
          this.allCubes[j] = [];
        }
      }
    }
  }

  reassembleStillShapes = () => {
    Object.keys(this.stillShapes).forEach( col => this.stillShapes[col] = [-1] )

    Object.keys(this.allCubes).forEach( row => {
      this.allCubes[row].forEach( cube => {
        this.stillShapes[cube.position.x].push(cube.position.y)
      })
    })
  }

  over = () => {
    let overTwentyOne = false;
    Object.keys(this.stillShapes).forEach(x => {
      if (this.stillShapes[x].includes(22)) {
        overTwentyOne = true;
      }
    })
    return overTwentyOne;
  }

  wipeGrid = () => {
    this.pause()
    
    this.scene = null;
    this.allCubes = GameUtil.allCubes();
    this.stillShapes = GameUtil.stillShapes();
    this.totalShapes = 0;
    this.currentShape;
    this.nextShape;
    this.nextShapeIndex = 0;
    this.nextShapeRandom = true;
    this.levelStatus = 1;
    this.score = 0;
    this.speed = 0.05;
    this.boost = 0;
    this.aniFrame;
    this.isPaused = true;
    this.isSetUp = false;

    this.aiMode = false;
    this.currentAiMove = null;
  }
}
