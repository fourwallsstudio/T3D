import React from 'react';
import { Provider } from 'react-redux';
import Displays from './displays/displays';
import Player from './player/player';

const Root = ({ store }) => {
  return (
      <Provider store={ store }>
        <div>
          <Displays store={ store } />
          <Player store={ store } />
        </div>
      </Provider>
  )
};

export default Root;
