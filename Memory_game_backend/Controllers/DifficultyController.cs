using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
[EnableCors("AllowAllOrigins")]
public class DifficultyController : ControllerBase
{
    private readonly AppDbContext _context;

    public DifficultyController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("find")]
    public async Task<IActionResult> GetDifficultyIdUsingName([FromQuery] string name)
    {


        var difficulty = await _context.Difficulty.FirstOrDefaultAsync(d => d.Name == name);

        if (difficulty == null)
        {
            return NotFound(new { message = "Difficulty not found" });
        }

        return Ok(difficulty);
    }
}