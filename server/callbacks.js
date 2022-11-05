import Empirica from "meteor/empirica:core";

// The true value of the question we are asking participants to answer
const TRUE_VALUE = 48;
// base reward paid to each participant regardless of accuracy
const BASE_REWARD = 2.0;
// Max bonus added to base reward based on accuracy of the average response.
const MAX_BONUS = 1.0;

// This function determines the bot initial response based on the response of
// a player. It is designed to be the mirror of the player response around 50 plus
// some random integer noise between -4 and 4.
// if the human response is undefined, bot response will be set to a random number.
function get_bot_initial_response(human_initial_response) {
  if (human_initial_response != null) {
    const noise = Math.floor(Math.random()*9) - 4;
    let bot_response = (human_initial_response + 50 + noise) % 100;
    // ensure bot response is between 0 ad 100.
    bot_response = Math.max(0, bot_response);
    bot_response = Math.min(100, bot_response);
    return bot_response;
  } else {
    const bot_response = Math.floor(Math.random()*100);
    return bot_response;
  }
}

// Function returns the next estimate of a stubborn bot. A stubborn
// bot starts with an initial estimate and stays very close to that estimate.
// In this specific implementation, stubborn bot always returns the same initial
// estimate without any noise.
function get_stubborn_bot_response(bot_initial_response) {
  let bot_response = bot_initial_response;
  // ensure bot response is between 0 ad 100.
  bot_response = Math.max(0, bot_response);
  bot_response = Math.min(100, bot_response);
  return bot_response;
}

// Function implements a friendly (Bayesian bot) that learns from the other player. It updates its answer
// in the next round to be the weighted average of its last answer and the latest answer of human player.
function get_friendly_bot_response(human_last_response, bot_last_response) {
  if (human_last_response != null) {
    const noise = Math.floor(Math.random()*7) - 3;
    let bot_response = (1.0/4.0) * human_last_response + (3.0/4.0) * bot_last_response;
    bot_response = Math.floor(bot_response + noise);
    // ensure bot response is between 0 ad 100.
    bot_response = Math.max(0, bot_response);
    bot_response = Math.min(100, bot_response);
    return bot_response;
  } else {
    return bot_last_response;
  }
}

// onGameStart is triggered opnce per game before the game starts, and before
// the first onRoundStart. It receives the game and list of all the players in
// the game.
Empirica.onGameStart((game, players) => {});

// onRoundStart is triggered before each round starts, and before onStageStart.
// It receives the same options as onGameStart, and the round that is starting.
Empirica.onRoundStart((game, round, players) => {});

// onStageStart is triggered before each stage starts.
// It receives the same options as onRoundStart, and the stage that is starting.
Empirica.onStageStart((game, round, stage, players) => {});

// onStageEnd is triggered after each stage.
// It receives the same options as onRoundEnd, and the stage that just ended.
Empirica.onStageEnd((game, round, stage, players) => {
  // TODO: SHOULD WE UPDATE THIS CODE AN HAVE BOT RESPONSES TO BE ALSO DEPENDENT ON
  // TODO: player last_responses, IN CASE PLAYER MOVES THE SLIDER BUT DOES NOT CLICK SUBMIT?

  // Currently, we only allow a single bot in the micro experiment where there is
  // only a single human player, so we check for these.
  if (game.treatment.botsCount > 0) {
    const bots = _.filter(players, p => 'bot' in p);
    const human_players = _.reject(players, p => 'bot' in p);
    const assert = require('assert');
    assert(bots.length === 1);
    assert(human_players.length === 1);
    const bot = bots[0];
    const human_player_responses = human_players[0].get('responses');
    // If we have a bot, we need to set its initial response based on the player
    // response at the end of response stage and before exposure stages start.
    if (stage.name === 'individual') {
      const human_player_initial_response = human_player_responses[0];
      const bot_response = get_bot_initial_response(human_player_initial_response);
      bot.set('responses', [bot_response]);
      bot.set('response' + stage.index, bot_response);
    }
    // In subsequent stages, the bot will update depending on its type specified
    // in the treatment condition
    if(stage.name.includes('group')) {
      const exposure_round = stage.index;
      const bot_responses = bot.get('responses');
      const human_player_last_response = human_player_responses[exposure_round];
      // Bot has not filled in the last stage responses, so it has one fewer elements than
      // the human who just finished the stage.
      const bot_last_response = bot_responses[exposure_round-1];
      const bot_initial_response = bot_responses[0];
      // Set the next estimate of a stubborn bot
      if (game.treatment.botBehavior === 'stubborn') {
        const bot_response = get_stubborn_bot_response(bot_initial_response);
        let bot_responses = bot.get('responses');
        bot_responses.push(bot_response);
        bot.set('responses', bot_responses);
        bot.set('response' + stage.index, bot_response);
      } else if (game.treatment.botBehavior === 'friendly') {
        const bot_response = get_friendly_bot_response(human_player_last_response, bot_last_response);
        let bot_responses = bot.get('responses');
        bot_responses.push(bot_response);
        bot.set('responses', bot_responses);
        bot.set('response' + stage.index, bot_response);
      }
    }
  }
});

// onRoundEnd is triggered after each round.
// It receives the same options as onGameEnd, and the round that just ended.
Empirica.onRoundEnd((game, round, players) => {});



const average = arr => arr.reduce((a,b) => a + b, 0) / arr.length;
// onGameEnd is triggered when the game ends. It receives the same options as onGameStart.
// We computed the rewards per players after game has ended.
Empirica.onGameEnd((game, players) => {
  players.forEach((player) => {
    const responses = player.get('responses');
    const last_responses = player.get('last_responses');
    // If user entered game and did not make any submission at all and did not
    // move the slider at all (without clicking the submit button at all),
    // no bonus or base pay. But if the user could not play, we need to make base
    // pay and show up bonus.
    if (responses.every(element => element === null) &&
        last_responses.every(element => element === null)) {
      player.set('made_submission', false);
      // user entered game and made no submssion
      player.set('total_reward', 0);
      player.set('base_reward', 0);
      player.set('bonus', 0);
    } else if (game.treatment.botsCount > 0 &&
               game.treatment.playerCount === 2) {
      // If we are in the micro experiment (one human player with a bot), for
      // ethical reasons, we compensate players with a full bonus reward
      const reward = BASE_REWARD + MAX_BONUS;
      player.set('total_reward', reward);
      player.set('base_reward', BASE_REWARD);
      player.set('bonus', MAX_BONUS);
      player.set('made_submission', true);
    } else {
      // Here we are in the macro experiment with no bot
      const average_response = (responses.length !== 0 ? average(responses) : average(last_responses));
      const average_error = Math.abs(TRUE_VALUE - average_response);
      const bonus = Math.max(0, MAX_BONUS - (MAX_BONUS / 50.0) * average_error);
      const round_bonus = Math.ceil(100.0 * bonus) / 100.0;
      const reward = Math.ceil((BASE_REWARD + round_bonus) * 100.0) / 100.0;
      player.set('total_reward', reward);
      player.set('base_reward', BASE_REWARD);
      player.set('bonus', bonus);
      player.set('made_submission', true);
    }
  });
});

// ===========================================================================
// => onSet, onAppend and onChange ==========================================
// ===========================================================================

// onSet, onAppend and onChange are called on every single update made by all
// players in each game, so they can rapidly become quite expensive and have
// the potential to slow down the app. Use wisely.
//
// It is very useful to be able to react to each update a user makes. Try
// nontheless to limit the amount of computations and database saves (.set)
// done in these callbacks. You can also try to limit the amount of calls to
// set() and append() you make (avoid calling them on a continuous drag of a
// slider for example) and inside these callbacks use the `key` argument at the
// very beginning of the callback to filter out which keys your need to run
// logic against.
//
// If you are not using these callbacks, comment them out so the system does
// not call them for nothing.

// // onSet is called when the experiment code call the .set() method
// // on games, rounds, stages, players, playerRounds or playerStages.
// Empirica.onSet((
//   game,
//   round,
//   stage,
//   player, // Player who made the change
//   target, // Object on which the change was made (eg. player.set() => player)
//   targetType, // Type of object on which the change was made (eg. player.set() => "player")
//   key, // Key of changed value (e.g. player.set("score", 1) => "score")
//   value, // New value
//   prevValue // Previous value
// ) => {
//   // // Example filtering
//   // if (key !== "value") {
//   //   return;
//   // }
// });

// // onAppend is called when the experiment code call the `.append()` method
// // on games, rounds, stages, players, playerRounds or playerStages.
// Empirica.onAppend((
//   game,
//   round,
//   stage,
//   player, // Player who made the change
//   target, // Object on which the change was made (eg. player.set() => player)
//   targetType, // Type of object on which the change was made (eg. player.set() => "player")
//   key, // Key of changed value (e.g. player.set("score", 1) => "score")
//   value, // New value
//   prevValue // Previous value
// ) => {
//   // Note: `value` is the single last value (e.g 0.2), while `prevValue` will
//   //       be an array of the previsous valued (e.g. [0.3, 0.4, 0.65]).
// });

// // onChange is called when the experiment code call the `.set()` or the
// // `.append()` method on games, rounds, stages, players, playerRounds or
// // playerStages.
// Empirica.onChange((
//   game,
//   round,
//   stage,
//   player, // Player who made the change
//   target, // Object on which the change was made (eg. player.set() => player)
//   targetType, // Type of object on which the change was made (eg. player.set() => "player")
//   key, // Key of changed value (e.g. player.set("score", 1) => "score")
//   value, // New value
//   prevValue, // Previous value
//   isAppend // True if the change was an append, false if it was a set
// ) => {
//   // `onChange` is useful to run server-side logic for any user interaction.
//   // Note the extra isAppend boolean that will allow to differenciate sets and
//   // appends.
//    Game.set("lastChangeAt", new Date().toString())
// });

// // onSubmit is called when the player submits a stage.
// Empirica.onSubmit((
//   game,
//   round,
//   stage,
//   player // Player who submitted
// ) => {
// });
