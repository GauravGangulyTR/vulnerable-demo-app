const mysql = require('mysql');

// VULNERABILITY: Database connection with hardcoded credentials
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'password123', // Hardcoded password
  database: 'myapp',
  multipleStatements: true // VULNERABILITY: Allows SQL injection with multiple statements
};

const connection = mysql.createConnection(dbConfig);

// VULNERABILITY: No connection encryption
connection.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    // VULNERABILITY: Logging sensitive error information
    console.error('Connection details:', dbConfig);
  }
});

// VULNERABILITY: Unsafe query builder
function buildQuery(table, conditions) {
  let query = `SELECT * FROM ${table} WHERE `;
  
  // Direct string concatenation - SQL injection vulnerability
  const conditionStrings = Object.keys(conditions).map(key => {
    return `${key} = '${conditions[key]}'`;
  });
  
  query += conditionStrings.join(' AND ');
  return query;
}

// VULNERABILITY: No input validation
function insertUser(userData) {
  const query = `INSERT INTO users (username, email, password) VALUES ('${userData.username}', '${userData.email}', '${userData.password}')`;
  
  return new Promise((resolve, reject) => {
    connection.query(query, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
}

// VULNERABILITY: SQL injection in search
function searchUsers(searchTerm) {
  const query = `SELECT * FROM users WHERE username LIKE '%${searchTerm}%' OR email LIKE '%${searchTerm}%'`;
  
  return new Promise((resolve, reject) => {
    connection.query(query, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
}

module.exports = {
  connection,
  buildQuery,
  insertUser,
  searchUsers
};
