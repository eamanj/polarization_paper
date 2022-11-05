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
    const doc_val = player.get("document") == undefined ? "" : player.get("document");
    const fatwa_val = player.get("fatwa") == undefined ? "" : player.get("fatwa");
    const doctors_val = player.get("doctors") == undefined ? "" : player.get("doctors");
    this.state = { document: doc_val, fatwa: fatwa_val, doctors: doctors_val };
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

    if (this.state.document.trim().toLowerCase() !== "01/31/2015" ||
        parseInt(this.state.fatwa.trim().toLowerCase()) !== 68 ||
        parseInt(this.state.doctors.trim().toLowerCase()) !== 12) {
      alert("Incorrect! Please read the article carefully, and try again.");
    } else {
      this.props.onNext();
    }
  };

  render() {
    const { hasPrev, onPrev } = this.props;
    const { document, fatwa, doctors } = this.state;
    return (
      <Centered>
        <div className="quiz">
          <h1> Quiz </h1>
          <form onSubmit={this.handleSubmit}>
            <p>
              <label htmlFor="document">
                In a document reviewed by Reuters, there is proof that Islamic State has sanctioned the
                harvesting of human organs. In what day was the document published? Please state the date
                in mm/dd/yyyy format.
              </label>
              <input
                type="text"
                dir="auto"
                id="document"
                name="document"
                placeholder="01/20/2000"
                value={document}
                onChange={this.handleChange}
                autoComplete="off"
                required
              />
            </p>
            <p>
              <label htmlFor="fatwa">
                "Organs that end the captive’s life if removed: The removal of that type is also not
                prohibited". What is the number of the Fatwa which sanctioned this rule?
              </label>
              <input
                type="text"
                dir="auto"
                id="fatwa"
                name="fatwa"
                placeholder="e.g. 999"
                value={fatwa}
                onChange={this.handleChange}
                autoComplete="off"
                required
              />
            </p>
            <p>
              <label htmlFor="doctors">
                How many doctors were killed in the city of Mosul, allegedly because they refused to
                remove organs?
              </label>
              <input
                  type="text"
                  dir="auto"
                  id="doctors"
                  name="doctors"
                  placeholder="e.g. 75"
                  value={doctors}
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
