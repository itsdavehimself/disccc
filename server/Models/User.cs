namespace server.Models;
using Microsoft.AspNetCore.Identity;

public class User : IdentityUser
{
  public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
  public bool FirstSignIn { get; set; } = true;
  public WeatherPreferences WeatherPreferences { get; set; } = new();
  public List<DayOfWeek> PreferredDays { get; set; } = new([DayOfWeek.Sunday, DayOfWeek.Monday, DayOfWeek.Tuesday, DayOfWeek.Wednesday, DayOfWeek.Thursday, DayOfWeek.Friday, DayOfWeek.Saturday]);
  public HomeCourse HomeCourse { get; set; } = new();
}

