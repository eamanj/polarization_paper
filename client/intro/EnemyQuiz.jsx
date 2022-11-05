// Quiz for article IsisOrganHarvesting.png
import React from "react";

import { Centered } from "meteor/empirica:core";
import { Button, ButtonGroup } from "@blueprintjs/core";

export default class EnemyQuiz extends React.Component {
  constructor(props) {
    super(props);
    const { player } = this.props;
    // Prefill the answers with players data in case they have already
    // filled something in previous renderings
    const prov_val = player.get("province") == undefined ? "" : player.get("province");
    const off_val = player.get("official") == undefined ? "" : player.get("official");
    const city_val = player.get("city") == undefined ? "" : player.get("city");
    this.state = { province: prov_val, official: off_val, city: city_val };
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

    if (this.state.province.trim().toLowerCase() !== "hormozgan" ||
        this.state.official.replace(/\s+/g, " ").trim().toLowerCase() !== "nikolai patrushev" ||
        this.state.city.trim().toLowerCase() !== "beijing") {
      alert("Incorrect! Please read the article carefully, and try again.");
    } else {
      this.props.onNext();
    }
  };

  render() {
    const { hasPrev, onPrev } = this.props;
    const { province, official, city } = this.state;
    return (
      <Centered>
        <div className="quiz">
          <h1> Quiz </h1>
          <form onSubmit={this.handleSubmit}>
            <p>
              <label htmlFor="province">
                What is the name of the province in which the Iranian Revolutionary guards allegedly shoot down a U.S. drone?
              </label>
              <input
                type="text"
                dir="auto"
                id="province"
                name="province"
                placeholder="e.g. Tehran"
                value={province}
                onChange={this.handleChange}
                autoComplete="off"
                required
              />
            </p>
            <p>
              <label htmlFor="official">
                What is the name of the Russian official who said that "Russia had military intelligence
                showing the U.S. drone in Iranian airspace when it was shot down"? Please state name and
                surname with a space between.
              </label>
              <input
                type="text"
                dir="auto"
                id="official"
                name="official"
                placeholder="e.g. Vladimir Putin"
                value={official}
                onChange={this.handleChange}
                autoComplete="off"
                required
              />
            </p>
            <p>
              <label htmlFor="city">
                In which city did Wang Yi and Javad Zarif meet to discuss the strengthening of relations
                between China and Iran?
              </label>
              <input
                  type="text"
                  dir="auto"
                  id="city"
                  name="city"
                  placeholder="e.g. New York"
                  value={city}
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
