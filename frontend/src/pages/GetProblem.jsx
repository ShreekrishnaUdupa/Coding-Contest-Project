import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {io } from 'socket.io-client';
import { Play, Send, Code, List, Check, X, Clock, AlertCircle } from 'lucide-react';

export default function ProblemSolvingPage() {
  const { contestCode, problemId } = useParams();

  const [problem, setProblem] = useState(null);
  const [role, setRole] = useState('participant');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [selectedLanguage, setSelectedLanguage] = useState('python');
  const [code, setCode] = useState('');
  const [activeTab, setActiveTab] = useState('code');

  const [submissions, setSubmissions] = useState([]);
  const [submissionsLoading, setSubmissionsLoading] = useState(false);

  const [testResult, setTestResult] = useState([]);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [loadingResult, setLoadingResult] = useState(false);
  
  const languages = {
    c: {
      name: 'C',
      defaultCode: '#include <stdio.h>\n\nint main() {\n    // Your code here\n    return 0;\n}'
    },
    cpp: {
      name: 'C++',
      defaultCode: '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    // Your code here\n    return 0;\n}'
    },
    java: {
      name: 'Java',
      defaultCode: 'public class Main {\n    public static void main (String args[]) {\n        // Your code here\n    }\n}'
    },
    py: {
      name: 'Python',
      defaultCode: '# Your code here\n\n'
    },
    js: {
      name: 'JavaScript',
      defaultCode: '// Your code here\n\n'
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const problemResponse = await fetch (`http://localhost:4000/api/contests/${contestCode}/problems/${problemId}`, {credentials: 'include'});

        if (!problemResponse.ok) throw new Error ('Failed to fetch problem');
        const problemData = await problemResponse.json();

        setProblem(problemData.problem);
        setRole (problemData.role);

        const latestSubmissionResponse = await fetch (`http://localhost:4000/api/contests/${contestCode}/problems/${problemId}/submissions/latest`, {credentials: 'include'});

        if (latestSubmissionResponse.status === 204) {
          setSelectedLanguage('py');
          setCode(languages['py'].defaultCode);
        }
        else if (latestSubmissionResponse.ok) {
          const latestData = await latestSubmissionResponse.json();
          setSelectedLanguage(latestData.language);
          setCode(latestData.code);
        }
        else {
          setSelectedLanguage('py');
          setCode(languages['py'].defaultCode);
        }
      }
      catch (error) {
        console.error(error);
        setError('Failed to load problem data.');
      }
      finally {
        setLoading(false);
      }
    };

    loadData();
  }, [contestCode, problemId]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      if (activeTab === 'submissions' && submissions.length === 0) {
        setSubmissionsLoading(true);
        try {
          const res = await fetch(
            `http://localhost:4000/api/contests/${contestCode}/problems/${problemId}/submissions`,
            { credentials: 'include' }
          );
          if (!res.ok) throw new Error('Failed to fetch submissions');
          const data = await res.json();
          setSubmissions(data);
        } catch (err) {
          console.error(err);
        } finally {
          setSubmissionsLoading(false);
        }
      }
    };
    fetchSubmissions();
  }, [activeTab, contestCode, problemId, submissions.length]);

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
    if (!code || code === languages[selectedLanguage].defaultCode) {
      setCode(languages[language].defaultCode);
    }
  };

  const handleRun = async () => {
    setLoadingResult(true);
    setActiveTab('testResult');
    setTestResult([]);

    try {
      const res = await fetch(
        `http://localhost:4000/api/contests/${contestCode}/problems/${problemId}/run`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            language: selectedLanguage,
            code
          })
        }
      );

      if (!res.ok) throw new Error('Run request failed');

      const data = await res.json();

      const socket = io('http://localhost:5000', {
        query: {webSocketId: data.webSocketId}
      });

      socket.on('codeResult', (result) => {
        console.log(result);
        setTestResult(result);
        setLoadingResult(false);
        socket.disconnect();
      });

    } catch (err) {
      console.error(err);
      setLoadingResult(false);
    }
  };

  const handleSubmit = async () => {
    setLoadingResult(true);
    setActiveTab('submissionResult');
    setSubmissionResult(null);

    try {
      const res = await fetch(
        `http://localhost:4000/api/contests/${contestCode}/problems/${problemId}/submissions`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ language: selectedLanguage, code }),
        }
      );

      if (!res.ok) throw new Error('Submit request failed');
      const data = await res.json();

      console.log(data);

      const socket = io ('http://localhost:5000', {
        query: { webSocketId: data.webSocketId },
      });

      socket.on('codeResult', (result) => {
        console.log(result);
        setSubmissionResult(result);
        setLoadingResult(false);
        socket.disconnect();
      });
    } catch (err) {
      console.error(err);
      setLoadingResult(false);
    }
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
    if (submission.pointsScored === submission.totalPoints) {
      return { icon: <Check className="h-4 w-4" />, color: 'text-green-600', text: 'Accepted' };
    } else if (submission.pointsScored > 0) {
      return { icon: <Clock className="h-4 w-4" />, color: 'text-yellow-600', text: 'Partial' };
    } else {
      return { icon: <X className="h-4 w-4" />, color: 'text-red-600', text: 'Failed' };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center relative overflow-hidden">
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
            {/* Tab Navigation - LeetCode Style */}
            <div className="bg-white/80 border-b border-gray-200 px-2">
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setActiveTab('code')}
                  className={`flex items-center px-4 py-3 text-sm font-medium transition-all duration-200 border-b-2 ${
                    activeTab === 'code'
                      ? 'text-gray-900 border-gray-900'
                      : 'text-gray-500 border-transparent hover:text-gray-700'
                  }`}
                >
                  <Code className="h-4 w-4 mr-2" />
                  Code
                </button>
                <button
                  onClick={() => setActiveTab('testResult')}
                  className={`flex items-center px-4 py-3 text-sm font-medium transition-all duration-200 border-b-2 ${
                    activeTab === 'testResult'
                      ? 'text-gray-900 border-gray-900'
                      : 'text-gray-500 border-transparent hover:text-gray-700'
                  }`}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Test Result
                </button>
                <button
                  onClick={() => setActiveTab('submissionResult')}
                  className={`flex items-center px-4 py-3 text-sm font-medium transition-all duration-200 border-b-2 ${
                    activeTab === 'submissionResult'
                      ? 'text-gray-900 border-gray-900'
                      : 'text-gray-500 border-transparent hover:text-gray-700'
                  }`}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Submission Result
                </button>
                <button
                  onClick={() => setActiveTab('submissions')}
                  className={`flex items-center px-4 py-3 text-sm font-medium transition-all duration-200 border-b-2 ${
                    activeTab === 'submissions'
                      ? 'text-gray-900 border-gray-900'
                      : 'text-gray-500 border-transparent hover:text-gray-700'
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
                <div className="bg-white/80 border-b border-gray-200 px-4 py-3">
                  <select
                    value={selectedLanguage}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                    className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {Object.entries(languages).map(([key, lang]) => (
                      <option key={key} value={key}>{lang.name}</option>
                    ))}
                  </select>
                </div>

                {/* Code Editor Area */}
                <div className="flex-1 p-4 bg-gray-50/50">
                  <div className="h-full bg-white rounded-lg border border-gray-300 overflow-hidden">
                    <textarea
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="w-full h-full p-4 bg-white resize-none outline-none font-mono text-sm text-gray-900"
                      placeholder="Start coding..."
                      spellCheck="false"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Test Result Tab - LeetCode Style */}
            {activeTab === 'testResult' && (
              <div className="flex-1 overflow-y-auto bg-gray-50/50">
                {loadingResult ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-3 border-gray-300 border-t-blue-600 mb-4"></div>
                    <p className="text-sm text-gray-600">Running test cases...</p>
                  </div>
                ) : testResult.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <AlertCircle className="h-12 w-12 mb-3 text-gray-400" />
                    <p className="text-sm">No test results yet</p>
                    <p className="text-xs text-gray-400 mt-1">Click "Run" to test your code</p>
                  </div>
                ) : (
                  <div className="p-4 space-y-4">
                    {/* Summary Header */}
                    <div className="bg-white rounded-lg border border-gray-300 p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {testResult.every(tc => tc.passed) ? (
                            <>
                              <Check className="h-5 w-5 text-green-600" />
                              <span className="text-lg font-semibold text-green-600">Accepted</span>
                            </>
                          ) : (
                            <>
                              <X className="h-5 w-5 text-red-600" />
                              <span className="text-lg font-semibold text-red-600">Wrong Answer</span>
                            </>
                          )}
                        </div>
                        <div className="text-sm text-gray-600">
                          <span className="font-semibold">{testResult.filter(tc => tc.passed).length}</span>
                          <span> / </span>
                          <span className="font-semibold">{testResult.length}</span>
                          <span className="ml-1">test cases passed</span>
                        </div>
                      </div>
                    </div>

                    {/* Test Cases */}
                    {testResult.map((testCase, index) => (
                      <div key={testCase.id || index} className="bg-white rounded-lg border border-gray-300 overflow-hidden">
                        <div className={`px-4 py-3 flex items-center justify-between ${
                          testCase.passed ? 'bg-green-50 border-b border-green-200' : 'bg-red-50 border-b border-red-200'
                        }`}>
                          <div className="flex items-center space-x-2">
                            {testCase.passed ? (
                              <Check className="h-4 w-4 text-green-600" />
                            ) : (
                              <X className="h-4 w-4 text-red-600" />
                            )}
                            <span className={`font-semibold text-sm ${
                              testCase.passed ? 'text-green-700' : 'text-red-700'
                            }`}>
                              Test Case {index + 1}
                            </span>
                          </div>
                          <span className={`text-xs font-bold ${
                            testCase.passed ? 'text-green-700' : 'text-red-700'
                          }`}>
                            {testCase.passed ? 'PASSED' : 'FAILED'}
                          </span>
                        </div>
                        <div className="p-4 space-y-3">
                          <div>
                            <div className="text-xs font-semibold text-gray-700 mb-2">Input:</div>
                            <pre className="text-sm bg-gray-50 p-3 rounded border border-gray-200 font-mono overflow-x-auto">
{testCase.input}
                            </pre>
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-gray-700 mb-2">Expected Output:</div>
                            <pre className="text-sm bg-gray-50 p-3 rounded border border-gray-200 font-mono overflow-x-auto">
{testCase.expectedOutput}
                            </pre>
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-gray-700 mb-2">Your Output:</div>
                            <pre className={`text-sm p-3 rounded border font-mono overflow-x-auto ${
                              testCase.passed 
                                ? 'bg-green-50 border-green-200' 
                                : 'bg-red-50 border-red-200'
                            }`}>
{testCase.actualOutput}
                            </pre>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Submission Result Tab - LeetCode Style */}
            {activeTab === 'submissionResult' && (
              <div className="flex-1 overflow-y-auto bg-gray-50/50">
                {loadingResult ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-3 border-gray-300 border-t-blue-600 mb-4"></div>
                    <p className="text-sm text-gray-600">Evaluating submission...</p>
                  </div>
                ) : !submissionResult ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <AlertCircle className="h-12 w-12 mb-3 text-gray-400" />
                    <p className="text-sm">No submission results yet</p>
                    <p className="text-xs text-gray-400 mt-1">Click "Submit" to evaluate your code</p>
                  </div>
                ) : (
                  <div className="p-4 space-y-4">
                    {/* Main Result Card */}
                    <div className={`rounded-lg border-2 p-6 ${
                      submissionResult.pointsScored === submissionResult.totalPoints
                        ? 'bg-green-50 border-green-400'
                        : submissionResult.pointsScored > 0
                        ? 'bg-yellow-50 border-yellow-400'
                        : 'bg-red-50 border-red-400'
                    }`}>
                      <div className="flex items-center justify-center mb-4">
                        {submissionResult.pointsScored === submissionResult.totalPoints ? (
                          <Check className="h-16 w-16 text-green-600" />
                        ) : submissionResult.pointsScored > 0 ? (
                          <Clock className="h-16 w-16 text-yellow-600" />
                        ) : (
                          <X className="h-16 w-16 text-red-600" />
                        )}
                      </div>
                      <h2 className={`text-3xl font-bold text-center mb-2 ${
                        submissionResult.pointsScored === submissionResult.totalPoints
                          ? 'text-green-700'
                          : submissionResult.pointsScored > 0
                          ? 'text-yellow-700'
                          : 'text-red-700'
                      }`}>
                        {submissionResult.pointsScored === submissionResult.totalPoints
                          ? 'Accepted'
                          : submissionResult.pointsScored > 0
                          ? 'Partial Solution'
                          : 'Wrong Answer'}
                      </h2>
                      <p className="text-center text-gray-600 text-sm">
                        Your submission has been evaluated
                      </p>
                    </div>

                    {/* Statistics Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg border border-gray-300 p-4">
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                          Test Cases Passed
                        </div>
                        <div className="text-2xl font-bold text-gray-900">
                          {submissionResult.totalTestCasesPassed} / {submissionResult.totalTestCases}
                        </div>
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              submissionResult.totalTestCasesPassed === submissionResult.totalTestCases
                                ? 'bg-green-600'
                                : submissionResult.totalTestCasesPassed > 0
                                ? 'bg-yellow-600'
                                : 'bg-red-600'
                            }`}
                            style={{
                              width: `${(submissionResult.totalTestCasesPassed / submissionResult.totalTestCases) * 100}%`
                            }}
                          ></div>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg border border-gray-300 p-4">
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                          Points Scored
                        </div>
                        <div className="text-2xl font-bold text-gray-900">
                          {submissionResult.pointsScored} / {submissionResult.totalPoints}
                        </div>
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              submissionResult.pointsScored === submissionResult.totalPoints
                                ? 'bg-green-600'
                                : submissionResult.pointsScored > 0
                                ? 'bg-yellow-600'
                                : 'bg-red-600'
                            }`}
                            style={{
                              width: `${(submissionResult.pointsScored / submissionResult.totalPoints) * 100}%`
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* Success Message or Feedback */}
                    {submissionResult.pointsScored === submissionResult.totalPoints ? (
                      <div className="bg-white rounded-lg border border-gray-300 p-4">
                        <div className="flex items-start space-x-3">
                          <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-1">Congratulations!</h3>
                            <p className="text-sm text-gray-600">
                              Your solution passed all test cases. Great job!
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white rounded-lg border border-gray-300 p-4">
                        <div className="flex items-start space-x-3">
                          <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-1">Keep trying!</h3>
                            <p className="text-sm text-gray-600">
                              {submissionResult.pointsScored > 0
                                ? 'Your solution passed some test cases. Review your code and try again.'
                                : 'Your solution did not pass the test cases. Check your logic and try again.'}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Submissions Tab */}
            {activeTab === 'submissions' && (
              <div className="flex-1 overflow-y-auto bg-gray-50/50 p-4">
                {submissionsLoading ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-blue-600"></div>
                  </div>
                ) : submissions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <List className="h-12 w-12 mb-3 text-gray-400" />
                    <p className="text-sm">No submissions yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {submissions.map((submission) => {
                      const status = getSubmissionStatus(submission);
                      return (
                        <div key={submission.id} className="bg-white rounded-lg border border-gray-300 p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className={`${status.color} flex items-center`}>
                                {status.icon}
                                <span className="ml-2 font-semibold text-sm">{status.text}</span>
                              </div>
                              <span className="text-xs text-gray-400">#{submission.id}</span>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-bold text-gray-900">
                                {submission.pointsScored} / {submission.totalPoints} pts
                              </div>
                              <div className="text-xs text-gray-500">
                                {submission.testCasesPassed} / {submission.totalTestCases} cases
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