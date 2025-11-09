import { useState, useEffect } from 'react';
import { Play, Send, Code, List, Check, X, Clock } from 'lucide-react';

export default function ProblemSolvingPage() {
  const [problem, setProblem] = useState(null);
  const [role, setRole] = useState('participant');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Code editor state
  const [selectedLanguage, setSelectedLanguage] = useState('python');
  const [code, setCode] = useState('');
  const [activeTab, setActiveTab] = useState('code'); // 'code' or 'submissions'
  
  // Submissions state
  const [submissions, setSubmissions] = useState([]);
  const [submissionsLoading, setSubmissionsLoading] = useState(false);

  // Mock contest and problem IDs
  const contestId = "5";
  const problemId = "3";

  const languages = {
    c: {
      name: 'C',
      defaultCode: '#include <stdio.h>\n\nint main() {\n    // Your code here\n    return 0;\n}'
    },
    cpp: {
      name: 'C++',
      defaultCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Your code here\n    return 0;\n}'
    },
    java: {
      name: 'Java',
      defaultCode: 'public class Solution {\n    public static void main(String[] args) {\n        // Your code here\n    }\n}'
    },
    python: {
      name: 'Python',
      defaultCode: '# Your code here\na = int(input())\nb = int(input())\nprint(a + b)'
    },
    javascript: {
      name: 'JavaScript',
      defaultCode: '// Your code here\nconst readline = require("readline");\nconst rl = readline.createInterface({\n    input: process.stdin,\n    output: process.stdout\n});'
    }
  };

  // Mock data for demo
  const mockProblem = {
    "role": "participant",
    "problem": {
      "id": 3,
      "difficulty": "easy",
      "title": "Sum of 2 numbers",
      "statement": "Write a program that takes in 2 numbers as inputs and calculates the sum of those 2 numbers.",
      "constraints": "1 <= a, b <= 10000 where a and b are the 2 numbers respectively",
      "totalPoints": 10,
      "sampleTestCases": [
        {
          "id": 3,
          "input": "2\n3",
          "expected_output": "5"
        },
        {
          "id": 4,
          "input": "10\n15",
          "expected_output": "25"
        }
      ]
    }
  };

  const mockRecentSubmission = {
    "language": "python",
    "code": "a = int(input())\nb = int(input())\nprint(a+b)"
  };

  const mockSubmissions = [
    {
      "id": 31,
      "points_scored": 10,
      "total_points": 10,
      "test_cases_passed": 2,
      "total_test_cases": 2
    },
    {
      "id": 30,
      "points_scored": 10,
      "total_points": 10,
      "test_cases_passed": 2,
      "total_test_cases": 2
    },
    {
      "id": 29,
      "points_scored": 0,
      "total_points": 10,
      "test_cases_passed": 0,
      "total_test_cases": 2
    },
    {
      "id": 28,
      "points_scored": 5,
      "total_points": 10,
      "test_cases_passed": 1,
      "total_test_cases": 2
    }
  ];

  useEffect(() => {
    // Simulate API calls
    setTimeout(() => {
      setProblem(mockProblem.problem);
      setRole(mockProblem.role);
      
      // Set recent submission or default code
      if (mockRecentSubmission) {
        setSelectedLanguage(mockRecentSubmission.language);
        setCode(mockRecentSubmission.code);
      } else {
        setCode(languages[selectedLanguage].defaultCode);
      }
      
      setLoading(false);
    }, 1000);
  }, []);

  const fetchSubmissions = async () => {
    if (activeTab === 'submissions' && submissions.length === 0) {
      setSubmissionsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setSubmissions(mockSubmissions);
        setSubmissionsLoading(false);
      }, 500);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [activeTab]);

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
    if (!code || code === languages[selectedLanguage].defaultCode) {
      setCode(languages[language].defaultCode);
    }
  };

  const handleRun = () => {
    alert('Running code...');
    // Implement run logic here
  };

  const handleSubmit = () => {
    alert('Submitting code...');
    // Implement submit logic here
  };

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

  const getSubmissionStatus = (submission) => {
    if (submission.points_scored === submission.total_points) {
      return { icon: <Check className="h-4 w-4" />, color: 'text-green-600', text: 'Accepted' };
    } else if (submission.points_scored > 0) {
      return { icon: <Clock className="h-4 w-4" />, color: 'text-yellow-600', text: 'Partial' };
    } else {
      return { icon: <X className="h-4 w-4" />, color: 'text-red-600', text: 'Failed' };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative z-10 text-center">
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-violet-600 mx-auto"></div>
            <p className="mt-4 text-gray-700 font-medium">Loading problem...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8 max-w-md w-full mx-4">
          <p className="text-center text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 h-screen flex flex-col">
        {/* Top Navigation */}
        <div className="bg-white/80 backdrop-blur-lg border-b border-white/20 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-lg font-semibold text-gray-900">
                {problem?.title || 'Loading...'}
              </h1>
              {problem && (
                <span className={`text-sm font-bold capitalize ${getDifficultyColor(problem.difficulty)}`}>
                  {problem.difficulty}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleRun}
                className="flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-xl transition-colors duration-200"
              >
                <Play className="h-4 w-4 mr-2" />
                Run
              </button>
              <button
                onClick={handleSubmit}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-sm font-medium rounded-xl transition-all duration-200"
              >
                <Send className="h-4 w-4 mr-2" />
                Submit
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Panel - Problem Details */}
          <div className="w-1/2 bg-white/60 backdrop-blur-sm border-r border-white/20 overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Problem Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">{problem?.title}</h2>
                <div className="text-sm text-gray-600">
                  <span className="font-semibold">{problem?.totalPoints}</span> points
                </div>
              </div>

              {/* Problem Statement */}
              <div className="bg-white/60 rounded-2xl p-6 border border-white/30">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Problem Statement</h3>
                <p className="text-gray-700 leading-relaxed">{problem?.statement}</p>
              </div>

              {/* Constraints */}
              <div className="bg-white/60 rounded-2xl p-6 border border-white/30">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Constraints</h3>
                <p className="text-gray-700 font-mono text-sm">{problem?.constraints}</p>
              </div>

              {/* Sample Test Cases */}
              <div className="bg-white/60 rounded-2xl p-6 border border-white/30">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Sample Test Cases</h3>
                <div className="space-y-4">
                  {problem?.sampleTestCases?.map((testCase, index) => (
                    <div key={testCase.id} className="bg-gray-50/80 rounded-xl p-4">
                      <div className="text-sm font-semibold text-gray-600 mb-2">Example {index + 1}</div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs font-medium text-gray-500 mb-1">Input:</div>
                          <pre className="text-sm bg-white/80 p-3 rounded-lg border font-mono">
                            {testCase.input}
                          </pre>
                        </div>
                        <div>
                          <div className="text-xs font-medium text-gray-500 mb-1">Output:</div>
                          <pre className="text-sm bg-white/80 p-3 rounded-lg border font-mono">
                            {testCase.expected_output}
                          </pre>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Code Editor */}
          <div className="w-1/2 flex flex-col bg-white/40 backdrop-blur-sm">
            {/* Tab Navigation */}
            <div className="bg-white/60 border-b border-white/20 px-4 py-3">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setActiveTab('code')}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-xl transition-colors duration-200 ${
                    activeTab === 'code'
                      ? 'bg-violet-100 text-violet-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
                  }`}
                >
                  <Code className="h-4 w-4 mr-2" />
                  Code
                </button>
                <button
                  onClick={() => setActiveTab('submissions')}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-xl transition-colors duration-200 ${
                    activeTab === 'submissions'
                      ? 'bg-violet-100 text-violet-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
                  }`}
                >
                  <List className="h-4 w-4 mr-2" />
                  Submissions
                </button>
              </div>
            </div>

            {/* Code Editor Tab */}
            {activeTab === 'code' && (
              <>
                {/* Language Selector */}
                <div className="bg-white/60 border-b border-white/20 px-4 py-3">
                  <select
                    value={selectedLanguage}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                    className="bg-white/80 border border-gray-200 rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-violet-500"
                  >
                    {Object.entries(languages).map(([key, lang]) => (
                      <option key={key} value={key}>{lang.name}</option>
                    ))}
                  </select>
                </div>

                {/* Code Editor Area */}
                <div className="flex-1 p-4">
                  <div className="h-full bg-white/80 rounded-2xl border border-white/30 overflow-hidden">
                    <textarea
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="w-full h-full p-4 bg-transparent resize-none outline-none font-mono text-sm text-gray-900"
                      placeholder="Start coding..."
                    />
                  </div>
                </div>
              </>
            )}

            {/* Submissions Tab */}
            {activeTab === 'submissions' && (
              <div className="flex-1 overflow-y-auto p-4">
                {submissionsLoading ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-violet-600"></div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {submissions.map((submission) => {
                      const status = getSubmissionStatus(submission);
                      return (
                        <div key={submission.id} className="bg-white/80 rounded-2xl p-4 border border-white/30">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className={`${status.color} flex items-center`}>
                                {status.icon}
                                <span className="ml-1 font-medium text-sm">{status.text}</span>
                              </div>
                              <span className="text-xs text-gray-500">ID: {submission.id}</span>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-semibold text-gray-900">
                                {submission.points_scored}/{submission.total_points} pts
                              </div>
                              <div className="text-xs text-gray-500">
                                {submission.test_cases_passed}/{submission.total_test_cases} cases
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}