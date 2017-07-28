import React from 'react';
import { connect } from 'react-redux';
import * as Shape from '../../util/shapes_util';
import * as Game from '../../util/game_util';
import * as AI from '../../util/ai_util';
import {
  updateScore,
  updateLevel,
  updateGameStatus,
  disableGrid
} from '../../actions/game_actions';
var THREE = require('three');

const ThreeCanvas = props => {

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(
    100,
    window.innerWidth / window.innerHeight,
    0.1,
    100,
  );
  camera.position.z = 13;
  camera.position.y = 12;
  camera.position.x = 0.5;
  camera.lookAt( new THREE.Vector3(0.5,12,0) );


  var renderer = new THREE.WebGLRenderer(
    {
      canvas: document.getElementById("myCanvas"),
      alpha: true,
    }
  );
  renderer.setSize( window.innerWidth, window.innerHeight );


  // LIGHT
  var light = new THREE.AmbientLight(0xffffff, 0.1);
  var light2 = new THREE.PointLight(0xffffff, .8, 100);
  var light3 = new THREE.PointLight(0xffffff, .8, 100);
  var light4 = new THREE.PointLight(0xffffff, .8, 100);
  var light5 = new THREE.PointLight(0xffffff, .8, 100);
  light2.position.set( 0, 6, 10 );
  light3.position.set( 0, 6, -10 );
  light4.position.set( 0, 20, 10 );
  light5.position.set( 0, 20, -10 );
  scene.add(light, light2, light3);


  // BORDER
  var geometryB = new THREE.PlaneGeometry(0.1, 25);
  var materialB = new THREE.MeshBasicMaterial(
    {
      color: 0xffffff,
      side: THREE.DoubleSide
    }
  );
  var border1 = new THREE.Mesh( geometryB, materialB );
  var border2 = new THREE.Mesh( geometryB, materialB );
  border1.position.set(-6, 12, 0);
  border2.position.set(7, 12, 0);
  scene.add(border1, border2);



  // NEW SHAPE
  let shapeIndex = 0;
  let newShape = Game.nextShape(shapeIndex);
  let newRotateDeltas = Shape.rotateDeltas[shapeIndex];
  scene.add(...newShape);


  // USER CONTROLS
  let speed = Game.speed();
  let boost = 0;
  let shapeDeltaIndex = 0;
  let viewRegular = true;
  let switchDisabled = false;

  document.addEventListener("keypress", function(e) {
    switch(e.key) {

      case "w":
        if (Game.rotatable(newShape, newRotateDeltas, shapeDeltaIndex)) {
          Game.rotateShape(newShape, newRotateDeltas, shapeDeltaIndex);
          shapeDeltaIndex += 1;
        }
        break;

      case "s":
        boost = .3;
        break;

      case "a":
        Game.moveLeft(newShape)
        break;

      case "d":
        Game.moveRight(newShape)
        break;

      case "p":
        playAndPause()
        aiPlay(...aiMoves)
        break;

      case "r":
        window.location.reload(false);
        break;

      case "v":
        toggleView();
        break;

      default:
        return;
    }
  })

  const toggleView = () => {
    if (viewRegular) {

      camera.position.z = 4;
      camera.position.y = -2;
      camera.lookAt( new THREE.Vector3(0.5,24,-5) );
      viewRegular = false;
      switchDisabled = true;
      props.disableGrid();

    } else {

      camera.position.z = 13;
      camera.position.y = 12;
      camera.position.x = 0.5;
      camera.lookAt( new THREE.Vector3(0.5,12,0) );
      viewRegular = true;
      switchDisabled = false;
      props.disableGrid();
    }
  }


  // AI
  let shapeDeltas = Shape.deltas[shapeIndex % 7]
  let aiMoves = AI.generateMove(shapeDeltas, newRotateDeltas);


  const aiPlay = (moveIndex, rotations) => {

    aiRotate(rotations)

    aiMakeMove(moveIndex)

    boost = .3;
  }


  const aiRotate = rotations => {

    for (let i = 0; i < rotations; i++) {

      Game.rotateShape(newShape, newRotateDeltas, i)
      shapeDeltaIndex += 1
    }
  }


  const aiMakeMove = moveIndex => {

    let furthestLeftIndex = AI.findFurthestLeft(newShape);

    while (newShape[furthestLeftIndex].position.x !== moveIndex) {

      if (moveIndex < newShape[furthestLeftIndex].position.x) {

        Game.moveLeft(newShape)

      } else {

        Game.moveRight(newShape)
      }
    }
  }


  // ANIMATION
  let isPaused = true;
  let aniFrame;
  let cameraDelta = 0;

  const animate = () => {

    if ( Game.over() ) {
      props.updateGameStatus("gameover");
      playAndPause();
    }

    // if (!switchDisabled) {
    //   if ( Game.levelStatus % 2 === 0 ) {
    //     speed = 0;
    //     switchAnimate();
    //
    //   } else if ( Game.levelStatus % 2 === 1
    //     && Game.levelStatus > 1 ) {
    //       speed = 0;
    //       switchBackAnimate();
    //
    //     } else {
    //       speed = Game.speed();
    //     }
    // }

    if (!newShape.some( c => Game.stillShapes[c.position.x]
      .includes(Math.ceil(c.position.y) - 1) )) {

      Game.moveCubes(newShape, speed, boost)

    } else {

      shapeDeltaIndex = 0;
      boost = 0;
      shapeIndex += 1 ;

      Game.addStillShape(newShape, scene);

      for (var row in Game.allCubes) {
        if ( Game.allCubes[row].length === 12 ) {
          completeRow();
        }
      }

      newShape = Game.nextShape(shapeIndex);
      newRotateDeltas = Shape.rotateDeltas[shapeIndex % 7];

      scene.add( ...newShape );

      shapeDeltas = Shape.deltas[shapeIndex % 7]
      aiMoves = AI.generateMove(shapeDeltas, newRotateDeltas);
      aiPlay(...aiMoves)
    }


    aniFrame = requestAnimationFrame( animate );
    renderer.render( scene, camera );
  }


  const completeRow = () => {
    let rows = [];

    for (var row in Game.allCubes) {
      if ( Game.allCubes[row].length === 12 ) {
        rows.push(row);
      }
    }

    rows.forEach( row => {
      Game.allCubes[row].forEach( c => {
        c.position.z = -0.25;
      })
    })

    setTimeout( () => {
      Game.fullRow(scene);

      props.updateScore(Game.score);
    }, 100);

  }


  const playAndPause = () => {
    if (isPaused) {

      animate();
      isPaused = !isPaused;
      props.updateGameStatus('playing');

    } else {

      cancelAnimationFrame( aniFrame );
      isPaused = !isPaused;
      props.updateGameStatus('paused');
    }
  }


  let aniFrame2;

  const switchAnimate = () => {
    if (Math.sin(cameraDelta) >= 0) {

      cameraDelta += 0.05;
      camera.lookAt( new THREE.Vector3(0.5,12,0) );
      camera.position.y = 12;
      camera.position.x = Math.sin(cameraDelta) * 13;
      camera.position.z = Math.cos(cameraDelta) * 13;

    } else {

      camera.lookAt( new THREE.Vector3(0.5,12,0) );
      camera.position.set(0.5, 12, -13);
      speed = Game.speed();
    }

    props.updateLevel(Game.levelStatus);
  }

  const switchBackAnimate = () => {
    if (Math.sin(cameraDelta) <= 0) {

      cameraDelta += 0.05;
      camera.lookAt( new THREE.Vector3(-0.5,12,0) );
      camera.position.y = 12;
      camera.position.x = Math.sin(cameraDelta) * 13;
      camera.position.z = Math.cos(cameraDelta) * 13;

    } else {

      camera.lookAt( new THREE.Vector3(0.5,12,0) );
      camera.position.set(0.5, 12, 13);
      speed = Game.speed();
    }

    props.updateLevel(Game.levelStatus);
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
    disableGrid: () => dispatch(disableGrid())
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ThreeCanvas);
