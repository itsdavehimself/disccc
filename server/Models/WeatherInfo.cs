namespace server.Models;

public class WeatherInfo
{
  public string Summary { get; set; } = string.Empty;
  public int TemperatureF { get; set; }
  public int WindSpeedMph { get; set; }
}