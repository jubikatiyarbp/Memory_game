using System.ComponentModel.DataAnnotations;

public class RegisterRequest
{
    [MinLength(4)]
    public required string Username { get; set; }

    [EmailAddress]
    public required string Email { get; set; }

    [MinLength(8)]
    public required string Password { get; set; }
}