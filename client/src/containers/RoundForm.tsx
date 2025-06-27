import { useState } from "react";

const RoundForm: React.FC = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const [course, setCourse] = useState("");
  const [date, setDate] = useState("");
  const [weatherSummary, setWeatherSummary] = useState("");
  const [temperatureF, setTemperatureF] = useState("");
  const [windSpeedMph, setWindSpeedMph] = useState("");
  const [players, setPlayers] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      course,
      date,
      weather: {
        summary: weatherSummary,
        temperatureF: parseInt(temperatureF),
        windSpeedMph: parseInt(windSpeedMph),
      },
      players: players.split(",").map((p) => p.trim()),
    };

    fetch(`${apiUrl}/api/rounds`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to create round");
        return res.json();
      })
      .then((data) => {
        console.log("Success:", data);
        // clear form or do something else
      })
      .catch((err) => console.error("Error creating round", err));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={course}
        onChange={(e) => setCourse(e.target.value)}
        placeholder="Course"
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <input
        type="text"
        value={weatherSummary}
        onChange={(e) => setWeatherSummary(e.target.value)}
        placeholder="Weather Summary"
      />
      <input
        type="number"
        value={temperatureF}
        onChange={(e) => setTemperatureF(e.target.value)}
        placeholder="Temp (F)"
      />
      <input
        type="number"
        value={windSpeedMph}
        onChange={(e) => setWindSpeedMph(e.target.value)}
        placeholder="Wind (mph)"
      />
      <input
        type="text"
        value={players}
        onChange={(e) => setPlayers(e.target.value)}
        placeholder="Players (comma separated)"
      />
      <button type="submit">Create Round</button>
    </form>
  );
};

export default RoundForm;
