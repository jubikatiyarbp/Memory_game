using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
[EnableCors("AllowAllOrigins")]
public class ScoreController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IScoreService _scoreService;

    public ScoreController(AppDbContext context, IScoreService scoreService)
    {
        _context = context;
        _scoreService = scoreService;
    }

    // Endpoint to submit the score after a game
    [HttpPost("submit")]
    [Authorize]
    public async Task<IActionResult> SubmitScore([FromBody] ScoreRequest req)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim))
        {
            return Unauthorized(new { message = "User ID is missing" });
        }
        var userId = int.Parse(userIdClaim);

        try
        {
            int scoreId = await _scoreService.SubmitScoreAsync(userId, req);
            return Ok(new { Message = "Score submitted successfully!", ScoreId = scoreId });
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut("update")]
    public async Task<IActionResult> UpdateScore([FromBody] ScoreRequest req)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim))
        {
            return Unauthorized(new { message = "User ID is missing"});
        }
        var userId = int.Parse(userIdClaim);

        bool updated = await _scoreService.UpdateScoreAsync(userId, req);

        if (!updated)
            return NotFound(new {message = "No existing score found to update."});

        return Ok(new { Message = "Score updated successfully!" });
    }

    
    [HttpGet("leaderboard/{difficultyName}")]
    public async Task<IActionResult> GetLeaderboard(string difficultyName)
    {
        try
        {
            var leaderboard = await _scoreService.GetLeaderboardAsync(difficultyName);

            if (leaderboard == null || !leaderboard.Any())
                return NotFound(new {message = "No scores found for this difficulty level."});

            return Ok(leaderboard);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [Authorize]
    [HttpGet("history")]
    public async Task<IActionResult> GetUserScoreHistory()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim))
        {
            return Unauthorized(new {message = "User ID is missing"});
        }
        var userId = int.Parse(userIdClaim);

        var history = await _scoreService.GetUserScoreHistoryAsync(userId);

        if (history == null || !history.Any())
            return NotFound("No score history found for this user.");

        return Ok(history);
    }

    [Authorize]
    [HttpGet("find")]
    public async Task<IActionResult> FindScoreByUserIdAndDifficultyId([FromQuery] int difficultyId)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim))
        {
            return Unauthorized(new {message = "User ID is missing"});
        }
        var userId = int.Parse(userIdClaim);

        var score = await _scoreService.GetScorebyUserIdAndDifficultyIdAsync(userId, difficultyId);

        if (score == null)
        {
            return NotFound(new { message = "No score found" });
        }
        
        return Ok(score);

    } 
}
