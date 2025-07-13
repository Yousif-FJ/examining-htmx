using HtmxExperiment.Components;
using HtmxExperiment.Components.CombinedComponents;
using HtmxExperiment.Framework;
using HtmxExperiment.Models;
using Microsoft.AspNetCore.Mvc;

namespace HtmxExperiment.Pages;


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
        return Partial(PartialViewsPaths.TodoListNStatsPartialViewPath, Todos);
    }

    public IActionResult OnPostToggleTodo(int id)
    {
        var todo = Todos.FirstOrDefault(todo => todo.Id == id);
        if (todo == null)
        {
            return NotFound();
        }
        todo.Completed = !todo.Completed;

        return Partial(PartialViewsPaths.TodoListNStatsPartialViewPath, Todos);
    }

    public IActionResult OnPostDeleteTodo(int id)
    {
        Todos.RemoveAll(todo => todo.Id == id);

        return Partial(PartialViewsPaths.TodoListNStatsPartialViewPath, Todos);
    }

    public IActionResult OnPostClearCompleted()
    {
        Todos.RemoveAll(todo => todo.Completed);

        return Partial(PartialViewsPaths.TodoListNStatsPartialViewPath, Todos);
    }
}
