import React from 'react';
import { connect } from 'react-redux';
import { updateGrid } from '../../actions/game_actions';

class Displays extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      gridActive: false,
      gridDisable: false
    }

    const that = this;

    document.addEventListener("keypress", function(e) {
      if (e.key === 'g') {
        that.setState({
          gridActive: !that.state.gridActive
        })
      }
    })
  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      gridDisable: nextProps.gridDisable
    })
  }

  render() {
    let hidden = "";
    let rotate = "";
    let levelSeven = "";
    let gameover = "";
    let gridActive = "";

    if (this.props.level % 2 === 0) {
      rotate = " rotate";
    } else {
      rotate = "";
    }

    if (this.props.level === 7) {
      levelSeven = " level-seven";
    }

    if (this.props.gameStatus !== 'welcome') { hidden = ' hidden'};
    if (this.props.gameStatus === 'gameover') { gameover = ' gameover'};
    if (this.state.gridDisable || !this.state.gridActive) {
      gridActive = "";
    } else {
      gridActive = ' grid-active';
    }


    return (
      <section>
        <div className={"backgound-black" + levelSeven}></div>
        <div className={"keyboard-wasd" + rotate}>
          <img  src="assets/wasd.png"></img>
        </div>
        <div className={"keyboard-play" + rotate}>
          <img  src="assets/playpause.png"></img>
        </div>

        <div className={"opening" + hidden}>
          <h1>t3d</h1>
          <img  src="assets/playpause.png"></img>
        </div>
        <div className={"gameover-display" + gameover}>
          <h1>game over</h1>
        </div>

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

        <div className="contact-container">
          <a href="http://calvinmcelroy.us/"><p>calvinmcelroy.us</p></a>
          <a href="mailto:fourwallsstudio@gmail.com"><p>fourwallsstudio@gmail.com</p></a>
          <div className="contact-icons-box">
            <a href="https://github.com/fourwallsstudio" className="github-img">
              <img src="assets/github.png"></img>
            </a>
            <a href="https://angel.co/calvin-mcelroy-1" className="angellist-img">
              <img src="assets/angellist.png"></img>
            </a>
            <a href="https://www.linkedin.com/in/calvin-mcelroy-04253210b/" className="linkedin-img">
              <img src="assets/linkedin.png"></img>
            </a>
          </div>
        </div>

      </section>
    )
  }

}



const mapStateToProps = ({ game }) => {
  return {
    score: game.score,
    level: game.level,
    gameStatus: game.gameStatus,
    gridDisable: game.gridDisable
  }
}

export default connect(
  mapStateToProps,
  null
)(Displays)
