const express = require("express");
const logger = require("morgan");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(logger('dev'));
}

// app.use("/api", routerApi);

app.use((_, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, _, res) => {
  res.status(err.status).json({ message: err.message });
});

module.exports = app;
