import React from "react";

import { Centered, ConsentButton } from "meteor/empirica:core";

export default class Consent extends React.Component {
  render() {
    return (
      <Centered>
        <div className="consent">
          <h1> Key Information </h1>
          <p>
            Thank you for participating in this study. We are studying online
            communication. The study will ask you to read a news article, solve an
            estimation task, and complete a short survey. The estimated
            time to complete the survey is ten minutes and you will receive compensation
            of up to $3.00. You will receive a guaranteed compensation of $2 for
            completing the survey in addition to a bonus of up to $1.00 for your
            performance in the estimation task. The more accurate you answer the
            estimation task, the bigger your bonus. To receive the compensation, you have
            to complete all tasks, answer all questions, and reach the final survey page.
          </p>
          <p>
            We do not ask for your name or any other information that might directly
            identify you. You were invited to participate in this study based on basic
            demographic characteristics you provided in an earlier study, including age,
            gender, education, race, and political affiliation. These basic demographic
            data and de-identified data from this study may be used for future research
            or shared with other researchers.
          </p>
          <p>
            Your participation in this study is entirely voluntary, and you have the
            right to decline to participate or stop participating at any point. If you
            choose to decline or stop participating, you may request that any information
            obtained from you in the course of the study be destroyed.
            If you have further questions or would like to provide additional information,
            please direct your correspondence to mturk.news.study@gmail.com. If you
            have questions regarding your rights as a research participant, you may
            contact the Chair of the Human Subjects Committee at campusirb@duke.edu.
            We encourage that you print or save this form for your own records.
          </p>
          <p>
            I am at least 18 years of age, and desire of my own free will to
            participate in this study.
          </p>
          <br />
          <ConsentButton text="I AGREE" />
        </div>
      </Centered>
    );
  }
}
