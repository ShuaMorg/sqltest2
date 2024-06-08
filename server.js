const express = require('express');
const Sequelize = require('sequelize');
const cors = require('cors');

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
    type: Sequelize.STRING,
    allowNull: false
  },
  score: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
});

// Sync database
sequelize.sync();

// Endpoint to save score
app.post('/save-score', async (req, res) => {
  const { username, score } = req.body;
  try {
    const newScore = await Score.create({ username, score });
    res.status(201).json(newScore);
  } catch (error) {
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
    res.status(500).json({ error: 'Error retrieving scores' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
