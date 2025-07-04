const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  quizTopic: { type: String, required: true }, // store topic name here
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctIndex: { type: Number, required: true },
});

module.exports = mongoose.model('Question', QuestionSchema);
