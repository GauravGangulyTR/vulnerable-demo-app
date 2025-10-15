const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
app.use(express.json());

// FIXED: Use environment variables for secrets
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'myapp'
};

// FIXED: SQL injection - using parameterized queries
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [results] = await connection.execute(
      'SELECT * FROM users WHERE username = ? AND password = ?',
      [username, password]
    );
    
    if (results.length > 0) {
      res.json({ success: true });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
    
    await connection.end();
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(3000, () => console.log('Server running securely'));
