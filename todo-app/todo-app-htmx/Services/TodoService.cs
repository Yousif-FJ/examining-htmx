using todo_app_htmx.Models;

namespace todo_app_htmx.Services;

public interface ITodoService
{
    List<Todo> GetAll();
    Todo Add(string text);
    Todo Toggle(int id);
    bool Delete(int id);
    void ClearCompleted();
    int CompletedCount();
    int TotalCount();
}

public class TodoService : ITodoService
{
    private List<Todo> _todos = new();
    private int _nextId = 1;

    public List<Todo> GetAll() => _todos;

    public Todo Add(string text)
    {
        var todo = new Todo
        {
            Id = _nextId++,
            Text = text,
            Completed = false
        };
        _todos.Add(todo);
        return todo;
    }

    public Todo Toggle(int id)
    {
        var todo = _todos.FirstOrDefault(t => t.Id == id);
        if (todo != null)
        {
            todo.Completed = !todo.Completed;
        }
        return todo;
    }

    public bool Delete(int id)
    {
        var todo = _todos.FirstOrDefault(t => t.Id == id);
        if (todo != null)
        {
            return _todos.Remove(todo);
        }
        return false;
    }

    public void ClearCompleted()
    {
        _todos.RemoveAll(t => t.Completed);
    }

    public int CompletedCount() => _todos.Count(t => t.Completed);
    
    public int TotalCount() => _todos.Count;
}
