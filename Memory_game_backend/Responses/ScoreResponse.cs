public class ScoreResponse
{
    public int Id { get; set; }

    public string Username { get; set; }
    public int FinalScore { get; set; }
    public int NoOfPairsMatched { get; set; }
    public double TimeTaken { get; set; }
    public string DifficultyName { get; set; }
    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

}
