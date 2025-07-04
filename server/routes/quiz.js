const router = require('express').Router();
const Question = require('../models/Question');
const Result = require('../models/Result');
const auth = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/adminMiddleware');
const QuizTopic = require('../models/QuizTopic');
 
// GET questions by quiz topic
router.get('/questions', auth, async (req, res) => {
  const topic = req.query.topic;
  if (!topic) return res.status(400).json({ msg: "Topic required" });

  const questions = await Question.find({ quizTopic: topic });
  res.json(questions);
});

// SUBMIT Quiz
router.post('/submit', auth, async (req, res) => {
  const { answers } = req.body; // [1, 2, 0, ...]
  const questions = await Question.find();
  let score = 0;

  questions.forEach((q, i) => {
    if (q.correctIndex === answers[i]) score++;
  });

  await Result.create({ userId: req.user.id, score });
  res.json({ msg: "Quiz submitted", score });
});

// Get Result history (optional)
router.get('/results', auth, async (req, res) => {
  const results = await Result.find({ userId: req.user.id });
  res.json(results);
});

// Only Admins can add questions
router.post('/add', auth, isAdmin, async (req, res) => {
  const { quizTopic, question, options, correctIndex } = req.body;

  try {
    let topic = await QuizTopic.findOne({ name: quizTopic });
    if (!topic) {
      topic = await QuizTopic.create({ name: quizTopic, questionCount: 0 });
    }

    // Create question
    const newQuestion = await Question.create({ quizTopic, question, options, correctIndex });

    // Update question count
    topic.questionCount += 1;
    await topic.save();

    res.status(201).json(newQuestion);
  } catch (err) {
    console.error(err);
    res.status(400).json({ msg: "Failed to create question" });
  }
});

// Update a question (admin only)
router.put('/questions/:id', auth, isAdmin, async (req, res) => {
  const { id } = req.params;
  const { question, options, correctIndex } = req.body;
  try {
    const updated = await Question.findByIdAndUpdate(
      id,
      { question, options, correctIndex },
      { new: true }
    );
    if (!updated) return res.status(404).json({ msg: 'Question not found' });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Delete a question (admin only)
router.delete('/questions/:id', auth, isAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const question = await Question.findById(id);
    if (!question) return res.status(404).json({ msg: 'Question not found' });

    const topic = await QuizTopic.findOne({ name: question.quizTopic });

    // Delete question
    await question.remove();

    // Decrement topic question count and remove topic if 0
    if (topic) {
      topic.questionCount = Math.max(0, topic.questionCount - 1);
      if (topic.questionCount === 0) {
        await topic.remove();
      } else {
        await topic.save();
      }
    }

    res.json({ msg: 'Question deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Topics routes
router.post('/topics', async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Topic name is required' });

  try {
    let topic = await QuizTopic.findOne({ name });
    if (topic) return res.status(400).json({ error: 'Topic already exists' });

    topic = await QuizTopic.create({ name, questionCount: 0 });
    res.status(201).json(topic);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/topics', async (req, res) => {
  const topics = await QuizTopic.find();
  res.json(topics);
});

module.exports = router;
