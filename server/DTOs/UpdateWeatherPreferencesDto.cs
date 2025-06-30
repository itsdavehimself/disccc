using Microsoft.AspNetCore.SignalR;

public class UpdateWeatherPrefrencesDto
{
  public int MaxTempF { get; set; }
  public int MinTempF { get; set; }
  public int MaxWindSpeedMph { get; set; }
  public string PreferredConditions { get; set; } = string.Empty;
}
