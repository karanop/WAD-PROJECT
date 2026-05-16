import React, { useContext } from 'react';
import { TodoContext } from '../../context/TodoContext';
import TodoItem from './TodoItem';

export default function TodoList() {
  const { filteredTasks, filter } = useContext(TodoContext);

  if (filteredTasks.length === 0) {
    const emptyMessages = {
      all: 'No tasks yet. Add one above!',
      active: 'No active tasks — well done!',
      completed: 'No completed tasks yet.',
    };

    return (
      <div className="todo-empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.3 }}>
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
        </svg>
        <p>{emptyMessages[filter]}</p>
      </div>
    );
  }

  return (
    <div className="todo-list">
      {filteredTasks.map((task) => (
        <TodoItem key={task.id} task={task} />
      ))}
    </div>
  );
}
