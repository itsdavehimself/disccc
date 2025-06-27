using Microsoft.AspNetCore.Mvc;
using server.Data;
using server.Models;
using server.DTOs;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.IdentityModel.Tokens.Jwt;

namespace server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
  private readonly AppDbContext _db;
  private readonly IConfiguration _config;

  public AuthController(AppDbContext db, IConfiguration config)
  {
    _db = db;
    _config = config;
  }

  [HttpPost("register")]
  public async Task<IActionResult> Register(UserDto request)
  {
    if (await _db.Users.AnyAsync(u => u.Email == request.Email))
      return BadRequest("Email already in use");

    if (await _db.Users.AnyAsync(u => u.Username == request.Username))
      return BadRequest("Username already in use");

    CreatePasswordHash(request.Password, out byte[] hash, out byte[] salt);

    var user = new User
    {
      Email = request.Email,
      Username = request.Username,
      PasswordHash = hash,
      PasswordSalt = salt,
    };

    _db.Users.Add(user);
    await _db.SaveChangesAsync();

    return Ok(new { message = "User created" });
  }

  private void CreatePasswordHash(string password, out byte[] hash, out byte[] salt)
  {
    using var hmac = new System.Security.Cryptography.HMACSHA256();
    salt = hmac.Key;
    hash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
  }

  [HttpPost("login")]
  public async Task<IActionResult> Login(LoginDto request)
  {
    var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
    if (user == null)
      return BadRequest("User not found");

    if (!VerifyPasswordHash(request.Password, user.PasswordHash!, user.PasswordSalt!))
      return BadRequest("Wrong password");

    string token = CreateToken(user);

    return Ok(new { token });
  }

  private bool VerifyPasswordHash(string password, byte[] storedHash, byte[] storedSalt)
  {
    using var hmac = new System.Security.Cryptography.HMACSHA256(storedSalt);
    var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
    return computedHash.SequenceEqual(storedHash);
  }

  private string CreateToken(User user)
  {
    var claims = new[]
    {
      new Claim(ClaimTypes.Name, user.Username),
      new Claim(ClaimTypes.Email, user.Email),
      new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
    };

    var key = new SymmetricSecurityKey(
      Encoding.UTF8.GetBytes(_config["Jwt:Key"]!)
    );

    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

    var token = new JwtSecurityToken(claims: claims, expires: DateTime.UtcNow.AddDays(7), signingCredentials: creds);

    return new JwtSecurityTokenHandler().WriteToken(token);
  }
}