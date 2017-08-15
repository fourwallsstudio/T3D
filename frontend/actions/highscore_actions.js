import axios from 'axios';
export const RECEIVE_HIGH_SCORES = 'RECEIVE_HIGH_SCORES';
export const CREATE_HIGH_SCORE = 'CREATE_HIGH_SCORE';

export const fetchHighScores = () => {
  return (dispatch) => {
    return axios.get('/highscores')
      .then( (highscores) => {
          dispatch(receiveHighScores(highscores));
      })
      .catch( err => console.log(err));
  }
}

export const createHighScore = (highscore) => {
  return (dispatch) => {
      return axios.post('/highscores', highscore)
        .then( (hs) => {
          dispatch(fetchHighScores());
        })
        .catch( err => console.log(err));
  }
}

export const receiveHighScores = highscores => {
  return {
    type: RECEIVE_HIGH_SCORES,
    highscores,
  }
}
