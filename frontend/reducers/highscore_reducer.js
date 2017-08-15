import { RECEIVE_HIGH_SCORES } from '../actions/highscore_actions';

const highScoreReducer = (state = [], action) => {
  switch (action.type) {

    case RECEIVE_HIGH_SCORES:
      return action.highscores.data;

    default:
      return state;
  }
}

export default highScoreReducer;
