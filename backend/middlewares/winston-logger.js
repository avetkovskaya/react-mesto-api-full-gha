const winston = require('winston');
const expressWinston = require('express-winston');

const loggerTransports = [
  new winston.transports.File({ filename: 'request.log' }),
];

const requestLogger = expressWinston.logger({
  transports: loggerTransports,
  format: winston.format.json(),
});

const errorLogger = expressWinston.errorLogger({
  transports: loggerTransports,
  format: winston.format.json(),
});

module.exports = {
  requestLogger,
  errorLogger,
  loggerTransports,
};
