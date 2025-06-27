using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using server.Models;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using System.Text.Json;

namespace server.Data;

public class AppDbContext : IdentityDbContext<User>
{
  public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

  public DbSet<Round> Rounds => Set<Round>();

  protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        var playersConverter = new ValueConverter<List<string>, string>(
            v => JsonSerializer.Serialize(v, (JsonSerializerOptions)null),
            v => JsonSerializer.Deserialize<List<string>>(v, (JsonSerializerOptions)null) ?? new());

        var weatherConverter = new ValueConverter<WeatherInfo, string>(
            v => JsonSerializer.Serialize(v, (JsonSerializerOptions)null),
            v => JsonSerializer.Deserialize<WeatherInfo>(v, (JsonSerializerOptions)null) ?? new());

        modelBuilder.Entity<Round>()
            .Property(r => r.Players)
            .HasConversion(playersConverter);

        modelBuilder.Entity<Round>()
            .Property(r => r.Weather)
            .HasConversion(weatherConverter);
    }
}