using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace HtmxExperiment.Models;

public class Todo
{
    public int Id { get; set; }
    
    [Required]
    [MaxLength(500)]
    public string Text { get; set; } = string.Empty;
    
    public bool Completed { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
