namespace ReactExperiment.Backend.API.DTOs;

public record TodoDto(int Id, string Text, bool Completed);

public record CreateTodoDto(string Text);

public record UpdateTodoDto(string? Text, bool? Completed);
