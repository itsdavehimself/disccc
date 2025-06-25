import { useEffect, useState } from "react";

type Weather = {
  summary: string;
  temperatureF: number;
  windSpeedMph: number;
};

type Round = {
  id: number;
  course: string;
  date: string;
  weather: Weather;
  players: string[];
};

const Rounds: React.FC = () => {
  const [rounds, setRounds] = useState<Round[]>([]);
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetch(`${apiUrl}/api/rounds`)
      .then((res) => res.json())
      .then((data) => setRounds(data))
      .catch((err) => console.error("Error fetching rounds", err));
  });

  return (
    <div>
      <h1>Upcoming Rounds</h1>
      <ul>
        {rounds.map((round) => (
          <li key={round.id}>
            <strong>{round.course}</strong> —{" "}
            {new Date(round.date).toDateString()}
            <br />
            Weather: {round.weather.summary}, {round.weather.temperatureF}°F,{" "}
            {round.weather.windSpeedMph} mph wind
            <br />
            Players: {round.players.join(", ")}
            <hr />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Rounds;
