import React from 'react';
import { connect } from 'react-redux';
import { Howl } from 'howler';

class Player extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      sound: null,
      isPaused: true,
      gameStatus: "",
      level: 1
    }

    this.song1 = './assets/We_Send_This.mp3';
    this.song2 = './assets/The_Water_Margin_(Original_Mix).mp3';

    this.howlerPlayer = this.howlerPlayer.bind(this);
    this.handleVolume = this.handleVolume.bind(this);
  }

  componentWillMount() {
    this.howlerPlayer(this.song1);
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.level !== nextProps.level ) {
      if (nextProps.level === 7) {
        this.howlerPlayer(this.song2);
      }
    }

    this.setState({
      gameStatus: nextProps.gameStatus,
      level: nextProps.level
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.gameStatus !== prevState.gameStatus) {

      if (this.state.gameStatus === 'playing') {
        if (this.state.isPaused) {
          this.state.sound.play();
          this.setState({ isPaused: false });
        }

      } else if (this.state.gameStatus === 'paused' ||
      this.state.gameStatus === 'gameover') {
        this.state.sound.pause();
        this.setState({ isPaused: true });
      }
    }

  if (this.state.level !== prevState.level) {
    if (this.state.level === 7) {
        this.state.sound.play();
        this.state.sound.fade(0, 1, 2000);
        this.setState({ isPaused: false });
    }
  }
}

  howlerPlayer(source) {
    if (this.state.sound) { this.state.sound.fade(1, 0, 1000); }

    const howlPlay = new Howl({
      src: [source],
    })

    this.setState({
      sound: howlPlay,
      isPaused: true
    })
  }

  handleVolume() {
    if (this.state.isPaused) {
      this.state.sound.play();
      this.setState({ isPaused: false })

    } else {
      this.state.sound.pause();
      this.setState({ isPaused: true })
    }
  }

  render() {
    let rotate = "";
    let playDisplay;

    if (this.props.level % 2 === 0) {
      rotate = " rotate";
    } else {
      rotate = "";
    }

    if (!this.state.isPaused) {
          playDisplay = (
            <svg viewBox="0 0 21 24">
              <path d="M4.5,0h-3C0.7,0,0,0.7,0,1.6v20.8C0,23.3,0.7,24,1.5,24h3C5.3,24,6,23.3,6,22.4V1.6C6,0.7,5.3,0,4.5,0z M16.5,0h-3C12.7,0,12,0.7,12,1.6v20.8c0,0.9,0.7,1.6,1.5,1.6h3c0.8,0,1.5-0.7,1.5-1.6V1.6C18,0.7,17.3,0,16.5,0z"/>
            </svg>
          );
        } else {
          playDisplay = (
            <svg viewBox="0 0 21 24">
              <path d="M0,21.6V2.4c0-2.2,1.7-3,3.9-1.9l15.5,9.6c2.1,1.1,2.1,2.8,0,3.9L3.9,23.5C1.8,24.6,0,23.7,0,21.6z"/>
            </svg>
          );
        }

    return (
      <div className={"play-pause-button" + rotate} onClick={ this.handleVolume } >
        { playDisplay }
      </div>
    )
  }
}


const mapStateToProps = ({ game }) => {
  return {
    level: game.level,
    gameStatus: game.gameStatus
  }
}

const mapDispatchToProps = state => {
  return {

  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Player);
