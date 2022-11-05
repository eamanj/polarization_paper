import React from "react";
import Prime from './Prime.jsx';

export default class EnemyPrime2 extends Prime {
  constructor(props) {
    super(props);
    this.articleFile = "WolfDen.png";
    const { player } = this.props;
    player.set('article', this.articleFile);
  }
}
