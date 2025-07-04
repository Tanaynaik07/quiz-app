import React, { useState, useEffect } from 'react';

import axios from 'axios';
import Navbar from '../components/Navbar';
import BASE_URL from '../utils/api'; 

const AdminAdd = () => {
  const [topics, setTopics] = useState([]);
  const [newTopic, setNewTopic] = useState('');
  const [form, setForm] = useState({
    quizTopic: '',
    question: '',
    options: ['', '', '', ''],
    correctIndex: 0,
  });
  const [questions, setQuestions] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // Fetch topics
  const fetchTopics = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/quiz/topics`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setTopics(res.data);
    } catch {
      alert('Failed to load topics');
    }
  };

  // Fetch questions
 const fetchQuestions = async (topicName = '') => {
  try {
    const url = topicName
      ? `${BASE_URL}/api/quiz/questions?topic=${topicName}`
      : `${BASE_URL}/api/quiz/questions`;

    const res = await axios.get(url, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });

    setQuestions(res.data);
  } catch {
    alert('Failed to load questions');
  }
};

useEffect(() => {
  if (form.quizTopic) {
    fetchQuestions(form.quizTopic);
  }
}, [form.quizTopic]);
  useEffect(() => {
    fetchTopics();
    fetchQuestions();
  }, []);

  const addTopic = async () => {
    if (!newTopic.trim()) return alert("Topic can't be empty");
    try {
      const res = await axios.post(
        `${BASE_URL}/api/quiz/topics`,
        { name: newTopic.trim() },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setTopics([...topics, res.data]);
      setForm({ ...form, quizTopic: res.data.name });
      setNewTopic('');
      alert('Topic added');
    } catch {
      alert('Failed to add topic or it already exists');
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...form.options];
    newOptions[index] = value;
    setForm({ ...form, options: newOptions });
  };

  const startEditing = (q) => {
    setEditingId(q._id);
    setForm({
      quizTopic: q.quizTopic,
      question: q.question,
      options: q.options,
      correctIndex: q.correctIndex,
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setForm({ quizTopic: '', question: '', options: ['', '', '', ''], correctIndex: 0 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.quizTopic) return alert('Please select or add a topic.');

    try {
      if (editingId) {
        // Update existing question
        await axios.put(
          `${BASE_URL}/api/quiz/questions/${editingId}`,
          form,
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        alert('Question updated!');
      } else {
        // Add new question
        await axios.post(
          `${BASE_URL}/api/quiz/add`,
          form,
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        alert('Question added!');
      }
      cancelEditing();
      fetchQuestions();
      fetchTopics();
    } catch {
      alert('Error saving question');
    }
  };

  const deleteQuestion = async (id) => {
    if (!window.confirm('Delete this question?')) return;
    try {
      await axios.delete(`${BASE_URL}/api/quiz/questions/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      alert('Question deleted');
      fetchQuestions();
      fetchTopics();
    } catch {
      alert('Failed to delete question');
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <Navbar />
      <h2>{editingId ? 'Edit Question' : 'Add New Question (Admin)'}</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: 40 }}>
        <input
          placeholder="Question"
          value={form.question}
          onChange={(e) => setForm({ ...form, question: e.target.value })}
          required
          style={styles.input}
        />

        <select
          value={form.quizTopic}
          onChange={(e) => setForm({ ...form, quizTopic: e.target.value })}
          required
          style={styles.input}
        >
          <option value="">Select Quiz Topic</option>
          {topics.map((t) => (
            <option key={t._id} value={t.name}>
              {t.name} ({t.questionCount})
            </option>
          ))}
        </select>

        <div style={{ marginBottom: 10 }}>
          <input
            placeholder="Add new topic"
            value={newTopic}
            onChange={(e) => setNewTopic(e.target.value)}
            style={{ padding: 8, width: '70%', fontSize: 14, marginRight: 8 }}
          />
          <button
            type="button"
            onClick={addTopic}
            style={{ padding: '8px 12px', cursor: 'pointer' }}
          >
            Add Topic
          </button>
        </div>

        {form.options.map((opt, idx) => (
          <input
            key={idx}
            placeholder={`Option ${idx + 1}`}
            value={opt}
            onChange={(e) => handleOptionChange(idx, e.target.value)}
            required
            style={styles.input}
          />
        ))}

        <select
          value={form.correctIndex}
          onChange={(e) => setForm({ ...form, correctIndex: Number(e.target.value) })}
          style={styles.input}
        >
          {form.options.map((_, i) => (
            <option key={i} value={i}>
              Correct Option: {i + 1}
            </option>
          ))}
        </select>

        <button type="submit" style={styles.button}>
          {editingId ? 'Update Question' : 'Add Question'}
        </button>

        {editingId && (
          <button
            type="button"
            onClick={cancelEditing}
            style={{ ...styles.button, backgroundColor: 'gray', marginLeft: 10 }}
          >
            Cancel
          </button>
        )}
      </form>

      <h3>Existing Questions</h3>
      {questions.length === 0 && <p>No questions found.</p>}
      {questions.map((q) => (
        <div
          key={q._id}
          style={{
            marginBottom: 15,
            padding: 10,
            border: '1px solid #ccc',
            borderRadius: 6,
          }}
        >
          <p style={{ fontWeight: 'bold' }}>
            [{q.quizTopic}] {q.question}
          </p>
          <ul>
            {q.options.map((opt, i) => (
              <li key={i} style={{ fontWeight: q.correctIndex === i ? 'bold' : 'normal' }}>
                {opt}
              </li>
            ))}
          </ul>
          <button onClick={() => startEditing(q)} style={{ marginRight: 10 }}>
            Edit
          </button>
          <button onClick={() => deleteQuestion(q._id)} style={{ backgroundColor: 'red', color: 'white' }}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

const styles = {
  input: { display: 'block', width: '100%', marginBottom: 10, padding: 10, fontSize: 16 },
  button: {
    padding: 10,
    backgroundColor: 'black',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    fontSize: 16,
    borderRadius: 4,
  },
};

export default AdminAdd;
