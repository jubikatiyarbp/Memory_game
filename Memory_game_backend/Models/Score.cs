using System.ComponentModel.DataAnnotations;

public class Score
{
    [Key]
    public int Id { get; set; }


    public required int FinalScore { get; set; }

    public int NoOfPairsMatched { get; set; }

    public double TimeTaken { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;


    //foreign key for user
    public required int UserId { get; set; }
    public User User { get; set; }

    // foreign key for difficulty
    public required int DifficultyId { get; set; }
    public Difficulty Difficulty { get; set; }
}
