using System.ComponentModel.DataAnnotations;

namespace HtmxExperiment.Models;

public class Event
{
    public int Id { get; set; }
    
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;
    
    [MaxLength(1000)]
    public string Description { get; set; } = string.Empty;
    
    [Required]
    public DateTime DateTime { get; set; }
    
    [Required]
    [MaxLength(300)]
    public string Location { get; set; } = string.Empty;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}