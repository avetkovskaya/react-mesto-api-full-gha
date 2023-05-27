const errorProcessing = (err, req, res, next) => {
  const { statusCode = 500, message } = err;
  const responseMessage = statusCode === 500 ? 'Где-то на сервере произошла ошибка' : message;
  res.status(statusCode).send({ message: responseMessage });
  next();
};

module.exports = { errorProcessing };
