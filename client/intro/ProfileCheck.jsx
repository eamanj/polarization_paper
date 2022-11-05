import React from "react";

import { Centered } from "meteor/empirica:core";
import { Button, ButtonGroup } from "@blueprintjs/core";

// Value determines the number of years age on URL is supposed to be shifted.
// real age will be url value minus this value.
const AGE_SHIFT = 754;

const Radio = ({ name, value, label, onChange }) => (
  <label>
    <input
      type="radio"
      name={name}
      value={value}
      onChange={onChange}
    />
    {label}
  </label>
);

function isNormalInteger(str) {
  const n = Math.floor(Number(str));
  return n !== Infinity && String(n) === str && n >= 0;
}

export default class ProfileCheck extends React.Component {
  state = {};
  constructor(props) {
    super(props);
    ProfileCheck.setUrlParams(this.props.player);
  }

  static setUrlParams(player) {
    let url_params = player.urlParams;
    // age
    if('sen' in url_params && (!(player.get('age')) || player.get('age') === '')) {
      if(isNormalInteger(url_params.sen)) {
        player.set('age', url_params.sen - AGE_SHIFT);
      }
    }
    // education: less than high school, high school, some college,
    // associate degree, bachelors degree, masters degree, doctoral degree,
    // professional degree
    if('tah' in url_params &&
       (!(player.get('education')) || player.get('education') === '')) {
      if(url_params.tah === 'rah') {
        player.set('education', 'less-than-high-school');
      } else if(url_params.tah === 'dab') {
        player.set('education', 'high-school');
      } else if(url_params.tah === 'dan') {
        player.set('education', 'some-college');
      } else if(url_params.tah === 'her') {
        player.set('education', 'associate');
      } else if(url_params.tah === 'lis') {
        player.set('education', 'bachelors');
      } else if(url_params.tah === 'fog') {
        player.set('education', 'masters');
      } else if(url_params.tah === 'ost') {
        player.set('education', 'doctorate');
      } else if(url_params.tah === 'vak') {
        player.set('education', 'professional');
      }
    }

    // gender
    if('jen' in url_params &&
       (!(player.get('gender')) || player.get('gender') === '')) {
      if(url_params.jen === 'pes') {
        player.set('gender', 'male');
      } else if(url_params.jen === 'dok') {
        player.set('gender', 'female');
      }
    }

    // political.
    if('sias' in url_params &&
       (!(player.get('political_affiliation')) || player.get('political_affiliation') === '')) {
      if(url_params.sias === 'jomh') {
        player.set('political_affiliation', 'republican');
        player.set('avatar', 'republican.png');
      } else if(url_params.sias === 'mard') {
        player.set('political_affiliation', 'democrat');
        player.set('avatar', 'democrat.png');
      }
    }
    // set a default avatar in case it is not set
    if(!(player.get('political_affiliation')) ||
       player.get('political_affiliation') === '') {
      player.set('political_affiliation', 'independent');
      player.set('avatar', 'independent.png');
    }
  }

  handleChange = event => {
    const el = event.currentTarget;
    const val = el.value.trim().toLowerCase();
    this.setState({[el.name]: val});
    if(el.name === "political_affiliation") {
      const p_affiliation = el.value.trim().toLowerCase();
      this.setState({'avatar': p_affiliation + '.png'});
    }
  };

  handleSubmit = event => {
    event.preventDefault();
    for (var key in this.state) {
      const val = this.state[key];
      this.props.player.set(key, val);
    }
    this.props.onNext();
  };

  render() {
    const { player } = this.props;
    const { hasPrev, hasNext, onNext, onPrev } = this.props;
    // For some strange reason page loads focusing on the input fields, skipping any content above the
    // input fields. Next line ensures the page scrolls up and loads at the first content.
    //window.scrollTo(0, 0);

    return (
      <Centered>
        <div className="profile-check">

          <h1> Profile Check </h1>
          <br />
          <p>
            Below you can see how your profile will be shown throughout the game, in addition
            to other information. If you see any errors in the information, please fill in the
            relevant questions in the survey. Otherwise if all information is correct, you can
            leave the survey unanswered.
          </p>
          <br />

          <div className="player-profile">
            <h3>Your Profile</h3>
            <img src={player.get("avatar")} className="profile-avatar" />
            <div className="profile-info">
              <span>Age</span>: {player.get('age')} <br />
                <span>Gender</span>: {player.get('gender')} <br />
                <span>Political Affiliation</span>: {player.get('political_affiliation')} <br />
            </div>
          </div>
          Fill in the survey below if any of information above is incorrect.
          <form onSubmit={this.handleSubmit}>
            <div className="form-line">
              <div>
                <label htmlFor="age" className="boldlabel">Age</label>
                <div>
                  <input
                    id="age"
                    type="number"
                    min="0"
                    max="150"
                    step="1"
                    dir="auto"
                    name="age"
                    onChange={this.handleChange}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="gender" className="boldlabel">Gender</label>
                <div>
                  <input
                    id="gender"
                    type="text"
                    dir="auto"
                    name="gender"
                    onChange={this.handleChange}
                    autoComplete="off"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="boldlabel">Political Affiliation</label>
              <div>
                <Radio
                  name="political_affiliation"
                  value="democrat"
                  label="Democrat"
                  onChange={this.handleChange}
                />
                <Radio
                  name="political_affiliation"
                  value="republican"
                  label="Republican"
                  onChange={this.handleChange}
                />
              </div>
            </div>
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
                  onClick={this.handleSubmit}
                  disabled={!hasNext}
                  rightIcon="arrow-right"
                  intent="primary"
                  alignText={"right"}
              >
                Next
              </Button>
            </ButtonGroup>
          </form>
        </div>
      </Centered>
    );
  }
}
