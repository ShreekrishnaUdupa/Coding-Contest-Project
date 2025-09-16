import { useState } from 'react';
import { Plus, Trash2, Eye, Save } from 'lucide-react';

export default function CreateProblem() {
  const [formData, setFormData] = useState({
    title: '',
    difficulty: 'easy',
    statement: '',
    constraints: '',
    testCases: [
      { number: 1, input: '', expectedOutput: '', points: 0, isSample: true }
    ]
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTestCaseChange = (index, field, value) => {
    const updatedTestCases = [...formData.testCases];
    if (field === 'points' || field === 'number') {
      updatedTestCases[index][field] = parseInt(value) || 0;
    } else if (field === 'isSample') {
      updatedTestCases[index][field] = value;
    } else {
      updatedTestCases[index][field] = value;
    }
    
    setFormData(prev => ({
      ...prev,
      testCases: updatedTestCases
    }));
  };

  const addTestCase = () => {
    const newTestCase = {
      number: formData.testCases.length + 1,
      input: '',
      expectedOutput: '',
      points: 0,
      isSample: false
    };
    
    setFormData(prev => ({
      ...prev,
      testCases: [...prev.testCases, newTestCase]
    }));
  };

  const removeTestCase = (index) => {
    if (formData.testCases.length > 1) {
      const updatedTestCases = formData.testCases.filter((_, i) => i !== index);
      // Re-number the test cases
      const renumberedTestCases = updatedTestCases.map((tc, i) => ({
        ...tc,
        number: i + 1
      }));
      
      setFormData(prev => ({
        ...prev,
        testCases: renumberedTestCases
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!formData.title.trim()) {
      setError('Problem title is required');
      setLoading(false);
      return;
    }
    if (!formData.statement.trim()) {
      setError('Problem statement is required');
      setLoading(false);
      return;
    }

    // Check if at least one sample test case exists
    const hasSampleTestCase = formData.testCases.some(tc => tc.isSample);
    if (!hasSampleTestCase) {
      setError('At least one sample test case is required');
      setLoading(false);
      return;
    }

    // Check if all test cases have input and expected output
    for (let i = 0; i < formData.testCases.length; i++) {
      const tc = formData.testCases[i];
      if (!tc.input.trim() || !tc.expectedOutput.trim()) {
        setError(`Test case ${i + 1} must have both input and expected output`);
        setLoading(false);
        return;
      }
    }

    try {
      // This is where you would send the data to your backend
      console.log('Sending problem data:', formData);
      
      // Simulate API call
      setTimeout(() => {
        alert('Problem created successfully!');
        setLoading(false);
        // Reset form or redirect
      }, 1000);

      // Actual API call would be:
      // const response = await fetch(`http://localhost:4000/api/contests/id/${contestId}/problems`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   credentials: 'include',
      //   body: JSON.stringify(formData)
      // });
      
    } catch (err) {
      console.error('Error creating problem:', err);
      setError('Failed to create problem. Please try again.');
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'hard':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 py-8 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 relative overflow-hidden">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
          
          <div className="relative z-10">
            {/* Header */}
            <div className="border-b border-gray-200/50 px-8 py-6">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Create Problem</h1>
                <p className="mt-2 text-gray-600">Design a new coding challenge for your contest</p>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="mx-8 mt-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Form */}
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Problem Title */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Problem Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                    placeholder="e.g. Sum of 2 numbers"
                    required
                  />
                </div>

                {/* Difficulty */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Difficulty <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                  <div className="mt-2">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(formData.difficulty)}`}>
                      {formData.difficulty}
                    </span>
                  </div>
                </div>
              </div>

              {/* Problem Statement */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Problem Statement <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="statement"
                  value={formData.statement}
                  onChange={handleInputChange}
                  rows="6"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 resize-none"
                  placeholder="Describe the problem clearly. Explain what the program should do, input format, and expected output format."
                  required
                />
              </div>

              {/* Constraints */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Constraints
                </label>
                <textarea
                  name="constraints"
                  value={formData.constraints}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 resize-none"
                  placeholder="e.g. 1 <= a, b <= 10000 where a and b are the input numbers"
                />
              </div>

              {/* Test Cases Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-semibold text-gray-700">
                    Test Cases <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={addTestCase}
                    className="flex items-center px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white text-sm font-medium rounded-2xl transition-all duration-200"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Test Case
                  </button>
                </div>

                <div className="space-y-4">
                  {formData.testCases.map((testCase, index) => (
                    <div key={index} className="bg-gray-50/80 rounded-2xl p-6 border border-gray-200">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Test Case {testCase.number}
                        </h3>
                        {formData.testCases.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeTestCase(index)}
                            className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors duration-200"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {/* Input */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Input <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            value={testCase.input}
                            onChange={(e) => handleTestCaseChange(index, 'input', e.target.value)}
                            rows="4"
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 font-mono text-sm resize-none"
                            placeholder="2\n3"
                            required
                          />
                        </div>

                        {/* Expected Output */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Expected Output <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            value={testCase.expectedOutput}
                            onChange={(e) => handleTestCaseChange(index, 'expectedOutput', e.target.value)}
                            rows="4"
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 font-mono text-sm resize-none"
                            placeholder="5"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Points */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Points
                          </label>
                          <input
                            type="number"
                            value={testCase.points}
                            onChange={(e) => handleTestCaseChange(index, 'points', e.target.value)}
                            min="0"
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
                            placeholder="10"
                          />
                        </div>

                        {/* Is Sample */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Test Case Type
                          </label>
                          <div className="flex items-center space-x-4 mt-3">
                            <label className="flex items-center">
                              <input
                                type="radio"
                                name={`testCase-${index}`}
                                checked={testCase.isSample}
                                onChange={() => handleTestCaseChange(index, 'isSample', true)}
                                className="text-violet-600 focus:ring-violet-500 border-gray-300"
                              />
                              <span className="ml-2 text-sm text-gray-700">Sample (visible to participants)</span>
                            </label>
                            <label className="flex items-center">
                              <input
                                type="radio"
                                name={`testCase-${index}`}
                                checked={!testCase.isSample}
                                onChange={() => handleTestCaseChange(index, 'isSample', false)}
                                className="text-violet-600 focus:ring-violet-500 border-gray-300"
                              />
                              <span className="ml-2 text-sm text-gray-700">Hidden</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                      Creating Problem...
                    </div>
                  ) : (
                    <span className="flex items-center justify-center space-x-2">
                      <Save className="w-5 h-5" />
                      <span>Create Problem</span>
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full opacity-60"></div>
          <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full opacity-60"></div>
        </div>
      </div>
    </div>
  );
}