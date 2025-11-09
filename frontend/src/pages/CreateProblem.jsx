import { useState } from 'react';
import { Plus, Trash2, Eye, Save } from 'lucide-react';

export default function CreateProblem() {
  const [formData, setFormData] = useState({
    title: '',
    difficulty: 'easy',
    statement: '',
    constraints: '',
    sampleTestCases: [
      { number: 1, input: '', expectedOutput: '', points: 0, isSample: true }
    ],
    hiddenTestCases: [
      { number: 1, input: '', expectedOutput: '', points: 0, isSample: false }
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

  const handleSampleTestCaseChange = (index, field, value) => {
    const updatedTestCases = [...formData.sampleTestCases];
    if (field === 'points' || field === 'number') {
      updatedTestCases[index][field] = parseInt(value) || 0;
    } else {
      updatedTestCases[index][field] = value;
    }
    
    setFormData(prev => ({
      ...prev,
      sampleTestCases: updatedTestCases
    }));
  };

  const handleHiddenTestCaseChange = (index, field, value) => {
    const updatedTestCases = [...formData.hiddenTestCases];
    if (field === 'points' || field === 'number') {
      updatedTestCases[index][field] = parseInt(value) || 0;
    } else {
      updatedTestCases[index][field] = value;
    }
    
    setFormData(prev => ({
      ...prev,
      hiddenTestCases: updatedTestCases
    }));
  };

  const addSampleTestCase = () => {
    const newTestCase = {
      number: formData.sampleTestCases.length + 1,
      input: '',
      expectedOutput: '',
      points: 0,
      isSample: true
    };
    
    setFormData(prev => ({
      ...prev,
      sampleTestCases: [...prev.sampleTestCases, newTestCase]
    }));
  };

  const addHiddenTestCase = () => {
    const newTestCase = {
      number: formData.hiddenTestCases.length + 1,
      input: '',
      expectedOutput: '',
      points: 0,
      isSample: false
    };
    
    setFormData(prev => ({
      ...prev,
      hiddenTestCases: [...prev.hiddenTestCases, newTestCase]
    }));
  };

  const removeSampleTestCase = (index) => {
    if (formData.sampleTestCases.length > 1) {
      const updatedTestCases = formData.sampleTestCases.filter((_, i) => i !== index);
      // Re-number the test cases
      const renumberedTestCases = updatedTestCases.map((tc, i) => ({
        ...tc,
        number: i + 1
      }));
      
      setFormData(prev => ({
        ...prev,
        sampleTestCases: renumberedTestCases
      }));
    }
  };

  const removeHiddenTestCase = (index) => {
    if (formData.hiddenTestCases.length > 1) {
      const updatedTestCases = formData.hiddenTestCases.filter((_, i) => i !== index);
      // Re-number the test cases
      const renumberedTestCases = updatedTestCases.map((tc, i) => ({
        ...tc,
        number: i + 1
      }));
      
      setFormData(prev => ({
        ...prev,
        hiddenTestCases: renumberedTestCases
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

    // Check if all sample test cases have input and expected output
    for (let i = 0; i < formData.sampleTestCases.length; i++) {
      const tc = formData.sampleTestCases[i];
      if (!tc.input.trim() || !tc.expectedOutput.trim()) {
        setError(`Sample test case ${i + 1} must have both input and expected output`);
        setLoading(false);
        return;
      }
    }

    // Check if all hidden test cases have input and expected output
    for (let i = 0; i < formData.hiddenTestCases.length; i++) {
      const tc = formData.hiddenTestCases[i];
      if (!tc.input.trim() || !tc.expectedOutput.trim()) {
        setError(`Hidden test case ${i + 1} must have both input and expected output`);
        setLoading(false);
        return;
      }
    }

    try {
      // Combine sample and hidden test cases for backend
      const testCases = [
        ...formData.sampleTestCases,
        ...formData.hiddenTestCases
      ];

      const submitData = {
        title: formData.title.trim(),
        difficulty: formData.difficulty,
        statement: formData.statement.trim(),
        constraints: formData.constraints.trim(),
        testCases
      };

      // This is where you would send the data to your backend
      console.log('Sending problem data:', submitData);
      
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
      //   body: JSON.stringify(submitData)
      // });
      
    } catch (err) {
      console.error('Error creating problem:', err);
      setError('Failed to create problem. Please try again.');
      setLoading(false);
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
              <div className="space-y-8">
                {/* Sample Test Cases */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700">
                        Sample Test Cases <span className="text-red-500">*</span>
                      </label>
                      <p className="text-xs text-gray-500 mt-1">Visible to participants as examples</p>
                    </div>
                    <button
                      type="button"
                      onClick={addSampleTestCase}
                      className="flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-sm font-medium rounded-2xl transition-all duration-200"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Sample
                    </button>
                  </div>

                  <div className="space-y-4">
                    {formData.sampleTestCases.map((testCase, index) => (
                      <div key={`sample-${index}`} className="bg-green-50/80 rounded-2xl p-6 border border-green-200">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            <div className="bg-green-100 p-2 rounded-lg">
                              <Eye className="h-4 w-4 text-green-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              Sample Test Case {testCase.number}
                            </h3>
                          </div>
                          {formData.sampleTestCases.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeSampleTestCase(index)}
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
                              onChange={(e) => handleSampleTestCaseChange(index, 'input', e.target.value)}
                              rows="4"
                              className="w-full px-3 py-2 bg-white border border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 font-mono text-sm resize-none"
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
                              onChange={(e) => handleSampleTestCaseChange(index, 'expectedOutput', e.target.value)}
                              rows="4"
                              className="w-full px-3 py-2 bg-white border border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 font-mono text-sm resize-none"
                              placeholder="5"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hidden Test Cases */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700">
                        Hidden Test Cases <span className="text-red-500">*</span>
                      </label>
                      <p className="text-xs text-gray-500 mt-1">Used for evaluation, not visible to participants</p>
                    </div>
                    <button
                      type="button"
                      onClick={addHiddenTestCase}
                      className="flex items-center px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white text-sm font-medium rounded-2xl transition-all duration-200"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Hidden
                    </button>
                  </div>

                  <div className="space-y-4">
                    {formData.hiddenTestCases.map((testCase, index) => (
                      <div key={`hidden-${index}`} className="bg-orange-50/80 rounded-2xl p-6 border border-orange-200">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            <div className="bg-orange-100 p-2 rounded-lg">
                              <svg className="h-4 w-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                                <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                              </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              Hidden Test Case {testCase.number}
                            </h3>
                          </div>
                          {formData.hiddenTestCases.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeHiddenTestCase(index)}
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
                              onChange={(e) => handleHiddenTestCaseChange(index, 'input', e.target.value)}
                              rows="4"
                              className="w-full px-3 py-2 bg-white border border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 font-mono text-sm resize-none"
                              placeholder="10\n20"
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
                              onChange={(e) => handleHiddenTestCaseChange(index, 'expectedOutput', e.target.value)}
                              rows="4"
                              className="w-full px-3 py-2 bg-white border border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 font-mono text-sm resize-none"
                              placeholder="30"
                              required
                            />
                          </div>
                        </div>

                        {/* Points for Hidden Test Case */}
                        <div className="w-full md:w-1/2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Points
                          </label>
                          <input
                            type="number"
                            value={testCase.points}
                            onChange={(e) => handleHiddenTestCaseChange(index, 'points', e.target.value)}
                            min="0"
                            className="w-full px-3 py-2 bg-white border border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                            placeholder="10"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
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