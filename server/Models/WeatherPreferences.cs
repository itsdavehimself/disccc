namespace server.Models;

public class WeatherPreferences
{
  public bool AllowRain { get; set; }
  public bool AllowSnow { get; set; }
  public string CloudCoverPreference { get; set; } = string.Empty;
  public int MaxTempF { get; set; }
  public int MinTempF { get; set; }
  public int MaxWindSpeedMph { get; set; }
}