import {
  UPDATE_SCORE,
  UPDATE_LEVEL,
  UPDATE_GAME_STATUS,
  TOGGLE_DISABLE_GRID,
  TOGGLE_AI_MODE
} from '../actions/game_actions';
import { merge } from 'lodash';

const defaultState = {
  score: 0,
  level: 1,
  gameStatus: 'welcome',
  gridDisable: false,
  aiMode: false,
}

const gameReducer = (state = defaultState, action) => {
  Object.freeze(state);

  switch (action.type) {

    case UPDATE_SCORE:
      return merge({}, state, { score: action.score });

    case UPDATE_LEVEL:
      return merge({}, state, { level: action.level });

    case UPDATE_GAME_STATUS:
      return merge({}, state, { gameStatus: action.status });

    case TOGGLE_DISABLE_GRID:
      let grid = !state.gridDisable
      return merge({}, state, { gridDisable: grid });

    case TOGGLE_AI_MODE:
      return merge({}, state, { aiMode: !state.aiMode });

    default:
      return state;
  }

}

export default gameReducer;
