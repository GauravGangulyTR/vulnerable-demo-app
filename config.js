// VULNERABILITY: More hardcoded secrets
module.exports = {
  database: {
    host: 'localhost',
    user: 'root',
    password: 'admin123', // Hardcoded password
    database: 'myapp'
  },
  jwt: {
    secret: 'supersecretkey123', // Hardcoded JWT secret
    expiresIn: '7d'
  },
  api: {
    key: 'sk-1234567890abcdef', // Hardcoded API key
    endpoint: 'http://api.example.com' // Using HTTP instead of HTTPS
  },
  admin: {
    username: 'admin',
    password: 'admin123' // Default admin credentials
  }
};
