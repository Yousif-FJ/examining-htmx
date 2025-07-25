using HtmxExperiment.Components;
using HtmxExperiment.Components.CombinedComponents;
using HtmxExperiment.Framework;
using HtmxExperiment.Models;
using HtmxExperiment.Services;
using Microsoft.AspNetCore.Mvc;

namespace HtmxExperiment.Pages;

public class IndexModel(ITodoService todoService) : PageModelExtension
{
    private readonly ITodoService _todoService = todoService;

    public List<Todo> Todos { get; set; } = [];

    [BindProperty]
    public string? NewTodoText { get; set; }

    public int CompletedCount { get; set; }
    public int TotalCount { get; set; }

    public async Task<IActionResult> OnGetAsync()
    {
        await LoadTodosAsync();
        return Page();
    }

    public async Task<IActionResult> OnPostAddTodoAsync()
    {
        if (string.IsNullOrWhiteSpace(NewTodoText))
        {
            ModelState.AddModelError(nameof(NewTodoText), "Todo text cannot be empty.");
            await LoadTodosAsync();
            return ViewComponent<TodoList, List<Todo>>(Todos);
        }

        await _todoService.AddTodoAsync(NewTodoText);
        await LoadTodosAsync();
        return Partial(PartialViewsPaths.TodoListNStatsPartialViewPath, Todos);
    }

    public async Task<IActionResult> OnPostToggleTodoAsync(int id)
    {
        var todo = await _todoService.ToggleTodoAsync(id);
        if (todo == null)
        {
            return NotFound();
        }

        await LoadTodosAsync();
        return Partial(PartialViewsPaths.TodoListNStatsPartialViewPath, Todos);
    }

    public async Task<IActionResult> OnPostDeleteTodoAsync(int id)
    {
        await _todoService.DeleteTodoAsync(id);
        await LoadTodosAsync();
        return Partial(PartialViewsPaths.TodoListNStatsPartialViewPath, Todos);
    }

    public async Task<IActionResult> OnPostClearCompletedAsync()
    {
        await _todoService.ClearCompletedAsync();
        await LoadTodosAsync();
        return Partial(PartialViewsPaths.TodoListNStatsPartialViewPath, Todos);
    }

    private async Task LoadTodosAsync()
    {
        Todos = await _todoService.GetAllTodosAsync();
        CompletedCount = await _todoService.GetCompletedCountAsync();
        TotalCount = await _todoService.GetTotalCountAsync();
    }
}
