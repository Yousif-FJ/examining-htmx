using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using todo_app_htmx.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorPages(options =>
{

    options.Conventions.ConfigureFilter(new IgnoreAntiforgeryTokenAttribute());
});

builder.Services.AddSingleton(new TodoAggregate());

var app = builder.Build();


app.UseDeveloperExceptionPage();

app.UseRouting();

app.UseAuthorization();

app.MapStaticAssets();
app.MapRazorPages()
   .WithStaticAssets();

app.Run();
