const mongoose = require("mongoose");
const TimeJogSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  distance: {
    type: Number,
    required: true,
  },
  time: {
    type: Number,
    required: true,
  },
});
var TimeJog = mongoose.model("TimeJog", TimeJogSchema);
module.exports = TimeJog;
