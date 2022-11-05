import React from "react";

import { Centered } from "meteor/empirica:core";
import { Button, ButtonGroup } from "@blueprintjs/core";

// minimum and maximum wait times before game starts in seconds
const MIN_WAITTIME = 30;
const MAX_WAITTIME = 90;

export default class WaitPeriod extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      IsNextDisabled: true
    };
    this.RandomWait = this.RandomWait.bind(this);
    this.EnableNext = this.EnableNext.bind(this);
  }

  EnableNext() {
    this.setState({ IsNextDisabled: false });
  }

  RandomWait() {
    const randomSubmitTime = MIN_WAITTIME + Math.random() * (MAX_WAITTIME - MIN_WAITTIME);

    // Timeout is in miliseconds
    setTimeout(this.EnableNext , randomSubmitTime*1000);
  }

  componentDidMount() {
    this.RandomWait();
  }

  render() {
    const { onNext } = this.props;
    return (
        <Centered>
          <div className="wait-period">
            <br />
            <br />
            <br />
            <br />
            <br />
            <p>
              Now you are ready to play!
              <br/>
              Please wait for others players (estimated time 1-2 minutes).
              <br />
              Please do not leave this screen since you are expected to proceed to the game
              immediately when other players have joined, and the "Proceed" button has been
              activated.
            </p>
            <br />
            <ButtonGroup className={"button-group"}>
            <Button
              type="button"
              onClick={onNext}
              disabled={this.state.IsNextDisabled}
              rightIcon="arrow-right"
              intent="primary"
              alignText={"right"}
            >
              Proceed to Game!
            </Button>
          </ButtonGroup>
          </div>
        </Centered>
    );
  }
}
