import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePreferences } from '../contexts/PreferencesContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { ICONS, PagePath } from '../constants';
import { API_BASE_URL } from '../config';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { preferences, updatePreference, setPreferences } = usePreferences();
  const [email, setEmail] = useState(preferences.email || '');
  const [whatsappNumber, setWhatsappNumber] = useState(preferences.whatsappNumber || '');
  const [emailError, setEmailError] = useState('');
  const [whatsappError, setWhatsappError] = useState('');

  const validateEmail = (value: string): boolean => {
    if (!value) {
      setEmailError('Email is required.');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(value)) {
      setEmailError('Please enter a valid email address.');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validateWhatsappNumber = (value: string): boolean => {
    if (!value) {
      setWhatsappError('WhatsApp number is required.');
      return false;
    }
    if (!/^\+?[1-9]\d{1,14}$/.test(value)) {
      setWhatsappError('Please enter a valid WhatsApp number (e.g., +1234567890).');
      return false;
    }
    setWhatsappError('');
    return true;
  };

  const handleLogin = (e: React.FormEvent) => {
  e.preventDefault();
  const isEmailValid = validateEmail(email);
  const isWhatsappValid = validateWhatsappNumber(whatsappNumber);

  if (isEmailValid && isWhatsappValid) {
    fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, whatsappNumber }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Login failed');
        return res.json();
      })
      .then((data) => {
        const userId = data.userId; // Assuming your backend returns this

  // Save to localStorage
  localStorage.setItem('userId', userId);
        setPreferences(prev => ({
          ...prev,
          email,
          whatsappNumber,
          isWhatsAppConfirmed: true,
        }));
        navigate(PagePath.INTERESTS);
      })
      .catch((error) => {
        console.error('Login API Error:', error);
      });
  }
};

  
  const handleSocialLogin = (provider: string) => {
    console.log(`Attempting ${provider} login...`);
    const mockEmail = provider === 'Google' ? 'user@gmail.com' : 'user@icloud.com';
    updatePreference('email', mockEmail);
    
    // Autofill WhatsApp for demo if empty, and validate it
    let currentWhatsapp = whatsappNumber;
    if (!currentWhatsapp) {
        currentWhatsapp = '+1234567890'; // Default for demo
    }

    if (validateWhatsappNumber(currentWhatsapp)) {
        updatePreference('whatsappNumber', currentWhatsapp);
        updatePreference('isWhatsAppConfirmed', true);
        navigate(PagePath.INTERESTS);
    } else {
        // If WhatsApp number from state (or default) is invalid, prompt user
        setWhatsappError('Please provide a valid WhatsApp number to continue with social login.');
        // Focus the WhatsApp input field if possible, or rely on the error message
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-lightest via-green-50 to-teal-100 p-4 page-fade-enter">
      <div className="bg-white shadow-xl-dark rounded-xl p-8 md:p-12 w-full max-w-lg border border-gray-200/70">
        <div className="text-center mb-10">
          <span className="inline-flex items-center justify-center p-3 bg-primary text-white rounded-full shadow-lg mb-5 ring-4 ring-primary-lighter">
            {ICONS.WHATSAPP_LOGO}
          </span>
          <h1 className="text-4xl font-bold text-gray-800">Welcome Back!</h1>
          <p className="text-gray-600 mt-2.5 text-lg">Sign in to get your hyper-personalized updates.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <Input
            id="email"
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => { setEmail(e.target.value); if(emailError) validateEmail(e.target.value); }}
            onBlur={() => validateEmail(email)}
            icon={<span className="text-gray-400">{ICONS.EMAIL}</span>}
            error={emailError}
            required
            inputClassName="bg-gray-50 text-gray-900 border-gray-300 hover:bg-white focus:bg-white focus:border-primary focus:ring-primary"
          />
          <Input
            id="whatsappNumber"
            label="WhatsApp Number"
            type="tel"
            placeholder="+1234567890"
            value={whatsappNumber}
            onChange={(e) => { setWhatsappNumber(e.target.value); if(whatsappError) validateWhatsappNumber(e.target.value); }}
            onBlur={() => validateWhatsappNumber(whatsappNumber)}
            icon={<span className="text-gray-400">{ICONS.PHONE}</span>}
            error={whatsappError}
            required
            inputClassName="bg-gray-50 text-gray-900 border-gray-300 hover:bg-white focus:bg-white focus:border-primary focus:ring-primary"
          />
          <p className="text-xs text-gray-500 text-center pt-1">
            We use your WhatsApp number to deliver personalized updates. Standard rates may apply.
          </p>

          <Button type="submit" variant="primary" size="lg" className="w-full !py-3.5">
            Continue to Personalization {ICONS.ARROW_RIGHT}
          </Button>
        </form>

        <div className="mt-10">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white text-gray-500 font-medium">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 !py-3" onClick={() => handleSocialLogin('Google')}>
              {ICONS.GOOGLE} Google
            </Button>
            <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 !py-3" onClick={() => handleSocialLogin('Apple')}>
             {ICONS.APPLE} Apple
            </Button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;