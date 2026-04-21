import { Outlet, useNavigate, useLocation } from 'react-router';
import { useAppStore } from '../store';
import { useEffect, useState } from 'react';
import { 
  Shield, Video, AlertCircle, Users, UsersRound, FileText, 
  Settings, Bell, LogOut, Menu, X, Home, ChevronRight 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function MainLayout() {
  const user = useAppStore((state) => state.user);
  const setUser = useAppStore((state) => state.setUser);
  const alerts = useAppStore((state) => state.alerts);
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  if (!user) return null;

  const handleLogout = () => {
    setUser(null);
    navigate('/login');
  };

  const navigation = [
    { name: 'Asosiy oyna', path: '/', icon: Home, roles: ['tarbiyachi', 'security', 'mudir'] },
    { name: 'Kameralar', path: '/cameras', icon: Video, roles: ['tarbiyachi', 'security', 'mudir'] },
    { name: 'Hodisalar', path: '/events', icon: AlertCircle, roles: ['tarbiyachi', 'security', 'mudir'] },
    { name: 'Bolalar', path: '/children', icon: Users, roles: ['tarbiyachi', 'mudir'] },
    { name: 'Xodimlar', path: '/staff', icon: UsersRound, roles: ['mudir'] },
    { name: 'Hisobotlar', path: '/reports', icon: FileText, roles: ['mudir'] },
    { name: 'Sozlamalar', path: '/settings', icon: Settings, roles: ['mudir'] },
  ];

  const visibleNav = navigation.filter((item) => item.roles.includes(user.role));
  const unreadAlertsCount = alerts.length;
  const isActive = (path) => location.pathname === path;

  const roleGradient = {
    tarbiyachi: 'from-blue-600 to-indigo-700',
    security: 'from-emerald-600 to-teal-700',
    mudir: 'from-purple-600 to-violet-700',
  };
  const grad = roleGradient[user.role] || 'from-blue-600 to-indigo-700';

  return (
    <div className="min-h-screen bg-[#fafbff] flex relative overflow-hidden font-sans">
      {/* Abstract Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <motion.div 
          animate={{ x: [0, 40, 0], y: [0, -30, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[10%] -left-[5%] w-[40vw] h-[40vw] bg-blue-100/50 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ x: [0, -50, 0], y: [0, 60, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[40%] -right-[10%] w-[35vw] h-[35vw] bg-purple-100/40 rounded-full blur-[100px]" 
        />
        <motion.div 
          animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[20%] left-[20%] w-[50vw] h-[50vw] bg-indigo-50/60 rounded-full blur-[150px]" 
        />
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 flex flex-col
        glass border-r border-white/40
        transform transition-transform duration-500 ease-in-out
        lg:translate-x-0 lg:z-30
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3.5"
          >
            <div className="w-11 h-11 vibrant-gradient rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/20">
              <Shield className="w-6 h-6 text-white"/>
            </div>
            <div>
              <span className="text-gray-900 font-black text-xl leading-none block tracking-tighter">BogchaGuard</span>
              <span className="text-primary text-[10px] font-bold uppercase tracking-[0.2em]">Creative AI</span>
            </div>
          </motion.div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-gray-900 p-2">
            <X className="w-6 h-6"/>
          </button>
        </div>

        {/* User Card */}
        <div className="mx-4 mb-8 p-4 bg-white/40 backdrop-blur-md rounded-3xl border border-white/60 shadow-lg shadow-gray-200/20 group hover:shadow-xl transition-all">
          <div className="flex items-center gap-3.5">
            <div className={`w-12 h-12 bg-gradient-to-br ${grad} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform`}>
              <span className="text-white font-black text-lg uppercase">{user.fullName[0]}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-gray-900 text-sm font-bold truncate">{user.fullName}</p>
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">{user.role}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-2 space-y-2 overflow-y-auto custom-scrollbar">
          {visibleNav.map((item, idx) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <motion.button 
                key={item.path}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => { navigate(item.path); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-3xl transition-all text-left relative group ${
                  active
                    ? 'text-white shadow-2xl shadow-primary/30 z-10'
                    : 'text-gray-500 hover:bg-white/60 hover:text-gray-900'
                }`}>
                {active && (
                  <motion.div 
                    layoutId="activeNav"
                    className="absolute inset-0 vibrant-gradient rounded-3xl -z-10"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <div className={`p-2 rounded-xl transition-all ${active ? 'bg-white/20' : 'bg-gray-100 group-hover:bg-white'}`}>
                  <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-gray-400 group-hover:text-primary'}`}/>
                </div>
                <span className="font-bold text-sm tracking-tight">{item.name}</span>
                {active && <ChevronRight className="w-4 h-4 ml-auto opacity-70"/>}
              </motion.button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-6">
          <button onClick={handleLogout}
            className="w-full flex items-center gap-4 px-5 py-4 text-red-500 hover:bg-red-50 rounded-3xl transition-all group border border-transparent hover:border-red-100">
            <div className="p-2 bg-red-50 rounded-xl group-hover:bg-red-100 transition-colors">
              <LogOut className="w-5 h-5"/>
            </div>
            <span className="text-sm font-bold">Chiqish</span>
          </button>
        </div>
      </aside>

      {/* Overlay (mobile) */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-md z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 lg:min-h-screen lg:ml-72 relative z-10">
        {/* Top Header */}
        <header className="sticky top-0 z-30 transition-all duration-300">
          <div className="mx-4 sm:mx-6 my-4 bg-white/60 backdrop-blur-2xl border border-white/40 rounded-[2rem] shadow-2xl shadow-gray-200/40">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-4">
                <button onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-3 hover:bg-white rounded-2xl transition-all shadow-sm">
                  <Menu className="w-6 h-6 text-gray-700"/>
                </button>
                {/* Page title / breadcrumb */}
                <div className="hidden sm:flex items-center gap-3 text-sm">
                  <button 
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 p-2 hover:bg-white glass rounded-xl transition-all group"
                  >
                    <Shield className="w-5 h-5 text-primary group-hover:scale-110 transition-transform"/>
                    <span className="text-gray-400 font-medium group-hover:text-primary transition-colors">Monitoring</span>
                  </button>
                  <ChevronRight className="w-4 h-4 text-gray-300"/>
                  <motion.span 
                    key={location.pathname}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-black text-gray-900 text-lg tracking-tight"
                  >
                    {visibleNav.find(n => isActive(n.path))?.name || 'Asosiy oyna'}
                  </motion.span>
                </div>
              </div>

              <div className="flex items-center gap-3 sm:gap-4">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/events')}
                  className="relative p-3 bg-white hover:bg-gray-50 rounded-2xl transition-all shadow-sm border border-gray-100 group"
                >
                  <Bell className="w-6 h-6 text-gray-600 group-hover:text-primary transition-colors"/>
                  {unreadAlertsCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-6 h-6 vibrant-gradient text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                      {unreadAlertsCount > 9 ? '9+' : unreadAlertsCount}
                    </span>
                  )}
                </motion.button>

                {/* User pill */}
                <div className="flex items-center gap-3 pl-1 pr-4 py-1.5 glass rounded-3xl hover:shadow-lg transition-all cursor-default">
                  <div className={`w-9 h-9 bg-gradient-to-br ${grad} rounded-[1.2rem] flex items-center justify-center shadow-lg`}>
                    <span className="text-white text-xs font-black">{user.fullName[0]}</span>
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-xs font-black text-gray-900 leading-none mb-0.5">{user.fullName}</p>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{user.role}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <Outlet/>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
