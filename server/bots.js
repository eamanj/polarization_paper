import moment from "moment";

import Empirica from "meteor/empirica:core";

// This is where you add bots, like Bob:

// Empirica.bot("bob", {
//   // // NOT SUPPORTED Called at the beginning of each stage (after onRoundStart/onStageStart)
//   // onStageStart(bot, game, round, stage, players) {},

//   // Called during each stage at tick interval (~1s at the moment)
//   onStageTick(bot, game, round, stage, secondsRemaining) {}

//   // // NOT SUPPORTED A player has changed a value
//   // // This might happen a lot!
//   // onStagePlayerChange(bot, game, round, stage, players, player) {}

//   // // NOT SUPPORTED Called at the end of the stage (after it finished, before onStageEnd/onRoundEnd is called)
//   // onStageEnd(bot, game, round, stage, players) {}
// };)

// If the remainder of the stage is greater than this, bot submission won't happen
// This ensures that the bot is guaranteed to wait a certain number of seconds
const MIN_BOTWAIT = 0.7;
Empirica.bot("Bob", {
    onStageTick(bot, game, round, stage, secondsRemaining) {
        // should the bot submit this stage if already not submitted?
        const stageRemainder = secondsRemaining / stage.durationInSeconds;
        const randomSubmit = Math.random() * MIN_BOTWAIT;
        if (!bot.stage.submitted &&
            stageRemainder < randomSubmit) {
          // Log when bot made its submission
          const now = moment();
          bot.set('response' + stage.index + 'TimeAt', now);
          bot.stage.submit();
        }
    }
});
