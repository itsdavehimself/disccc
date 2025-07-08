namespace server.Models;

public class WeatherPreferences
{
  public bool AllowRain { get; set; } = false;
  public bool AllowSnow { get; set; } = false;
  public int MaxTempF { get; set; } = 95;
  public int MinTempF { get; set; } = 32;
  public int MaxWindSpeedMph { get; set; } = 30;
}