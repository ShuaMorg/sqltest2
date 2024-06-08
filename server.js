const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const cors = require('cors');
const path = require('path');

// Initialize Express
const app = express();
app.use(cors()); // Enable CORS
app.use(express.json());

// Initialize Sequelize with SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'scores.sqlite'
});

// Define the Score model
const Score = sequelize.define('Score', {
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

// Sync database
sequelize.sync();

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to save score
app.post('/save-score', async (req, res) => {
  const { username, score } = req.body;
  try {
    const newScore = await Score.create({ username, score });
    res.status(201).json(newScore);
  } catch (error) {
    console.error('Error saving score:', error);
    res.status(500).json({ error: 'Error saving score' });
  }
});

// Endpoint to get high scores
app.get('/high-scores', async (req, res) => {
  try {
    const scores = await Score.findAll({
      order: [['score', 'DESC']],
      limit: 10
    });
    res.status(200).json(scores);
  } catch (error) {
    console.error('Error retrieving scores:', error);
    res.status(500).json({ error: 'Error retrieving scores' });
  }
});

// Serve the index.html file for the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
