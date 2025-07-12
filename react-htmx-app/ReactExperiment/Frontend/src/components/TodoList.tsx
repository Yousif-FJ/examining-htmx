import { FC } from 'react';
import TodoItem from './TodoItem';
import { Todo } from '../types/Todo';

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: number) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

const TodoList: FC<TodoListProps> = ({ todos, onToggle, onDelete }) => {
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
          onDelete={onDelete} 
        />
      ))}
    </ul>
  );
};

export default TodoList;