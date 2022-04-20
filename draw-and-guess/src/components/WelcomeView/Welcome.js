import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Welcome.css";
import { useEffect, useState } from "react";


const Welcome = (props) => {
  let goTo = "";
  const navigate = useNavigate();
  const [highScore, setHighScore] = useState(0);

  useEffect(()=>{
    axios({
      method: "get",
      url: "http://localhost:2000/highScore"
    })
    .catch((e) => {
      console.log("[useEffect] => welcome: couldnt get highest score" + e);
    })
    .then((res)=> {
      setHighScore(res.data.score);
    })
  })

  const submitHandler = (event) => {
    event.preventDefault();
    
    axios({
      method: "get",
      url: "http://localhost:2000/WelcomeNav",
    })
      .catch((e) => {
        console.log("[Welcome] => " + e);
      })
      .then((res) => {
        goTo = res.data.status;
        //first player go to choosing word -> drawing , else to waiting room.
        if (goTo === "toDraw") {
          goTo = "/Choosing";
        } else {
          goTo = "/waiting";
        }
        navigate(goTo, {
          state: { sessionInfo: sessionInfo, from: "welcome" },
        });
      });
  };

  let sessionInfo = {
    wordGuessed: [],
    wordsDrawn: [],
    score: 0,
    startDate : new Date()
  };

  return (
    <div className="WelcomePage">
      <div className="HowToPlay">
        best score: {highScore}
        <h5>How to play?</h5>
        <span>
          <div style={{ marginBottom: 15 }}>
            You need least two players to play this game.
          </div>
          When its your turn to draw, you will have to visualize the word you
          chose and draw it.
          <br />
          alternatively when somebody else is drawing you have to type your
          guess into the chat to gain points.
        </span>
      </div>
      <div className="DifficultyAndRewards">
        <h5>difficulty and rewards:</h5>
        <span>
          Easy (3-4 letters) gain 1 point.
          <br />
          Medium (5 letters) gain 3 points.
          <br />
          Hard (6+ letters) gain 5 points.
        </span>
      </div>
      <br />
      <button className="NextPage" onClick={submitHandler}>
        <b>Play</b>
      </button>
      <br />
    </div>
  );
};

export default Welcome;
