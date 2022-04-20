import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

import "./WordChoose.css";
const randomWords = require("random-words");

const WordChoosing = () => {
  const [difficulty, setDifficulty] = useState("");
  const [words, setWords] = useState([]);
  const [picked, setPicked] = useState("");
  const navigate = useNavigate();

  const location = useLocation();
  const sessionInfo = location.state.sessionInfo;

  const setDifficultyClick = (difficultyLocal) => {
    const randomWordsToPlayWith = randomWords({ maxLength: 10, exactly: 500 });
    let filteredWordsToPlayWith;

    setDifficulty(difficultyLocal);
    sessionInfo['difficulty'] = difficultyLocal;
    if (difficultyLocal === "easy") {
      filteredWordsToPlayWith = randomWordsToPlayWith.filter(
        (word) => word.length < 5 && word.length > 2
      );
    } else if (difficultyLocal === "medium") {
      filteredWordsToPlayWith = randomWordsToPlayWith.filter(
        (word) => word.length === 5
      );
    } else {
      filteredWordsToPlayWith = randomWordsToPlayWith.filter(
        (word) => word.length > 5
      );
    }
    
    setWords(filteredWordsToPlayWith.slice(0, 3));
  };

  const submitHandler = (event) => {
    event.preventDefault();
    
    navigate("/drawing" ,{state: { wordpicked: picked  ,sessionInfo: sessionInfo}});
  };

  return (
    <div className="choose-word">
      {!difficulty ? (
        <>
          <h4>Pick difficulty</h4>
          <span className="difficulty-buttons">
            <button id="Easy" onClick={() => setDifficultyClick("easy")}>
              Easy
            </button>
            <button id="Medium" onClick={() => setDifficultyClick("medium")}>
              Medium
            </button>
            <button id="Hard" onClick={() => setDifficultyClick("hard")}>
              Hard
            </button>
          </span>
        </>
      ) : (
        <>
          <span id="generatedWords">
            <h4>Pick your desired word:</h4>
            <button
              id="word1"
              value={words[0]}
              onClick={() => setPicked(words[0])}
            >
              {words[0]}
            </button>
            <button
              id="word2"
              value={words[1]}
              onClick={() => setPicked(words[1])}
            >
              {words[1]}
            </button>
            <button
              id="word3"
              value={words[2]}
              onClick={() => setPicked(words[2])}
            >
              {words[2]}
            </button>
          </span>
          <br />
          <input id="chosen-word" type="text" readOnly placeholder=" enter guess here" value={picked} />
          <button disabled={!picked} id="approve-word" onClick={submitHandler}>
            Im Ready!
          </button>
        </>
      )}
    </div>
  );
};

export default WordChoosing;
