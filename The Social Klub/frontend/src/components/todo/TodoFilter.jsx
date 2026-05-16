import React, { useContext } from 'react';
import { TodoContext } from '../../context/TodoContext';

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Completed' },
];

export default function TodoFilter() {
  const { filter, setFilter } = useContext(TodoContext);

  return (
    <div className="todo-filter-row">
      {FILTERS.map((f) => (
        <button
          key={f.key}
          id={`todo-filter-${f.key}`}
          className={`todo-filter-btn ${filter === f.key ? 'todo-filter-btn--active' : ''}`}
          onClick={() => setFilter(f.key)}
          type="button"
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
