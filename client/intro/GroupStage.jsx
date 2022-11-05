import React from "react";
import Slider from "meteor/empirica:slider";
import IndividualStage from './IndividualStage.jsx';


const avatarNames = "abcdefghijklmnopqrstuvwxyz".split("");
// generate random first responses for the 2 neighbors
const num_neighbors = 3;
const responses = _.times(num_neighbors,
    function randomResponse() { return (Math.floor(Math.random()*200) / 2.0); });

export default class GroupStage extends IndividualStage {
  constructor(props) {
    super(props);
    this.stageDuration = 15;

    this.state = {
      submitted: false,
      seconds: this.stageDuration
    };

    this.timer = 0;
    this.startTimer = this.startTimer.bind(this);
    this.countDown = this.countDown.bind(this);
  }

  handleRelease = num => {
    const { player } = this.props;
    const value = Math.round(num * 100) / 100;
    player.set("instruction_second_guess", value);
  };

  renderInstructions() {
    return (
        <div>
          The game has <strong>five stages</strong>. There is one individual stage, followed by
          four group stages. On this page, we show a sample of how the <u>group stages</u> look
          like.
          <div className="mediumspace"/>

          <h3 className="bp3-heading">
            2. The Group Stages
          </h3>
          <p>
            In the <strong>Group</strong> stages, <span className="underline">you will be
            playing with at least one other player</span>. You will be able to see the answers
            they provided in the previous stage to the right of your profile. If you want,
            you can change your answer to the question based upon the responses of the other
            people playing the game. You again should use the slider to pick your answer
            and click Submit to register your response. You can take a maximum of
            {" "}<strong>{this.stageDuration} seconds</strong> to submit your next answer
            {" "}<u>in the group stages</u>.
          </p>
          <br />
          <div className="verylargespace"/>
        </div>
    );
  }

  renderSocialInteraction(response, index) {
    const neighbor_id = avatarNames[index];
    return (
        <div className="alter" key={neighbor_id}>
          <img src={`/avatars/jdenticon/${neighbor_id}`} className="alter-avatar" />
          <div className="range">
            <Slider
                min={0}
                max={100}
                stepSize={1}
                labelStepSize={50}
                value={response}
                disabled
                hideHandleOnEmpty
            />
          </div>
        </div>
    );
  }

  renderSocialExposure() {
    return (
        <div className="social-exposure">
          <h3>
            {num_neighbors === 1
              ? `There is ${num_neighbors} other player.`
              : `There are ${num_neighbors} other players.`}
          </h3>
          {responses.map((r, index) => this.renderSocialInteraction(r, index))}
        </div>
    );
  }
}


