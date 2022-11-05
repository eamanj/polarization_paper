import React from "react";
import Prime from './Prime.jsx';

export default class ApoliticalPrime extends Prime {
  constructor(props) {
    super(props);
    this.articleFile = "Hashtag_Rock.png";
    const { player } = this.props;
    player.set('article', this.articleFile);
  }
}

