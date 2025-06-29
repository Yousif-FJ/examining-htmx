using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using todo_app_htmx.Models;

namespace todo_app_htmx.Pages;

public class IndexModel(TodoAggregate todoAggregate) : PageModel
{
    private readonly TodoAggregate _todoAggregate = todoAggregate;

    public List<Todo> Todos => _todoAggregate.Todos;

    [BindProperty]
    public string? NewTodoText { get; set; }

    public int CompletedCount => Todos.Count(todo => todo.Completed);
    public int TotalCount => Todos.Count;

    public IActionResult OnGet()
    {
        return Page();
    }

    public IActionResult OnPostAddTodo()
    {
        if (string.IsNullOrWhiteSpace(NewTodoText))
        {
            ModelState.AddModelError(nameof(NewTodoText), "Todo text cannot be empty.");
            return Partial("/Components/_TodoList.cshtml", Todos);
        }

        Todos.Add(new Todo
        {
            Id = Todos.Count + 1,
            Text = NewTodoText,
            Completed = false
        });

        return Partial("/Components/_TodoList.cshtml", Todos);
    }

    public IActionResult OnPostToggleTodo(int id)
    {
        var todo = Todos.FirstOrDefault(todo => todo.Id == id);
        if (todo == null)
        {
            return NotFound();
        }
        todo.Completed = !todo.Completed;
        return Partial("/Components/_TodoItem.cshtml", todo);
    }

    public IActionResult OnPostDeleteTodo(int id)
    {
        Todos.RemoveAll(todo => todo.Id == id);

        return Partial("/Components/_TodoList.cshtml", Todos);
    }

    public IActionResult OnPostClearCompleted()
    {
        Todos.Clear();
        return Partial("/Components/_TodoList.cshtml", Todos);
    }
}
