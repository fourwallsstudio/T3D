import React from 'react';

const HighScoreDisplay = (props) => {

  const highscores = props.highscores.map( (hs) => {
    return (
      <li key={ hs.id } >
        <h2>{hs.username}</h2>
        <h2>{hs.score}</h2>
      </li>
    )
  })

  return (
    <ul className="highscore-display-container">
      <h1>HIGH SCORES</h1>
      { highscores }
    </ul>
  )
};

export default HighScoreDisplay;
