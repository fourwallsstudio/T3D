import React from 'react';
import ReactDOM from 'react-dom';
import Root from './components/root';
import GameCanvas from './components/game/game_canvas';
import configureStore from './store/store';


document.addEventListener('DOMContentLoaded', () => {

  const store = configureStore();

  window.getState = store.getState;

  ReactDOM.render(<Root store={ store }/>, document.getElementById('root'));
  ReactDOM.render(<GameCanvas store={ store } />, document.getElementById('myCanvas'));
});
