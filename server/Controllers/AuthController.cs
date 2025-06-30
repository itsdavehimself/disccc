using Microsoft.AspNetCore.Mvc;
using server.Data;
using server.Models;
using server.DTOs;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using System.Threading.Tasks;

namespace server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<User> _userManager;
    private readonly IConfiguration _config;

    public AuthController(UserManager<User> userManager, IConfiguration config)
    {
        _userManager = userManager;
        _config = config;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(UserDto request)
    {
        if (await _userManager.FindByEmailAsync(request.Email) is not null)
            return BadRequest(new {message = "Email already in use"});

        string tempUsername;
        do
        {
            tempUsername = GenerateTempUsername(request.Email);
        } while (await _userManager.FindByNameAsync(tempUsername) is not null);

        var user = new User
        {
            Email = request.Email,
            UserName = tempUsername,
            CreatedAt = DateTime.UtcNow
        };

        var result = await _userManager.CreateAsync(user, request.Password);

        if (!result.Succeeded)
            return BadRequest(result.Errors.Select(e => e.Description));

        var token = CreateToken(user);

        Response.Cookies.Append("access_token", token, new CookieOptions
        {
            HttpOnly = true,
            Secure = false,
            SameSite = SameSiteMode.Strict,
            Expires = DateTime.UtcNow.AddDays(7)
        });

        return Ok(new
        {
            message = "User registered"
        });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null)
            return BadRequest(new {message = "Invalid credentials"});

        var isValid = await _userManager.CheckPasswordAsync(user, request.Password);
        if (!isValid)
            return BadRequest(new {message = "Invalid credentials"});

        if (user.firstSignIn)
        {
            user.firstSignIn = false;
            await _userManager.UpdateAsync(user);
        }

        string token = CreateToken(user);

        Response.Cookies.Append("access_token", token, new CookieOptions
        {
            HttpOnly = true,
            Secure = false,
            SameSite = SameSiteMode.Strict,
            Expires = DateTime.UtcNow.AddDays(7)
        });

        return Ok(new
        {
            message = "User logged in"
        });
    }

    [HttpPost("logout")]
    public IActionResult Logout()
    {
        Response.Cookies.Delete("access_token");
        return Ok(new { message = "Logged out" });
    }

    private string CreateToken(User user)
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.Name, user.UserName!),
            new Claim(ClaimTypes.Email, user.Email!),
            new Claim(ClaimTypes.NameIdentifier, user.Id)
        };

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_config["Jwt:Key"]!)
        );

        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private string GenerateTempUsername(string email)
    {
        var basePart = email.Split('@')[0];
        basePart = new string(basePart.Take(6).ToArray());

        var random = new Random();
        var randomDigits = random.Next(10000, 99999);

        return $"{basePart}{randomDigits}";
    }
}
