import React from "react";

import { Centered } from "meteor/empirica:core";
import { Button, ButtonGroup } from "@blueprintjs/core";

export default class Overview extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { hasPrev, hasNext, onNext, onPrev } = this.props;

    return (
      <Centered>
        <div className="instructions">
          <h1 className={"bp3-heading"}> Game Overview </h1>
          <p>
            After completing the instructions and comprehension check, you will
            begin the game.
          </p>
          <div className="smallspace"/>
          The game consists of multiple stages. You will play simultaneously with at least one
          other player.
          <div className="smallspace"/>
          1- In the first stage, <strong> you will be asked to answer a question.</strong>
          <br />
          2- In the subsequent stages, <strong>you will be shown the answer the other
          players provided to the same question and you will have another attempt
          for answering the same question. </strong>
          <div className="smallspace"/>
          The next two pages explain the different stages of the game in more detail.
          <div className="smallspace"/>
          <br />

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

