// Массив доменов, с которых разрешены кросс-доменные запросы
const allowedCors = [
  'https://api.application-mesto.nomoredomains.xyz',
  'http://api.application-mesto.nomoredomains.xyz',
  'https://application-mesto.nomoredomains.icu',
  'http://application-mesto.nomoredomains.icu',
  'localhost:3000',
];

module.exports.allowOrigin = (req, res, next) => {
  const { origin } = req.headers; // Сохраняю источник запроса в переменную origin
  // проверяю, что источник запроса есть среди разрешённых
  if (allowedCors.includes(origin)) {
    // устанавливаю заголовок, который разрешает браузеру запросы с этого источника
    res.header('Access-Control-Allow-Origin', origin);
  }
  const { method } = req; // Сохраняю тип запроса (HTTP-метод) в соответствующую переменную

  // Значение для заголовка Access-Control-Allow-Methods по умолчанию (разрешены все типы запросов)
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

  // Если это предварительный запрос, добавляем нужные заголовки
  if (method === 'OPTIONS') {
    // разрешаю кросс-доменные запросы любых типов (по умолчанию)
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    // завершаю обработку запроса и возвращаем результат клиенту
    return res.end();
  }
  next();
};
