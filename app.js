const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const Quiz = require('./models/Quiz.js');
const Challenge = require('./models/Challenge.js');
const Leaderboard = require('./models/leaderboardModel');
const app = express();
const cors = require('cors');

app.use(cors());

// Connect to MongoDB
const mongoURI = 'mongodb://localhost:27017/quizzy';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });


// Use sessions for tracking logins
app.use(session({
  secret: 'your-secret-key',
  resave: true,
  saveUninitialized: false
}));

// Middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files from the 'public' folder
app.use(express.static('public'));

// Set up routes
const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);

app.post('/api/create-quiz', async (req, res) => {
  try {
    const quizData = req.body;
    console.log('Received quiz data:', quizData);

      const newQuiz = new Quiz({
          quizCode: quizData.quizCode,
          username: quizData.username,
          email: quizData.email,
          college: quizData.college,
          quizName: quizData.quizName,
      });

      await newQuiz.save();

      res.json({ success: true, message: 'Quiz created successfully' });
  } catch (error) {
      console.error('Error creating quiz:', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// Endpoint to fetch all challenges
app.get('/api/challenges', async (req, res) => {
  try {
    const challenges = await Challenge.find({}, 'quizCode category title questions');
    res.json(challenges);
  } catch (error) {
    console.error('Error fetching challenges:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to fetch a specific challenge quiz
app.get('/api/challenge-quiz', async (req, res) => {
  const quizCode = req.query.quizCode;
  try {
    const challenge = await Challenge.findOne({ quizCode });
    res.json(challenge);
  } catch (error) {
    console.error('Error fetching challenge quiz:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Add Questions in challenge
app.post('/api/add-challenges', async (req, res) => {
  try {
    const challengeQuizzes = req.body;
    
    const results = [];
    for (const challenge of challengeQuizzes) {
      
      const existingQuiz = await Challenge.findOne({ quizCode: challenge.quizCode });

      if (existingQuiz) {
        
        const updatedQuiz = await Challenge.findOneAndUpdate({ quizCode: challenge.quizCode }, challenge, { new: true });
        results.push(updatedQuiz);
      } else {
        
        const result = await Challenge.create(challenge);
        results.push(result);
      }
    }

    res.json({ success: true, addedQuizzes: results });
  } catch (error) {
    console.error('Error adding challenge quizzes:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});


app.post('/joinleaderboard', async (req, res) => {
    try {
        const data = req.body;
        console.log('Received data:', data);
        
        const existingEntry = await Leaderboard.findOne({ username: data.username, email: data.email });

        if (existingEntry) {
            existingEntry.fullname = data.fullname;
            existingEntry.college = data.college;
            existingEntry.points = data.points;

            await existingEntry.save();
            console.log('Data updated in the leaderboard:', existingEntry);
            res.status(200).send('Data updated in the leaderboard!');
        } else {
            const leaderboardEntry = new Leaderboard({
                username: data.username,
                fullname: data.fullname,
                email: data.email,
                college: data.college,
                points: data.points,
            });

            await leaderboardEntry.save();
            console.log('Data added to the leaderboard:', leaderboardEntry);
            res.status(200).send('Data added to the leaderboard!');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/leaderboard', async (req, res) => {
  try {
      const limit = parseInt(req.query.limit) || 10;

      const data = await Leaderboard.find({}, null, { limit }).sort({ points: -1 });

      res.status(200).json(data);
  } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
  }
});

app.delete('/api/drop-challenge', async (req, res) => {
  try {
    const quizCode = req.query.quizCode;

    const result = await Challenge.deleteOne({ quizCode });

    if (result.deletedCount > 0) {
      res.json({ success: true, message: 'Challenge dropped successfully.' });
    } else {
      res.status(404).json({ success: false, error: 'Challenge not found.' });
    }
  } catch (error) {
    console.error('Error dropping challenge:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});


// Start the server
const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });