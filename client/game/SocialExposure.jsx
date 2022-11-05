import React from "react";
import Slider from "meteor/empirica:slider";

export default class SocialExposure extends React.Component {
  renderSocialInteraction(neighbor) {
    const { stage } = this.props;
    const responses = neighbor.get('responses');
    const last_stage_index = stage.index - 1;
    const last_stage_response = responses[last_stage_index];
    return (
      <div className="alter" key={neighbor._id}>
        <img src={neighbor.get("avatar")} className="alter-avatar" />
        <div className="range">
          <Slider
            min={0}
            max={100}
            stepSize={1}
            labelStepSize={50}
            value={last_stage_response}
            disabled
            hideHandleOnEmpty
          />
        </div>
      </div>
    );
  }

  render() {
    const { game, stage, player } = this.props;
    const neighbor_ids = player.get("neighbor_ids");

    if (neighbor_ids.length === 0) {
      return null;
    }
    const neighbors = _.filter(game.players, p => neighbor_ids.includes(p._id));
    const num_neighbors = neighbors.length;

    return (
      <div className="social-exposure">
        <h3>
        {stage.name.includes("group")
          ? num_neighbors === 1
                ? `There is ${num_neighbors} other player.`
                : `There are ${num_neighbors} other players.`
          : 'The answer of other players will be shown here once you submit.'}
        </h3>
        {stage.name.includes("group")
          ? neighbors.map(p => this.renderSocialInteraction(p))
          : ""}
      </div>
    );
  }
}
