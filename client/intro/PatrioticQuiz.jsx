import React from "react";

import { Centered } from "meteor/empirica:core";
import { Button, ButtonGroup } from "@blueprintjs/core";

export default class PatrioticQuiz extends React.Component {
  constructor(props) {
    super(props);
    const { player } = this.props;
    // Prefill the answers with players data in case they have already
    // filled something in previous renderings
    const boston_val = player.get("boston") == undefined ? "" : player.get("boston");
    const hotdog_val = player.get("hotdog") == undefined ? "" : player.get("hotdog");
    const champ_val = player.get("champion") == undefined ? "" : player.get("champion");
    this.state = { boston: boston_val, hotdog: hotdog_val, champion: champ_val };
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

    const state_answer = this.state.boston.trim().toLowerCase();
    const hotdog_answer = this.state.hotdog.trim().toLowerCase();
    const champion_answer = this.state.champion.trim().toLowerCase();

    const state_valid_answers = ["old state house", "state house",
                                 "boston old state house", "boston state house",
                                 "bostons old state house", "bostons state house",
                                 "boston's old state house", "boston's state house"];
    const hotdog_valid_answers = ["62 hotdogs", "62 hotdog"];

    if (!(state_valid_answers.includes(state_answer)) ||
        (parseFloat(hotdog_answer) !== 62 &&
         !(hotdog_valid_answers.includes(hotdog_answer))) ||
        champion_answer !== "jack dietz") {
      alert("Incorrect! Please read the article carefully, and try again.");
    } else {
      this.props.onNext();
    }
  };

  render() {
    const { hasPrev, onPrev } = this.props;
    const { boston, hotdog, champion } = this.state;
    return (
      <Centered>
        <div className="quiz">
          <h1> Quiz </h1>
          <form onSubmit={this.handleSubmit}>
            <p>
              <label htmlFor="boston">
                On July 4, 1776, America gained independence. Where did crowds in
                Boston gathered to hear a reading of the Declaration of Independence
                according to the article?
              </label>
              <input
                type="text"
                dir="auto"
                id="boston"
                name="boston"
                placeholder="e.g. the national mall"
                value={boston}
                onChange={this.handleChange}
                autoComplete="off"
                required
              />
            </p>
            <p>
              <label htmlFor="hotdog">
                How many hot-dogs did Matt Stonie eat to win the annual Nathan’s
                International Hot Dog Eating Contest?
              </label>
              <input
                type="text"
                dir="auto"
                id="hotdog"
                name="hotdog"
                placeholder="e.g. 999"
                value={hotdog}
                onChange={this.handleChange}
                autoComplete="off"
                required
              />
            </p>
            <p>
              <label htmlFor="champion">
                Who holds the title for the "Watermelon Seed Spittin’ World
                Championship", held annually in Pauls Valley? Please state name and
                surname.
              </label>
              <input
                  type="text"
                  dir="auto"
                  id="champion"
                  name="champion"
                  placeholder="e.g. hulk hogan"
                  value={champion}
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
