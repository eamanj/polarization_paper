import React from "react";
import Prime from './Prime.jsx';

export default class PatrioticPrime extends Prime {
  constructor(props) {
    super(props);
    this.articleFile = "HotDog.png";
    const { player } = this.props;
    player.set('article', this.articleFile);
  }
}
