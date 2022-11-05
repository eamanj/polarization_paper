import React from "react";

import { Centered } from "meteor/empirica:core";

export default class Sorry extends React.Component {
  static stepName = "Sorry";
  constructor(props) {
    super(props);
  }

  render() {
    const { player } = this.props;
    let msg;
    switch (player.exitStatus) {
      case "gameFull":
        msg = "All games you are eligible for have filled up too fast...";
        break;
      case "gameLobbyTimedOut":
        msg = "There were NOT enough players for the game to start..";
        break;
      case "playerEndedLobbyWait":
        msg =
          "You decided to stop waiting, we are sorry it was too long a wait.";
        break;
      default:
        msg = "Unfortunately the Game was cancelled...";
        break;
    }

    return (
      <Centered>
        <div className="score">
          <h1>Sorry!</h1>

          <p>Sorry, you were not able to play today! {msg}</p>

          <p>
            Please submit <strong>{player._id}</strong> as the survey code in order
            to receive the <strong>${player.get("base_reward")}</strong> base payment for
            your time today.
          </p>



          <p>
            <strong>Please come back for the next scheduled game.</strong>{" "}
          </p>

        </div>
      </Centered>
    );
  }
}
