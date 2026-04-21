import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAppStore } from '../store';
import { Shield, User, UserCog, ArrowLeft, Loader2, AlertCircle, ChevronRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { loginApi } from '../api/auth';

export function LoginPage() {
  const [selectedRole, setSelectedRole] = useState(null); // 'tarbiyachi', 'security', 'mudir'
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const setUser = useAppStore((state) => state.setUser);
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setLoginId('');
    setPassword('');
    setErrorMsg('');
  };

  const handleBack = () => {
    setSelectedRole(null);
    setErrorMsg('');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginId || !password) {
      setErrorMsg("Iltimos, barcha maydonlarni to'ldiring!");
      return;
    }
    
    setIsLoading(true);
    setErrorMsg('');

    try {
      const response = await loginApi(selectedRole, loginId, password);
      if (response.success) {
        setUser(response.user);
        navigate('/');
      }
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const renderRoleSelection = () => (
    <div className="space-y-8">
      <div className="text-center mb-10">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4"
        >
          <Sparkles className="w-3 h-3" />
          Xush kelibsiz
        </motion.div>
        <h2 className="text-4xl font-black text-gray-900 mb-3 tracking-tighter">Tizimga kirish</h2>
        <p className="text-gray-500 font-medium text-sm">Davom etish uchun o'z vazifangizni tanlang</p>
      </div>

      <div className="grid gap-4">
        {[
          { id: 'tarbiyachi', name: 'Tarbiyachi', desc: "Guruhni boshqarish", icon: User, color: 'from-blue-500 to-indigo-600', delay: 0.1 },
          { id: 'security', name: 'Xavfsizlik', desc: "Hudud nazorati", icon: Shield, color: 'from-emerald-500 to-teal-600', delay: 0.2 },
          { id: 'mudir', name: 'Mudir', desc: "To'liq statistika", icon: UserCog, color: 'from-purple-500 to-violet-600', delay: 0.3 }
        ].map((role, idx) => (
          <motion.button
            key={role.id}
            initial={{ x: idx % 2 === 0 ? -20 : 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: role.delay, duration: 0.5 }}
            whileHover={{ x: 10, scale: 1.02 }}
            onClick={() => handleRoleSelect(role.id)}
            className="w-full flex items-center gap-5 p-6 glass rounded-[2rem] hover:shadow-2xl hover:shadow-primary/10 transition-all group relative overflow-hidden text-left"
          >
            <div className={`w-16 h-16 bg-gradient-to-br ${role.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform flex-shrink-0`}>
              <role.icon className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xl font-black text-gray-900 tracking-tight">{role.name}</div>
              <div className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1 opacity-70">{role.desc}</div>
            </div>
            <div className="p-2 bg-gray-50 rounded-xl opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0">
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );

  const renderAuthForm = () => {
    const roles = {
      tarbiyachi: { label: 'Tarbiyachi', color: 'blue', icon: User },
      security: { label: 'Xavfsizlik', color: 'emerald', icon: Shield },
      mudir: { label: 'Mudir', color: 'purple', icon: UserCog }
    };
    const current = roles[selectedRole];

    return (
      <div className="space-y-6">
        <button 
          onClick={handleBack}
          className="group flex items-center gap-2 text-gray-400 hover:text-gray-900 transition-all mb-4 px-2 py-1 px-3 glass rounded-full w-fit text-[10px] font-black uppercase tracking-widest"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          Orqaga
        </button>

        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0.5, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            className={`mx-auto w-24 h-24 rounded-3xl flex items-center justify-center mb-6 bg-${current.color}-50 shadow-inner`}
          >
            <current.icon className={`w-12 h-12 text-${current.color}-600`} />
          </motion.div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Xush kelibsiz, {current.label}</h2>
          <p className="text-sm text-gray-400 font-medium mt-2">Tasdiqlash uchun ma'lumotlarni kiriting</p>
        </div>

        {errorMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm font-bold text-red-800 leading-snug">{errorMsg}</p>
          </motion.div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] block pl-1">Login</label>
            <input
              type="text"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-[1.5rem] focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-bold text-gray-900"
              placeholder="Foydalanuvchi nomi"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] block pl-1">Parol</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-[1.5rem] focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-bold text-gray-900"
              placeholder="••••••••"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className={`w-full py-5 vibrant-gradient text-white font-black rounded-[1.5rem] shadow-2xl shadow-primary/30 transition-all flex items-center justify-center gap-3 mt-4 ${isLoading ? 'opacity-70 pointer-events-none' : ''}`}
          >
            {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
              <>
                <span>Kirish</span>
                <ChevronRight className="w-5 h-5" />
              </>
            )}
          </motion.button>
        </form>
      </div>
    );
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 lg:p-8 bg-[#fafbff] overflow-hidden font-sans">
      {/* Dynamic Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ x: [0, 100, 0], y: [0, 50, 0], rotate: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[10%] -left-[5%] w-[50vw] h-[50vw] bg-blue-100/40 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ x: [0, -80, 0], y: [0, 100, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[0%] -right-[10%] w-[45vw] h-[45vw] bg-purple-100/30 rounded-full blur-[100px]" 
        />
        <motion.div 
          animate={{ y: [0, -100, 0], scale: [1, 1.5, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] left-[30%] w-[30vw] h-[30vw] bg-indigo-50/50 rounded-full blur-[150px]" 
        />
      </div>

      <div className="w-full max-w-7xl grid lg:grid-cols-2 gap-12 lg:gap-24 items-center relative z-10 px-4 sm:px-8">
        
        {/* Left Side - Asymmetric Branding */}
        <div className="text-center lg:text-left space-y-10 lg:p-8 order-2 lg:order-1 pt-8 lg:pt-0">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-4 px-6 py-3 glass rounded-full shadow-2xl shadow-gray-200/40 border-white/60"
          >
            <div className="p-2 border-none vibrant-gradient rounded-xl shadow-lg">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-black text-gray-900 tracking-tighter">BogchaGuard <span className="text-primary">AI</span></span>
          </motion.div>
          
          <div className="space-y-6">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-6xl lg:text-7xl font-black text-gray-900 leading-[1.05] tracking-tight text-balance"
            >
              Farzandlar <br className="hidden lg:block"/>
              Xavfsizligi <br className="hidden lg:block"/>
              <span className="text-primary">Intellektda</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl font-medium text-gray-400 max-w-lg mx-auto lg:mx-0 leading-relaxed"
            >
              Sun'iy intellekt yordamida bog'cha jarayonlarini real vaqtda monitoring qilish va kutilmagan hodisalarni oldindan aniqlash.
            </motion.p>
          </div>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 lg:gap-8 pt-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="glass p-8 rounded-[2.5rem] shadow-2xl shadow-blue-500/10 hover:-translate-y-2 transition-transform"
            >
              <div className="text-5xl font-black text-primary mb-2">98<span className="text-3xl">%+</span></div>
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Aniqlik</div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 }}
              className="glass p-8 rounded-[2.5rem] shadow-2xl shadow-emerald-500/10 hover:-translate-y-2 transition-transform"
            >
              <div className="text-5xl font-black text-emerald-500 mb-2">&lt;2<span className="text-3xl">s</span></div>
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Tezkorlik</div>
            </motion.div>
          </div>
        </div>

        {/* Right Side - Floating Auth Panel */}
        <div className="order-1 lg:order-2 w-full max-w-xl mx-auto relative group">
          <motion.div 
            initial={{ opacity: 0, rotate: 2 }}
            animate={{ opacity: 1, rotate: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute -inset-6 bg-gradient-to-tr from-primary/10 via-purple-500/5 to-transparent rounded-[4rem] blur-3xl"
          ></motion.div>
          <motion.div 
            layout
            className="glass rounded-[3rem] shadow-2xl shadow-gray-200/50 p-10 sm:p-14 relative overflow-hidden min-h-[600px] flex flex-col justify-center border-white/80"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedRole ? 'auth' : 'selection'}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.4 }}
              >
                {!selectedRole ? renderRoleSelection() : renderAuthForm()}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
    );
}

