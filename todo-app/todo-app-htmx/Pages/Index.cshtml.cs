using Microsoft.AspNetCore.Mvc;
using todo_app_htmx.Components;
using todo_app_htmx.Framework;
using todo_app_htmx.Models;

namespace todo_app_htmx.Pages;

public class IndexModel(TodoAggregate todoAggregate) : PageModelExtension
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
            return ViewComponent<TodoList, List<Todo>>(Todos);
        }

        Todos.Add(new Todo
        {
            Id = Todos.Count + 1,
            Text = NewTodoText,
            Completed = false
        });

        return ViewComponent<TodoList, List<Todo>>(Todos);
    }

    public IActionResult OnPostToggleTodo(int id)
    {
        var todo = Todos.FirstOrDefault(todo => todo.Id == id);
        if (todo == null)
        {
            return NotFound();
        }
        todo.Completed = !todo.Completed;
        return ViewComponent<TodoList, List<Todo>>(Todos);
    }

    public IActionResult OnPostDeleteTodo(int id)
    {
        Todos.RemoveAll(todo => todo.Id == id);

        return ViewComponent<TodoList, List<Todo>>(Todos);
    }

    public IActionResult OnPostClearCompleted()
    {
        Todos.RemoveAll(todo => todo.Completed);

        return ViewComponent<TodoList, List<Todo>>(Todos);
    }
}
