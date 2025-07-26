import { FC, useState, ChangeEvent, FormEvent, useRef } from 'react';

interface TodoFormProps {
  onAddTodo: (text: string) => Promise<void>;
  isSubmitting?: boolean;
}

const TodoForm: FC<TodoFormProps> = ({ onAddTodo, isSubmitting = false }) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() !== '' && !isSubmitting) {
      try {
        await onAddTodo(inputValue);
        setInputValue('');
        // Restore focus to the input after adding the todo
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      } catch {
        // Error handling is done in the parent component
        // Restore focus even if there's an error
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="input-group mb-3">
        <input 
          ref={inputRef}
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