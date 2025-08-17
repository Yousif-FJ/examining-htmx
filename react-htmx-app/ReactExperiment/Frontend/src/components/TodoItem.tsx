import { FC, useState } from 'react';
import { Todo } from '../types/Todo';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => Promise<void>;
  onUpdate: (id: number, text: string) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  isDragging?: boolean;
  onDragStart: (e: React.DragEvent, todo: Todo) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, targetTodo: Todo) => void;
}

const TodoItem: FC<TodoItemProps> = ({ 
  todo, 
  onToggle, 
  onUpdate,
  onDelete, 
  isDragging = false,
  onDragStart,
  onDragOver,
  onDrop
}) => {
  const [isToggling, setIsToggling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [isUpdating, setIsUpdating] = useState(false);

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

  const handleEditStart = () => {
    setIsEditing(true);
    setEditText(todo.text);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditText(todo.text);
  };

  const handleEditSave = async () => {
    if (editText.trim() === '' || editText.trim() === todo.text) {
      handleEditCancel();
      return;
    }

    try {
      setIsUpdating(true);
      await onUpdate(todo.id, editText.trim());
      setIsEditing(false);
    } catch {
      // Error handling is done in the parent component
    } finally {
      setIsUpdating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEditSave();
    } else if (e.key === 'Escape') {
      handleEditCancel();
    }
  };
  return (
    <li 
      className={`list-group-item d-flex justify-content-between align-items-center ${isDragging ? 'opacity-50' : ''}`}
      draggable={!isEditing}
      onDragStart={(e) => onDragStart(e, todo)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, todo)}
    >
      <div className="d-flex align-items-center flex-grow-1">
        <div className="drag-handle me-2" style={{ cursor: 'move' }}>
          <span style={{ fontSize: '1.2em', color: '#6c757d' }}>⋮⋮</span>
        </div>
        <div className="form-check me-3">
          <input
            className="form-check-input"
            type="checkbox"
            checked={todo.completed}
            onChange={handleToggle}
            disabled={isToggling || isDeleting || isEditing || isUpdating}
            id={`todo-${todo.id}`}
          />
        </div>
        <div className="flex-grow-1">
          {isEditing ? (
            <div className="d-flex align-items-center">
              <input
                type="text"
                className="form-control form-control-sm me-2"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleEditSave}
                autoFocus
                disabled={isUpdating}
              />
              {isUpdating && (
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              )}
            </div>
          ) : (
            <label 
              className={`form-check-label ${todo.completed ? 'text-decoration-line-through' : ''}`}
              htmlFor={`todo-${todo.id}`}
              onDoubleClick={handleEditStart}
              style={{ cursor: 'pointer' }}
            >
              {todo.text}
              {isToggling && (
                <span className="spinner-border spinner-border-sm ms-2" role="status" aria-hidden="true"></span>
              )}
            </label>
          )}
        </div>
      </div>
      <div className="d-flex align-items-center">
        {isEditing ? (
          <div className="btn-group btn-group-sm">
            <button 
              className="btn btn-sm btn-outline-success"
              onClick={handleEditSave}
              disabled={isUpdating}
              aria-label="Save changes"
            >
              <i className="bi bi-check"></i>
            </button>
            <button 
              className="btn btn-sm btn-outline-secondary"
              onClick={handleEditCancel}
              disabled={isUpdating}
              aria-label="Cancel edit"
            >
              <i className="bi bi-x"></i>
            </button>
          </div>
        ) : (
          <>
            <button 
              className="btn btn-sm btn-outline-primary me-2"
              onClick={handleEditStart}
              disabled={isToggling || isDeleting}
              aria-label="Edit task"
            >
              <i className="bi bi-pencil"></i>
            </button>
            <button 
              className="btn btn-sm btn-outline-danger"
              onClick={handleDelete}
              disabled={isToggling || isDeleting}
              aria-label="Delete task"
            >
              {isDeleting ? (
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              ) : (
                <i className="bi bi-trash"></i>
              )}
            </button>
          </>
        )}
      </div>
    </li>
  );
};

export default TodoItem;