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

  let game = null;
  let renderer;
  let isPaused;

  const newGame = () => {
    game = new Game;
    game.updateGameStatus = props.updateGameStatus;
    game.updateScore = props.updateScore;
    game.updateLevel = props.updateLevel;
    game.disableGrid = props.disableGrid;

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

  if (props.aiMode) {
    
  } else {
    newGame();
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
        newGame()
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

  return null;
};


const mapStateToProps = state => {
  return {
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
