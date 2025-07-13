namespace HtmxExperiment.Models;

public class Todo
{
    public int Id { get; set; }
    public string Text { get; set; } = string.Empty;
    public bool Completed { get; set; }
}


public class TodoAggregate
{
    public List<Todo> Todos { get; set; } = [
        new Todo{
        Id = 1,
        Text = "Sample Todo",
        Completed = false
    },
        new Todo{
        Id = 2,
        Text = "Another Todo",
        Completed = true
    }
    ];
}