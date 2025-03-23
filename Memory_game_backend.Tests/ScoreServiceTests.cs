using NUnit.Framework;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

[TestFixture]
public class ScoreServiceTests
{
    private AppDbContext _dbContext;
    private ScoreService _scoreService;

    [SetUp]
    public void Setup()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        _dbContext = new AppDbContext(options);
        _scoreService = new ScoreService(_dbContext);
    }

    [TearDown]
    public void TearDown()
    {
        _dbContext.Dispose(); // Dispose the database context
    }

    [Test]
    public async Task SubmitScoreAsync_InvalidDifficulty_ThrowsException()
    {
        // Arrange
        var userId = 1;
        var scoreRequest = new ScoreRequest { DifficultyId = 999, FinalScore = 100 };

        // Act & Assert
        var ex = Assert.ThrowsAsync<Exception>(async () => await _scoreService.SubmitScoreAsync(userId, scoreRequest));
        Assert.That(ex.Message, Is.EqualTo("Invalid difficulty level."));
    }

    [Test]
    public async Task UpdateScoreAsync_ExistingScore_UpdatesSuccessfully()
    {
        // Arrange
        var userId = 1;
        var difficultyId = 1;

        // Add initial score to the database
        var existingScore = new Score
        {
            UserId = userId,
            DifficultyId = difficultyId,
            FinalScore = 50,
            NoOfPairsMatched = 10,
            TimeTaken = 60,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        _dbContext.Scores.Add(existingScore);
        await _dbContext.SaveChangesAsync();

        var updateRequest = new ScoreRequest
        {
            DifficultyId = difficultyId,
            FinalScore = 100,  // New score
            NoOfPairsMatched = 20,
            TimeTaken = 40
        };

        // Act
        var result = await _scoreService.UpdateScoreAsync(userId, updateRequest);

        // Assert
        Assert.That(result, Is.True, "UpdateScoreAsync should return true when updating an existing score.");

        // Verify the score is updated in the database
        var updatedScore = await _dbContext.Scores.FirstOrDefaultAsync(s => s.UserId == userId && s.DifficultyId == difficultyId);
        Assert.That(updatedScore, Is.Not.Null);
        Assert.That(updatedScore.FinalScore, Is.EqualTo(100), "FinalScore should be updated.");
        Assert.That(updatedScore.NoOfPairsMatched, Is.EqualTo(20), "NoOfPairsMatched should be updated.");
        Assert.That(updatedScore.TimeTaken, Is.EqualTo(40), "TimeTaken should be updated.");
    }

    [Test]
    public async Task UpdateScoreAsync_NoExistingScore_ReturnsFalse()
    {
        // Arrange
        var userId = 1;
        var difficultyId = 1;

        var updateRequest = new ScoreRequest
        {
            DifficultyId = difficultyId,
            FinalScore = 100,
            NoOfPairsMatched = 20,
            TimeTaken = 40
        };

        // Act
        var result = await _scoreService.UpdateScoreAsync(userId, updateRequest);

        // Assert
        Assert.That(result, Is.False, "UpdateScoreAsync should return false when no existing score is found.");
    }

}
