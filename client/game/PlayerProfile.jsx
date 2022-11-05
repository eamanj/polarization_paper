import React from "react";

import Timer from "./Timer.jsx";

export default class PlayerProfile extends React.Component {
  render() {
    const { stage } = this.props;
    const { player } = this.props;

    return (
        <aside className="player-profile">
          <h3>Your Profile</h3>
          <img src={player.get("avatar")} className="profile-avatar" />
          <Timer stage={stage} />
        </aside>
    );
  }
}
