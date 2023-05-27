const { permitCors } = require('../index');

module.exports = (req, res, next) => {
  if (permitCors.includes(req.headers.origin)) {
    return res.header('Access-Control-Allow-Origin', req.headers.origin);
  }
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  const reqHeaders = req.headers['access-control-request-headers'];
  res.header('Access-Control-Allow-Credentials', true);
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', reqHeaders);

    return res.end();
  }

  return next();
};
