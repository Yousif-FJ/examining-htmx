using HtmxExperiment.Models;
using Microsoft.EntityFrameworkCore;

namespace HtmxExperiment.Services;

public interface ITodoService
{
    Task<List<Todo>> GetAllTodosAsync();
    Task<Todo?> GetTodoByIdAsync(int id);
    Task<Todo> AddTodoAsync(string text);
    Task<Todo?> ToggleTodoAsync(int id);
    Task<bool> DeleteTodoAsync(int id);
    Task<int> ClearCompletedAsync();
    Task<int> GetCompletedCountAsync();
    Task<int> GetTotalCountAsync();
}

public class TodoService(TodoDbContext context) : ITodoService
{
    private readonly TodoDbContext _context = context;

    public async Task<List<Todo>> GetAllTodosAsync()
    {
        return await _context.Todos.OrderBy(t => t.CreatedAt).ToListAsync();
    }

    public async Task<Todo?> GetTodoByIdAsync(int id)
    {
        return await _context.Todos.FindAsync(id);
    }

    public async Task<Todo> AddTodoAsync(string text)
    {
        var todo = new Todo
        {
            Text = text.Trim(),
            Completed = false,
            CreatedAt = DateTime.UtcNow
        };

        _context.Todos.Add(todo);
        await _context.SaveChangesAsync();
        return todo;
    }

    public async Task<Todo?> ToggleTodoAsync(int id)
    {
        var todo = await _context.Todos.FindAsync(id);
        if (todo == null)
            return null;

        todo.Completed = !todo.Completed;
        await _context.SaveChangesAsync();
        return todo;
    }

    public async Task<bool> DeleteTodoAsync(int id)
    {
        var todo = await _context.Todos.FindAsync(id);
        if (todo == null)
            return false;

        _context.Todos.Remove(todo);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<int> ClearCompletedAsync()
    {
        var completedTodos = await _context.Todos.Where(t => t.Completed).ToListAsync();
        _context.Todos.RemoveRange(completedTodos);
        await _context.SaveChangesAsync();
        return completedTodos.Count;
    }

    public async Task<int> GetCompletedCountAsync()
    {
        return await _context.Todos.CountAsync(t => t.Completed);
    }

    public async Task<int> GetTotalCountAsync()
    {
        return await _context.Todos.CountAsync();
    }
}