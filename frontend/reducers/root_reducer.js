import { combineReducers } from 'redux';
import gameReducer from './game_reducer';
import highScoreReducer from './highscore_reducer';

const rootReducer = combineReducers({
  game: gameReducer,
  highscores: highScoreReducer,
})

export default rootReducer;
