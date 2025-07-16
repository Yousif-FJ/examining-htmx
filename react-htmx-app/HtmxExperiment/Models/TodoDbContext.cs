using Microsoft.EntityFrameworkCore;

namespace HtmxExperiment.Models;

public class TodoDbContext(DbContextOptions<TodoDbContext> options) : DbContext(options)
{
    public DbSet<Todo> Todos { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Todo>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Text).IsRequired().HasMaxLength(500);
            entity.Property(e => e.Completed).HasDefaultValue(false);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("datetime('now')");
        });
    }
}
