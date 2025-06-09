using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using todo_app_htmx.Models;

namespace todo_app_htmx.Pages;

public class IndexModel(TodoAggregate todoAggregate, ILogger<IndexModel> logger) : PageModel
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
            return Partial("_TodoList", Todos);
        }

        Todos.Add(new Todo
        {
            Id = Todos.Count + 1,
            Text = NewTodoText,
            Completed = false
        });

        return Partial("_TodoList", Todos);
    }

    public IActionResult OnPostToggleTodo(int id)
    {
        var todo = Todos.FirstOrDefault(todo => todo.Id == id);
        if (todo == null)
        {
            return NotFound();
        }
        todo.Completed = !todo.Completed;
        return Partial("_TodoItem", todo);
    }

    public IActionResult OnPostDeleteTodo(int id)
    {
        Todos.RemoveAll(todo => todo.Id == id);

        return Partial("_TodoList", Todos);
    }

    public IActionResult OnPostClearCompleted()
    {
        Todos.Clear();
        return Partial("_TodoList", Todos);
    }
}
