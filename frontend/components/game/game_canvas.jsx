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

    this.state = {
      renderer: null,
      gameCamera: null,
      gameScene: null,
      game: null,
      rotateDisabled: false,
    }

    this.aniFrame = null;
    this.cameraDelta = 0;
  }

  componentWillMount() {
    this.setUpThreeRender();
    this.createNewGame();
  }

  componentDidMount() {
    this.animate();
    this.setUpKeyEvents();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.aiMode !== this.props.aiMode) {
      this.createNewGame(nextProps.aiMode);
    }

    if (nextProps.level !== this.props.level) {
      if (!this.state.rotateDisabled) {
        this.state.game.pause();
        this.rotateCamera();
      }
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.aiMode !== this.props.aiMode) {
      if (this.props.aiMode) {
        this.state.game.setUp();
        this.playPauseToggle();
      }
    }
  }

  setUpThreeRender = () => {
    const gameCamera = new Camera();

    const renderer = new THREE.WebGLRenderer(
      {
        canvas: document.getElementById("myCanvas"),
        alpha: true,
      }
    );
    renderer.setSize( window.innerWidth, window.innerHeight );
    this.setState({ renderer, gameCamera });
  }

  animate = () => {
    this.aniFrame = requestAnimationFrame( this.animate )
    this.state.renderer.render( this.state.gameScene.scene, this.state.gameCamera.camera )
  }

  setUpKeyEvents = () => {
    document.addEventListener("keypress", function(e) {
      this.handleKeyEvent(e);
    }.bind(this))
  }

  handleKeyEvent = (e) => {
    const game = this.state.game;

    switch(e.key) {

      case "w":
        game.rotateShape()
        break;

      case "s":
        game.boost = 0.3;
        break;

      case "a":
        game.moveShapeHorizontal('left')
        break;

      case "d":
        game.moveShapeHorizontal('right')
        break;

      case "p":
        if (!game.inProgress) game.setUp();
        this.playPauseToggle()
        break;

      case "r":
        game.pause()
        game.wipeGrid()
        this.createNewGame()
        this.props.updateGameStatus('welcome')
        break;

      case "v":
        this.toggleCameraView()
        break;

      default:
        return
    }
  }

  createNewGame = (aiMode = false) => {
    if (this.state.game) this.state.game.pause();
    const gameScene = new Scene();
    const newGame = new Game(gameScene);
    newGame.updateScore = this.props.updateScore;
    newGame.updateLevel = this.props.updateLevel;
    newGame.updateGameStatus = this.props.updateGameStatus;
    newGame.toggleAiMode = this.props.toggleAiMode;

    if (aiMode) newGame.aiMode = true;

    this.setState({ gameScene, game: newGame })
  }

  playPauseToggle = () => {
    const game = this.state.game;

    if (game.isPaused) {

      game.play()
      game.isPaused = !game.isPaused
      this.props.updateGameStatus('playing')

    } else {

      game.pause()
      game.isPaused = !game.isPaused
      this.props.updateGameStatus('paused')
    }
  }

  rotateCamera() {
    const camera = this.state.camera.camera;
    const evenLevel = this.props.level % 2 === 0;
    const rotating = evenLevel
                      ? Math.sin(this.cameraDelta) >= 0
                      : Math.sin(this.cameraDelta) <= 0;
    const vectorX = evenLevel ? 0.5 : -0.5;
    const setZ = evenLevel ? -13 : 13;

    if (rotating) {

      this.cameraDelta += 0.05;
      camera.lookAt( new THREE.Vector3(vectorX, 12, 0) )
      camera.position.y = 12;
      camera.position.x = Math.sin(this.cameraDelta) * 13;
      camera.position.z = Math.cos(this.cameraDelta) * 13;

    } else {

      camera.position.set(0.5, 12, setZ)
      camera.lookAt( new THREE.Vector3(0.5, 12, 0) )
      this.stopRotate()
      return;
    }

    this.aniFrame = requestAnimationFrame(this.rotateCamera)
    this.renderer.render(this.scene.scene, this.camera.camera)
  }

  stopRotate() {
    cancelAnimationFrame(this.aniFrame)
    this.aniFrame = undefined;
    this.state.game.play();
  }

  toggleCameraView = () => {
    this.state.camera.toggleView();
    this.props.toggleDisableGrid();
    this.setState({ rotateDisabled: !this.state.rotateDisabled })
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
