import React from "react";

import { Centered } from "meteor/empirica:core";
import { Button, ButtonGroup } from "@blueprintjs/core";

export default class Rewards extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { hasPrev, hasNext, onNext, onPrev } = this.props;

    return (
      <Centered>
        <div className="instructions">
          <h1 className={"bp3-heading"}>How is your reward computed? </h1>
          Your reward will be based on the accuracy of your submitted answers in all
          stages, before and after observing the answer provided by the other
          players. The accuracy of all stages contribute <strong> equally </strong>
          to your reward, so you should try your best to be accurate in all stages.
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

