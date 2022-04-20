import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import './Waiting.css'
import { serverApi } from "../../consts/api";

const Waiting = () => {
  const api = serverApi;
  //navigate
  const navigate = useNavigate();
  const submitHandler = (event) => {
    event.preventDefault();

    navigate("/");
  };
  ///
  const location = useLocation();
  const sessionInfo = location.state.sessionInfo;
  const gotFrom = location.state.from;


  useEffect(() => {

      const serverResponse = () => {
    const uri = gotFrom === "draw" ? "isWordGuessed" : "waitingHealthCheck";
    axios({
      method: "get",
      url: `${api}/${uri}`,
    })
      .catch((e) => {
        console.log("[healthCheck] -> Waiting" + e);
      })
      .then((res) => {
        if (res.data.status === "ready") {
          navigateToNextPage(res.data);
        }
      });
  };
    const healthCheck = setInterval(serverResponse, 3000);
    return () => {
      clearInterval(healthCheck);
    };
  }, []);

  const navigateToNextPage = (data) => {
    let uri;
    let dataToSend;
    if (gotFrom === "draw") {
      uri = "/SwapRoles";
      dataToSend = {
        numberOfGuesses: data.numberOfGuesses,
        wordGuessed: sessionInfo.wordsDrawn.at(-1),
      };
    } else {
      uri = "/guessing";
      dataToSend = {
        wordpicked: data.wordToGuess,
        img: data.painting,
        difficulty: data.difficulty,
      };
    }

    navigate(uri, {
      state: {
        ...dataToSend,
        sessionInfo: sessionInfo,
      },
    });
  };

  return (
    <div className="waiting-page">
      <h4>Waiting the other player...</h4>
      <button onClick={submitHandler}>Go Back</button>
    </div>
  );
};

export default Waiting;
