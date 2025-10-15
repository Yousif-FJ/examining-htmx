import { useState, useMemo } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import TodoList from './components/TodoList'
import TodoForm from './components/TodoForm'
import TodoSearch from './components/TodoSearch'
import AuthPage from './components/AuthPage'
import Navbar from './components/Navbar'
import { useTodos } from './hooks/useTodos'
import { useAuth } from './hooks/useAuthUser'
import { AuthProvider } from './contexts/AuthProvider'

function TodoApp() {
  const { user, loading: authLoading } = useAuth();
  const {
    todos,
    loading,
    error,
    addTodo,
    updateTodo,
    toggleTodo,
    deleteTodo,
    clearCompleted,
    reorderTodos,
    refetch
  } = useTodos();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter todos based on search term
  const filteredTodos = useMemo(() => {
    if (!searchTerm.trim()) {
      return todos;
    }
    
    return todos.filter(todo => 
      todo.text.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [todos, searchTerm]);

  const handleAddTodo = async (text: string) => {
    try {
      setIsSubmitting(true);
      await addTodo(text);
    } catch  {
      // Error is already handled in the hook
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSearchChange = (newSearchTerm: string) => {
    setSearchTerm(newSearchTerm);
  };

  // Show loading spinner while checking authentication
  if (authLoading) {
    return (
      <>
        <div className="container py-4">
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6">
              <div className="text-center py-4">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Show auth page if user is not logged in
  if (!user) {
    return (
      <>
        <Navbar />
        <AuthPage />
      </>
    );
  }

  const completedCount = filteredTodos.filter(t => t.completed).length;

  return (
    <>
      <Navbar />
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

                <TodoSearch
                  searchTerm={searchTerm}
                  onSearchChange={handleSearchChange}
                  todoCount={todos.length}
                  filteredCount={filteredTodos.length}
                />
                
                {loading ? (
                  <div className="text-center py-4">
                    <div className="spinner-border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Show search results empty state */}
                    {searchTerm && filteredTodos.length === 0 && todos.length > 0 ? (
                      <div className="alert alert-info text-center my-3">
                        No todos found matching "{searchTerm}". 
                        <button 
                          className="btn btn-link p-0 ms-1"
                          onClick={() => setSearchTerm('')}
                        >
                          Clear search
                        </button>
                      </div>
                    ) : (
                      /* Show todos list */
                      <TodoList 
                        todos={filteredTodos} 
                        onToggle={toggleTodo} 
                        onUpdate={updateTodo}
                        onDelete={deleteTodo} 
                        onReorder={reorderTodos}
                      />
                    )}
                  </>
                )}
                
                {!loading && filteredTodos.length > 0 && (
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <small className="text-muted">
                      {completedCount} of {filteredTodos.length} completed
                      {searchTerm && ` (filtered from ${todos.length} total)`}
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
    </>
  )
}

function App() {
  return (
    <AuthProvider>
      <TodoApp />
    </AuthProvider>
  );
}

export default App
