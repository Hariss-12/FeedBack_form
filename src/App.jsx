
import React, { useState } from "react";
import axios from "axios";
import "./App.css";

// Replace this with your deployed Render backend URL
const API_URL = "https://feedback-form-8xf0.onrender.com";

function App() {
  const [feedback, setFeedback] = useState({
    q1: "",
    q2: "",
    q3: "",
    q4: "",
    q5: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFeedback((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await axios.post(`${API_URL}/api/feedback`, feedback);

      alert("Feedback submitted successfully!");

      setFeedback({
        q1: "",
        q2: "",
        q3: "",
        q4: "",
        q5: "",
      });
    } catch (error) {
      console.error(
        "Error submitting feedback:",
        error.response?.data || error.message
      );

      alert("Failed to submit feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Feedback Form</h1>

      <form onSubmit={handleSubmit} className="feedback-form">

        <label htmlFor="q1">Name:</label>
        <input
          id="q1"
          type="text"
          name="q1"
          value={feedback.q1}
          onChange={handleChange}
          required
        />

        <label htmlFor="q2">Department:</label>
        <input
          id="q2"
          type="text"
          name="q2"
          value={feedback.q2}
          onChange={handleChange}
          required
        />

        <label htmlFor="q3">Session Title:</label>
        <input
          id="q3"
          type="text"
          name="q3"
          value={feedback.q3}
          onChange={handleChange}
          required
        />

        <label htmlFor="q4">Feedback:</label>
        <textarea
          id="q4"
          name="q4"
          value={feedback.q4}
          onChange={handleChange}
          required
          rows="4"
        />

        <label htmlFor="q5">Suggestions:</label>
        <textarea
          id="q5"
          name="q5"
          value={feedback.q5}
          onChange={handleChange}
          rows="3"
        />

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>

      </form>
    </div>
  );
}

export default App;