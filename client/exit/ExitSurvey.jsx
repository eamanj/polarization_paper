import React from "react";

import { Centered } from "meteor/empirica:core";
import { Radio, RadioGroup, Button, ButtonGroup } from "@blueprintjs/core";
import Slider from "meteor/empirica:slider";

const QuestionRow = ({label}) => (
    <tr>
      <td colSpan="6" className="left">
        <div className="verylargespace"/>
        <div className="form-line">
          {label}
        </div>
        <div className="smallspace"/>
      </td>
    </tr>
);

const Row5 = ({name, values, label, onChange}) => (
    <tr>
      <td className="right">{label}</td>
      <td><input type="radio" name={name} value={values[0]}
                 onChange={onChange} /></td>
      <td><input type="radio" name={name} value={values[1]}
                 onChange={onChange} /></td>
      <td><input type="radio" name={name} value={values[2]}
                 onChange={onChange} /></td>
      <td><input type="radio" name={name} value={values[3]}
                 onChange={onChange} /></td>
      <td><input type="radio" name={name} value={values[4]}
                 onChange={onChange} /></td>
    </tr>
);

const Header5 = ({headers}) => (
    <tr>
      <th></th>
      <th>{headers[0]}</th>
      <th>{headers[1]}</th>
      <th>{headers[2]}</th>
      <th>{headers[3]}</th>
      <th>{headers[4]}</th>
    </tr>
);


const Row7 = ({name, values, label, onChange}) => (
    <tr>
      <td className="right">{label}</td>
      <td><input type="radio" name={name} value={values[0]}
                 onChange={onChange} /></td>
      <td><input type="radio" name={name} value={values[1]}
                 onChange={onChange} /></td>
      <td><input type="radio" name={name} value={values[2]}
                 onChange={onChange} /></td>
      <td><input type="radio" name={name} value={values[3]}
                 onChange={onChange} /></td>
      <td><input type="radio" name={name} value={values[4]}
                 onChange={onChange} /></td>
      <td><input type="radio" name={name} value={values[5]}
                 onChange={onChange} /></td>
      <td><input type="radio" name={name} value={values[6]}
                 onChange={onChange} /></td>
    </tr>
);

const Header7 = ({headers}) => (
    <tr>
      <th></th>
      <th>{headers[0]}</th>
      <th>{headers[1]}</th>
      <th>{headers[2]}</th>
      <th>{headers[3]}</th>
      <th>{headers[4]}</th>
      <th>{headers[5]}</th>
      <th>{headers[6]}</th>
    </tr>
);

const SliderRow = ({label, name, value, onChange}) => (
    <tr>
      <td className="right">{label}</td>
      <td colSpan="5">
        <div className="mediumspace"/>
        <Slider
            min={0}
            max={100}
            stepSize={1}
            labelStepSize={50}
            onChange={(e) => onChange(name, e)}
            value={value}
            hideHandleOnEmpty
        />
      </td>
    </tr>
);


export default class ExitSurvey extends React.Component {
  static stepName = "ExitSurvey";
  state = {};

  constructor(props) {
    super(props);
  }

  handleChange = event => {
    const el = event.currentTarget;
    this.setState({ [el.name]: el.value });
  };

  handleSliderChange = (name, value) => {
    this.setState({ [name]: value });
  };

  handleSubmit = event => {
    event.preventDefault();
    for (var key in this.state) {
      const val = this.state[key];
      this.props.player.set(key, val);
    }
    this.props.onSubmit();
  };

  render() {
    const { senate,
            american_feel, texan_feel, democrats_feel,
            californians_feel, chinese_feel, republicans_feel,
            russians_feel, iranians_feel} = this.state;
    const { hasNext } = this.props;

    return (
      <Centered>
        <div className="exit-survey">
          <h1> Exit Survey </h1>
          Please answer the following short survey. Your answers won't affect
          your reward.
          <div className="verylargespace"/>
          <form onSubmit={this.handleSubmit}>
            <RadioGroup
                label="Which party has a majority of seats in the Senate?"
                inline={true}
                name="senate"
                onChange={this.handleChange}
                selectedValue={senate}
            >
              <Radio value="democrats" label="Democrats" />
              <Radio value="republicans" label="Republicans" />
            </RadioGroup>
            <br />


            <div className="largespace"/>
            What party affiliation, if any, did the other player(s) in the game have?
            <div className="mediumspace"/>
            <table className="custom-table">
              <tbody>
              <Header5 headers= {[
                "None",
                "Multiple Parties",
                "Independent",
                "Republican",
                "Democratic",
                "Do not recall"]} />
              <Row5 name="other_player_party"
                   values={[
                     "none",
                     "multiple",
                     "independent",
                     "republican",
                     "democratic",
                     "do_not_recall"]}
                   label=""
                   onChange={this.handleChange} />
              </tbody>
            </table>
            <br />


            <div className="largespace"/>
            How knowledgeable do you think the other player(s) were about the
            issue in the estimation question?
            <div className="mediumspace"/>
            <table className="custom-table">
              <tbody>
              <Header7 headers= {[
                "Very Unknowledgeable",
                "Unknowledgeable",
                "Slightly Unknowledgeable",
                "Neither Unknowledgeable nor Knowledgable",
                "Slightly Knowledgeable",
                "Knowledgeable",
                "Very Knowledgeable"]} />
              <Row7 name="knowledge"
                   values={[
                     "very-unknowledgeable",
                     "unknowledgeable",
                     "slightly-unknowledgeable",
                     "neither-unknowledgeable-knowledgable",
                     "slightly-knowledgeable",
                     "knowledgeable",
                     "very-knowledgeable"]}
                   label=""
                   onChange={this.handleChange} />
              </tbody>
            </table>
            <br />



            <div className="mediumspace"/>
            <table className="bp3-html-table">
              <tbody>
              <QuestionRow label="How strongly do you agree or disagree with the following statements?" />
              <Header5 headers= {["Strongly Disagree",
                "Disagree",
                "Neither Disagree nor Agree",
                "Agree",
                "Strongly Agree"]} />
              <Row5 name="american"
                   values={["strong_disagree", "disagree", "no_agree_disagree", "agree", "strong_agree"]}
                   label="I identify with Americans."
                   onChange={this.handleChange} />
              <Row5 name="state"
                   values={["strong_disagree", "disagree", "no_agree_disagree", "agree", "strong_agree"]}
                   label="I identify with people in my state."
                   onChange={this.handleChange} />
              <Row5 name="neighborhood"
                   values={["strong_disagree", "disagree", "no_agree_disagree", "agree", "strong_agree"]}
                   label="I identify with people in my neighborhood."
                   onChange={this.handleChange} />
              <Row5 name="democrats"
                   values={["strong_disagree", "disagree", "no_agree_disagree", "agree", "strong_agree"]}
                   label="I identify with Democrats."
                   onChange={this.handleChange} />
              <Row5 name="republicans"
                   values={["strong_disagree", "disagree", "no_agree_disagree", "agree", "strong_agree"]}
                   label="I identify with Republicans."
                   onChange={this.handleChange} />


              <QuestionRow label="Please indicate the extent to which you feel this way right now." />
              <Header5 headers= {["Not at all",
                                  "A little",
                                  "Moderately",
                                  "Quite a bit",
                                  "Extremely"]} />
              <Row5 name="determined"
                   values={["not_at_all", "little", "moderate", "quite_bit", "extreme"]}
                   label="Determined"
                   onChange={this.handleChange} />
              <Row5 name="attentive"
                    values={["not_at_all", "little", "moderate", "quite_bit", "extreme"]}
                    label="Attentive"
                    onChange={this.handleChange} />
              <Row5 name="alert"
                    values={["not_at_all", "little", "moderate", "quite_bit", "extreme"]}
                    label="Alert"
                    onChange={this.handleChange} />
              <Row5 name="inspired"
                    values={["not_at_all", "little", "moderate", "quite_bit", "extreme"]}
                    label="Inspired"
                    onChange={this.handleChange} />
              <Row5 name="active"
                    values={["not_at_all", "little", "moderate", "quite_bit", "extreme"]}
                    label="Active"
                    onChange={this.handleChange} />
              <Row5 name="afraid"
                    values={["not_at_all", "little", "moderate", "quite_bit", "extreme"]}
                    label="Afraid"
                    onChange={this.handleChange} />
              <Row5 name="nervous"
                    values={["not_at_all", "little", "moderate", "quite_bit", "extreme"]}
                    label="Nervous"
                    onChange={this.handleChange} />
              <Row5 name="upset"
                    values={["not_at_all", "little", "moderate", "quite_bit", "extreme"]}
                    label="Upset"
                    onChange={this.handleChange} />
              <Row5 name="ashamed"
                    values={["not_at_all", "little", "moderate", "quite_bit", "extreme"]}
                    label="Ashamed"
                    onChange={this.handleChange} />
              <Row5 name="hostile"
                    values={["not_at_all", "little", "moderate", "quite_bit", "extreme"]}
                    label="Hostile"
                    onChange={this.handleChange} />


              <QuestionRow label="Please rate your feeling toward the following groups of people
              on a scale of 0 to 100, using the slider
              (0: Very Unfavorable, 100: Very Favorable)." />
              <Header5 headers= {["Very Unfavorable",
                                  "",
                                  "Neutral",
                                  "",
                                  "Very Favorable"]} />
              <SliderRow label="Americans"
                         name="american_feel"
                         value={american_feel}
                         onChange={this.handleSliderChange} />
              <SliderRow label="Texans"
                         name="texan_feel"
                         value={texan_feel}
                         onChange={this.handleSliderChange} />
              <SliderRow label="Democratic Party Voters"
                         name="democrats_feel"
                         value={democrats_feel}
                         onChange={this.handleSliderChange} />
              <SliderRow label="Californians"
                         name="californians_feel"
                         value={californians_feel}
                         onChange={this.handleSliderChange} />
              <SliderRow label="Chinese"
                         name="chinese_feel"
                         value={chinese_feel}
                         onChange={this.handleSliderChange} />
              <SliderRow label="Republican Party Voters"
                         name="republicans_feel"
                         value={republicans_feel}
                         onChange={this.handleSliderChange} />
              <SliderRow label="Russians"
                         name="russians_feel"
                         value={russians_feel}
                         onChange={this.handleSliderChange} />
              <SliderRow label="Iranians"
                         name="iranians_feel"
                         value={iranians_feel}
                         onChange={this.handleSliderChange} />
              </tbody>
            </table>



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
          </form>
        </div>
      </Centered>
    );
  }
}
