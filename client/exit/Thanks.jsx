import React from "react";

import { Centered } from "meteor/empirica:core";

export default class Thanks extends React.Component {
  static stepName = "Thanks";

  constructor(props) {
    super(props);
  }

  render() {
    const { player } = this.props;
    return (
      <div className="finished">
        <div className="largespace">
          <h4>Finished!</h4>
          <p>
            Please submit the following code to receive your bonus: {" "}
            <strong>{player._id}</strong>
            <br/>
            Thank you for participating!
          </p>
        </div>
      </div>
    );
  }
}
