import React, { useState } from 'react';
import { User, Check } from 'lucide-react';

interface Layer1Props {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  rememberMe: boolean;
  setRememberMe: React.Dispatch<React.SetStateAction<boolean>>;
  onContinue: () => void;
}

const Layer1: React.FC<Layer1Props> = ({ 
  email, 
  setEmail, 
  rememberMe, 
  setRememberMe, 
  onContinue 
}) => {
  const [error, setError] = useState<string>('');

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    
    if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setError('');
    onContinue();
  };

  return (
    <form onSubmit={handleContinue}>
      <div className="space-y-6">
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center">
            <User className="text-white" size={32} />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <div className="relative">
            <input
              id="email"
              type="email"
              className={`block w-full px-4 py-3 border ${
                error ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:ring-black focus:border-black transition-colors`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              autoFocus
            />
            {error && (
              <p className="mt-1 text-sm text-red-600" id="email-error">
                {error}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center">
          <button
            type="button"
            className={`flex items-center justify-center w-5 h-5 border ${
              rememberMe ? 'bg-black border-black' : 'border-gray-300'
            } rounded focus:outline-none focus:ring-2 focus:ring-black mr-2 transition-colors`}
            onClick={() => setRememberMe(!rememberMe)}
            aria-checked={rememberMe}
            role="checkbox"
          >
            {rememberMe && <Check className="text-white" size={12} />}
          </button>
          <label className="text-sm text-gray-700" onClick={() => setRememberMe(!rememberMe)}>
            Remember me
          </label>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-black text-white rounded-md font-medium hover:bg-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
        >
          Continue
        </button>

        <div className="text-center">
          <a href="#" className="text-sm text-gray-600 hover:text-black transition-colors">
            Don't have an account? Sign up
          </a>
        </div>
      </div>
    </form>
  );
};

export default Layer1;