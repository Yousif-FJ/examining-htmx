using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ReactExperiment.Backend.API.Data;
using ReactExperiment.Backend.API.Endpoints;
using ReactExperiment.Backend.API.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddOpenApi();

// Add Entity Framework with SQLite database
builder.Services.AddDbContext<TodoDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection") 
        ?? "Data Source=todos.db"));

// Add Identity services
builder.Services.AddIdentity<User, IdentityRole>(options =>
{
    // Password settings
    options.Password.RequireDigit = false;
    options.Password.RequireLowercase = false;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = false;
    options.Password.RequiredLength = 6;
    
    // User settings
    options.User.RequireUniqueEmail = true;
    
    // Sign in settings
    options.SignIn.RequireConfirmedEmail = false;
    options.SignIn.RequireConfirmedPhoneNumber = false;
})
.AddEntityFrameworkStores<TodoDbContext>()
.AddDefaultTokenProviders();

// Configure cookie authentication
builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.HttpOnly = true;
    options.ExpireTimeSpan = TimeSpan.FromDays(7);
    options.LoginPath = "/api/auth/login";
    options.LogoutPath = "/api/auth/logout";
    options.SlidingExpiration = true;
    options.Cookie.SameSite = SameSiteMode.Lax;
    options.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;
    
    // Return JSON responses for API calls
    options.Events.OnRedirectToLogin = context =>
    {
        context.Response.StatusCode = 401;
        return Task.CompletedTask;
    };
    options.Events.OnRedirectToAccessDenied = context =>
    {
        context.Response.StatusCode = 403;
        return Task.CompletedTask;
    };
});

// Add Authorization
builder.Services.AddAuthorization();

// Add CORS for frontend communication
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.SetIsOriginAllowed(origin => 
                new Uri(origin).Host == "localhost" || 
                new Uri(origin).Host == "127.0.0.1")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials(); // Important for cookie authentication
    });
});

var app = builder.Build();

// Ensure database is created on startup and apply migrations
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<TodoDbContext>();
    context.Database.EnsureCreated();
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("AllowFrontend");

// Add authentication and authorization middleware
app.UseAuthentication();
app.UseAuthorization();

// Map endpoints
app.MapAuthEndpoints();
app.MapTodoEndpoints();

app.Run();
