import React from "react";

import { Centered } from "meteor/empirica:core";
import { Button, ButtonGroup } from "@blueprintjs/core";

export default class ApoliticalQuiz extends React.Component {
  constructor(props) {
    super(props);
    const { player } = this.props;
    // Prefill the answers with players data in case they have already
    // filled something in previous renderings
    const mile_val = player.get("mile") == undefined ? "" : player.get("mile");
    const stone_val = player.get("stone") == undefined ? "" : player.get("stone");
    const years_val = player.get("years") == undefined ? "" : player.get("years");
    this.state = { mile: mile_val, stone: stone_val, years: years_val };
  }

  handleChange = event => {
    const el = event.currentTarget;
    this.setState({ [el.name]: el.value });

    // store the player answer in case she goes back so we can initialize
    // with her answers upon rerendering
    const { player } = this.props;
    player.set(el.name, el.value);
  };

  handleSubmit = event => {
    event.preventDefault();

    const mile_answer = this.state.mile.replace(/\s+/g, " ").trim().toLowerCase();
    const stone_answer = this.state.stone.trim().toLowerCase();
    const years_answer = this.state.years.trim().toLowerCase();

    const stone_valid_answers = ["38.6 mm", "39 mm", "38 mm",
                                 "38.6 millimeters", "39 millimeters",
                                 "38 millimeters"];
    const years_valid_answers = ["315000 years", "315,000 years",
                                 "315000 yrs", "315,000 yrs",
                                 "315,000"];

    if ((parseFloat(mile_answer) !== 190 && mile_answer !== "190 miles") ||
        ((parseFloat(stone_answer) > 39 || parseFloat(stone_answer) < 38) &&
         !(stone_valid_answers.includes(stone_answer))) ||
        (parseFloat(years_answer) !== 315000 &&
         !(years_valid_answers.includes(years_answer)))) {
      alert("Incorrect! Please read the article carefully, and try again.");
    } else {
      this.props.onNext();
    }
  };

  render() {
    const { hasPrev, onPrev } = this.props;
    const { mile, stone, years } = this.state;
    return (
      <Centered>
        <div className="quiz">
          <h1> Quiz </h1>
          <form onSubmit={this.handleSubmit}>
            <p>
              <label htmlFor="mile">
                How many miles east of Cape Town is Blombos Cave roughly located?
                (please state the number only)
              </label>
              <input
                type="text"
                dir="auto"
                id="mile"
                name="mile"
                placeholder="e.g. 123"
                value={mile}
                onChange={this.handleChange}
                autoComplete="off"
                required
              />
            </p>
            <p>
              <label htmlFor="horse">
                How many millimetres long is the stone flake found in Blombos Cave?
                (please write the answer to the first decimal)
              </label>
              <input
                type="text"
                dir="auto"
                id="stone"
                name="stone"
                placeholder="e.g. 23.8"
                value={stone}
                onChange={this.handleChange}
                autoComplete="off"
                required
              />
            </p>
            <p>
              <label htmlFor="horse">
                How many years ago did Homo sapiens first appear in Africa?
                (please state the number only)
              </label>
              <input
                  type="text"
                  dir="auto"
                  id="years"
                  name="years"
                  placeholder="e.g. 23.8"
                  value={years}
                  onChange={this.handleChange}
                  autoComplete="off"
                  required
              />
            </p>

            <ButtonGroup className={"button-group"}>
              <Button
                  type="button"
                  onClick={onPrev}
                  disabled={!hasPrev}
                  icon="arrow-left"
              >
                Back to article
              </Button>
              <Button
                  type="button"
                  onClick={this.handleSubmit}
                  disabled={false}
                  rightIcon="arrow-right"
                  intent="primary"
                  alignText={"right"}
              >
                Submit
              </Button>
            </ButtonGroup>
          </form>
        </div>
      </Centered>
    );
  }
}
