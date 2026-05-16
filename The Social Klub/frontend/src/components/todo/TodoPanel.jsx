import React, { useState, useEffect, useContext } from 'react';
import { TodoContext } from '../../context/TodoContext';
import TodoInput from './TodoInput';
import TodoFilter from './TodoFilter';
import TodoList from './TodoList';

const TRANSITION_MS = 320;

export default function TodoPanel({ isOpen, onClose }) {
  const { activeCount, tasks, clearCompleted } = useContext(TodoContext);
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const completedCount = tasks.length - activeCount;

  // Animate open
  useEffect(() => {
    if (isOpen) {
      setClosing(false);
      const t = requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });
      return () => cancelAnimationFrame(t);
    }
  }, [isOpen]);

  // Animate close
  const handleClose = () => {
    setVisible(false);
    setClosing(true);
    setTimeout(() => {
      onClose();
      setClosing(false);
    }, TRANSITION_MS);
  };

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

  if (!isOpen && !closing) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="todo-backdrop"
        style={{ opacity: visible ? 1 : 0 }}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className="todo-drawer"
        style={{ transform: visible ? 'translateX(0)' : 'translateX(100%)' }}
        role="dialog"
        aria-label="Todo panel"
      >
        {/* Header */}
        <div className="todo-drawer-header">
          <div className="todo-drawer-title-row">
            <div>
              <h5 className="todo-drawer-title">My Tasks</h5>
              <span className="todo-drawer-subtitle">
                {activeCount} remaining{completedCount > 0 ? ` · ${completedCount} done` : ''}
              </span>
            </div>
            <button
              id="todo-close-btn"
              type="button"
              className="todo-close-btn"
              onClick={handleClose}
              aria-label="Close todo panel"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Input */}
        <div className="todo-drawer-input-section">
          <TodoInput />
        </div>

        {/* Filter */}
        <div className="todo-drawer-filter-section">
          <TodoFilter />
        </div>

        {/* List */}
        <div className="todo-drawer-list-section">
          <TodoList />
        </div>

        {/* Footer */}
        {completedCount > 0 && (
          <div className="todo-drawer-footer">
            <button
              id="todo-clear-completed-btn"
              type="button"
              className="todo-clear-btn"
              onClick={clearCompleted}
            >
              Clear completed ({completedCount})
            </button>
          </div>
        )}
      </div>
    </>
  );
}
