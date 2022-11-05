import React from "react";

import { Centered } from "meteor/empirica:core";
import {
  Button,
  ButtonGroup,
  FormGroup,
  Label
} from "@blueprintjs/core";
import Slider from "meteor/empirica:slider";

export default class IndividualStage extends React.Component {
  constructor(props) {
    super(props);
    const { player } = this.props;
    this.stageDuration = 30;

    this.state = {
      guess: player.get("instruction_guess"),
      submitted: false,
      seconds: this.stageDuration
    };

    this.timer = 0;
    this.startTimer = this.startTimer.bind(this);
    this.countDown = this.countDown.bind(this);
  }

  componentDidMount() {
    this.startTimer();
  }

//prevents memory leak: https://egghead.io/lessons/react-stop-memory-leaks-with-componentwillunmount-lifecycle-method-in-react
  componentWillUnmount() {
    clearInterval(this.timer);
    clearInterval(this.countDown);
  }

  startTimer() {
    if (this.timer === 0 && this.state.seconds > 0) {
      this.timer = setInterval(this.countDown, 1000);
    }
  }

  countDown() {
    let seconds = this.state.seconds - 1;

    if (!this.state.submitted) {
      // Remove one second, set state so a re-render happens.
      this.setState({
        seconds: seconds
      });
    }

    // Check if we're at zero.
    if (seconds === 0) {
      this.setState({ submitted: true });
    }
  }

  handleChange = num => {
    const value = Math.round(num * 100) / 100;
    this.setState({ guess: value });
  };

  handleRelease = num => {
    const { player } = this.props;
    const value = Math.round(num * 100) / 100;
    player.set("instruction_first_guess", value);
  };

  handleSubmit = event => {
    event.preventDefault();
    this.setState({ submitted: true });
  };

  handleReset = event => {
    event.preventDefault();
    this.setState({ submitted: false });
    this.setState({ seconds: this.stageDuration });
  };

  renderTimer(){
    const remainingSeconds = this.state.seconds;

    const classes = ["timer"];
    if (remainingSeconds <= 5) {
      classes.push("lessThan5");
    } else if (remainingSeconds <= 10) {
      classes.push("lessThan10");
    }

    return (
        <div className={classes.join(" ")}>
          <h4>Timer</h4>
          <span className="seconds">{remainingSeconds}</span>
        </div>
    );
  }

  renderInstructions() {
    return (
        <div>
          The game has <strong>five stages</strong>. There is one individual stage, followed by
          four group stages. On this page, we show a sample of how the first stage looks like.

          <div className="mediumspace"/>

          <h3 className="bp3-heading">
            1. The Individual Stage
          </h3>
          <p>
            In the <strong>Individual</strong> stage, you will be asked to
            answer a factual question like the one shown below. Even if you
            don't know the exact answer, try your best by guessing as close
            as possible to the correct answer. <u>To enter your answer you
            can use the slider to pick a value and then click Submit to register
            your response</u>. You can take a maximum of <strong>{this.stageDuration}
            {" "} seconds</strong> to submit your answer <u>in the individual stage</u>.
            <br />
            <br />
            The question below is a <span className="underline">sample</span> question
            and during the actual game, you will be asked a different question.
            During the game, other players will be answering the same question. Their
            answers will be shown to you to the right of your profile after you
            submit (in the second stage).
          </p>
          <br />
        </div>
    );
  }

  renderProfile() {
    const { player } = this.props;
    return (
        <aside className="player-profile">
          <h3>Your Profile</h3>
          <img src={player.get("avatar")} className="profile-avatar" />
          {this.renderTimer()}
        </aside>
    );
  }

  renderTaskStimulus() {
    return(
        <div className="task-stimulus">
          <img src="snap.png" />
          <br />
          <strong>What percentage of food stamp (SNAP) recipients do you believe are
          employed full time or part time?</strong> Please answer with a number
          between 0-100 using the slider.
        </div>
    );
  }

  renderSlider() {
    const guess = this.state.guess;
    return (
        <FormGroup>
          <Label>
            Your current estimate is: {guess}
          </Label>
          <Slider
              min={0}
              max={100}
              stepSize={1}
              labelStepSize={20}
              onChange={this.handleChange}
              onRelease={this.handleRelease}
              value={guess}
              hideHandleOnEmpty
              disabled={this.state.submitted}
          />
        </FormGroup>
    );
  }

  renderSubmit() {
    if (this.state.submitted) {
      return(
          <FormGroup>
            <Button
                icon={"refresh"}
                minimal={true}
                intent={"primary"}
                fill={true}
                onClick={this.handleReset}
            >
              <span>
                try again (If this were the real game, we would have
                just recorded your response.)

              </span>
            </Button>
          </FormGroup>
      );
    } else {
      return (
          <FormGroup>
            <Button
                type="submit"
                fill={true}
            >
              Submit
            </Button>
          </FormGroup>
      );
    }
  }

  renderTaskResponse() {
    return (
        <div className="task-response">
          <form onSubmit={this.handleSubmit}>
            {this.renderSlider()}
            {this.renderSubmit()}
          </form>
        </div>
    );
  }

  renderTask() {
    return(
        <div className="task">
          {this.renderTaskStimulus()}
          {this.renderTaskResponse()}
        </div>
    );
  }

  renderSocialExposure() {
    return (
        <div className="social-exposure">
          <h3>
            Other players' answers will be shown here once you submit.
          </h3>
        </div>
    );
  }


  render() {
    const { hasPrev, hasNext, onNext, onPrev } = this.props;

    return (
        <Centered>
          <div className="instructions">
            <h1 className={"bp3-heading"}> An <span className="underline">Example</span> Game</h1>

            {this.renderInstructions()}

            <div className="round">
              <div className="content">
                {this.renderProfile()}
                {this.renderSocialExposure()}
                {this.renderTask()}
              </div>
            </div>

            <ButtonGroup className={"button-group"}>
              <Button
                  type="button"
                  onClick={onPrev}
                  disabled={!hasPrev}
                  icon="arrow-left"
              >
                Previous
              </Button>
              <Button
                  type="button"
                  onClick={onNext}
                  disabled={!hasNext}
                  rightIcon="arrow-right"
                  intent="primary"
                  alignText={"right"}
              >
                Next
              </Button>
            </ButtonGroup>

          </div>
        </Centered>
    );
  }
}
