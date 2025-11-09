import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Trophy, Medal, Award, Users, Target, TrendingUp } from 'lucide-react';
import { io } from 'socket.io-client';

export default function GetLeaderboard () {

const contestId = "123";
  const [leaderboard, setLeaderboard] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  const mockLeaderboard = [
    { username: 'CodeMaster2024', total_points: 2850, total_submissions: 15 },
    { username: 'AlgorithmNinja', total_points: 2720, total_submissions: 12 },
    { username: 'ByteWarrior', total_points: 2680, total_submissions: 18 },
    { username: 'LogicLord', total_points: 2540, total_submissions: 14 },
    { username: 'DataDriven', total_points: 2420, total_submissions: 11 },
    { username: 'CodeCrusher', total_points: 2380, total_submissions: 16 },
    { username: 'BinaryBeast', total_points: 2240, total_submissions: 13 },
    { username: 'SyntaxSage', total_points: 2180, total_submissions: 10 },
    { username: 'DebuggingDiva', total_points: 2120, total_submissions: 17 },
    { username: 'RecursiveRabbit', total_points: 2080, total_submissions: 9 }
  ];

  useEffect (() => {

    // dumbshit code

    setTimeout(() => {
      setLeaderboard(mockLeaderboard);
      setLoading(false);
    }, 1500);

    //

    
    const socket = io ('http://localhost:4000');

    socket.emit ('get-leaderboard', contestId);

    socket.on ('leaderboard-data', data => setLeaderboard(data));
    socket.on ('leaderboard-error', error => setError(error.error));
    socket.on (`leaderboard-update-${contestId}`, data => setLeaderboard(data));

    return () => { socket.disconnect(); };
  }, [contestId]);
const getRankIcon = (position) => {
    switch (position) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return (
          <div className="h-6 w-6 rounded-full bg-violet-100 flex items-center justify-center">
            <span className="text-violet-700 text-sm font-bold">{position}</span>
          </div>
        );
    }
  };

  const getRankStyling = (position) => {
    switch (position) {
      case 1:
        return 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200 shadow-yellow-100';
      case 2:
        return 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200 shadow-gray-100';
      case 3:
        return 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 shadow-amber-100';
      default:
        return 'bg-white/60 border-white/30';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-500"></div>
        </div>
        
        <div className="relative z-10 text-center">
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-violet-200 border-t-violet-600 mx-auto"></div>
            <p className="mt-6 text-gray-700 font-medium text-lg">Loading leaderboard...</p>
            <p className="mt-2 text-gray-500 text-sm">Fetching latest rankings</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 py-8 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 mb-8 relative overflow-hidden">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
          
          <div className="relative z-10 px-8 py-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-gradient-to-r from-violet-100 to-indigo-100 p-4 rounded-2xl">
                  <Trophy className="h-8 w-8 text-violet-700" />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Contest Leaderboard</h1>
              <p className="mt-2 text-gray-600">Real-time rankings updated live</p>
              
              {leaderboard.length > 0 && (
                <div className="mt-6 flex items-center justify-center space-x-8">
                  <div className="text-center">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2 rounded-2xl border border-blue-200">
                      <Users className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                      <div className="text-lg font-bold text-blue-700">{leaderboard.length}</div>
                      <div className="text-xs text-blue-600">Participants</div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-2 rounded-2xl border border-green-200">
                      <Target className="h-5 w-5 text-green-600 mx-auto mb-1" />
                      <div className="text-lg font-bold text-green-700">{leaderboard[0]?.total_points || 0}</div>
                      <div className="text-xs text-green-600">Top Score</div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="bg-gradient-to-r from-purple-50 to-violet-50 px-4 py-2 rounded-2xl border border-purple-200">
                      <TrendingUp className="h-5 w-5 text-purple-600 mx-auto mb-1" />
                      <div className="text-lg font-bold text-purple-700">
                        {Math.round(leaderboard.reduce((acc, user) => acc + user.total_submissions, 0) / leaderboard.length) || 0}
                      </div>
                      <div className="text-xs text-purple-600">Avg Submissions</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 mb-8 p-6">
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Leaderboard */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 relative overflow-hidden">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
          
          <div className="relative z-10">
            {leaderboard.length === 0 ? (
              <div className="text-center py-16 px-8">
                <div className="bg-gradient-to-r from-gray-100 to-slate-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No participants yet</h3>
                <p className="text-gray-500 text-sm max-w-sm mx-auto">
                  Be the first to join the contest and claim the top spot on the leaderboard!
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50/50 border-b border-gray-200/50">
                    <tr>
                      <th className="px-8 py-4 text-left text-sm font-bold text-gray-600 uppercase tracking-wide w-24">
                        Rank
                      </th>
                      <th className="px-8 py-4 text-left text-sm font-bold text-gray-600 uppercase tracking-wide">
                        Username
                      </th>
                      <th className="px-8 py-4 text-left text-sm font-bold text-gray-600 uppercase tracking-wide w-32">
                        Points
                      </th>
                      <th className="px-8 py-4 text-left text-sm font-bold text-gray-600 uppercase tracking-wide w-32">
                        Submissions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200/30">
                    {leaderboard.map((user, index) => {
                      const position = index + 1;
                      return (
                        <tr key={index} className={`${getRankStyling(position)} hover:bg-gray-50/30 transition-colors duration-150`}>
                          <td className="px-8 py-6 whitespace-nowrap">
                            <div className="flex items-center">
                              {getRankIcon(position)}
                            </div>
                          </td>
                          <td className="px-8 py-6 whitespace-nowrap">
                            <div className="text-base font-semibold text-gray-900 tracking-tight">
                              {user.username}
                            </div>
                          </td>
                          <td className="px-8 py-6 whitespace-nowrap">
                            <div className="text-base font-semibold text-gray-900">
                              {user.total_points.toLocaleString()}
                            </div>
                          </td>
                          <td className="px-8 py-6 whitespace-nowrap">
                            <div className="text-base font-semibold text-gray-900">
                              {user.total_submissions}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Decorative elements */}
          <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full opacity-60"></div>
          <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full opacity-60"></div>
        </div>
      </div>
    </div>
  );
}