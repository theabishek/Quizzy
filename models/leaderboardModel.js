const mongoose = require('mongoose');

const leaderboardSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    fullname: String,
    email: String,
    college: {
        type: String,
        required: true,
    },
    points: {
        type: Number,
        required: true,
    },
});

const Leaderboard = mongoose.model('Leaderboard', leaderboardSchema);

module.exports = Leaderboard;
