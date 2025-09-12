import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';

export default function GetLeaderboard () {

  const {contestId} = useParams();
  const [leaderboard, setLeaderboard] = useState([]);
  const [error, setError] = useState(null);

  useEffect (() => {
    const socket = io ('http://localhost:4000');

    socket.emit ('get-leaderboard', contestId);

    socket.on ('leaderboard-data', data => setLeaderboard(data));
    socket.on ('leaderboard-error', error => setError(error.error));
    socket.on (`leaderboard-update-${contestId}`, data => setLeaderboard(data));

    return () => { socket.disconnect(); };
  }, [contestId]);

  return (
    <div>
      {error && <p> {error} </p>}

      <ul>
        {leaderboard.map((user, index) => (
          <li key={index}>
            {user.username} - {user.total_points} points ({user.total_submissions} submissions)
          </li>
        ))}
      </ul>
    </div>
  );
}