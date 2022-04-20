const { default: mongoose } = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const ScoreSchema = new Schema({
  score: Number,
  time: Number,
});

const Score = mongoose.model("bestScore", ScoreSchema);

module.exports = Score;
