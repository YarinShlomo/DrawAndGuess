import { useLocation, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import axios from "axios";
import Canvas from "./Canvas/Canvas";
import "./Draw.css";
import { serverApi } from "../../consts/api";

const Drawing = () => {
  const api = serverApi;

  //navigate
  const navigate = useNavigate();

  const goBackHandler = (event) => {
    event.preventDefault();

    navigate("/");
  };
  ///

  const headRef = useRef(null);

  const location = useLocation();
  const wordPicked = location.state.wordpicked;
  const difficulty = location.state.sessionInfo.difficulty;
  const sessionInfo = location.state.sessionInfo;
  let [base64Img, setBase64Img] = useState([]);
  

  const submitHandler = () => {
    axios({
      method: "post",
      url: `${api}/updateDrawing`,
      data: {
        painting: base64Img,
        wordToGuess: wordPicked,
        difficulty: difficulty,
      },
    }).catch((e) => {
      console.log("[submitHandler] from Submit " + e);
    });

    sessionInfo.wordsDrawn.push(wordPicked);
    navigate("/waiting", { state: { sessionInfo: sessionInfo, from: "draw" } });
  };

  return (
    <div className="draw-page">
      <h4 ref={headRef} name="draw-title">
        Need to Draw: {wordPicked}
      </h4>
      <Canvas setimage={setBase64Img} />
      <button type="submit" onClick={submitHandler}>
        Submit Drawing
      </button>
      <button onClick={goBackHandler}>Go Back</button>
    </div>
  );
};

export default Drawing;
