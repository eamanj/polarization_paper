// Quiz for article RiseFallIsis.png
import React from "react";

import { Centered } from "meteor/empirica:core";
import { Button, ButtonGroup } from "@blueprintjs/core";

export default class EnemyQuiz1 extends React.Component {
  constructor(props) {
    super(props);
    const { player } = this.props;
    // Prefill the answers with players data in case they have already
    // filled something in previous renderings
    const women_val = player.get("women") == undefined ? "" : player.get("women");
    const falluj_val = player.get("fallujah") == undefined ? "" : player.get("fallujah");
    const kurd_val = player.get("kurdish") == undefined ? "" : player.get("kurdish");
    this.state = { women: women_val, fallujah: falluj_val, kurdish: kurd_val };
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

    if ((this.state.women.trim().toLowerCase() !== "7000" &&
         this.state.women.trim().toLowerCase() !== "more than 7000") ||
        this.state.fallujah.trim().toLowerCase() !== "06/2016" ||
        this.state.kurdish.trim().toLowerCase() !== "ypg") {
      alert("Incorrect! Please read the article carefully, and try again.");
    } else {
      this.props.onNext();
    }
  };

  render() {
    const { hasPrev, onPrev } = this.props;
    const { women, fallujah, kurdish } = this.state;
    return (
      <Centered>
        <div className="quiz">
          <h1> Quiz </h1>
          <form onSubmit={this.handleSubmit}>
            <p>
              <label htmlFor="women">
                How many women and girls were forced into sexual slavery
                by the Islamic State in 2014?
              </label>
              <input
                type="text"
                dir="auto"
                id="women"
                name="women"
                placeholder="e.g 999"
                value={women}
                onChange={this.handleChange}
                autoComplete="off"
                required
              />
            </p>
            <p>
              <label htmlFor="fallujah">
                In what month and what year did Iraq take back control of Fallujah?
                Please state the date as mm/yyyy.
              </label>
              <input
                  type="text"
                  dir="auto"
                  id="fallujah"
                  name="fallujah"
                  placeholder="01/1990"
                  value={fallujah}
                  onChange={this.handleChange}
                  autoComplete="off"
                  required
              />
            </p>
            <p>
              <label htmlFor="kurdish">
                What is the name of the Syrian Kurdish militia helped by the US coalition
                in September 2014? Please state the abbreviated name.
              </label>
              <input
                  type="text"
                  dir="auto"
                  id="kurdish"
                  name="kurdish"
                  placeholder="e.g. PKK"
                  value={kurdish}
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
