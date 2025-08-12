import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck } from 'lucide-react';

interface Layer3Props {
  verificationCode: string;
  setVerificationCode: React.Dispatch<React.SetStateAction<string>>;
  onComplete: () => void;
}

const Layer3: React.FC<Layer3Props> = ({ 
  verificationCode, 
  setVerificationCode, 
  onComplete 
}) => {
  const [error, setError] = useState<string>('');
  const [remainingTime, setRemainingTime] = useState<number>(120);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Set up the countdown timer
  useEffect(() => {
    if (remainingTime <= 0) return;
    
    const timer = setInterval(() => {
      setRemainingTime(prev => prev - 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [remainingTime]);

  // Format the time as mm:ss
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (value && !/^[0-9]$/.test(value)) return;

    const newVerificationCode = [...verificationCode];
    newVerificationCode[index] = value;
    setVerificationCode(newVerificationCode.join(''));

    // Move focus to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    // Move focus to previous input on backspace
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();
    
    // Only process if the pasted data looks like a verification code
    if (/^\d{6}$/.test(pastedData)) {
      setVerificationCode(pastedData);
      
      // Set focus to the last input
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (verificationCode.length < 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }
    
    setError('');
    onComplete();
  };

  const resendCode = () => {
    // In a real app, you would call an API to resend the code
    setRemainingTime(120);
    alert('New verification code sent!');
  };

  return (
    <form onSubmit={handleVerify}>
      <div className="space-y-6">
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center">
            <ShieldCheck className="text-white" size={32} />
          </div>
        </div>

        <div className="text-center mb-6">
          <p className="text-gray-600">
            We've sent a 6-digit verification code to your email address.
          </p>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 text-center">
            Enter Verification Code
          </label>
          <div className="flex justify-between gap-2 max-w-xs mx-auto">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength={1}
                value={verificationCode[index] || ''}
                onChange={(e) => handleInputChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={index === 0 ? handlePaste : undefined}
                className="w-10 h-12 text-center border border-gray-300 rounded-md focus:ring-black focus:border-black text-lg transition-colors"
                autoFocus={index === 0}
              />
            ))}
          </div>
          {error && (
            <p className="mt-1 text-sm text-red-600 text-center">
              {error}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-black text-white rounded-md font-medium hover:bg-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
          disabled={verificationCode.length < 6}
        >
          Verify & Sign In
        </button>

        <div className="text-center">
          {remainingTime > 0 ? (
            <p className="text-sm text-gray-600">
              Resend code in {formatTime(remainingTime)}
            </p>
          ) : (
            <button
              type="button"
              onClick={resendCode}
              className="text-sm text-gray-600 hover:text-black transition-colors"
            >
              Resend verification code
            </button>
          )}
        </div>
      </div>
    </form>
  );
};

export default Layer3;