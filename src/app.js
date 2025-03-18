const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const dotenv = require('dotenv');
const trailerRouter = require('./routes/trailer');
const globalErrorHandler = require('./middleware/globalErrorHandler');
const morgan = require('morgan');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(morgan('dev'));
app.use(helmet());

//  Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Max de 100 req for IP
  message: 'Too many requests from this IP, please try again later.',
  headers: true,
});

app.use('/api', limiter);
app.use('/api', trailerRouter);

app.use(globalErrorHandler);

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} in ${process.env.NODE_ENV} mode.`);
});

module.exports = { app, server };
