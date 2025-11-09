import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';

export default function GetContest () {
	
  const {contestCode} = useParams();
  const navigate = useNavigate();

  const [contest, setContest] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

	useEffect (() => {

    async function fetchContest () {
      try {
        const response = await fetch (`http://localhost:4000/api/contests/${contestCode}`);

        console.log(response);
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

    if (contestCode) fetchContest();
  }, [contestCode]);

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

  async function enterContest () {
    try {
      const response = await fetch (`http://localhost:4000/api/contests/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify ({contestId: contest.id})
        });

        if (!response.ok) {
          console.error(error);
          window.alert(error);
          return;
        }

        navigate (`/contests/id/${contest.id}/problems`);
    }

    catch (error) {
      console.error(error);
      window.alert(error);
    }
    // navigate (`/${contestCode}/problems`);
  }

  const hasStarted = timeRemaining === 0;

  if (loading) return <Loading />;
  
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center p-4">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Contest Not Found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/contests')}
            className="px-6 py-3 cursor-pointer bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold rounded-2xl transition-all duration-200 transform hover:scale-105"
          >
            Back to Contests
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-500"></div>
      </div>

      {/* Header - Dark gradient section with glassmorphism */}
      <div>
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">{contest?.title}</h1>
            <p className="text-lg mb-8">
              {new Date(contest?.startTime).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}, {new Date(contest?.startTime).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              })} to {new Date(contest?.endTime).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric', 
                year: 'numeric'
              })}, {new Date(contest?.endTime).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              })}
            </p>
            
            {hasStarted ? (
              <button
                onClick={enterContest}
                className="cursor-pointer bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-lg flex items-center space-x-2 mx-auto"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                <span>Enter Contest</span>
              </button>
            ) : (
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 inline-block shadow-lg">
                <p className="text-sm text-gray-300 mb-4">Contest starts in:</p>
                <div className="text-4xl font-mono font-bold text-white tracking-wider">
                  {formatTime(timeRemaining)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content - Glassmorphism cards */}
      <div className="relative">
        <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
          
          {/* About Section */}
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
            <div className="relative z-10">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent text-center mb-8">Description</h2>
              <div className="text-gray-700 text-lg leading-relaxed text-center max-w-3xl mx-auto">
                {contest?.description || "No description available for this contest."}
              </div>
            </div>
          </div>

          {/* Rules Section */}
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
            <div className="relative z-10">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent text-center mb-8">Rules</h2>
              <div className="text-gray-700 text-lg leading-relaxed text-center max-w-3xl mx-auto">
                {contest?.rules || "No specific rules have been set for this contest. Please follow general coding contest guidelines."}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}