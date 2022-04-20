const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const config = require("config");
const Score = require("./model/score");
const c = require("config");

const port = process.env.PORT || 2000;

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
app.use(cors());
app.options("*", cors());

let toggleDrawWait = true;
let painting = "";
let wordToGuess = "";
let difficulty = "";
let numberOfGuesses;


app.listen(port, (err) => {
  if(err) return console.log(err);
  console.log("server running on port 2000");
});

app.get("/WelcomeNav", (req, res) => {
  if (toggleDrawWait) {
    res.status(200).json({ status: "toDraw" });
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
  ({ painting, wordToGuess, difficulty } = req.body);

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
