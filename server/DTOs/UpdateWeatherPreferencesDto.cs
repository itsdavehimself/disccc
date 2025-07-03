using Microsoft.AspNetCore.SignalR;

public class UpdateWeatherPrefrencesDto
{
  public int MaxTempF { get; set; }
  public int MinTempF { get; set; }
  public int MaxWindSpeedMph { get; set; }
  public bool AllowRain { get; set; }
  public bool AllowSnow { get; set; }
}
