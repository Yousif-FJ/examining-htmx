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
    public string SearchTerm { get; set; } = string.Empty;

    public int CompletedCount { get; set; }
    public int TotalCount { get; set; }

    public async Task<IActionResult> OnGetAsync(string? searchTerm = null)
    {
        SearchTerm = searchTerm ?? string.Empty;
        await LoadTodosAsync(searchTerm);
        return Page();
    }

    public async Task<IActionResult> OnGetSearchAsync(string? searchTerm)
    {
        SearchTerm = searchTerm ?? string.Empty;
        await LoadTodosAsync(searchTerm);
        return ViewComponent<TodoList, List<Todo>>(Todos);
    }

    public async Task<IActionResult> OnPostAddTodoAsync(string newTodoText)
    {
        if (string.IsNullOrWhiteSpace(newTodoText))
        {
            ModelState.AddModelError(nameof(newTodoText), "Todo text cannot be empty.");
            await LoadTodosAsync();
            return ViewComponent<TodoList, List<Todo>>(Todos);
        }

        await _todoService.AddTodoAsync(newTodoText);
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

    public async Task<IActionResult> OnPostUpdateTodoOrderAsync(int[] todoIds)
    {
        if (todoIds != null && todoIds.Length > 0)
        {
            await _todoService.UpdateTodoOrderAsync(todoIds);
        }
        
        await LoadTodosAsync();
        return Partial(PartialViewsPaths.TodoListNStatsPartialViewPath, Todos);
    }

    private async Task LoadTodosAsync(string? searchTerm = null)
    {
        if (string.IsNullOrWhiteSpace(searchTerm))
        {
            Todos = await _todoService.GetAllTodosAsync();
        }
        else
        {
            Todos = await _todoService.SearchTodosAsync(searchTerm);
        }
        
        CompletedCount = await _todoService.GetCompletedCountAsync();
        TotalCount = await _todoService.GetTotalCountAsync();
    }
}
