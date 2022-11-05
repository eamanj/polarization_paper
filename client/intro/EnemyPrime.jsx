import React from "react";
import Prime from './Prime.jsx';

export default class EnemyPrime extends Prime {
  constructor(props) {
    super(props);
    this.articleFile = "SuperEnemy.png";
    const { player } = this.props;
    player.set('article', this.articleFile);
  }
}
