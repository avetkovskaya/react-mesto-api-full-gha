const permitCors = [
  'https://avetkovskaya.mesto.nomoredomains.icu',
  'http://avetkovskaya.mesto.nomoredomains.icu',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'https://web.postman.co',
];

const {
  MONGODB_URL = 'mongodb://localhost:27017/mestodb',
  NODE_ENV,
  PORT = 3000,
  JWT_SECRET,
} = process.env;

const ValidationURL = /^(http|https):\/\/([-a-zA-Z0-9-]+\.)+[a-zA-Z]{1,256}(\/[a-zA-Z0-9-._~:/?&#[\]@$!'()+*,;=]*#?)?$/;

module.exports = {
  permitCors,
  NODE_ENV,
  PORT,
  JWT_SECRET: NODE_ENV === 'production' ? JWT_SECRET : 'JWT_SECRET',
  MONGODB_URL,
  ValidationURL,
};
