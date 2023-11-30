const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  quizCode: String,
  category: String,
  title: String,
  questions: [
    {
      question: String,
      options: [String],
      correctOption: String,
    },
  ],
});

const Challenge = mongoose.model('Challenge', challengeSchema);

mongoose.connect('mongodb://localhost:27017/quizzy', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

module.exports = Challenge;
