export const UPDATE_SCORE = 'UPDATE_SCORE';
export const UPDATE_LEVEL = 'UPDATE_LEVEL';
export const UPDATE_GAME_STATUS = 'UPDATE_GAME_STATUS';
export const DISABLE_GRID = 'DISABLE_GRID';

export const updateScore = score => {
  return {
    type: UPDATE_SCORE,
    score
  }
}

export const updateLevel = level => {
  return {
    type: UPDATE_LEVEL,
    level
  }
}

export const updateGameStatus = status => {
  return {
    type: UPDATE_GAME_STATUS,
    status
  }
}

export const disableGrid = () => {
  return {
    type: DISABLE_GRID
  }
}
