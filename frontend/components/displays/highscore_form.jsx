import React from 'react';

export default class HighScoreForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = { name: '' }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(e) {
    e.preventDefault();
    if (e.target.value.length <= 3) {
      this.setState({ name: e.target.value.toUpperCase() });
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.handleClick();

    this.props.createHighScore({
      username: this.state.name,
      score: this.props.score
    })

    this.props.disableHighScoreForm();
    this.props.updateScore(0);
    this.props.updateGameStatus('gameover');
  }


  render() {

    return (
      <div className='highscore-form-container' >
        <form onSubmit={ this.handleSubmit }>
          <h1>Add 3 Letter Name</h1>
          <input value={ this.state.name } onChange={ this.handleChange } ></input>
          <button>Submit</button>
        </form>
      </div>
    )
  }
}
