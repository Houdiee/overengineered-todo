using Microsoft.EntityFrameworkCore;
using Entities;

public class TodoDbContext : DbContext
{
    public DbSet<User> Users { get; set; } = null!;
    public DbSet<Entry> Entries { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>().HasKey(u => u.Id);

        modelBuilder.Entity<Entry>().HasKey(e => e.Id);

        modelBuilder.Entity<Entry>()
          .HasOne(e => e.User)
          .WithMany(u => u.Entries)
          .HasForeignKey(e => e.UserId);
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        string currentDir = Directory.GetCurrentDirectory();
        string destination = "Database/TodoApp.db";
        string path = Path.Join(currentDir, destination);

        optionsBuilder.UseSqlite($"Data Source={path}");
    }
}
