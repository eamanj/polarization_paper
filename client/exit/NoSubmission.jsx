import React from "react";

import { Centered } from "meteor/empirica:core";

export default class NoSubmission extends React.Component {
  static stepName = "NoSubmission";
  render() {
    return (
      <Centered>
        <div className="exit-survey">
          <h1> No Submission? </h1>
          <p>
            We did not receive any submissions from you, so we cannot pay you.
            Let us know if there has been a mistake.
          </p>
        </div>
      </Centered>
    );
  }
}
