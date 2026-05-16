import React, { useState, useContext } from 'react';
import { TodoContext } from '../../context/TodoContext';

export default function TodoInput() {
  const { addTask } = useContext(TodoContext);
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (addTask(text)) setText('');
  };

  return (
    <form className="todo-input-row" onSubmit={handleSubmit}>
      <input
        id="todo-new-task-input"
        type="text"
        className="todo-input-field"
        placeholder="What needs to be done?"
        value={text}
        onChange={(e) => setText(e.target.value)}
        autoComplete="off"
      />
      <button
        id="todo-add-btn"
        type="submit"
        className="todo-add-btn"
        disabled={!text.trim()}
        aria-label="Add task"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>
    </form>
  );
}
