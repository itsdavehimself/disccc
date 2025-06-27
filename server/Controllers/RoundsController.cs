using Microsoft.AspNetCore.Mvc;
using server.Data;
using server.Models;
using Microsoft.AspNetCore.Authorization;

namespace server.Controllers;

[Authorize]
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
    var rounds = _db.Rounds.ToList();

    return Ok(rounds);
  }

  [HttpPost]
  public IActionResult CreateRound([FromBody] Round round)
  {
    _db.Rounds.Add(round);
    _db.SaveChanges();

    return CreatedAtAction(nameof(GetRounds), new { id = round.Id }, round);
  }

  [HttpDelete("{id}")]
  public IActionResult DeleteRound(int id)
  {
    var round = _db.Rounds.Find(id);

    if (round == null)
    {
      return NotFound();
    }

    _db.Rounds.Remove(round);
    _db.SaveChanges();

    return NoContent();
  }
}