import moment from "moment";

import React from "react";
import Slider from "meteor/empirica:slider";

export default class TaskResponse extends React.Component {
  handleChange = num => {
    const { stage, player } = this.props;
    const value = Math.round(num * 100) / 100;
    player.stage.set('value', value);
    var player_last_responses = player.get('last_responses');
    player_last_responses[stage.index] = value;
    player.set('last_responses', player_last_responses);
    player.set('last_response' + stage.index, value);
  };

  handleSubmit = event => {
    event.preventDefault();
    // Set the player first response before social exposure
    const { stage, player } = this.props;
    const response = Math.round(player.stage.get('value') * 100) / 100;
    var player_responses = player.get('responses');
    //player_responses.push(response);
    player_responses[stage.index] = response;
    player.set('responses', player_responses);
    player.set('response' + stage.index, response);
    // Log when player made its submission
    const now = moment();
    player.set('response' + stage.index + 'TimeAt', now);
    player.stage.submit();
  };

  renderSubmitted() {
    return (
      <div className="task-response">
        <div className="response-submitted">
          <h5>Waiting on other players...</h5>
          Please wait until all other players make another estimate.
        </div>
      </div>
    );
  }

  renderSlider() {
    const { player } = this.props;
    const value = player.stage.get('value');
    return (
      <Slider
        min={0}
        max={100}
        stepSize={1}
        labelStepSize={20}
        onChange={this.handleChange}
        value={value}
        hideHandleOnEmpty
      />
    );
  }

  render() {
    const { player } = this.props;

    // If the player already submitted, don't show the slider or submit button
    if (player.stage.submitted) {
      return this.renderSubmitted();
    }

    return (
      <div className="task-response">
        <form onSubmit={this.handleSubmit}>
          {this.renderSlider()}

          <button type="submit">Submit</button>
        </form>
      </div>
    );
  }
}
