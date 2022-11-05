import React from "react";

import { Centered } from "meteor/empirica:core";

export default class TaskStimulus extends React.Component {
  render() {
    return (
      <div className="task-stimulus">
        <img src="labor.jpg" />
        <p className='noselect'>
          Thinking of all new immigrants to the U.S. between 2011 and 2015,
          that is all individuals who arrived in the U.S. between 2011 and 2015
          but were not U.S. citizens at birth, what <strong>percentage</strong> {" "}
          were university-educated?
        </p>
      </div>
    );
  }
}
