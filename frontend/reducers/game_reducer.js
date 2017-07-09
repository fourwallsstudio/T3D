import {
  UPDATE_SCORE,
  UPDATE_LEVEL,
  UPDATE_GAME_STATUS,
  DISABLE_GRID
} from '../actions/game_actions';
import { merge } from 'lodash';

const defaultState = {
  score: 0,
  level: 1,
  gameStatus: 'welcome',
  gridDisable: false
}

const gameReducer = (state = defaultState, action) => {
  Object.freeze(state);

  switch (action.type) {

    case UPDATE_SCORE:
      return merge({}, state, { score: action.score });

    case UPDATE_LEVEL:
      return merge({}, state, { level: action.level });

    case UPDATE_GAME_STATUS:
      return merge({}, state, { gameStatus: action.status })

    case DISABLE_GRID:
      let grid = !state.gridDisable
      return merge({}, state, { gridDisable: grid })

    default:
      return state;
  }

}

export default gameReducer;