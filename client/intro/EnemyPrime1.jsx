import React from "react";
import Prime from './Prime.jsx';

export default class EnemyPrime1 extends Prime {
  constructor(props) {
    super(props);
    this.articleFile = "RiseFallIsis.png";
    const { player } = this.props;
    player.set('article', this.articleFile);
  }
}

