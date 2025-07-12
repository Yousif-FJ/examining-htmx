using Microsoft.EntityFrameworkCore;
using ReactExperiment.Backend.API.Data;
using ReactExperiment.Backend.API.Models;
using ReactExperiment.Backend.API.DTOs;

namespace ReactExperiment.Backend.API.Endpoints;

public static class TodoEndpoints
{
    public static void MapTodoEndpoints(this WebApplication app)
    {
        var todoGroup = app.MapGroup("/api/todos").WithTags("Todos");

        todoGroup.MapGet("/", GetAllTodos).WithName("GetTodos");
        todoGroup.MapGet("{id}", GetTodoById).WithName("GetTodoById");
        todoGroup.MapPost("/", CreateTodo).WithName("CreateTodo");
        todoGroup.MapPatch("{id}/toggle", ToggleTodo).WithName("ToggleTodo");
        todoGroup.MapDelete("{id}", DeleteTodo).WithName("DeleteTodo");
        todoGroup.MapDelete("completed", ClearCompletedTodos).WithName("ClearCompletedTodos");
    }

    static async Task<IResult> GetAllTodos(TodoDbContext db)
    {
        var todos = await db.Todos.ToListAsync();
        var todoDtos = todos.Select(t => new TodoDto(t.Id, t.Text, t.Completed));
        return TypedResults.Ok(todoDtos);
    }

    static async Task<IResult> GetTodoById(int id, TodoDbContext db)
    {
        var todo = await db.Todos.FindAsync(id);
        return todo is not null 
            ? TypedResults.Ok(new TodoDto(todo.Id, todo.Text, todo.Completed)) 
            : TypedResults.NotFound();
    }

    static async Task<IResult> CreateTodo(CreateTodoDto createTodo, TodoDbContext db)
    {
        if (string.IsNullOrWhiteSpace(createTodo.Text))
        {
            return TypedResults.BadRequest("Todo text cannot be empty");
        }

        var todo = new Todo
        {
            Text = createTodo.Text.Trim(),
            Completed = false
        };

        db.Todos.Add(todo);
        await db.SaveChangesAsync();

        var todoDto = new TodoDto(todo.Id, todo.Text, todo.Completed);
        return TypedResults.Created($"/api/todos/{todo.Id}", todoDto);
    }

    static async Task<IResult> ToggleTodo(int id, TodoDbContext db)
    {
        var todo = await db.Todos.FindAsync(id);
        if (todo is null)
        {
            return TypedResults.NotFound();
        }

        todo.Completed = !todo.Completed;
        await db.SaveChangesAsync();

        return TypedResults.Ok(new TodoDto(todo.Id, todo.Text, todo.Completed));
    }

    static async Task<IResult> DeleteTodo(int id, TodoDbContext db)
    {
        var todo = await db.Todos.FindAsync(id);
        if (todo is null)
        {
            return TypedResults.NotFound();
        }

        db.Todos.Remove(todo);
        await db.SaveChangesAsync();

        return TypedResults.NoContent();
    }

    static async Task<IResult> ClearCompletedTodos(TodoDbContext db)
    {
        var completedTodos = await db.Todos.Where(t => t.Completed).ToListAsync();
        db.Todos.RemoveRange(completedTodos);
        await db.SaveChangesAsync();

        return TypedResults.Ok(new { DeletedCount = completedTodos.Count });
    }
}
