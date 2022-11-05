// Quiz for article WolfDen.png
import React from "react";

import { Centered } from "meteor/empirica:core";
import { Button, ButtonGroup } from "@blueprintjs/core";

export default class EnemyQuiz2 extends React.Component {
  constructor(props) {
    super(props);
    const { player } = this.props;
    // Prefill the answers with players data in case they have already
    // filled something in previous renderings
    const name_val = player.get("name") == undefined ? "" : player.get("name");
    const cases_val = player.get("cases") == undefined ? "" : player.get("cases");
    const years_val = player.get("years") == undefined ? "" : player.get("years");
    this.state = { name: name_val, cases: cases_val, years: years_val };
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

    if (this.state.name.trim().toLowerCase() !== "omar mateen" ||
        parseFloat(this.state.cases.trim().toLowerCase()) !== 90 ||
        parseFloat(this.state.years.trim().toLowerCase()) !== 15) {
      alert("Incorrect! Please read the article carefully, and try again.");
    } else {
      this.props.onNext();
    }
  };

  render() {
    const { hasPrev, onPrev } = this.props;
    const { name, cases, years } = this.state;
    return (
      <Centered>
        <div className="quiz">
          <h1> Quiz </h1>
          <form onSubmit={this.handleSubmit}>
            <p>
              <label htmlFor="name">
                What was the name of the man who killed 49 people in Orlando's
                Pulse nightclub? (Please state name and surname).
              </label>
              <input
                type="text"
                dir="auto"
                id="name"
                name="name"
                placeholder="e.g. Osama Bin Laden"
                value={name}
                onChange={this.handleChange}
                autoComplete="off"
                required
              />
            </p>
            <p>
              <label htmlFor="cases">
                How many Islamic State court cases were brought by the Department
                of Justice since 2014?
              </label>
              <input
                type="text"
                dir="auto"
                id="cases"
                name="cases"
                placeholder="e.g 999"
                value={cases}
                onChange={this.handleChange}
                autoComplete="off"
                required
              />
            </p>
            <p>
              <label htmlFor="years">
                To how many years in prison was Alaa Saadeh sentenced, as he was
                found guilty conspiring to provide material support to Islamic
                State?
              </label>
              <input
                  type="text"
                  dir="auto"
                  id="years"
                  name="years"
                  placeholder="e.g. 75"
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
