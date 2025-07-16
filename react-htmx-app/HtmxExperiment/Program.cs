using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using HtmxExperiment.Models;
using HtmxExperiment.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorPages(options =>
{
    options.Conventions.ConfigureFilter(new IgnoreAntiforgeryTokenAttribute());
});

// Configure Entity Framework with SQLite
builder.Services.AddDbContext<TodoDbContext>(options =>
    options.UseSqlite("Data Source=todos.db"));

// Register the TodoService
builder.Services.AddScoped<ITodoService, TodoService>();


var app = builder.Build();

// Ensure database is created (without migrations)
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<TodoDbContext>();
    context.Database.EnsureCreated();
    
    // Seed with initial data if database is empty
    if (!context.Todos.Any())
    {
        context.Todos.AddRange(
            new Todo { Text = "Sample Todo", Completed = false },
            new Todo { Text = "Another Todo", Completed = true }
        );
        context.SaveChanges();
    }
}

app.UseDeveloperExceptionPage();

app.UseRouting();

app.UseAuthorization();

app.MapStaticAssets();
app.MapRazorPages()
   .WithStaticAssets();

app.Run();
