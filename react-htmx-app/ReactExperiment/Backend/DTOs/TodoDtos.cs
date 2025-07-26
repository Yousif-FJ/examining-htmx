namespace ReactExperiment.Backend.API.DTOs;

public record TodoDto(int Id, string Text, bool Completed, int Order);

public record CreateTodoDto(string Text);

public record UpdateTodoDto(string? Text, bool? Completed);

public record ReorderTodosDto(List<int> TodoIds);
