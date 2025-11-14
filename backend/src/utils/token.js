const jwt = require('jsonwebtoken');

const getSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('Configura JWT_SECRET antes de generar tokens');
  }
  return secret;
};

const generateToken = (payload, expiresIn = process.env.TOKEN_EXPIRATION || '2h') => {
  return jwt.sign(payload, getSecret(), { expiresIn });
};

const verifyToken = (token) => jwt.verify(token, getSecret());

module.exports = { generateToken, verifyToken };
