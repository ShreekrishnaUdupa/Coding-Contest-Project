import { useState, useEffect } from 'react';
import { Plus, Eye, Edit, Trash2, AlertCircle } from 'lucide-react';

export default function GetAllProblems() {
  // Mock data for demo purposes
  const contestId = "123";
  const [problems, setProblems] = useState([]);
  const [role, setRole] = useState('organizer');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Mock data
  const mockProblems = [
    {
      id: '1',
      title: 'Two Sum',
      difficulty: 'easy',
      totalPoints: 100
    },
    {
      id: '2', 
      title: 'Binary Tree Maximum Path Sum',
      difficulty: 'hard',
      totalPoints: 300
    },
    {
      id: '3',
      title: 'Longest Palindromic Substring',
      difficulty: 'medium',
      totalPoints: 200
    },
    {
      id: '4',
      title: 'Valid Parentheses',
      difficulty: 'easy',
      totalPoints: 150
    },
    {
      id: '5',
      title: 'Merge K Sorted Lists',
      difficulty: 'hard',
      totalPoints: 400
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProblems(mockProblems);
      setLoading(false);
    }, 1000);
  }, []);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'text-green-600';
      case 'medium':
        return 'text-yellow-600';
      case 'hard':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const handleViewProblem = (problemId) => {
    alert(`Navigate to: /contests/id/${contestId}/problems/id/${problemId}`);
  };

  const handleEditProblem = (problemId) => {
    alert(`Navigate to edit: /contests/id/${contestId}/problems/id/${problemId}/edit`);
  };

  const handleDeleteProblem = (problemId) => {
    if (window.confirm('Are you sure you want to delete this problem?')) {
      setProblems(problems.filter(p => p.id !== problemId));
      alert(`Problem ${problemId} deleted successfully!`);
    }
  };

  const handleAddProblem = () => {
    alert(`Navigate to: /contests/id/${contestId}/problems/add`);
  };

  const canModify = role === 'organizer' || role === 'moderator';

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
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-violet-600 mx-auto"></div>
            <p className="mt-4 text-gray-700">Loading problems...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-500"></div>
        </div>

        <div className="relative z-10 bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8 max-w-md w-full mx-4">
          <div className="flex items-center justify-center mb-4">
            <AlertCircle className="h-6 w-6 text-red-500" />
          </div>
          <h2 className="text-lg font-medium text-center text-gray-900 mb-2">Error</h2>
          <p className="text-center text-gray-600 text-base mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white py-2 px-4 rounded-2xl transition-all duration-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 py-6 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 mb-6 relative overflow-hidden">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
          
          <div className="relative z-10 px-6 py-4 border-b border-gray-200/50">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-medium text-gray-900">Problems</h1>
                {problems.length > 0 && (
                  <p className="text-sm text-gray-500 mt-1">{problems.length} problems</p>
                )}
              </div>
              {canModify && (
                <button
                  onClick={handleAddProblem}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white text-sm rounded-2xl transition-all duration-200"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Problem
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 relative overflow-hidden">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
          
          <div className="relative z-10">
            {problems.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No problems found</p>
                {canModify && (
                  <p className="text-gray-400 text-sm mt-1">Start by adding your first problem.</p>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50/50 border-b border-gray-200/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                        #
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                        Difficulty
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                        Points
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200/30">
                    {problems.map((problem, index) => (
                      <tr key={problem.id || index} className="hover:bg-gray-50/30 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap text-base text-gray-900">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-base font-medium text-gray-900">
                            {problem.title || 'Untitled Problem'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`text-base font-medium capitalize ${getDifficultyColor(problem.difficulty)}`}>
                            {problem.difficulty || 'Unknown'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-base text-gray-900">
                          {problem.totalPoints || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-base">
                          <div className="flex items-center justify-end space-x-3">
                            <button
                              onClick={() => handleViewProblem(problem.id)}
                              className="text-blue-600 hover:text-blue-800 transition-colors duration-150"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            {canModify && (
                              <>
                                <button
                                  onClick={() => handleEditProblem(problem.id)}
                                  className="text-gray-600 hover:text-gray-800 transition-colors duration-150"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteProblem(problem.id)}
                                  className="text-red-600 hover:text-red-800 transition-colors duration-150"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
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