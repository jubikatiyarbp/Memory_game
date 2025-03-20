using Microsoft.EntityFrameworkCore;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options){}
    public DbSet<User> Users { get; set; }
    public DbSet<Score> Scores { get; set; }
    public DbSet<Difficulty> Difficulty { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // define relationships
        modelBuilder.Entity<Score>()
            .HasOne(s => s.User)
            .WithMany(u => u.Scores)
            .HasForeignKey(s => s.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Score>()
            .HasOne(s => s.Difficulty)
            .WithMany(d => d.Scores)
            .HasForeignKey(s => s.DifficultyId)
            .OnDelete(DeleteBehavior.Cascade);

        // seeding difficulty levels 
        modelBuilder.Entity<Difficulty>().HasData(
            new Difficulty
            {
                Id = 1,
                Name = "Easy",
                TimeLimit = 1,
                CreatedAt = new DateTime(2025, 3, 18),
                UpdatedAt = new DateTime(2025, 3, 18)
            },
            new Difficulty
            {
                Id = 2,
                Name = "Medium",
                TimeLimit = 0.5,
                CreatedAt = new DateTime(2025, 3, 18),
                UpdatedAt = new DateTime(2025, 3, 18)
            },
            new Difficulty
            {
                Id = 3,
                Name = "Hard",
                TimeLimit = 0.3,
                CreatedAt = new DateTime(2025, 3, 18),
                UpdatedAt = new DateTime(2025, 3, 18)
            }
        );
    }

}


