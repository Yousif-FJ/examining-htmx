import { FC, useState, ChangeEvent, FormEvent } from 'react';

interface TodoFormProps {
  onAddTodo: (text: string) => Promise<void>;
  isSubmitting?: boolean;
}

const TodoForm: FC<TodoFormProps> = ({ onAddTodo, isSubmitting = false }) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() !== '' && !isSubmitting) {
      try {
        await onAddTodo(inputValue);
        setInputValue('');
      } catch (err) {
        // Error handling is done in the parent component
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="input-group mb-3">
        <input 
          type="text" 
          className="form-control"
          placeholder="Add a new task"
          value={inputValue}
          onChange={handleInputChange}
          disabled={isSubmitting}
          aria-label="New task"
          aria-describedby="button-add"
        />
        <button 
          className="btn btn-primary"
          type="submit"
          disabled={isSubmitting || inputValue.trim() === ''}
          id="button-add"
        >
          {isSubmitting ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Adding...
            </>
          ) : (
            'Add'
          )}
        </button>
      </div>
    </form>
  );
};

export default TodoForm;