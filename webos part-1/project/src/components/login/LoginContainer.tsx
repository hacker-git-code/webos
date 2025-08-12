import React, { useState } from 'react';
import Layer1 from './Layer1';
import Layer2 from './Layer2';
import Layer3 from './Layer3';
import { ChevronLeft } from 'lucide-react';

const LoginContainer: React.FC = () => {
  const [currentLayer, setCurrentLayer] = useState<number>(1);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [verificationCode, setVerificationCode] = useState<string>('');

  const goToNextLayer = () => {
    setCurrentLayer(prev => Math.min(prev + 1, 3));
  };

  const goToPreviousLayer = () => {
    setCurrentLayer(prev => Math.max(prev - 1, 1));
  };

  const handleLogin = () => {
    // In a real app, you would handle the login logic here
    console.log('Login successful!', { email, password, verificationCode, rememberMe });
    alert('Login successful!');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-black">
              {currentLayer === 1 ? 'Sign In' : 
               currentLayer === 2 ? 'Enter Password' : 
               'Verification'}
            </h1>
            {currentLayer > 1 && (
              <button
                onClick={goToPreviousLayer}
                className="p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
                aria-label="Go back"
              >
                <ChevronLeft size={20} />
              </button>
            )}
          </div>

          <div className="mb-6">
            <div className="flex gap-1 mb-8">
              {[1, 2, 3].map((step) => (
                <div 
                  key={step}
                  className={`h-1 flex-1 rounded-full ${
                    step <= currentLayer ? 'bg-black' : 'bg-gray-200'
                  } transition-all duration-300`}
                ></div>
              ))}
            </div>

            {currentLayer === 1 && (
              <Layer1 
                email={email} 
                setEmail={setEmail} 
                rememberMe={rememberMe}
                setRememberMe={setRememberMe}
                onContinue={goToNextLayer}
              />
            )}
            
            {currentLayer === 2 && (
              <Layer2 
                password={password} 
                setPassword={setPassword} 
                onContinue={goToNextLayer}
                email={email}
              />
            )}
            
            {currentLayer === 3 && (
              <Layer3 
                verificationCode={verificationCode} 
                setVerificationCode={setVerificationCode} 
                onComplete={handleLogin}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginContainer;