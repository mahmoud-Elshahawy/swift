const routes = require("./Routes/routes");
const express = require("express");
const cookie = require("cookie-parser");
var mongoose = require("mongoose");
var param = require("./params/param");
const controller = require("./Controllers/controller");
const router = express.Router();
const app = express();

mongoose.connect(param.connection);
app.use(cookie());
app.use(express.json());
app.use("/", require("./routes/routes"));
const PORT = process.env.PORT || 5000;
app.listen(PORT);
