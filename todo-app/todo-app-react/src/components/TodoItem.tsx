import { FC } from 'react';
import { Todo } from '../types/Todo';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

const TodoItem: FC<TodoItemProps> = ({ todo, onToggle, onDelete }) => {
  return (
    <li className="list-group-item d-flex justify-content-between align-items-center">
      <div className="form-check">
        <input
          className="form-check-input"
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          id={`todo-${todo.id}`}
        />
        <label 
          className={`form-check-label ${todo.completed ? 'text-decoration-line-through' : ''}`}
          htmlFor={`todo-${todo.id}`}
        >
          {todo.text}
        </label>
      </div>
      <button 
        className="btn btn-sm btn-outline-danger"
        onClick={() => onDelete(todo.id)}
        aria-label="Delete task"
      >
        <i className="bi bi-trash"></i> Delete
      </button>
    </li>
  );
};

export default TodoItem;