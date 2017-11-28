const _ = require('lodash');
const Shape = require('./testing_shape');
const { aiGameMove } = require('../frontend/util/ai_util');

const weightOptions = {
  calcCompleteRows: true,
  calcConnections: false,
  calcGaps: true,
  calcHeight: true,
  calcShapeHeight: true,
  accountForGapsOnCompleteRows: true,
  values: {
    row: 100,
    connection: 15,
    gap: 100,
    height: 50,
    heightExp: 1,
    shapeHeight: 10,
    shapeHeightExp: 1,
  }
}

class Game {
  constructor() {
    this.allCubes = {};
    this.stillShapes = {};
    this.totalShapes = 0;
    this.currentShape;
    this.nextShape;
    this.nextShapeIndex = 0;
    this.nextShapeRandom = true;
    this.score = 0;
    this.weightOptions = weightOptions;

    this.currentAiMove = null;
    this.stats = this.setUpStats();

    this.play = this.play.bind(this);
    this.aiMakeMove = this.aiMakeMove.bind(this);
    this.recordStats = this.recordStats.bind(this);
    this.wipeGrid = this.wipeGrid.bind(this);
  }


  newShape() {
    this.currentShape = new Shape(this.nextShapeIndex)
    this.currentShape.putInPlayPosition()
    this.totalShapes += 1;
  }

  createNextShape() {
    if (this.nextShapeRandom) {
      this.nextShapeIndex = Math.floor(Math.random() * 7)
    } else {
      this.nextShapeIndex = (this.nextShapeIndex + 1) % 7
    }
  }

  setUp() {
    this.newShape()
    this.createNextShape()
  }

  play() {
    if (this.over()) {
      return;
    }

    if (!this.currentAiMove) {
      const newMove = aiGameMove(this);
      this.currentAiMove = newMove;
      // this.stats = newMove['stats'];
      this.recordStats();
      this.aiMakeMove();
    }

    if (!this.shapeTouchBottom()) {
      this.currentShape.moveDown()
    } else {
      this.currentAiMove = null;
      this.addStillShape()
    }
  }

  addStillShape() {
    this.currentShape.cubes.forEach(cube => {
      cube.position.y = Math.ceil(cube.position.y)

      this.allCubes[cube.position.y].push( cube )
      this.stillShapes[cube.position.x].push( cube.position.y )
    })

    this.newShape()
    this.createNextShape()
    this.play()

    if (this.completeRows().length > 0) {
      const rows = this.completeRows();
      this.removeAndReassembleRows(rows);
    }
  }

  shapeTouchBottom() {
    return this.currentShape.cubes.some( c => this.stillShapes[c.position.x]
        .includes(Math.ceil(c.position.y) - 1))
  }

  aiMakeMove() {
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

  moveShapeHorizontal(direction) {
    this.currentShape.moveHorizontal(direction, this.stillShapes)
  }

  rotateShape() {
    if (this.currentShape.rotatable(this.stillShapes)) {
      this.currentShape.rotate()
    }
  }

  completeRows() {
    const rows = [];

    Object.keys(this.allCubes).forEach( row => {
      if ( this.allCubes[row].length === 12 ) {
        rows.push(row)
      }
    })

    return rows;
  }

  removeAndReassembleRows(rows) {
    rows.forEach( row => {
      this.allCubes[row] = [];
    })

    this.reassembleCubes(rows)
    this.reassembleStillShapes()
    this.addScore(rows.length)
  }

  addScore(rows) {
    this.score += (rows + rows) * 100;
  }

  reassembleCubes(rows) {
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

  reassembleStillShapes() {
    Object.keys(this.stillShapes).forEach( col => this.stillShapes[col] = [-1] )

    Object.keys(this.allCubes).forEach( row => {
      this.allCubes[row].forEach( cube => {
        this.stillShapes[cube.position.x].push(cube.position.y)
      })
    })
  }

  over() {
    let overTwentyOne = false;
    Object.keys(this.stillShapes).forEach(x => {
      if (this.stillShapes[x].includes(22)) {
        overTwentyOne = true;
      }
    })
    return overTwentyOne;
  }

  setUpStats() {
    const completeRowsByShape = {};
    const freqOfShapes = {};
    const gapsByShape = {};
    _.forEach(_.range(0, 7, 1), i => {
      completeRowsByShape[i] = 0;
      freqOfShapes[i] = 0;
      gapsByShape[i] = 0;
    });

    return {
      completeRowsByShape,
      freqOfShapes,
      gapsByShape
    }
  }

  recordStats() {
    const { weights } = this.currentAiMove;
    if (this.currentShape.idx !== undefined) {
      this.stats.completeRowsByShape[this.currentShape.idx] += (weights.completeRowsWeight / this.weightOptions.values.row);
      this.stats.freqOfShapes[this.currentShape.idx] += 1;
      this.stats.gapsByShape[this.currentShape.idx] += (weights.gapsWeight / this.weightOptions.values.gap) * -1;
    }
  }

  wipeGrid() {
    this.allCubes = {};
    this.stillShapes = {};
    this.totalShapes = 0;
    this.currentShape;
    this.nextShape;
    this.nextShapeIndex = 0;
    this.nextShapeRandom = true;
    this.score = 0;

    this.currentAiMove = null;
  }
}

module.exports = Game;
