namespace server.Models;

public class WeatherPreferences
{
  public string PreferredConditions { get; set; } = string.Empty;
  public int MaxTempF { get; set; }
  public int MinTempF { get; set; }
  public int MaxWindSpeedMph { get; set; }
}