import { FC, useState } from 'react';
import { Todo } from '../types/Todo';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

const TodoItem: FC<TodoItemProps> = ({ todo, onToggle, onDelete }) => {
  const [isToggling, setIsToggling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggle = async () => {
    try {
      setIsToggling(true);
      await onToggle(todo.id);
    } catch {
      // Error handling is done in the parent component
    } finally {
      setIsToggling(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onDelete(todo.id);
    } catch {
      // Error handling is done in the parent component
    } finally {
      setIsDeleting(false);
    }
  };
  return (
    <li className="list-group-item d-flex justify-content-between align-items-center">
      <div className="form-check">
        <input
          className="form-check-input"
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggle}
          disabled={isToggling || isDeleting}
          id={`todo-${todo.id}`}
        />
        <label 
          className={`form-check-label ${todo.completed ? 'text-decoration-line-through' : ''}`}
          htmlFor={`todo-${todo.id}`}
        >
          {todo.text}
          {isToggling && (
            <span className="spinner-border spinner-border-sm ms-2" role="status" aria-hidden="true"></span>
          )}
        </label>
      </div>
      <button 
        className="btn btn-sm btn-outline-danger"
        onClick={handleDelete}
        disabled={isToggling || isDeleting}
        aria-label="Delete task"
      >
        {isDeleting ? (
          <>
            <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
            Deleting...
          </>
        ) : (
          <>
            <i className="bi bi-trash"></i> Delete
          </>
        )}
      </button>
    </li>
  );
};

export default TodoItem;