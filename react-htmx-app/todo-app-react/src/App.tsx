import { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import TodoList from './components/TodoList'
import TodoForm from './components/TodoForm'
import { Todo } from './types/Todo'

function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    // Load todos from localStorage on initial render
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
  });
  
  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (text: string) => {
    const newTodo: Todo = {
      id: Date.now(),
      text,
      completed: false
    };
    setTodos([...todos, newTodo]);
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  const completedCount = todos.filter(t => t.completed).length;

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-sm">
            <div className="card-header">
              <h1 className="h4 mb-0 text-center">Todo List</h1>
            </div>
            <div className="card-body">
              <TodoForm onAddTodo={addTodo} />
              
              <TodoList 
                todos={todos} 
                onToggle={toggleTodo} 
                onDelete={deleteTodo} 
              />
              
              {todos.length > 0 && (
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <small className="text-muted">
                    {completedCount} of {todos.length} completed
                  </small>
                  {completedCount > 0 && (
                    <button 
                      className="btn btn-sm btn-outline-secondary"
                      onClick={clearCompleted}
                    >
                      Clear completed
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
