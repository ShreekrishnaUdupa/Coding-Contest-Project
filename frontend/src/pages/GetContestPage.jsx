import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '../components/Loading';

export default function GetContestPage () {
	
  const {name} = useParams();

  const [contest, setContest] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

	useEffect (() => {

    async function fetchContest () {
      try {
        const response = await fetch (`http://localhost:4000/api/contests/${name}`);
        const data = await response.json();

        if (!response.ok) {
          setError(data.error || 'Failed to fetch contest');
          setLoading(false);
          return;
        }

        setContest(data);

        sessionStorage.setItem('contestId', data.id);
        document.title = data.title;
      }
      
      catch (error) {
        console.error('Error fetching data: ', error);
        setError('Failed to fetch contest');
      }

      finally {
        setLoading(false);
      }
		}

    if (name) fetchContest();
  }, [name]);

  useEffect (() => {

    if (!contest?.startTime) return;

    function calculateTimeRemaining () {
      const diff = new Date(contest.startTime) - Date.now();

      setTimeRemaining(diff > 0 ? Math.floor(diff / 1000) : 0);
    }

    calculateTimeRemaining();

    const interval = setInterval (calculateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [contest?.startTime]);

  function formatTime (seconds) {
    const hrs = String (Math.floor (seconds / 3600)).padStart(2, "0");
    const mins = String (Math.floor ((seconds % 3600) / 60)).padStart(2, "0");
    const secs = String (seconds % 60).padStart (2, "0");

    return `${hrs}:${mins}:${secs}`;
  }

  const hasStarted = timeRemaining === 0;

  if (loading) return <Loading />;
  if (error) return <p> Error occurred! {error} </p>;

  return (
    <div>
      <div> Title: {contest.title} </div>
      <div> Description: {contest.description} </div>
      <div> Rules: {contest.rules} </div>
      <div> Start Time: {new Date(contest.startTime).toLocaleString()} </div>
      <div> End Time: {new Date(contest.endTime).toLocaleString()} </div>

      {hasStarted ? (<button> Enter Contest </button>)
      : (<p> Contest starts in {formatTime(timeRemaining)} </p>)
      }

    </div>
  );
}