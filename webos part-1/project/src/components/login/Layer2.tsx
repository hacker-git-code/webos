import React, { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';

interface Layer2Props {
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  onContinue: () => void;
  email: string;
}

const Layer2: React.FC<Layer2Props> = ({ 
  password, 
  setPassword, 
  onContinue,
  email
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!password.trim()) {
      setError('Password is required');
      return;
    }
    
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    
    setError('');
    onContinue();
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form onSubmit={handleContinue}>
      <div className="space-y-6">
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center">
            <Lock className="text-white" size={32} />
          </div>
        </div>

        <div className="mb-2 text-center">
          <p className="text-gray-600">{email}</p>
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              className={`block w-full px-4 py-3 border ${
                error ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:ring-black focus:border-black transition-colors`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoFocus
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={toggleShowPassword}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400" />
              )}
            </button>
            {error && (
              <p className="mt-1 text-sm text-red-600" id="password-error">
                {error}
              </p>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-black text-white rounded-md font-medium hover:bg-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
        >
          Continue
        </button>

        <div className="text-center">
          <a href="#" className="text-sm text-gray-600 hover:text-black transition-colors">
            Forgot password?
          </a>
        </div>
      </div>
    </form>
  );
};

export default Layer2;