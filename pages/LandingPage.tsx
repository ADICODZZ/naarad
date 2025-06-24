
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePreferences } from '../contexts/PreferencesContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { ICONS, PagePath } from '../constants';
import WhatsAppPreview from '../components/common/WhatsAppPreview';
import { SampleMessage } from '../types';
import { API_BASE_URL } from '../config';
// SVG Section Divider Component
const SectionDivider: React.FC<{
  fillColor?: string;
  className?: string;
  type?: 'curve' | 'angle-top-left' | 'angle-top-right' | 'wave';
}> = ({
  fillColor = "fill-gray-900", // Default to a dark color similar to section BGs
  className = "",
  type = 'curve'
}) => {
  if (type === 'angle-top-left') {
    return (
      <div className={`relative ${className}`} style={{ lineHeight: 0 }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" preserveAspectRatio="none" className={`w-full h-auto block ${fillColor}`}>
          <polygon points="0,100 1440,0 1440,100" />
        </svg>
      </div>
    );
  }
  if (type === 'angle-top-right') {
    return (
      <div className={`relative ${className}`} style={{ lineHeight: 0 }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" preserveAspectRatio="none" className={`w-full h-auto block ${fillColor}`}>
          <polygon points="0,0 1440,100 0,100" />
        </svg>
      </div>
    );
  }
  if (type === 'wave') {
    return (
      <div className={`relative ${className}`} style={{ lineHeight: 0 }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" preserveAspectRatio="none" className={`w-full h-auto block ${fillColor}`}>
          <path d="M0,50 C360,100 1080,0 1440,50 L1440,100 L0,100 Z"></path>
        </svg>
      </div>
    );
  }
  // Default 'curve'
  return (
    <div className={`relative ${className}`} style={{ lineHeight: 0, transform: 'translateY(1px)' }}> {/* Slight Y translation to hide seam */}
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" preserveAspectRatio="none" className={`w-full h-auto block ${fillColor}`}>
        <path d="M1440,21.2109375 C1260,21.2109375 1080,80 720,80 C360,80 180,21.2109375 0,21.2109375 L0,0 L1440,0 L1440,21.2109375 Z"></path>
      </svg>
    </div>
  );
};


const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string; delay?: string }> = ({ icon, title, description, delay = "0" }) => (
  <div 
    className={`bg-gradient-to-br from-gray-850 to-gray-900 p-6 md:p-8 rounded-2xl shadow-2xl-dark border border-white/10 transform transition-all duration-300 hover:scale-105 hover:shadow-glow-primary wow animate__animated animate__fadeInUp group`} 
    data-wow-delay={`${delay}s`}
  >
    <div className="flex items-center justify-center w-16 h-16 bg-primary/20 text-primary rounded-full mx-auto mb-6 text-3xl shadow-lg border-2 border-primary/30 group-hover:bg-primary group-hover:text-white transition-all duration-300">
      {icon}
    </div>
    <h3 className="text-xl md:text-2xl font-semibold text-white mb-3 text-center">{title}</h3>
    <p className="text-primary-lighter/70 text-sm md:text-base text-center leading-relaxed">{description}</p>
  </div>
);

const HowItWorksStep: React.FC<{ icon: React.ReactNode; title: string; description: string; stepNumber: number; delay?: string }> = ({ icon, title, description, stepNumber, delay = "0" }) => (
  <div 
    className={`text-center md:text-left p-6 bg-white/5 backdrop-blur-sm rounded-xl shadow-xl-dark border border-white/10 hover:border-primary/30 transition-all duration-300 wow animate__animated animate__fadeInUp group`}
    data-wow-delay={`${delay}s`}
  >
    <div className="flex flex-col md:flex-row items-center">
      <div className="flex-shrink-0 w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-3xl font-bold shadow-lg mr-0 md:mr-6 mb-4 md:mb-0 border-2 border-primary-dark group-hover:scale-110 transition-transform duration-300">
        {stepNumber}
      </div>
      <div className="mt-2 md:mt-0">
        <h3 className="text-xl lg:text-2xl font-semibold text-white mb-2">{title}</h3>
        <p className="text-primary-lighter/70 text-sm lg:text-base leading-relaxed">{description}</p>
      </div>
    </div>
  </div>
);


const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { preferences, updatePreference, setPreferences } = usePreferences();

   useEffect(() => {
    const isAuthenticated = preferences.email !== '' && preferences.whatsappNumber !== '';
    if (isAuthenticated) {
      navigate(PagePath.DASHBOARD, { replace: true });
    }
  }, [preferences, navigate]);

  const [email, setEmail] = useState(preferences.email || '');
  const [whatsappNumber, setWhatsappNumber] = useState(preferences.whatsappNumber || '');
  const [emailError, setEmailError] = useState('');
  const [whatsappError, setWhatsappError] = useState('');

  const loginSectionRef = useRef<HTMLDivElement>(null);

  const scrollToLogin = () => {
    loginSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

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
    
    let currentWhatsapp = whatsappNumber;
    if (!currentWhatsapp) {
        currentWhatsapp = '+1234567890'; // Default for demo
    }

    if (validateWhatsappNumber(currentWhatsapp)) {
        updatePreference('whatsappNumber', currentWhatsapp);
        updatePreference('isWhatsAppConfirmed', true);
        navigate(PagePath.INTERESTS);
    } else {
        setWhatsappError('Please provide a valid WhatsApp number to continue with social login.');
        loginSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const exampleLandingPageMessage: SampleMessage = {
      summaryText: "🚀 Your Morning Tech Digest:\n\nGoogle teases 'Phoenix-7B', a new AI model set to redefine search. Apple's AR glasses could hit shelves next quarter! 🕶️\n\n🔥 Hot from YouTube: MKBHD dives into 'Pixel Fold 3' leaks - game-changer?",
      imageUrl: "💡", 
      actionText: "Read Full Digest"
  };

  useEffect(() => {
    const WOW = (window as any).WOW;
    if (WOW) {
      new WOW({
        live: false,
        boxClass: 'wow',
        animateClass: 'animate__animated',
        offset: 50,
        mobile: true,
      }).init();
    }
  }, []);


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-secondary-dark to-gray-900 text-white page-fade-enter overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent z-0"></div>
        {/* Enhanced Decorative Blobs */}
        <div className="absolute -top-40 -left-60 w-[500px] h-[500px] bg-primary/20 rounded-full filter blur-3xl opacity-30 animate-slow-pulse"></div>
        <div className="absolute -bottom-40 -right-52 w-[450px] h-[450px] bg-accent-teal/20 rounded-full filter blur-3xl opacity-30 animate-slow-pulse animation-delay-2000"></div>

        <div className="container mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start mb-4 wow animate__animated animate__fadeInDown" data-wow-delay="0s">
                <span className="inline-flex items-center justify-center p-3 mr-3 bg-primary text-white rounded-2xl shadow-2xl ring-4 ring-primary/30">
                  {ICONS.WHATSAPP_LOGO}
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-primary tracking-wide">
                  Naarad AI
                </h2>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-5 tracking-tight wow animate__animated animate__fadeInDown" data-wow-delay="0.2s">
                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-primary-lighter via-white to-primary-light">Stop Drowning</span>
                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-primary-light via-white to-primary-lighter mt-1">in Information.</span>
              </h1>
              <p className="text-lg md:text-xl text-primary-lighter/80 max-w-xl mx-auto lg:mx-0 mb-6 leading-relaxed wow animate__animated animate__fadeInUp" data-wow-delay="0.3s">
                <strong className="font-semibold text-white">Naarad AI</strong> delivers hyper-personalized updates for sports, news, movies, YouTube, and your unique interests, straight to your WhatsApp.
              </p>
              <p className="text-xl md:text-2xl text-primary font-semibold max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed wow animate__animated animate__fadeInUp" data-wow-delay="0.4s">
                Never waste a second on pointless news again.
              </p>
              <div className="flex justify-center lg:justify-start wow animate__animated animate__fadeInUp" data-wow-delay="0.5s">
                <Button 
                  onClick={scrollToLogin} 
                  variant="primary" 
                  size="lg" 
                  className="!py-4 !px-10 text-lg shadow-xl hover:shadow-glow-primary transform hover:scale-105"
                >
                  Create Your Feed Now {ICONS.ARROW_RIGHT}
                </Button>
              </div>
            </div>
            <div className="mt-10 lg:mt-0 wow animate__animated animate__fadeInRight" data-wow-delay="0.4s">
                <div className="relative transform lg:scale-110 xl:scale-100 lg:hover:scale-115 transition-transform duration-300 animate-float">
                     <div className="absolute -inset-2 bg-gradient-to-br from-primary/30 to-accent-teal/30 rounded-3xl blur-lg opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                    <div className="relative shadow-2xl-dark rounded-2xl border-2 border-white/10">
                         <WhatsAppPreview message={exampleLandingPageMessage} />
                    </div>
                </div>
            </div>
          </div>
        </div>
      </section>
      
      <SectionDivider fillColor="fill-gray-900" type="curve" />

      {/* How It Works Section */}
      <section className="py-16 md:py-24 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-primary-lighter wow animate__animated animate__fadeInUp">Simple Steps to a Smarter Feed</h2>
          <p className="text-center text-primary-lighter/70 mb-12 md:mb-16 max-w-2xl mx-auto wow animate__animated animate__fadeInUp" data-wow-delay="0.1s">Unlock a world of curated content in just a few clicks. It's quick, easy, and incredibly powerful.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
            <HowItWorksStep stepNumber={1} icon={ICONS.USER} title="Sign Up & Connect" description="Quickly sign up with your email and WhatsApp number. It's secure and fast." delay="0.2s" />
            <HowItWorksStep stepNumber={2} icon={ICONS.STAR} title="Tailor Your Interests" description="Choose from diverse categories like sports, news, movies, and YouTube, or add your custom topics." delay="0.4s" />
            <HowItWorksStep stepNumber={3} icon={ICONS.CLOCK} title="Set Your Pace" description="Decide update frequency: real-time alerts, daily digests, or a custom schedule that suits you." delay="0.6s" />
            <HowItWorksStep stepNumber={4} icon={ICONS.WHATSAPP} title="Enjoy Smart Updates" description="Receive concise, relevant information directly in WhatsApp. Pure signal, no noise." delay="0.8s" />
          </div>
        </div>
      </section>

      <SectionDivider fillColor="fill-gray-950" type="angle-top-left" />


      {/* Features Section */}
      <section className="py-16 md:py-24 px-4 bg-gray-950">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 md:mb-16 text-primary-lighter wow animate__animated animate__fadeInUp">Why You'll Love It</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
            <FeatureCard icon={ICONS.LIGHTBULB} title="Truly Personal" description="Our AI understands your preferences deeply, curating updates that genuinely matter to you." delay="0.1s" />
            <FeatureCard icon={ICONS.CHECK} title="Effortless & Efficient" description="Stay informed without the endless scrolling. Get key insights and news delivered concisely." delay="0.2s" />
            <FeatureCard icon={<div className="flex">{ICONS.SPORTS}{ICONS.NEWS}</div>} title="All Interests, One Place" description="From global news and sports leagues to niche hobbies and YouTube channels, we consolidate it all." delay="0.3s" />
            <FeatureCard icon={ICONS.BELL} title="Never Miss Out" description="Timely alerts on topics you care about. Stop FOMO and stay ahead with information that counts." delay="0.4s" />
          </div>
        </div>
      </section>
      
      <SectionDivider fillColor="fill-gray-900" type="wave" />


      {/* Login Section */}
      <section ref={loginSectionRef} className="py-16 md:py-24 px-4 bg-gray-900">
        <div className="container mx-auto">
          <div className="bg-gradient-to-br from-gray-850 to-gray-950 backdrop-blur-lg shadow-2xl-dark rounded-2xl p-8 md:p-12 w-full max-w-lg mx-auto border border-white/10 wow animate__animated animate__fadeInUp">
            <div className="text-center mb-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-primary-lighter">Ready to Get Started?</h2>
              <p className="text-primary-lighter/80 mt-3 text-lg">Sign in or create an account to personalize your feed.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-7">
              <Input
                id="email"
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); if(emailError) validateEmail(e.target.value); }}
                onBlur={() => validateEmail(email)}
                icon={<span className="text-primary">{ICONS.EMAIL}</span>}
                error={emailError}
                required
                inputClassName="bg-white/5 text-white placeholder-gray-400/60 border-white/20 focus:border-primary focus:ring-primary"
                labelClassName="!text-primary-lighter/90 !font-medium"
              />
              <Input
                id="whatsappNumber"
                label="WhatsApp Number"
                type="tel"
                placeholder="+1234567890"
                value={whatsappNumber}
                onChange={(e) => { setWhatsappNumber(e.target.value); if(whatsappError) validateWhatsappNumber(e.target.value); }}
                onBlur={() => validateWhatsappNumber(whatsappNumber)}
                icon={<span className="text-primary">{ICONS.PHONE}</span>}
                error={whatsappError}
                required
                inputClassName="bg-white/5 text-white placeholder-gray-400/60 border-white/20 focus:border-primary focus:ring-primary"
                labelClassName="!text-primary-lighter/90 !font-medium"
              />
              <p className="text-xs text-primary-lighter/60 text-center pt-1">
                We use your WhatsApp number to deliver personalized updates. Standard rates may apply.
              </p>

              <Button type="submit" variant="primary" size="lg" className="w-full mt-8 !py-3.5 shadow-lg hover:shadow-glow-primary transform hover:scale-105">
                Continue to Personalization {ICONS.ARROW_RIGHT}
              </Button>
            </form>

            <div className="">
              {/* <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-gray-900 text-primary-lighter/80 font-medium rounded-md">Or continue with</span>
                </div>
              </div> */}

              
                 {/* <Button 
                    variant="outline" 
                    className="w-full border-white/30 text-white hover:bg-white/10 hover:border-primary !py-3 transform hover:scale-105" 
                    onClick={() => handleSocialLogin('Google')}
                  >
                  {ICONS.GOOGLE} Google
                </Button>
                <Button 
                    variant="outline" 
                    className="w-full border-white/30 text-white hover:bg-white/10 hover:border-primary !py-3 transform hover:scale-105" 
                    onClick={() => handleSocialLogin('Apple')}
                >
                  {ICONS.APPLE} Apple
                </Button> */}
              
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center border-t border-white/10 bg-gray-950">
        <p className="text-primary-lighter/60 text-sm">&copy; {new Date().getFullYear()} Naarad AI. Stay Informed, Your Way.</p>
      </footer>
    </div>
  );
};

export default LandingPage;