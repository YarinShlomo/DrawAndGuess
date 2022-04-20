import "./SwapRoles.css";
import { useLocation, useNavigate } from "react-router-dom";

import React from "react";

const SwapRoles = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const sessionInfo = location.state.sessionInfo;
  const arrivedFromGuess = location.state.from === "guess";
  const numberOfGuesses = location.state.numberOfGuesses;
  const wordGuessed = location.state.wordGuessed;
  const nextRole = arrivedFromGuess ? "drawer" : "guesser";
  let goodJobLabel = arrivedFromGuess ?  `You` : `Your friend`;
  goodJobLabel = goodJobLabel.concat(` guessed the word ${wordGuessed} in ${numberOfGuesses} guesses`);

  const SwitchPositionHandler = event => {
    event.preventDefault();

    const navigateTo = arrivedFromGuess ? '/choosing' : '/waiting';
    navigate(navigateTo, {state: {sessionInfo : sessionInfo}});
  }

  return (
    <div className="swap-role-page">
      <span className="good-job-statement">
      Good job! <br />
      {goodJobLabel} <br/>
      Your score is: {sessionInfo.score}
      <br/>
      </span>
      <span className="keep-playing">
        to keep playing but now be the {nextRole}
      </span>
      <button onClick={SwitchPositionHandler}>Click here</button>
    </div>
  );
};

export default SwapRoles;
