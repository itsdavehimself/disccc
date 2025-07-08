using server.Models;

namespace server.DTOs;

public class UpdateDayPreferencesDto
{
  public List<DayOfWeek> Days { get; set; } = new();
}