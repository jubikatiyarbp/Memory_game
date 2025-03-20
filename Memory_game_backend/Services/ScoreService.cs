using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

public class ScoreService : IScoreService
{
    private readonly AppDbContext _context;

    public ScoreService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<int> SubmitScoreAsync(int userId, ScoreRequest req)
    {
        var difficultyExists = await _context.Difficulty.AnyAsync(d => d.Id == req.DifficultyId);
        if (!difficultyExists)
            throw new Exception("Invalid difficulty level.");

        var score = new Score
        {
            UserId = userId,
            DifficultyId = req.DifficultyId,
            FinalScore = req.FinalScore,
            NoOfPairsMatched = req.NoOfPairsMatched,
            TimeTaken = req.TimeTaken,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Scores.Add(score);
        await _context.SaveChangesAsync();

        return score.Id;
    }

    public async Task<bool> UpdateScoreAsync(int userId, ScoreRequest req)
    {
        try
        {
            var score = await _context.Scores
            .FirstOrDefaultAsync(s => s.UserId == userId && s.DifficultyId == req.DifficultyId);

            if (score == null)
                return false; // No existing score found for this user & difficulty level

            // Update score details
            score.FinalScore = req.FinalScore;
            score.NoOfPairsMatched = req.NoOfPairsMatched;
            score.TimeTaken = req.TimeTaken;
            score.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error updating score: {ex.Message}");
            return false;
        }
    }

    public async Task<List<LeaderboardResponse>> GetLeaderboardAsync(string difficultyName)
    {
        try
        {
            // get difficultyId using difficultyName
            var difficulty = await _context.Difficulty
            .FirstOrDefaultAsync(d => d.Name == difficultyName) ?? throw new Exception("Difficulty not found");

            return await _context.Scores
                .Where(s => s.FinalScore != 0)
                .Where(s => s.DifficultyId == difficulty.Id)
                .OrderByDescending(s => s.FinalScore)  // Highest score first
                .ThenBy(s => s.TimeTaken)  // If scores are same, lower time first
                .Take(10)  // Top 10
                .Select(s => new LeaderboardResponse
                {
                    Username = s.User.Username,
                    FinalScore = s.FinalScore
                })
                .ToListAsync();
        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }
    }

    public async Task<List<UserAllScoresResponse>> GetUserScoreHistoryAsync(int userId)
    {
        return await _context.Scores
            .Where(s => s.UserId == userId)
            .Include(s => s.Difficulty)
            .OrderByDescending(s => s.CreatedAt)  // Most recent scores first
            .Select(s => new UserAllScoresResponse
            {
                FinalScore = s.FinalScore,
                NoOfPairsMatched = s.NoOfPairsMatched,
                TimeTaken = s.TimeTaken,
                DifficultyName = s.Difficulty.Name,
                CreatedAt = s.CreatedAt
            })
            .ToListAsync();
    }

    public async Task<ScoreResponse> GetScorebyUserIdAndDifficultyIdAsync(int userId, int difficultyId)
    {
        var score = await _context.Scores
        .Where(s => s.UserId == userId && s.DifficultyId == difficultyId)
        .Include(s => s.Difficulty)
        .Include(s => s.User)
        .Select(s => new ScoreResponse
        {
            Id = s.Id,
            Username = s.User.Username,
            FinalScore = s.FinalScore,
            NoOfPairsMatched = s.NoOfPairsMatched,
            TimeTaken = s.TimeTaken,
            DifficultyName = s.Difficulty.Name,
            CreatedAt = s.CreatedAt,
            UpdatedAt = s.UpdatedAt
        })
        .FirstOrDefaultAsync();

        return score ?? null!;
    }

}