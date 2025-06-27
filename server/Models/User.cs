namespace server.Models;
using Microsoft.AspNetCore.Identity;

public class User : IdentityUser
{
  public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

