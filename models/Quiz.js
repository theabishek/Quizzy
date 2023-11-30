const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    quizCode: String,
    username: String,
    email: String,
    college: String,
    quizName: String
});

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;
