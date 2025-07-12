import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import TodoList from './components/TodoList'
import TodoForm from './components/TodoForm'
import { useTodos } from './hooks/useTodos'

function App() {
  const {
    todos,
    loading,
    error,
    addTodo,
    toggleTodo,
    deleteTodo,
    clearCompleted,
    refetch
  } = useTodos();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddTodo = async (text: string) => {
    try {
      setIsSubmitting(true);
      await addTodo(text);
    } catch (err) {
      // Error is already handled in the hook
    } finally {
      setIsSubmitting(false);
    }
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
              {error && (
                <div className="alert alert-danger d-flex justify-content-between align-items-center">
                  <span>{error}</span>
                  <button 
                    className="btn btn-sm btn-outline-secondary"
                    onClick={refetch}
                  >
                    Retry
                  </button>
                </div>
              )}
              
              <TodoForm 
                onAddTodo={handleAddTodo} 
                isSubmitting={isSubmitting}
              />
              
              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <TodoList 
                  todos={todos} 
                  onToggle={toggleTodo} 
                  onDelete={deleteTodo} 
                />
              )}
              
              {!loading && todos.length > 0 && (
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
