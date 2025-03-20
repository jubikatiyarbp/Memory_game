using System.Security.Claims;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Route("api/[Controller]")]
[ApiController]
[EnableCors("AllowAllOrigins")]

public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;

    private readonly JwtService _jwtService;

    public AuthController(AppDbContext context, JwtService jwtService)
    {
        _context = context;
        _jwtService = jwtService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest req)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (await _context.Users.AnyAsync(u => u.Username == req.Username))
        {
            return BadRequest(new { message = "Username already exists" });
        }

        var user = new User
        {
            Username = req.Username,
            Email = req.Email,
            Password = BCrypt.Net.BCrypt.HashPassword(req.Password),
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok(new { message = "User registered successfully" });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest req)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == req.Username);
        if (user == null || !BCrypt.Net.BCrypt.Verify(req.Password, user.Password))
        {
            return Unauthorized(new { message = "Invalid username or password" });
        }

        // Generate access token
        var accessToken = _jwtService.GenerateToken(user.Id, user.Username, out string tokenId);

        // Generate refresh token
        var refreshToken = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));

        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(7);     // expiry in 7 days
        user.TokenId = tokenId;
        await _context.SaveChangesAsync();

        return Ok(new { message = "Login successful", accessToken=accessToken.Result, refreshToken, tokenId });
    }

    [Authorize]
    [EnableCors("AllowAllOrigins")]
    [HttpGet("getUserInfo")]
    public async Task<IActionResult> GetUserInfo()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null)
        {
            return Unauthorized();
        }

        var userId = int.Parse(userIdClaim.Value);
        var user = await _context.Users.FindAsync(userId);
        if (user == null)
        {
            return NotFound(new { message = "User not found" });
        }

        return Ok(new
        {
            user.Id,
            user.Username,
            user.Email,
            user.CreatedAt,
            user.UpdatedAt
        });
    }

    [HttpPost("refreshToken")]
    public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequest req)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.RefreshToken == req.RefreshToken);

        if (user == null || user.RefreshTokenExpiry < DateTime.UtcNow)
        {
            return Unauthorized(new { message = "Invalid or expired refresh token" });
        }

        // Generate a new access token
        var newAccessToken = _jwtService.GenerateToken(user.Id, user.Username, out string tokenId);

        // Generate a new refresh token as well
        var newRefreshToken = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));

        user.RefreshToken = newRefreshToken;
        user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(7);
        user.TokenId = tokenId;
        await _context.SaveChangesAsync();

        return Ok(new { accessToken = newAccessToken, refreshToken = newRefreshToken });
    }

    [Authorize]
    [EnableCors("AllowAllOrigins")]
    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
        {
            return Unauthorized(new { message = "User not authenticated" });
        }

        var user = await _context.Users.FindAsync(int.Parse(userId));
        if (user == null)
        {
            return NotFound(new { message = "User not found" });
        }

        user.RefreshToken = null;
        user.RefreshTokenExpiry = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return Ok(new { message = "Logout successful" });
    }
}