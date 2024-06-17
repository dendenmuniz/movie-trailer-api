const express = require("express");
const dotenv = require("dotenv");
const trailerRouter = require("./routes/trailer");

const app = express();

dotenv.config({ path: "./config/config.env" });

const PORT = process.env.PORT;

app.use(express.json());
app.use("/api", trailerRouter);

const server = app.listen(PORT, () => {
  console.log(
    `Server is running on port ${PORT} in ${process.env.NODE_ENV} mode.`
  );
});

module.exports = { app, server };
