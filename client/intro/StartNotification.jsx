import React from "react";

import { Centered } from "meteor/empirica:core";
import { Button, ButtonGroup } from "@blueprintjs/core";

export default class StartNotification extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { hasPrev, hasNext, onNext, onPrev } = this.props;

    return (
      <Centered>
        <div className="start-notification">
          <br />
          <br />
          <br />
          <br />
          <br />
          <p>
            Now you are ready to play! The game starts after an attention check.
          </p>
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

