import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import './Guess.css'
import { serverApi } from "../../consts/api";

const Guessing = () => {
  const api = serverApi;

  // navigation
  const navigate = useNavigate();

  const goBackHandler = (event) => {
    event.preventDefault();

    navigate("/");
  };
  ///
  
  const location = useLocation();
  const wordPicked = location.state.wordpicked.toLowerCase();
  const img64 = location.state.img;
  const difficulty = location.state.difficulty;
  const sessionInfo = location.state.sessionInfo;

  let [guess, setGuess] = useState("");
  const textChangeHandler = (event) => {
    setGuess(event.target.value);
  };

  const [countGuesses, setCountGuesses] = useState(1);
  const [feedback, setFeedback] = useState("");

  const updateSession = () => {
    sessionInfo.wordGuessed.push(wordPicked);
    if (difficulty === "easy") {
      sessionInfo.score += 1;
    } else if (difficulty === "medium") {
      sessionInfo.score += 3;
    } else {
      sessionInfo.score += 5;
    }
  };

  const checkGuessHandler = (event) => {
    event.preventDefault();

    const guessWord = guess.toLowerCase();
    if (guessWord === wordPicked) {
      //success
      updateSession();
      notifyServer();
      navigate("/SwapRoles", {
        state: {
          from: "guess",
          numberOfGuesses: countGuesses,
          wordGuessed: wordPicked,
          sessionInfo: sessionInfo,
        },
      });
    } else {
      setGuess("");
      setFeedback(" try again");
      setCountGuesses(countGuesses + 1);
    }
  };

  const notifyServer = () => {
    axios({
      method: "post",
      url: `${api}/wordGuessed`,
      data: { numberOfGuesses: countGuesses, score: sessionInfo.score, startDate : sessionInfo.startDate }
    }).catch((e) => {
      console.log("[notifyServer] from Guess " + e);
    });
  };

  return (
    <div>
      <h4>Guessing Phase: </h4>
      <button onClick={goBackHandler}>Go Back</button>
      <img className="draw-to-guess" alt="To guess" src={img64} />
      <form onSubmit={checkGuessHandler}>
        <input type="text" value={guess} onChange={textChangeHandler} />
        <button type="submit"> submit guess</button>
        <span className="feedback">
          {feedback}
          <br />
          number of guesses: {countGuesses - 1}
        </span>
      </form>
    </div>
  );
};

export default Guessing;
