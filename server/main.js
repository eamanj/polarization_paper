import Empirica from "meteor/empirica:core";

import "./callbacks.js";
import "./bots.js";

// A helper function that returns the opposite party of the given party.
function oppositeParty(party) {
  if (party === 'democrat') {
    return 'republican';
  } else if (party === 'republican') {
    return 'democrat';
  } else {
    console.log('WARNING: opposite party of ' + party + ' is requested. ' +
                'Returning independent.');
    return 'independent';
  }
}

// gameInit is where the structure of a game is defined.
// Just before every game starts, once all the players needed are ready, this
// function is called with the treatment and the list of players.
// You must then add rounds and stages to the game, depending on the treatment
// and the players. You can also get/set initial values on your game, players,
// rounds and stages (with get/set methods), that will be able to use later in
// the game.
Empirica.gameInit((game, treatment, players) => {
  const Num_Stages = 5;
  // Currently, we only support only one Bot.
  var assert = require('assert');
  assert(treatment.botsCount <= 1);
  // get the bots
  const bots = _.filter(game.players, p => 'bot' in p);
  const human_players = _.reject(game.players, p => 'bot' in p);
  assert(bots.length === treatment.botsCount);
  if (bots.length > 0) {
    const bot = bots[0];
    // Set bot political party and avatar
    if (['democrat', 'republican'].includes(treatment.botPoliticalAffiliation)) {
      bot.set('political_affiliation', treatment.botPoliticalAffiliation);
    } else if (['same', 'opposite'].includes(treatment.botPoliticalAffiliation)) {
      // in opposite  and same party treatments for the bot, we require only one
      // player. Since bots appear only in the micro experiment with a single player.
      assert(human_players.length === 1);
      const human_player = human_players[0];
      const pol_aff = treatment.botPoliticalAffiliation === 'same' ?
          human_player.get('political_affiliation') :
          oppositeParty(human_player.get('political_affiliation'));
      bot.set('political_affiliation', pol_aff);
    } else {
      console.log('WARNING: bad treatment ' + treatment.botPoliticalAffiliation +
                  ' given for the bot. Not setting.')
    }
  }

  const player_ids = _.pluck(players, '_id');
  // Set the avatar and neighbors of all players and bots.
  players.forEach((player, i) => {
    if (player.get("political_affiliation") === 'republican') {
      player.set("avatar", 'republican.png');
    } else if (player.get("political_affiliation") === 'democrat') {
      player.set("avatar", 'democrat.png');
    } else {
      console.log('WARNING: player ', player.get('_id'), ' is independent.');
      player.set("avatar", 'independent.png');
    }

    // currently all players are neighbors of each other. set neighbors only for the
    // human players.
    const neighbor_ids = _.reject(player_ids, i => i === player._id);
    player.set('neighbor_ids', neighbor_ids);

    // Initialize the responses array
    player.set('responses', Array(Num_Stages).fill(null));
    // Initialize the last responses array: it holds the last position of slider
    player.set('last_responses', Array(Num_Stages).fill(null));
  });

  _.times(1, i => {
    const round = game.addRound();
    round.addStage({
      name: "individual",
      displayName: "First Stage (Individual)",
      durationInSeconds: 30,
      index: 0
    });
    
    //only add the exposure stage if there are more than one player.
    if (game.treatment.playerCount > 1) {
      const numbers = ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth'];
      _.each(_.range(1, Num_Stages, 1), i => {
        round.addStage({
          name: ("group" + i),
          displayName: (numbers[i] + " Stage (Group)"),
          durationInSeconds: 15,
          index: i
        });
      });
    }
  });
});



