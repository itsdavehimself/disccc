namespace server.Models;

public class WeatherPreferences
{
  public bool AllowRain { get; set; }
  public bool AllowSnow { get; set; }
  public int MaxTempF { get; set; }
  public int MinTempF { get; set; }
  public int MaxWindSpeedMph { get; set; }
}