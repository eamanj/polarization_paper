import React from "react";

import { Centered } from "meteor/empirica:core";
import { Button, ButtonGroup } from "@blueprintjs/core";

export default class Prime extends React.Component {
  constructor(props) {
    super(props);
    this.articleFile = "ErrorNonExisting.png";
    const { player } = this.props;
    player.set('article', this.articleFile);
  }


  render() {
    const { hasPrev, hasNext, onNext, onPrev } = this.props;

    return (
      <Centered>
        <div className="instructions">
          <h1 className={"bp3-heading"}> Pre-game Task </h1>
          <br />
            <div className="instruction-text">
              Please read the following article taken from Reuters, a non-partisan
              news outlet. On the next screen, we are going to ask you several
              questions about the article. You will need to answer those correctly to
              advance to the game.
            </div>
          <br />
          <br />
          <img src={this.articleFile} />
          
          <ButtonGroup className={"button-group"}>
            <Button
              type="button"
              onClick={onPrev}
              disabled={!hasPrev}
              icon="arrow-left"
            >
              Previous
            </Button>
            <Button
              type="button"
              onClick={onNext}
              disabled={!hasNext}
              rightIcon="arrow-right"
              intent="primary"
              alignText={"right"}
            >
              Next
            </Button>
          </ButtonGroup>
        </div>
      </Centered>
    );
  }
}

