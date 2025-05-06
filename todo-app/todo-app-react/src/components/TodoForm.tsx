import { FC, useState, ChangeEvent, FormEvent } from 'react';

interface TodoFormProps {
  onAddTodo: (text: string) => void;
}

const TodoForm: FC<TodoFormProps> = ({ onAddTodo }) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() !== '') {
      onAddTodo(inputValue);
      setInputValue('');
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
          aria-label="New task"
          aria-describedby="button-add"
        />
        <button 
          className="btn btn-primary"
          type="submit"
          id="button-add"
        >
          Add
        </button>
      </div>
    </form>
  );
};

export default TodoForm;