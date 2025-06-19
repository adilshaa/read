import React, { useState } from 'react';
import { supabase } from '../supabaseClient'; // Import Supabase client

const AdminPage = () => {
  const [questionText, setQuestionText] = useState('');
  // Initialize with 2 empty options by default
  const [options, setOptions] = useState([
    { id: 1, text: '' },
    { id: 2, text: '' },
  ]);
  const [correctOptionId, setCorrectOptionId] = useState(null);
  const [nextOptionId, setNextOptionId] = useState(3); // To generate unique IDs for new options
  const [isSubmitting, setIsSubmitting] = useState(false); // For loading state

  const handleQuestionTextChange = (e) => {
    setQuestionText(e.target.value);
  };

  const handleOptionTextChange = (id, text) => {
    setOptions(
      options.map((option) => (option.id === id ? { ...option, text } : option))
    );
  };

  const handleCorrectOptionChange = (id) => {
    setCorrectOptionId(id);
  };

  const addOption = () => {
    // Limit the number of options, e.g., to 6
    if (options.length >= 6) {
      alert('You can add a maximum of 6 options.');
      return;
    }
    setOptions([...options, { id: nextOptionId, text: '' }]);
    setNextOptionId(nextOptionId + 1);
  };

  const removeOption = (id) => {
    // Don't allow removing if only 2 options are left
    if (options.length <= 2) {
      alert('A question must have at least two options.');
      return;
    }
    setOptions(options.filter((option) => option.id !== id));
    // If the removed option was the correct one, reset correctOptionId
    if (correctOptionId === id) {
      setCorrectOptionId(null);
    }
  };

  const handleSubmit = async (e) => { // Make handleSubmit async
    e.preventDefault();
    setIsSubmitting(true); // Set loading state
    // Basic validation
    if (!questionText.trim()) {
      alert('Please enter the question text.');
      return;
    }
    if (options.some(opt => !opt.text.trim())) {
      alert('Please ensure all options have text.');
      return;
    }
    if (options.length < 2) {
      alert('A question must have at least two options.');
      return;
    }
    if (correctOptionId === null) {
      alert('Please select the correct answer.');
      setIsSubmitting(false);
      return;
    }

    const correctAnswerObject = options.find(opt => opt.id === correctOptionId);
    if (!correctAnswerObject) {
        alert('Selected correct answer not found. This should not happen.');
        setIsSubmitting(false);
        return;
    }

    const questionData = {
      question_text: questionText, // snake_case for Supabase column
      options_array: options.map(opt => opt.text), // snake_case for Supabase column
      correct_answer_text: correctAnswerObject.text, // snake_case for Supabase column
    };

    try {
      const { data, error } = await supabase
        .from('questions')
        .insert([questionData])
        .select(); // .select() can be used to get the inserted data back

      if (error) {
        console.error('Error inserting question:', error);
        alert(`Error saving question: ${error.message}`);
      } else {
        console.log('Question saved successfully:', data);
        alert('Question saved successfully!');
        // Reset form
        setQuestionText('');
        setOptions([{ id: 1, text: '' }, { id: 2, text: '' }]);
        setCorrectOptionId(null);
        setNextOptionId(3);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      alert('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false); // Reset loading state
    }
  };
  // Basic styling (can be moved to a CSS file)
  const formStyle = {
    maxWidth: '700px', // Wider for better layout
    margin: '2rem auto',
    padding: '2rem',
    backgroundColor: '#f9f9f9', // Light background for the form
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
  };
  const labelStyle = {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '600', // Slightly bolder
    color: '#333',
  };
  const inputStyle = {
    width: '100%',
    padding: '0.75rem', // More padding
    marginBottom: '1rem',
    border: '1px solid #ccc', // Softer border
    borderRadius: '4px',
    boxSizing: 'border-box',
    fontSize: '1rem',
  };
  const buttonStyle = {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '0.5rem',
    fontSize: '1rem',
    transition: 'background-color 0.2s ease',
  };
   const removeButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#dc3545',
    padding: '0.3rem 0.6rem',
    marginLeft: '10px',
    fontSize: '0.8rem', // Smaller remove button
  };
  const optionEntryStyle = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '0.75rem', // More spacing
  };
  const radioInputStyle = {
    marginRight: '10px',
    transform: 'scale(1.2)', // Slightly larger radio
  };
  const optionInputStyle = {
    ...inputStyle,
    marginBottom: '0', // Reset margin as it's controlled by optionEntryStyle
    flexGrow: 1,
  };


  return (
    <div style={formStyle}>
      <h2 style={{textAlign: 'center', color: '#333', marginBottom: '2rem'}}>Add New Question</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="questionText" style={labelStyle}>Question:</label>
          <textarea
            id="questionText"
            value={questionText}
            onChange={handleQuestionTextChange}
            rows="4" // More rows
            style={inputStyle}
            required
            placeholder="Enter the question here..."
          />
        </div>

        <label style={labelStyle}>Options (select the correct one):</label>
        {options.map((option, index) => (
          <div key={option.id} style={optionEntryStyle}>
            <input
              type="radio"
              name="correctOption"
              id={`option_radio_${option.id}`}
              checked={correctOptionId === option.id}
              onChange={() => handleCorrectOptionChange(option.id)}
              style={radioInputStyle}
              // Make the radio group required by ensuring at least one is checked via form validation (done in handleSubmit)
            />
            <input
              type="text"
              value={option.text}
              onChange={(e) => handleOptionTextChange(option.id, e.target.value)}
              placeholder={`Option ${index + 1}`}
              style={optionInputStyle}
              required
            />
            {options.length > 2 && (
              <button
                type="button"
                onClick={() => removeOption(option.id)}
                style={removeButtonStyle}
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addOption}
          style={{...buttonStyle, backgroundColor: '#28a745', marginTop: '0.5rem', marginBottom: '1.5rem'}}
          disabled={options.length >= 6} // Disable if 6 options reached
        >
          Add Option
        </button>

        <div>
          <button
            type="submit"
            style={{...buttonStyle, width: '100%', marginTop: '1rem'}}
            disabled={isSubmitting} // Disable button while submitting
          >
            {isSubmitting ? 'Saving...' : 'Save Question'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminPage;
