import React from "react";

import { Centered } from "meteor/empirica:core";
import { Radio, RadioGroup, Button, ButtonGroup } from "@blueprintjs/core";

export default class GameSurvey extends React.Component {
  static stepName = "GameSurvey";
  state = { clarity: "", fairness: "", lookup: "", familiarity: "", feedback: "" };

  constructor(props) {
    super(props);
  }

  handleChange = event => {
    const el = event.currentTarget;
    this.setState({ [el.name]: el.value });
  };

  handleSubmit = event => {
    event.preventDefault();
    for (var key in this.state) {
      const val = this.state[key];
      this.props.player.set(key, val);
    }
    this.props.onSubmit();
  };

  render() {
    const { player } = this.props;
    const { clarity, fairness, lookup, familiarity, feedback } = this.state;
    const { hasNext } = this.props;
    return (
      <Centered>
        <div className="exit-survey">
          <h1> Game Survey </h1>
          <p>
            Thank you for participating! <br/>
            Your final reward for completing the HIT, including the {" "}
            ${player.get("base_reward")} base reward and the accuracy bonus,
            is <strong>${player.get("total_reward")}</strong>. <br/>
            Please submit the following code to receive your bonus: {" "}
            <strong>{player._id}</strong>
          </p>

          <div className="largespace"/>
          Please answer the following short questionnaire about the game.
          Your answers won't affect your reward.
          <div className="largespace"/>
          <form onSubmit={this.handleSubmit}>
            <br />
            <RadioGroup
                label="Were you familiar with the issue in the estimation task
                 before the game?"
                inline={true}
                name="familiarity"
                onChange={this.handleChange}
                selectedValue={familiarity}
            >
              <Radio label="Yes" value="yes" />
              <Radio label="No" value="no" />
            </RadioGroup>

            <div className="largespace"/>

            <RadioGroup
                label="Did you look up the answer to the estimation task online?"
                inline={true}
                name="lookup"
                onChange={this.handleChange}
                selectedValue={lookup}
            >
              <Radio value="yes" label="Yes" />
              <Radio value="no" label="No" />
            </RadioGroup>


            <div className="form-line">
              <label htmlFor="clarity">
                How would you rate the overall clarity of the game and its
                instructions?
                <br/>
                (1 = very unclear, 10 = very clear)
              </label>
              <input
                  type="number"
                  min="1"
                  max="10"
                  step="1"
                  id="clarity"
                  name="clarity"
                  value={clarity}
                  onChange={this.handleChange}
                  autoComplete="off"
              />
            </div>
            <div className="form-line">
              <label htmlFor="fairness">
                Do you feel the pay was fair?
                <br/>
                (1 = very unfair, 10 = very fair)
              </label>
              <input
                  type="number"
                  min="1"
                  max="10"
                  step="1"
                  id="fairness"
                  name="fairness"
                  value={fairness}
                  onChange={this.handleChange}
                  autoComplete="off"
              />
            </div>
            <div className="form-line">
              <label htmlFor="feedback">
                Please enter any feedback, including problems you encountered
                about this HIT below:
              </label>
              <textarea
                  dir="auto"
                  id="feedback"
                  name="feedback"
                  value={feedback}
                  onChange={this.handleChange}
              />
            </div>
            <br />

            <ButtonGroup className={"button-group"}>
              <Button
                  type="button"
                  onClick={this.handleSubmit}
                  disabled={!hasNext}
                  rightIcon="arrow-right"
                  intent="primary"
                  alignText={"right"}
              >
                Next
              </Button>
            </ButtonGroup>
          </form>
        </div>
      </Centered>
    );
  }
}
