import React from 'react';
import { connect } from 'react-redux';
import { updateGrid, updateGameStatus } from '../../actions/game_actions';
import { fetchHighScores, createHighScore } from '../../actions/highscore_actions';
import AddHighScoreForm from './add_highscore_form';
import HighScoreDisplay from './highscore_display';

class Displays extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      gridActive: false,
      gridDisable: false,
      addHighScoreModalActive: false,
      highScoreDisplay: false,
    }

    document.addEventListener("keypress", function(e) {
      if (e.key === 'g') {
        this.setState({
          gridActive: !this.state.gridActive
        })
      }
    }.bind(this))

    this.handleClick = this.handleClick.bind(this);
    this.handleHSToggle = this.handleHSToggle.bind(this);
  }

  componentDidMount() {
    this.props.fetchHighScores()
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.gridDisable !== nextProps.gridDisable) {
      this.setState({ gridDisable: nextProps.gridDisable });
    }

    if (nextProps.gameStatus === 'gameover'
        && (nextProps.highscores.length === 0
        || nextProps.highscores[nextProps.highscores.length - 1].score <= nextProps.score)) {

        this.setState({ addHighScoreModalActive: true })
    }
  }

  handleClick() {
    this.setState({
      addHighScoreModalActive: false,
      highScoreDisplay: true
    });
  }

  handleHSToggle() {
    this.setState({ highScoreDisplay: !this.state.highScoreDisplay });
  }

  render() {
    const hidden = this.props.gameStatus !== 'welcome' ? ' hidden' : '';
    const rotate = this.props.level % 2 === 0 ? ' rotate' : '';
    const sky = this.props.level > 20 ? ' sky' : '';
    const gameover = this.props.gameStatus === 'gameover' ? ' gameover' : '';
    const gridActive = this.state.gridDisable || !this.state.gridActive
      ? '' : ' grid-active'
    let addHighScoreModal;
    let highScoreDisplay;

    if (this.state.addHighScoreModalActive) {
      addHighScoreModal = <AddHighScoreForm
                            createHighScore={ this.props.createHighScore }
                            score={ this.props.score }
                            handleClick={ this.handleClick }
                            updateGameStatus={ this.props.updateGameStatus } />;
    } else {
      addHighScoreModal = "";
    }

    if (this.state.highScoreDisplay) {
      highScoreDisplay = <HighScoreDisplay
                            highscores={ this.props.highscores } />;
    } else {
      highScoreDisplay = "";
    }

    return (
      <section>
        <div className={"backgound-black" + sky}></div>
        <div className={"keyboard-wasd" + rotate}>
          <img  src="assets/wasd.png"></img>
        </div>
        <div className={"keyboard-play" + rotate}>
          <img  src="assets/playpause.png"></img>
        </div>

        <div className={"opening" + hidden}>
          <h1>t3d</h1>
          <img  src="assets/playpause.png"></img>
          <p>
            t3d is a 3d version of the classic tetris game. <br /><br />
            Use the keyboard to play: <br /><br />
            "a": move left <br />
            "d": move right <br />
            "w": rotate piece <br />
            "a": drop piece <br /><br />
            "p": play / pause game <br />
        </p>
        </div>
        <div className={"gameover-display" + gameover}>
          <h1>game over</h1>
        </div>

        { highScoreDisplay }
        { addHighScoreModal }

        <div className={"grid-box" + gridActive}>
          <div className="grid"></div>
          <div className="grid"></div>
          <div className="grid"></div>
          <div className="grid"></div>
          <div className="grid"></div>
          <div className="grid"></div>
          <div className="grid"></div>
          <div className="grid"></div>
          <div className="grid"></div>
          <div className="grid"></div>
          <div className="grid"></div>
          <div className="grid"></div>
        </div>

        <aside className={"display-aside" + rotate}>
          <h1>t3d</h1>
          <div className="lvl">
            <h2>level</h2>
            <p>{ this.props.level }</p>
          </div>
          <div className="score-board">
            <h2>score</h2>
            <p>{ this.props.score }</p>
          </div>
        </aside>

        <div className="controls">
          <div className={"grid-toggle" + rotate}>
            <img  src="assets/grid.png"></img>
          </div>
          <div className={"view-toggle" + rotate}>
            <img  src="assets/view.png"></img>
          </div>
          <div className={"restart-toggle" + rotate}>
            <img  src="assets/restart.png"></img>
          </div>
        </div>

        <div className="highscore-display-toggle" onClick={ this.handleHSToggle }>
          <h1>HS</h1>
        </div>

        <div className="contact-container">
          <a href="http://calvinmcelroy.us/" target="_blank"><p>calvinmcelroy.us</p></a>
          <a href="mailto:fourwallsstudio@gmail.com"><p>fourwallsstudio@gmail.com</p></a>
          <div className="contact-icons-box">
            <a href="https://github.com/fourwallsstudio" target="_blank" className="github-img">
              <img src="assets/github.png"></img>
            </a>
            <a href="https://angel.co/calvin-mcelroy-1" target="_blank" className="angellist-img">
              <img src="assets/angellist.png"></img>
            </a>
            <a href="https://www.linkedin.com/in/calvin-mcelroy-04253210b/" target="_blank" className="linkedin-img">
              <img src="assets/linkedin.png"></img>
            </a>
          </div>
        </div>

      </section>
    )
  }

}



const mapStateToProps = ({ game, highscores }) => {
  return {
    score: game.score,
    level: game.level,
    gameStatus: game.gameStatus,
    gridDisable: game.gridDisable,
    highscores,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchHighScores: () => dispatch(fetchHighScores()),
    createHighScore: hs => dispatch(createHighScore(hs)),
    updateGameStatus: status => dispatch(updateGameStatus(status)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Displays)
