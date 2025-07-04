// models/QuizTopic.js
const mongoose = require('mongoose');

const QuizTopicSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  questionCount: { type: Number, default: 0 },
});

module.exports = mongoose.model('QuizTopic', QuizTopicSchema);
