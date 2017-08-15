import React from 'react';
import ReactDOM from 'react-dom';
import Root from './components/root';
import ThreeCanvas from './components/three/three_canvas';
import configureStore from './store/store';


document.addEventListener('DOMContentLoaded', () => {

  const store = configureStore();

  window.getState = store.getState;

  ReactDOM.render(<Root store={ store }/>, document.getElementById('root'));
  ReactDOM.render(<ThreeCanvas store={ store } />, document.getElementById('myCanvas'));
});
