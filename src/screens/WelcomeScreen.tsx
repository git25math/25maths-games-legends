import { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, User, Info, LogIn, LogOut } from 'lucide-react';
import type { Language, Character } from '../types';
import { translations } from '../i18n/translations';
import { CharacterCard } from '../components/CharacterCard';
import { CHARACTERS } from '../data/characters';

export const WelcomeScreen = ({
  lang,
  selectedCharId,
  onCharSelect,
  onStart,
  isLoggedIn,
  onLogin,
  onSignup,
  onLogout,
  onGuest,
}: {
  lang: Language;
  selectedCharId: string | null;
  onCharSelect: (id: string) => void;
  onStart: () => void;
  isLoggedIn: boolean;
  onLogin: (email: string, password: string) => Promise<{ error: any }>;
  onSignup: (email: string, password: string) => Promise<{ error: any }>;
  onLogout: () => void;
  onGuest: () => void;
}) => {
  const t = translations[lang];
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const handleAuth = async () => {
    setAuthError('');
    const fn = isSignup ? onSignup : onLogin;
    const { error } = await fn(email, password);
    if (error) {
      setAuthError(isSignup ? t.signupError : t.loginError);
    } else {
      setShowAuthForm(false);
      setEmail('');
      setPassword('');
    }
  };

  return (
    <motion.div
      key="welcome"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      className="flex flex-col items-center justify-center min-h-[80vh] text-center"
    >
      <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ repeat: Infinity, duration: 4 }} className="mb-6">
        <div className="bg-indigo-600 p-6 rounded-[2.5rem] shadow-2xl shadow-indigo-500/50">
          <Sparkles size={80} className="text-white" />
        </div>
      </motion.div>
      <h1 className="text-7xl md:text-9xl font-black text-white mb-4 tracking-tighter">
        MATH<span className="text-indigo-500">QUEST</span>
      </h1>
      <p className="text-2xl text-slate-400 mb-12 font-medium">{t.subtitle}</p>

      <div className="w-full max-w-5xl">
        <h2 className="text-3xl font-black text-white mb-10 flex items-center justify-center gap-3">
          <User className="text-indigo-400" />
          {t.chooseHero}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          {CHARACTERS.map(char => (
            <CharacterCard
              key={char.id}
              character={char}
              isSelected={selectedCharId === char.id}
              onSelect={() => onCharSelect(char.id)}
              lang={lang}
            />
          ))}
        </div>

        <div className="flex flex-col items-center gap-6">
          <button
            disabled={!selectedCharId || !isLoggedIn}
            onClick={onStart}
            className={`px-16 py-6 rounded-3xl text-3xl font-black transition-all shadow-2xl ${
              selectedCharId && isLoggedIn ? 'bg-yellow-400 hover:bg-yellow-300 text-slate-900 scale-105' : 'bg-slate-800 text-slate-600 cursor-not-allowed'
            }`}
          >
            {t.startJourney}
          </button>
          {!isLoggedIn && selectedCharId && (
            <p className="text-amber-400/80 text-sm font-bold">{lang === 'zh' ? '请先登录或选择游客模式' : 'Please login or use guest mode first'}</p>
          )}

          {!isLoggedIn && !showAuthForm && (
            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
              <Info className="text-indigo-400" size={20} />
              <p className="text-white/60 text-sm font-bold">{t.loginToPlay}</p>
              <button
                onClick={() => setShowAuthForm(true)}
                className="px-4 py-2 bg-white text-slate-900 font-black rounded-xl text-xs hover:bg-slate-100 transition-all"
              >
                {t.loginBtn}
              </button>
              <button
                onClick={onGuest}
                className="px-4 py-2 bg-slate-700 text-white font-bold rounded-xl text-xs hover:bg-slate-600 transition-all"
              >
                {t.guestMode}
              </button>
            </div>
          )}

          {!isLoggedIn && showAuthForm && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 w-full max-w-sm space-y-4"
            >
              <input
                type="email"
                placeholder={t.emailPlaceholder}
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 outline-none focus:border-indigo-400"
              />
              <input
                type="password"
                placeholder={t.passwordPlaceholder}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 outline-none focus:border-indigo-400"
                onKeyDown={e => e.key === 'Enter' && handleAuth()}
              />
              {authError && <p className="text-rose-400 text-xs font-bold">{authError}</p>}
              <button
                onClick={handleAuth}
                className="w-full py-3 bg-indigo-600 text-white font-black rounded-xl hover:bg-indigo-500 transition-all"
              >
                {isSignup ? t.signupSubmit : t.loginSubmit}
              </button>
              <button
                onClick={() => setIsSignup(!isSignup)}
                className="w-full text-white/50 text-xs font-bold hover:text-white/80 transition-colors"
              >
                {isSignup ? t.switchToLogin : t.switchToSignup}
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
