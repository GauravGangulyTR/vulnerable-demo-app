const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// VULNERABILITY 1: Hardcoded secrets
const JWT_SECRET = 'supersecretkey123'; // Hardcoded secret
const DB_PASSWORD = 'admin123'; // Hardcoded password
const API_KEY = 'sk-1234567890abcdef'; // Hardcoded API key

// VULNERABILITY 2: SQL Injection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: DB_PASSWORD,
  database: 'myapp'
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  // SQL Injection vulnerability - concatenating user input directly
  const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
  
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (results.length > 0) {
      const token = jwt.sign({ username }, JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  });
});

// VULNERABILITY 3: Command Injection
app.post('/ping', (req, res) => {
  const { host } = req.body;
  
  // Command injection - user input passed directly to exec
  exec(`ping -c 4 ${host}`, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json({ output: stdout });
  });
});

// VULNERABILITY 4: Path Traversal
app.get('/download', (req, res) => {
  const { filename } = req.query;
  
  // Path traversal - no validation of filename
  const filePath = path.join(__dirname, 'uploads', filename);
  
  res.download(filePath, (err) => {
    if (err) {
      res.status(404).json({ error: 'File not found' });
    }
  });
});

// VULNERABILITY 5: Insecure Direct Object Reference (IDOR)
app.get('/user/:id', (req, res) => {
  const userId = req.params.id;
  
  // No authorization check - any user can access any user's data
  const query = `SELECT * FROM users WHERE id = ${userId}`;
  
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results[0]);
  });
});

// VULNERABILITY 6: Weak password hashing
app.post('/register', async (req, res) => {
  const { username, password, email } = req.body;
  
  // Weak bcrypt rounds (should be 10+)
  const hashedPassword = await bcrypt.hash(password, 4);
  
  const query = `INSERT INTO users (username, password, email) VALUES ('${username}', '${hashedPassword}', '${email}')`;
  
  db.query(query, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ success: true, userId: result.insertId });
  });
});

// VULNERABILITY 7: Missing input validation
app.post('/update-profile', (req, res) => {
  const { userId, bio, website } = req.body;
  
  // No input validation or sanitization
  const query = `UPDATE users SET bio = '${bio}', website = '${website}' WHERE id = ${userId}`;
  
  db.query(query, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ success: true });
  });
});

// VULNERABILITY 8: Missing authentication
app.get('/admin/users', (req, res) => {
  // No authentication check - anyone can access admin endpoint
  const query = 'SELECT * FROM users';
  
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// VULNERABILITY 9: Information disclosure
app.get('/error-test', (req, res) => {
  try {
    // Intentional error
    throw new Error('Database connection failed');
  } catch (error) {
    // Exposing full error stack to client
    res.status(500).json({
      error: error.message,
      stack: error.stack,
      env: process.env // Exposing environment variables
    });
  }
});

// VULNERABILITY 10: Insecure file upload
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('file'), (req, res) => {
  // No file type validation or size limits
  res.json({
    success: true,
    filename: req.file.filename,
    originalName: req.file.originalname
  });
});

// VULNERABILITY 11: Missing CORS configuration
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Allows any origin
  res.header('Access-Control-Allow-Headers', '*');
  next();
});

// VULNERABILITY 12: Using eval with user input
app.post('/calculate', (req, res) => {
  const { expression } = req.body;
  
  try {
    // Dangerous use of eval with user input
    const result = eval(expression);
    res.json({ result });
  } catch (error) {
    res.status(400).json({ error: 'Invalid expression' });
  }
});

// VULNERABILITY 13: Missing rate limiting
app.post('/send-email', (req, res) => {
  const { to, subject, body } = req.body;
  
  // No rate limiting - vulnerable to abuse
  console.log(`Sending email to ${to}`);
  res.json({ success: true });
});

// VULNERABILITY 14: Insecure session management
app.post('/create-session', (req, res) => {
  const { username } = req.body;
  
  // Session ID is predictable
  const sessionId = `session_${username}_${Date.now()}`;
  
  res.cookie('sessionId', sessionId, {
    httpOnly: false, // Should be true
    secure: false, // Should be true in production
    sameSite: 'none' // Too permissive
  });
  
  res.json({ success: true });
});

// VULNERABILITY 15: XML External Entity (XXE)
const xml2js = require('xml2js');

app.post('/parse-xml', (req, res) => {
  const { xmlData } = req.body;
  
  // XXE vulnerability - XML parser not configured securely
  const parser = new xml2js.Parser();
  
  parser.parseString(xmlData, (err, result) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json(result);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`WARNING: This is a deliberately vulnerable application for security testing`);
});

module.exports = app;
