import React from 'react'
import { connect } from 'react-redux'
import Game from './game'
import * as AI from '../../util/ai_util'
import Scene from './elements/scene'
import Camera from './elements/camera'
import {
  updateScore,
  updateLevel,
  updateGameStatus,
  disableGrid
} from '../../actions/game_actions'
const THREE = require('three')

const ThreeCanvas = props => {

  let game = null;
  let renderer;
  let isPaused;

  const newGame = () => {
    game = new Game
    game.updateGameStatus = props.updateGameStatus
    game.updateScore = props.updateScore
    game.updateLevel = props.updateLevel
    game.disableGrid = props.disableGrid

    renderer = new THREE.WebGLRenderer(
      {
        canvas: document.getElementById("myCanvas"),
        alpha: true,
      }
    );
    renderer.setSize( window.innerWidth, window.innerHeight );

    isPaused = true;
    game.setUp(renderer)
  };

  newGame();

  // USER CONTROLS

  document.addEventListener("keypress", function(e) {
    switch(e.key) {

      case "w":
        game.rotateShape()
        break

      case "s":
        game.boost = 0.3
        break

      case "a":
        game.moveShapeHorizontal('left')
        break

      case "d":
        game.moveShapeHorizontal('right')
        break

      case "p":
        playAndPause()
        break

      case "r":
        game.pause()
        game.wipeGrid()
        newGame()
        props.updateGameStatus('welcome')
        break

      case "v":
        game.toggleCameraView()
        props.disableGrid()
        break

      default:
        return
    }
  })

  const playAndPause = () => {
    if (isPaused) {

      game.play()
      isPaused = !isPaused
      props.updateGameStatus('playing')

    } else {

      game.pause()
      isPaused = !isPaused
      props.updateGameStatus('paused')
    }
  }

  return <div></div>;
};


const mapStateToProps = state => {
  return {
    gridActive: state.game.gridActive
  }
}

const mapDispatchToProps = dispatch => {
  return {
    updateScore: score => dispatch(updateScore(score)),
    updateLevel: level => dispatch(updateLevel(level)),
    updateGameStatus: status => dispatch(updateGameStatus(status)),
    disableGrid: () => dispatch(disableGrid()),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ThreeCanvas);
