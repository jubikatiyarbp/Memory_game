public class Difficulty
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required double TimeLimit { get; set; }

    // Navigation property: One Difficulty can have multiple Scores
    public List<Score> Scores { get; set; } = new();

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

}
