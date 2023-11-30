const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  collegeName: String,
  role: String
});

const User = mongoose.model('User', userSchema);

module.exports = User;
