import { FC } from 'react';

interface TodoSearchProps {
  searchTerm: string;
  onSearchChange: (searchTerm: string) => void;
  todoCount: number;
  filteredCount: number;
}

const TodoSearch: FC<TodoSearchProps> = ({ 
  searchTerm, 
  onSearchChange, 
  todoCount, 
  filteredCount 
}) => {
  const handleClearSearch = () => {
    onSearchChange('');
  };

  return (
    <div className="mb-3">
      <div className="input-group">
        <span className="input-group-text">
          <i className="bi bi-search"></i>
        </span>
        <input
          type="text"
          className="form-control"
          placeholder="Search todos..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {searchTerm && (
          <button
            className="btn btn-outline-secondary"
            type="button"
            onClick={handleClearSearch}
            aria-label="Clear search"
          >
            <i className="bi bi-x-lg"></i>
          </button>
        )}
      </div>
      {searchTerm && (
        <small className="text-muted">
          Showing {filteredCount} of {todoCount} todos
        </small>
      )}
    </div>
  );
};

export default TodoSearch;
