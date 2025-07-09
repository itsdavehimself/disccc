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
using Microsoft.AspNetCore.Authorization;

namespace server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
  private readonly UserManager<User> _userManager;
  private readonly IConfiguration _config;
  public UserController(UserManager<User> userManager, IConfiguration config)
  {
    _userManager = userManager;
    _config = config;
  }

  [Authorize]
  [HttpGet("me")]
  public async Task<IActionResult> Me()
  {
      var email = User.FindFirst(ClaimTypes.Email)?.Value;
      if (email is null) return Unauthorized();

      var username = User.FindFirst(ClaimTypes.Name)?.Value;
      if (username is null) return Unauthorized();

      var user = await _userManager.FindByEmailAsync(email);
      if (user is null) return Unauthorized();

      return Ok(new
      {
        email = user.Email,
        username = user.UserName,
        user.FirstSignIn,
        user.WeatherPreferences,
        user.PreferredDays,
        user.HomeCourse
      });
  }

  [Authorize]
  [HttpPatch("update-username")]
  public async Task<IActionResult> UpdateUsername(UpdateUserNameDto request)
  {
    var email = User.FindFirst(ClaimTypes.Email)?.Value;
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

  [Authorize]
  [HttpPatch("weather-preferences")]
  public async Task<IActionResult> UpdateWeatherPreferences(UpdateWeatherPrefrencesDto request)
  {
    var email = User.FindFirst(ClaimTypes.Email)?.Value;
    if (email is null) return Unauthorized();

    var user = await _userManager.FindByEmailAsync(email);
    if (user is null) return Unauthorized();

    if (request == null)
    return BadRequest(new { message = "Request cannot be empty" });

    user.WeatherPreferences = new WeatherPreferences
    {
      AllowRain = request.AllowRain,
      AllowSnow = request.AllowSnow,
      MaxTempF = request.MaxTempF,
      MinTempF = request.MinTempF,
      MaxWindSpeedMph = request.MaxWindSpeedMph
    };

    await _userManager.UpdateAsync(user);
    return Ok(new { message = "Weather preferences updated" });
  }

  [Authorize]
  [HttpPatch("day-preferences")]
  public async Task<IActionResult> UpdateDayPreferences(UpdateDayPreferencesDto request)
  {
    var email = User.FindFirst(ClaimTypes.Email)?.Value;
    if (email is null) return Unauthorized();

    var user = await _userManager.FindByEmailAsync(email);
    if (user is null) return Unauthorized();

    if (request is null)
      return BadRequest(new { message = "Request cannot be empty" });

    user.PreferredDays = request.Days;
    user.FirstSignIn = false;

    await _userManager.UpdateAsync(user);
    return Ok(new { message = "Preferred days updated" });

  }

  [Authorize]
  [HttpPatch("home-course")]
  public async Task<IActionResult> UpdateHomeCourse(HomeCourseDto request)
  {
    var email = User.FindFirst(ClaimTypes.Email)?.Value;
    if (email is null) return Unauthorized();

    var user = await _userManager.FindByEmailAsync(email);
    if (user is null) return Unauthorized();

    if (request is null)
      return BadRequest(new { message = "Request cannot be empty" });

    user.HomeCourse = new HomeCourse
    {
      Name = request.Name,
      City = request.City,
      State = request.State,
      Latitude = request.Latitude,
      Longitude = request.Longitude
    };

    await _userManager.UpdateAsync(user);
    return Ok(new { message = "Home course updated" });
  }

  [Authorize]
  [HttpPost("first-sign-in")]
  public async Task<IActionResult> UpdateFirstSignIn()
  {
    var email = User.FindFirst(ClaimTypes.Email)?.Value;
    if (email is null) return Unauthorized();

    var user = await _userManager.FindByEmailAsync(email);
    if (user is null) return Unauthorized();

    user.FirstSignIn = false;

    await _userManager.UpdateAsync(user);
    return Ok(new { message = "User onboarding completed" });
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
}