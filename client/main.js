import { render } from "react-dom";

import Empirica from "meteor/empirica:core";

import Round from "./game/Round";
import Consent from "./intro/Consent";
import About from "./intro/About";
import ProfileCheck from "./intro/ProfileCheck";
import Overview from "./intro/Overview";
import IndividualStage from "./intro/IndividualStage";
import GroupStage from "./intro/GroupStage";
import Rewards from "./intro/Rewards";
import ApoliticalPrime from "./intro/ApoliticalPrime";
import PatrioticPrime from "./intro/PatrioticPrime";
import EnemyPrime from "./intro/EnemyPrime";
import ApoliticalQuiz from "./intro/ApoliticalQuiz";
import PatrioticQuiz from "./intro/PatrioticQuiz";
import EnemyQuiz from "./intro/EnemyQuiz";
import WaitPeriod from "./intro/WaitPeriod";
import ExitSurvey from "./exit/ExitSurvey";
import GameSurvey from "./exit/GameSurvey";
import Debrief from "./exit/Debrief";
import Thanks from "./exit/Thanks";
import NoSubmission from "./exit/NoSubmission";
import Sorry from "./exit/Sorry";

// Bonus users get if they show up but can't play
const SHOWUP_REWARD = 2.00;
const SHOWUP_BONUS = 0.00;

// Set the Consent Component you want to present players (optional).
Empirica.consent(Consent);
Empirica.about(About);


// Introduction pages to show before they play the game (optional).
// At this point they have been assigned a treatment. You can return
// different instruction steps depending on the assigned treatment.
Empirica.introSteps(game => {
  const steps = [ProfileCheck, Overview,
                 IndividualStage, GroupStage,
                 Rewards];
  //steps.push(StartNotification);

  if (game.treatment.prime === 1) {
    steps.push(ApoliticalPrime);
    steps.push(ApoliticalQuiz);
  } else if (game.treatment.prime === 2) {
    steps.push(PatrioticPrime);
    steps.push(PatrioticQuiz);
  } else if (game.treatment.prime === 3) {
    steps.push(EnemyPrime);
    steps.push(EnemyQuiz);
  } else {
    console.log('ERROR: No priming treatment provided.')
  }
  steps.push(WaitPeriod)

  return steps;
});

// The Round component containing the game UI logic.
// This is where you will be doing the most development.
// See client/game/Round.jsx to learn more.
Empirica.round(Round);

// End of Game pages. These may vary depending on player or game information.
// For example we can show the score of the user, or we can show them a
// different message if they actually could not participate the game (timed
// out), etc.
// The last step will be the last page shown to user and will be shown to the
// user if they come back to the website.
// If you don't return anything, or do not define this function, a default
// exit screen will be shown.
Empirica.exitSteps((game, player) => {
  // If the player made at least one submission, show surveys and thank!
  if(player.get('made_submission')) {
    return [ExitSurvey, GameSurvey, Debrief, Thanks];
  } else if(player.exitStatus === "finished") {
    // Player entered game but made no submission
    return [NoSubmission];
  } else {
    // Player could not enter any game. We would ideally set rewards in
    // Callbacks, but exit status is not available onGameEnd, so we need to
    // set reward of players who did not make it to the game here.
    const reward = Math.ceil((SHOWUP_REWARD + SHOWUP_BONUS) * 100.0) / 100.0;
    player.set('total_reward', reward);
    player.set('base_reward', SHOWUP_REWARD);
    player.set('bonus', SHOWUP_BONUS);
    return [Sorry];
  }
});

// Start the app render tree.
// NB: This must be called after any other Empirica calls (Empirica.round(),
// Empirica.introSteps(), ...).
// It is required and usually does not need changing.
Meteor.startup(() => {
  render(Empirica.routes(), document.getElementById("app"));
});
