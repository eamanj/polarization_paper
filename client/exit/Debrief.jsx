import React from "react";

import { Centered } from "meteor/empirica:core";
import { Button, ButtonGroup } from "@blueprintjs/core";

export default class Debrief extends React.Component {
  static stepName = "Debrief";

  handleSubmit = event => {
    event.preventDefault();
    this.props.onSubmit();
  };

  render() {
    const { hasNext } = this.props;
    return (
      <Centered>
        <div className="exit-survey">
          <h1> Debrief </h1>
          <p>
            Thank you for participating in this study. We are studying online news and
            how people interact online. In the estimation task, we presented you with
            an estimate we attributed to another participant. The estimate instead
            came from a bot responding to your input. This allowed us to present you
            with an estimate immediately after your first estimate as well as allowing
            us to study how people respond to feedback from other people online. We
            regret that we had to withhold the true source of the estimate from you.
          </p>
          <ButtonGroup className={"button-group"}>
            <Button
                type="button"
                onClick={this.handleSubmit}
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
