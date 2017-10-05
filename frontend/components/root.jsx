import React from 'react';
import { Provider } from 'react-redux';
import Displays from './displays/displays';

const Root = ({ store }) => {
  return (
      <Provider store={ store }>
        <div>
          <Displays store={ store } />
        </div>
      </Provider>
  )
};

export default Root;
