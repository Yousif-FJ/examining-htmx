using HtmxExperiment.Models;
using Microsoft.EntityFrameworkCore;

namespace HtmxExperiment.Services;

public interface ITodoService
{
    Task<List<Todo>> GetAllTodosAsync();
    Task<List<Todo>> SearchTodosAsync(string? searchTerm);
    Task<Todo?> GetTodoByIdAsync(int id);
    Task<Todo> AddTodoAsync(string text);
    Task<Todo?> ToggleTodoAsync(int id);
    Task<Todo?> EditTodoAsync(int id, string newText);
    Task<bool> DeleteTodoAsync(int id);
    Task<int> ClearCompletedAsync();
    Task<int> GetCompletedCountAsync();
    Task<int> GetTotalCountAsync();
    Task UpdateTodoOrderAsync(int[] todoIds);
}

public class TodoService(ApplicationDbContext context) : ITodoService
{
    private readonly ApplicationDbContext _context = context;

    public async Task<List<Todo>> GetAllTodosAsync()
    {
        return await _context.Todos.OrderBy(t => t.Order).ToListAsync();
    }

    public async Task<List<Todo>> SearchTodosAsync(string? searchTerm)
    {
        var query = _context.Todos.AsQueryable();
        
        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            query = query.Where(t => EF.Functions.Like(t.Text.ToLower(), $"%{searchTerm.ToLower()}%"));
        }
        
        return await query.OrderBy(t => t.Order).ToListAsync();
    }

    public async Task<Todo?> GetTodoByIdAsync(int id)
    {
        return await _context.Todos.FindAsync(id);
    }

    public async Task<Todo> AddTodoAsync(string text)
    {
        var maxOrder = await _context.Todos.MaxAsync(t => (int?)t.Order) ?? 0;
        
        var todo = new Todo
        {
            Text = text.Trim(),
            Completed = false,
            CreatedAt = DateTime.UtcNow,
            Order = maxOrder + 1
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

    public async Task<Todo?> EditTodoAsync(int id, string newText)
    {
        var todo = await _context.Todos.FindAsync(id);
        if (todo == null)
            return null;

        todo.Text = newText.Trim();
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

    public async Task UpdateTodoOrderAsync(int[] todoIds)
    {
        for (int i = 0; i < todoIds.Length; i++)
        {
            var todo = await _context.Todos.FindAsync(todoIds[i]);
            if (todo != null)
            {
                todo.Order = i + 1;
            }
        }
        await _context.SaveChangesAsync();
    }
}