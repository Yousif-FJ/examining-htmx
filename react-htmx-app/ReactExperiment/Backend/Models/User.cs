using Microsoft.AspNetCore.Identity;

namespace ReactExperiment.Backend.API.Models;

public class User : IdentityUser
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
