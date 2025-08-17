import { FC, useState } from 'react';
import TodoItem from './TodoItem';
import { Todo } from '../types/Todo';

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: number) => Promise<void>;
  onUpdate: (id: number, text: string) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onReorder: (reorderedTodos: Todo[]) => Promise<void>;
}

const TodoList: FC<TodoListProps> = ({ todos, onToggle, onUpdate, onDelete, onReorder }) => {
  const [draggedTodo, setDraggedTodo] = useState<Todo | null>(null);

  const handleDragStart = (e: React.DragEvent, todo: Todo) => {
    setDraggedTodo(todo);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetTodo: Todo) => {
    e.preventDefault();
    
    if (!draggedTodo || draggedTodo.id === targetTodo.id) {
      setDraggedTodo(null);
      return;
    }

    const draggedIndex = todos.findIndex(t => t.id === draggedTodo.id);
    const targetIndex = todos.findIndex(t => t.id === targetTodo.id);

    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedTodo(null);
      return;
    }

    // Create new array with reordered items
    const newTodos = [...todos];
    const [removed] = newTodos.splice(draggedIndex, 1);
    newTodos.splice(targetIndex, 0, removed);

    // Update order values
    const reorderedTodos = newTodos.map((todo, index) => ({
      ...todo,
      order: index
    }));

    onReorder(reorderedTodos);
    setDraggedTodo(null);
  };

  if (todos.length === 0) {
    return (
      <div className="alert alert-info text-center my-3">
        No tasks yet. Add a new task to get started!
      </div>
    );
  }

  return (
    <ul className="list-group">
      {todos.map(todo => (
        <TodoItem 
          key={todo.id} 
          todo={todo} 
          onToggle={onToggle} 
          onUpdate={onUpdate}
          onDelete={onDelete}
          isDragging={draggedTodo?.id === todo.id}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        />
      ))}
    </ul>
  );
};

export default TodoList;