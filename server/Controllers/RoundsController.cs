using Microsoft.AspNetCore.Mvc;
using server.Data;
using server.Models;

namespace server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RoundsController : ControllerBase
{
  private readonly AppDbContext _db;

  public RoundsController(AppDbContext db)
  {
    _db = db;
  }
  
  [HttpGet]
  public IActionResult GetRounds()
  {
    var rounds = new[] {
      new {
        Id = 1,
        Course = "Fairfield",
        Date = "2025-06-25",
        Weather = "Sunny",
        Players = new[] {"Dave", "Ben"}
      },
      new {
        Id = 2,
        Course = "Willow Stream",
        Date = "2025-06-26",
        Weather = "Rainy",
        Players = new[] {"Jess", "Kyle"}
      },
    };

    return Ok(rounds);
  }

  [HttpPost]
  public IActionResult CreateRound([FromBody] Round round)
  {
    _db.Rounds.Add(round);
    _db.SaveChanges();

    return CreatedAtAction(nameof(GetRounds), new { id = round.Id }, round);
  }
}
