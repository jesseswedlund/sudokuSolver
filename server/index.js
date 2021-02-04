const express = require("express");
const morgan = require("morgan");
const path = require("path");
const PORT = process.env.PORT || 3000;
const app = express();

if (process.env.NODE_ENV !== "testing") app.use(morgan("dev"));

app.use(express.json());

app.use(express.static(path.join(__dirname, "..", "public")));

app.use("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public/bundle.js"));
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).send({ message: err.message });
});

app.listen(PORT, () => console.log(`listening on port ${PORT}`));

module.exports = app;
