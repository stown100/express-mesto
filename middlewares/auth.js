const jwt = require('jsonwebtoken');

function handleAuthError(res, next) {
  const err = new Error('Необходима авторизация');
  err.statusCode = 401;
  next(err);
  // return res.status(401).send({ msg: 'Необходима авторизация' });
}

function extractBearerToken(header) {
  return header.replace('Bearer ', '');
}

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return handleAuthError(res);
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, 'super-strong-secret');
  } catch (err) {
    err.statusCode = 401;
    next(err);
  }
  req.user = payload; // записывю пейлоуд в объект запроса
};
