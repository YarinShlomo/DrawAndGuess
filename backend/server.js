const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const config = require("config");
const Score = require("./model/score");
const c = require("config");

const dbConfig = config.get("DAG.dbConfig.dbName");
mongoose
  .connect(dbConfig)
  .then(() => {
    console.log("Database Connected");
  })
  .catch(() => {
    console.log("Database not Connected");
  });

const app = express();
app.use(express.json());
// app.use(cors({origin: ["http://localhost:3000"]}));
app.use(cors());
app.options("*", cors());

let isPlaying = false;
let toggleDrawWait = true;
let lastPlayingUpdate = new Date();
let painting = "";
let wordToGuess = "";
let difficulty = "";
let numberOfGuesses;
let users = { player1: [], player2: [] };
let users2 = [];

app.listen(2000, () => {
  console.log("server listening on port 2000");
});

app.get("/WelcomeNav", (req, res) => {
  if (toggleDrawWait) {
    res.status(200).json({ status: "toDraw" });
    // isPlaying = true;
  } else {
    res.status(200).json({ status: "toWait" });
  }

  toggleDrawWait = !toggleDrawWait;
});

app.get("/highScore", (req, res) =>{
    Score.find({}, (err, points) =>{
        if(err){
            res.status(500).json({massage: "couldnt reach db"});
        }
        res.status(200).json({score: points[0].score});
    }).sort({score: -1})
    .limit(1) // get the best score only, happens efficiently (mongodb optimization)
});

app.get("/waitingHealthCheck", (req, res) => {
  if (painting && wordToGuess) {
    // send to front
    res.status(200).json({
      status: "ready",
      painting: painting,
      wordToGuess: wordToGuess,
      difficulty: difficulty,
    });
  } else {
    res.status(200).json({ status: "still playing." });
  }
});

app.post("/updateDrawing", (req, res) => {
  // let reqBody = req.body;
  // console.log(reqBody);

  ({ painting, wordToGuess, difficulty } = req.body);
  //////
  // console.log("updated");
  //////
});

app.post("/wordGuessed", (req, res) => {
  let reqBody = req.body;
  let score;
  const currentDate = new Date().getTime();
  ({ numberOfGuesses, score, startDate } = reqBody);
  const timeDiff = currentDate - new Date(startDate).getTime();
  const DBscores = Score.find({}, (err, allScores) => {
    if (err) {
      console.log("[/wordGuessed] error: " + err);
      res.status(500).json({message: "could not fetch data from db"});
    }
    const currentMaxScore = allScores[0].score;
    const isBetterScore = currentMaxScore < score;
    const isSameScoreLessTime =
    currentMaxScore === score && allScores[0].time > new Date() - startDate;

    if (isBetterScore || isSameScoreLessTime) {
      console.log(reqBody);
      console.log(startDate + typeof startDate);
      console.log("time dif: " + timeDiff);
      const Score_1 = new Score({
        score: score,
        time: timeDiff,
      });
      console.log("created");
      console.log(Score_1);
      Score_1.save()
        .then((result) => {
          //   console.log(result);
          res.status(200).json({
            massage: result,
          });
        })
        .catch((err) => {
          //   console.log(err);
          res.status(500).json({
            massage: err,
          });
        });
    } else {
      res.status(200).json({ status: "ok" });
    }
  })
    .sort({ score: -1 })
    .limit(1); // get only the maximus score document.
});

app.get("/isWordGuessed", (req, res) => {
  if (numberOfGuesses >= 0) {
    painting = "";
    wordToGuess = "";
    res.status(200).json({ status: "ready", numberOfGuesses: numberOfGuesses });

    // reset params:
    numberOfGuesses = undefined;
  } else {
    res.status(200).json({ status: "wait" });
  }
});
