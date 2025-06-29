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

    [HttpPatch("update-username")]
    public async Task<IActionResult> Update(UpdateUserNameDto request)
    {
        var token = Request.Cookies["access_token"];
        if (token is null) return Unauthorized();

        var principal = ValidateToken(token);
        if (principal is null) return Unauthorized();

        var email = principal.FindFirst(ClaimTypes.Email)?.Value;
        if (email is null) return Unauthorized();

        var existingUser = await _userManager.FindByNameAsync(request.Username);
        if (existingUser != null) return BadRequest(new { message = "Username is already in use" });

        var user = await _userManager.FindByEmailAsync(email);
        if (user is null) return Unauthorized();

        user.UserName = request.Username;
        await _userManager.UpdateAsync(user);

        return Ok(new
        {
            message = "Username updated"
        });
    }

    [HttpGet("me")]
    public async Task<IActionResult> Me()
    {
        var token = Request.Cookies["access_token"];
        if (token is null) return Unauthorized();

        var principal = ValidateToken(token);
        if (principal is null) return Unauthorized();

        var email = principal.FindFirst(ClaimTypes.Email)?.Value;
        if (email is null) return Unauthorized();

        var username = principal.FindFirst(ClaimTypes.Name)?.Value;
        if (username is null) return Unauthorized();

        var user = await _userManager.FindByEmailAsync(email);
        if (user is null) return Unauthorized();

        return Ok(new
        {
            email = user.Email,
            username = user.UserName,
            user.firstSignIn
        });
    }

    [HttpPost("logout")]
    public IActionResult Logout()
    {
        Response.Cookies.Delete("access_token");
        return Ok(new { message = "Logged out" });
    }

    [HttpDelete]
    public async Task<IActionResult> Delete(string email)
    {
        var user = await _userManager.FindByEmailAsync(email);

        if (user == null)
        {
            return NotFound();
        }

        var result = await _userManager.DeleteAsync(user);

        if (!result.Succeeded)
        {
            return BadRequest(result.Errors.Select(e => e.Description));
        }

        return NoContent();
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

    private ClaimsPrincipal? ValidateToken(string token)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.UTF8.GetBytes(_config["Jwt:Key"]!);

        try
        {
            var principal = tokenHandler.ValidateToken(token, new TokenValidationParameters
            {
                ValidateIssuer = false,
                ValidateAudience = false,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key)
            }, out SecurityToken validatedToken);

            return principal;
        }
        catch
        {
            return null;
        }
    }
}
