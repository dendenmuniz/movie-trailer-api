const express = require("express");
const dotenv = require("dotenv");
const trailerRouter = require("./routes/trailer");
const globalErrorHandler = require("./middleware/globalErrorHandler");
const morgan = require("morgan");

dotenv.config({ path: "./config/config.env" });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(morgan("dev")); 

app.use("/api", trailerRouter);


app.use(globalErrorHandler);

const server = app.listen(PORT, () => {
  console.log(
    `Server is running on port ${PORT} in ${process.env.NODE_ENV} mode.`
  );
});

module.exports = { app, server };
