import React, { useContext } from 'react';
import { TodoContext } from '../../context/TodoContext';

export default function TodoItem({ task }) {
  const { toggleTask, deleteTask } = useContext(TodoContext);

  return (
    <div className={`todo-item ${task.completed ? 'todo-item--done' : ''}`}>
      {/* Custom checkbox */}
      <button
        className={`todo-checkbox ${task.completed ? 'todo-checkbox--checked' : ''}`}
        onClick={() => toggleTask(task.id)}
        aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
        type="button"
      >
        {task.completed && (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </button>

      {/* Label */}
      <span className="todo-item-text" onClick={() => toggleTask(task.id)}>
        {task.text}
      </span>

      {/* Delete */}
      <button
        className="todo-delete-btn"
        onClick={() => deleteTask(task.id)}
        aria-label="Delete task"
        type="button"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}
