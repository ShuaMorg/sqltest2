const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const db = new sqlite3.Database('./highscores.db');

app.use(bodyParser.json());
app.use(express.static(__dirname));

// Create highscores table if it doesn't exist
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS highscores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    score INTEGER
  )`);
});

// Get high scores
app.get('/highscores', (req, res) => {
  db.all("SELECT * FROM highscores ORDER BY score DESC LIMIT 10", (err, rows) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.json(rows);
  });
});

// Add new high score
app.post('/highscores', (req, res) => {
  const score = req.body.score;
  db.run(`INSERT INTO highscores (score) VALUES (?)`, [score], function(err) {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.status(201).json({ id: this.lastID });
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
