import React from 'react'
import { connect } from 'react-redux'

import Game from './game'
import Scene from './elements/scene'
import Camera from './elements/camera'
const THREE = require('three')

// ACTIONS
import {
  updateScore,
  updateLevel,
  updateGameStatus,
  disableGrid
} from '../../actions/game_actions'

const GameCanvas = props => {

  // let isPaused;

  const createNewGame = () => {
    const newGame = new Game;
    newGame.updateGameStatus = props.updateGameStatus;
    newGame.updateScore = props.updateScore;
    newGame.updateLevel = props.updateLevel;
    newGame.disableGrid = props.disableGrid;

    const renderer = new THREE.WebGLRenderer(
      {
        canvas: document.getElementById("myCanvas"),
        alpha: true,
      }
    );
    renderer.setSize( window.innerWidth, window.innerHeight );

    // newGame.isPaused = true;
    newGame.setUp(renderer)

    return newGame;
  };


  let game = createNewGame();

  if (props.aiMode) {
    game.aiMode = true;
  }

  // USER CONTROLS

  document.addEventListener("keypress", function(e) {
    switch(e.key) {

      case "w":
        game.rotateShape()
        break

      case "s":
        game.boost = 0.3;
        break

      case "a":
        game.moveShapeHorizontal('left')
        break

      case "d":
        game.moveShapeHorizontal('right')
        break

      case "p":
        playPauseToggle()
        break

      case "r":
        game.pause()
        game.wipeGrid()
        game = createNewGame()
        playPauseToggle()
        break

      case "v":
        game.toggleCameraView()
        props.disableGrid()
        break

      default:
        return
    }
  })

  const playPauseToggle = () => {
    if (game.isPaused) {

      game.play()
      game.isPaused = !game.isPaused
      props.updateGameStatus('playing')

    } else {

      game.pause()
      game.isPaused = !game.isPaused
      props.updateGameStatus('paused')
    }
  }

  return null;
};


const mapStateToProps = state => {
  return {
    aiMode: state.game.aiMode,
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
)(GameCanvas);
