namespace server.Models;

public class Round
{
  public int Id { get; set; }
  public string Course { get; set; } = string.Empty;
  public DateTime Date { get; set; }
  public WeatherInfo Weather { get; set; } = new();
  public List<string> Players { get; set; } = new();
}