namespace ReactExperiment.Backend.API.Models;

public class Todo
{
    public int Id { get; set; }
    public string Text { get; set; } = string.Empty;
    public bool Completed { get; set; }
    public int Order { get; set; }
    public string? UserId { get; set; }
    public User? User { get; set; }
}
