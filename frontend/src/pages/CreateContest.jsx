import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CreateContest () {
  const [formData, setFormData] = useState({
    code: '',
    title: '',
    description: '',
    rules: '',
    startTime: '',
    endTime: ''
  });

  const [error, setError] = useState('');
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatDateTime = (date, time) => {
    if (!date || !time) return '';
    return `${date}T${time}`;
  };

  const handleStartDateTimeChange = (newDate, newTime) => {
    const date = newDate || startDate;
    const time = newTime || startTime;
    setStartDate(date);
    setStartTime(time);
    setFormData(prev => ({
      ...prev,
      startTime: formatDateTime(date, time)
    }));
  };

  const handleEndDateTimeChange = (newDate, newTime) => {
    const date = newDate || endDate;
    const time = newTime || endTime;
    setEndDate(date);
    setEndTime(time);
    setFormData(prev => ({
      ...prev,
      endTime: formatDateTime(date, time)
    }));
  };

  const formatDisplayDateTime = (dateStr, timeStr) => {
    if (!dateStr || !timeStr) return 'Select date and time';
    const date = new Date(`${dateStr}T${timeStr}`);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.code.trim()) {
      setError('Contest code is required');
      return;
    }
    if (!formData.title.trim()) {
      setError('Contest title is required');
      return;
    }
    if (!formData.startTime) {
      setError('Start time is required');
      return;
    }
    if (!formData.endTime) {
      setError('End time is required');
      return;
    }

    try {
      const formatToUTC = (localDateTimeString) => {
        const localDate = new Date(localDateTimeString);
        return localDate.toISOString();
      };

      const requestBody = {
        code: formData.code.trim(),
        title: formData.title.trim(),
        description: formData.description.trim(),
        rules: formData.rules.trim(),
        startTime: formatToUTC(formData.startTime),
        endTime: formatToUTC(formData.endTime)
      };

      console.log('Sending contest data:', requestBody);

      const response = await fetch('http://localhost:4000/api/contests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(requestBody)
      });

      console.log(response);
      const data = await response.json();

      if (response.ok) {
        navigate (`/forgot-password`);
        
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to create contest');
      }
    } catch (err) {
      console.error('Error creating contest:', err);
      setError('Network error. Please check if the server is running.');
    }
  };

  const CustomDateTimePicker = ({ 
    isVisible, 
    onClose, 
    selectedDate, 
    selectedTime, 
    onDateTimeChange, 
    label,
    color = "violet" 
  }) => {
    const [tempDate, setTempDate] = useState(selectedDate || '');
    const [tempTime, setTempTime] = useState(selectedTime || '');

    const colorClasses = {
      violet: {
        bg: "from-violet-500 to-purple-600",
        ring: "ring-violet-500",
        text: "text-violet-600"
      },
      red: {
        bg: "from-red-500 to-rose-600", 
        ring: "ring-red-500",
        text: "text-red-600"
      }
    };

    const currentColor = colorClasses[color];

    const handleConfirm = () => {
      onDateTimeChange(tempDate, tempTime);
      onClose();
    };

    if (!isVisible) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 max-w-sm w-full mx-4 transform transition-all duration-300 scale-100">
          <div className="text-center mb-6">
            <h3 className={`text-xl font-bold bg-gradient-to-r ${currentColor.bg} bg-clip-text text-transparent`}>
              {label}
            </h3>
          </div>

          <div className="space-y-4">
            {/* Date Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={tempDate}
                  onChange={(e) => setTempDate(e.target.value)}
                  className={`w-full px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200 rounded-2xl focus:outline-none focus:${currentColor.ring} focus:border-transparent transition-all duration-200 font-medium text-gray-700 cursor-pointer hover:from-gray-100 hover:to-gray-150`}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                </div>
              </div>
            </div>

            {/* Time Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Time
              </label>
              <div className="relative">
                <input
                  type="time"
                  value={tempTime}
                  onChange={(e) => setTempTime(e.target.value)}
                  className={`w-full px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200 rounded-2xl focus:outline-none focus:${currentColor.ring} focus:border-transparent transition-all duration-200 font-medium text-gray-700 cursor-pointer hover:from-gray-100 hover:to-gray-150`}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-2xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className={`flex-1 px-4 py-3 bg-gradient-to-r ${currentColor.bg} hover:shadow-lg text-white font-semibold rounded-2xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]`}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center p-4">
      
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-500"></div>
      </div>

      <div className="relative w-full max-w-2xl">
        {/* Main card */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8 relative overflow-hidden">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
          
          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
                Create Contest
              </h1>
              <p className="text-gray-600">Set up your coding competition</p>
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {/* Form */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contest Code */}
                <div className="relative group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Contest Code <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="code"
                      value={formData.code}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 group-hover:bg-gray-100"
                      placeholder="e.g. coding-contest"
                      required
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    </div>
                  </div>
                </div>

                {/* Contest Title */}
                <div className="relative group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Contest Title <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 group-hover:bg-gray-100"
                      placeholder="e.g. Weekly Coding Challenge"
                      required
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="relative group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 group-hover:bg-gray-100 resize-none"
                  placeholder="Describe your contest objectives and what participants can expect..."
                />
              </div>

              {/* Rules */}
              <div className="relative group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Rules
                </label>
                <textarea
                  name="rules"
                  value={formData.rules}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 group-hover:bg-gray-100 resize-none"
                  placeholder="List the contest rules and guidelines participants should follow..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Start Time */}
                <div className="relative group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Start Time
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowStartPicker(true)}
                      className="w-full pl-12 pr-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 group-hover:from-gray-100 group-hover:to-gray-150 text-left font-medium text-gray-700 hover:shadow-md transform hover:scale-[1.01]"
                    >
                      {formatDisplayDateTime(startDate, startTime)}
                    </button>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-6 w-6 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400 transform transition-transform duration-200 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* End Time */}
                <div className="relative group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    End Time
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowEndPicker(true)}
                      className="w-full pl-12 pr-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 group-hover:from-gray-100 group-hover:to-gray-150 text-left font-medium text-gray-700 hover:shadow-md transform hover:scale-[1.01]"
                    >
                      {formatDisplayDateTime(endDate, endTime)}
                    </button>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-6 w-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400 transform transition-transform duration-200 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 active:scale-[0.98]"
                >
                  <span className="flex items-center justify-center space-x-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Create Contest</span>
                  </span>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Additional decorative elements */}
        <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full opacity-60"></div>
        <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full opacity-60"></div>
      </div>

      {/* Custom Date Time Pickers */}
      <CustomDateTimePicker
        isVisible={showStartPicker}
        onClose={() => setShowStartPicker(false)}
        selectedDate={startDate}
        selectedTime={startTime}
        onDateTimeChange={handleStartDateTimeChange}
        label="Contest Start Time"
        color="violet"
      />

      <CustomDateTimePicker
        isVisible={showEndPicker}
        onClose={() => setShowEndPicker(false)}
        selectedDate={endDate}
        selectedTime={endTime}
        onDateTimeChange={handleEndDateTimeChange}
        label="Contest End Time"
        color="red"
      />
    </div>
  );
}