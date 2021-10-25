module.exports = (err, req, res, next) => {
  if (err.message === 'Validation failed') {
    const err = new Error('Переданы некорректные данные');
    res.status(400).send({ message: err.message });
  }
  const status = err.statusCode || 500;
  const { message } = err;
  console.log(err.message);
  res.status(status).json({ err: message || 'Произошла ошибка на сервере' });
  return next();
};
