import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function OtpVerification () {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = [useRef(), useRef(), useRef(), useRef()];

  const navigate = useNavigate();

  const email = sessionStorage.getItem('email');

  const handleInputChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    if (value && index < 3)
      inputRefs[index + 1].current?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0)
      inputRefs[index - 1].current?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 4);

    if (!/^\d+$/.test(pastedData)) return;
    
    const newOtp = pastedData.split('').concat(['', '', '', '']).slice(0, 4);
    setOtp(newOtp);
    
    const nextEmptyIndex = newOtp.findIndex(digit => digit === '');
    const focusIndex = nextEmptyIndex === -1 ? 3 : Math.min(nextEmptyIndex, 3);
    inputRefs[focusIndex].current?.focus();
  };

  const handleVerify = async () => {

    const otpCode = otp.join('');

    if (otpCode.length !== 4) {
      setError('Please enter all 4 digits');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:4000/api/auth/otp-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otpCode })
      });

      const data = await response.json();

      console.log(data);

      if (!response.ok) {
        console.error(data.error);
        window.alert(data.error);
        setError(data.error);
        return;
      }

      navigate ('/');
    }
    
    catch (error) {
      setError('Verification failed. Please try again.');
    }
    
    finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f4ff] to-[#e0e7ff] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-xl">

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-[#111827] mb-2">Verify Your Email</h2>
          <p className="text-gray-500">
            We've sent a 4-digit code to {' '}
            <span className="font-semibold text-[#111827]">{email}</span>
          </p>
        </div>

        <div className="mb-6">
          <div className="flex justify-center gap-3 mb-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={inputRefs[index]}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                className={`w-14 h-14 text-center text-2xl font-bold rounded-lg outline-none transition-colors border-2
                  ${
                    error
                      ? "border-red-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200"
                      : digit
                      ? "border-indigo-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200"
                      : "border-gray-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200"
                  }`}
              />
            ))}
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}
        </div>

        <button
          onClick={handleVerify}
            disabled={isLoading || otp.some(digit => !digit)}
            className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors mb-4 ${
              isLoading || otp.some(digit => !digit)
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Verifying...
              </div>
            ) : (
              'Verify Email'
            )}
        </button>

      </div>
    </div>
  );
}