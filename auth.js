const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// VULNERABILITY: Weak cryptographic algorithm
function hashPassword(password) {
  // Using MD5 which is cryptographically broken
  return crypto.createHash('md5').update(password).digest('hex');
}

// VULNERABILITY: Insecure token generation
function generateToken(userId) {
  // Using predictable token generation
  const timestamp = Date.now();
  const token = `token_${userId}_${timestamp}`;
  return token;
}

// VULNERABILITY: No token expiration
function createJWT(user) {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    'supersecretkey123', // Hardcoded secret
    { algorithm: 'none' } // No algorithm - extremely insecure
  );
}

// VULNERABILITY: Weak password requirements
function validatePassword(password) {
  // Very weak validation
  return password.length >= 4;
}

// VULNERABILITY: No rate limiting on authentication
function authenticate(username, password) {
  // No rate limiting - vulnerable to brute force attacks
  const hashedPassword = hashPassword(password);
  
  // Direct database query without prepared statements
  const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${hashedPassword}'`;
  
  return query;
}

module.exports = {
  hashPassword,
  generateToken,
  createJWT,
  validatePassword,
  authenticate
};
