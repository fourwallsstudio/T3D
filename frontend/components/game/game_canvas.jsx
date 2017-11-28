import React from 'react'
import { connect } from 'react-redux'

import Game from './game'
import Scene from './elements/scene'
import Camera from './elements/camera'
const THREE = require('three');

// ACTIONS
import {
  updateScore,
  updateLevel,
  updateGameStatus,
  toggleDisableGrid,
  toggleAiMode,
} from '../../actions/game_actions'

class GameCanvas extends React.Component {
  constructor(props) {
    super(props);

    this.renderer = null;
    this.gameCamera = null;
    this.gameScene = null;
    this.game = null;
    this.aniFrame;
  }

  componentDidMount() {
    this.setUpThreeRender();
    this.createNewGame();
    this.animate();
    this.setUpKeyEvents();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.aiMode !== this.props.aiMode) {
      if (this.props.aiMode) {
        this.createNewGame(this.props.aiMode);
        this.game.setUp();
        this.game.togglePlayPause();
      }
    }

    if (prevProps.level !== this.props.level && this.props.level !== 1) {
      if (!this.gameCamera.rotateDisabled) {
        this.game.isPaused = true;
        this.gameCamera.rotateCamera();
      }
    }
  }

  setUpThreeRender = () => {
    const renderer = new THREE.WebGLRenderer(
      {
        canvas: document.getElementById("myCanvas"),
        alpha: true,
      }
    );
    renderer.setSize( window.innerWidth, window.innerHeight );
    this.renderer = renderer;
  }

  animate = () => {
    this.aniFrame = requestAnimationFrame( this.animate )
    this.renderer.render( this.gameScene.scene, this.gameCamera.camera )
  }

  setUpKeyEvents = () => {
    document.addEventListener("keypress", function(e) {
      this.handleKeyEvent(e);
    }.bind(this))
  }

  handleKeyEvent = (e) => {
    switch(e.key) {

      case "w":
        this.game.rotateShape()
        break;

      case "s":
        this.game.enableBoost();
        break;

      case "a":
        this.game.moveShapeHorizontal('left')
        break;

      case "d":
        this.game.moveShapeHorizontal('right')
        break;

      case "p":
        this.game.togglePlayPause()
        break;

      case "r":
        this.createNewGame()
        this.props.updateGameStatus('welcome')
        break;

      case "v":
        this.gameCamera.toggleView();
        this.props.toggleDisableGrid();
        break;

      default:
        return
    }
  }

  createNewGame = (aiMode = false) => {
    if (this.game) this.game.pause();
    const gameScene = new Scene();
    const gameCamera = new Camera();
    const newGame = new Game(gameScene);
    newGame.updateScore = this.props.updateScore;
    newGame.updateLevel = this.props.updateLevel;
    newGame.updateGameStatus = this.props.updateGameStatus;
    newGame.toggleAiMode = this.props.toggleAiMode;

    if (aiMode) newGame.aiMode = true;

    this.game = newGame;
    this.gameScene = gameScene;
    this.gameCamera = gameCamera;
    this.gameCamera.game = newGame;

    this.props.updateScore(newGame.score);
    this.props.updateLevel(newGame.levelStatus);
  }

  render = () => null;
};


const mapStateToProps = state => {
  return {
    aiMode: state.game.aiMode,
    level: state.game.level,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    updateScore: score => dispatch(updateScore(score)),
    updateLevel: level => dispatch(updateLevel(level)),
    updateGameStatus: status => dispatch(updateGameStatus(status)),
    toggleDisableGrid: () => dispatch(toggleDisableGrid()),
    toggleAiMode: () => dispatch(toggleAiMode()),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GameCanvas);
