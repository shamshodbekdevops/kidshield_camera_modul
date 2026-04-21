import { useAppStore } from '../store';
import { useNavigate } from 'react-router';
import { Users, Video, AlertTriangle, Activity, TrendingUp, Clock, Shield, Sparkles, ArrowUpRight } from 'lucide-react';
import { CameraFeed } from './CameraFeed';
import { AlertsList } from './AlertsList';
import { motion } from 'motion/react';

export function Dashboard() {
    const user = useAppStore((state) => state.user);
    const alerts = useAppStore((state) => state.alerts);
    const navigate = useNavigate();

    // Mock data
    const stats = {
        tarbiyachi: [
            { label: 'Bolalar guruhdа', value: '24', icon: Users, color: 'blue', path: '/children' },
            { label: 'Bugun kelganlar', value: '22', icon: TrendingUp, color: 'green', path: '/children' },
            { label: 'Faol hodisalar', value: alerts.length.toString(), icon: AlertTriangle, color: 'red', path: '/events' },
            { label: 'Kameralar online', value: '3', icon: Video, color: 'purple', path: '/cameras' },
        ],
        security: [
            { label: 'Hududda bolalar', value: '156', icon: Users, color: 'blue', path: '/children' },
            { label: 'Xavfsizlik hodisalari', value: '2', icon: AlertTriangle, color: 'red', path: '/events' },
            { label: 'Kirish/Chiqishlar', value: '45', icon: Activity, color: 'green', path: '/events' },
            { label: 'Tashqi kameralar', value: '8', icon: Video, color: 'purple', path: '/cameras' },
        ],
        mudir: [
            { label: 'Jami bolalar', value: '156', icon: Users, color: 'blue', path: '/children' },
            { label: 'Bugun kelganlar', value: '142', icon: TrendingUp, color: 'green', path: '/children' },
            { label: 'Faol hodisalar', value: alerts.length.toString(), icon: AlertTriangle, color: 'red', path: '/events' },
            { label: 'Online kameralar', value: '24/24', icon: Video, color: 'purple', path: '/cameras' },
        ],
    };

    const currentStats = stats[user.role];

    const getColorClasses = (color) => {
        const colors = {
            blue: { bg: 'bg-blue-50', text: 'text-blue-600', icon: 'text-blue-600', grad: 'from-blue-500 to-indigo-600' },
            green: { bg: 'bg-emerald-50', text: 'text-emerald-600', icon: 'text-emerald-600', grad: 'from-emerald-500 to-teal-600' },
            red: { bg: 'bg-rose-50', text: 'text-rose-600', icon: 'text-rose-600', grad: 'from-rose-500 to-red-600' },
            purple: { bg: 'bg-violet-50', text: 'text-violet-600', icon: 'text-violet-600', grad: 'from-violet-500 to-purple-600' },
        };
        return colors[color] || colors.blue;
    };

    return (
    <div className="space-y-10 pb-12">
      {/* Dynamic Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Tizim Faol</span>
          </div>
          <h1 className="text-5xl font-black text-gray-900 tracking-tighter mb-2">
            Salom, <span className="text-primary">{user?.fullName.split(' ')[0]}</span>!
          </h1>
          <p className="text-gray-500 font-medium max-w-md">
            Bugungi jarayonlarni boshqarish va nazorat qilish markazi.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="glass px-6 py-4 rounded-[1.8rem] flex items-center gap-4 shadow-xl shadow-gray-200/40 border-white/60">
            <div className="w-10 h-10 vibrant-gradient rounded-xl flex items-center justify-center text-white shadow-lg">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Hozirgi vaqt</p>
              <p className="text-sm font-black text-gray-900">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Balanced Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {currentStats.map((stat, idx) => {
            const Icon = stat.icon;
            const colors = getColorClasses(stat.color);

            return (
              <motion.div 
                key={stat.label} 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
                className="glass p-6 rounded-[2.5rem] shadow-2xl shadow-gray-200/30 border-white/80 transition-all flex flex-col justify-between group overflow-hidden relative cursor-default hover:bg-white"
              >
                <div className={`absolute -right-6 -bottom-6 w-24 h-24 bg-gradient-to-br ${colors.grad} opacity-5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700`} />
                
                <div className="flex items-start justify-between relative z-10">
                  <div className={`p-4 ${colors.bg} rounded-2xl group-hover:scale-110 transition-transform shadow-sm`}>
                    <Icon className={`w-6 h-6 ${colors.icon}`}/>
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.2, rotate: 45 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => navigate(stat.path)}
                    className="p-3 bg-white/60 hover:bg-primary hover:text-white rounded-2xl transition-all shadow-sm group/btn"
                  >
                    <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover/btn:text-white transition-colors" />
                  </motion.button>
                </div>
                
                <div className="relative z-10 mt-6">
                  <p className={`text-4xl font-black ${colors.text} tracking-tighter`}>{stat.value}</p>
                  <p className="text-[11px] font-black text-gray-500 uppercase tracking-widest mt-1 opacity-70 truncate">{stat.label}</p>
                </div>
              </motion.div>
            );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        {/* Camera Feed - Main Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <div className="glass rounded-[3rem] p-8 shadow-2xl shadow-gray-200/40 border-white/80 overflow-hidden relative h-full">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32" />
            
            <div className="flex items-center justify-between mb-8 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg border border-gray-50">
                  <Video className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight">Kamera Monitoringi</h2>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-0.5">Xavfsizlik tizimi faol</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 px-4 py-2 bg-emerald-50 rounded-full text-[10px] font-black tracking-widest text-emerald-600 border border-emerald-100 shadow-sm">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"/>
                <span>LIVE</span>
              </div>
            </div>
            
            <div className="relative z-10">
              {user?.role === 'tarbiyachi' && (
                <div className="rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white">
                  <CameraFeed cameraName="Guruh 1" location="Ichki kamera"/>
                </div>
              )}
              
              {(user?.role === 'security' || user?.role === 'mudir') && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="rounded-[2rem] overflow-hidden shadow-xl border-4 border-white">
                     <CameraFeed cameraName={user?.role === 'security' ? 'Kirish' : 'Guruh 1'} location="Tashqi" compact/>
                  </div>
                  <div className="rounded-[2rem] overflow-hidden shadow-xl border-4 border-white">
                     <CameraFeed cameraName="Hovli" location="Tashqi" compact/>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Alerts Panel */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="h-full"
        >
          <AlertsList />
        </motion.div>
      </div>


      {/* Recent Activity Section */}
      {user?.role === 'mudir' && (
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass rounded-[3rem] p-10 shadow-2xl shadow-gray-200/40 border-white/80"
        >
          <div className="flex items-center gap-4 mb-8">
             <div className="w-12 h-12 bg-pink-50 rounded-2xl flex items-center justify-center">
               <Activity className="w-6 h-6 text-pink-500" />
             </div>
             <div>
               <h2 className="text-2xl font-black text-gray-900 tracking-tight">Xodimlar Faolligi</h2>
               <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-0.5">Real-vaqt tizim loglari</p>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
                { name: 'Aziza Karimova', action: 'Tizimga kirdi', time: '10:23', role: 'Tarbiyachi', color: 'blue' },
                { name: 'Akmal Abdullayev', action: 'Hodisani hal etdi', time: '09:45', role: 'Xavfsizlik', color: 'emerald' },
                { name: 'Malika Nazarova', action: 'Tizimga kirdi', time: '08:30', role: 'Tarbiyachi', color: 'violet' },
            ].map((activity, index) => (
              <motion.div 
                key={index} 
                whileHover={{ scale: 1.02, x: 5 }}
                className="flex items-center justify-between p-5 glass rounded-3xl border-white/60 hover:shadow-xl transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 bg-${activity.color}-100 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform`}>
                    <span className={`text-${activity.color}-600 font-black text-lg`}>{activity.name[0]}</span>
                  </div>
                  <div>
                    <div className="text-sm font-black text-gray-900 group-hover:text-primary transition-colors">{activity.name}</div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{activity.action}</div>
                  </div>
                </div>
                <div className="p-2.5 bg-gray-50 rounded-xl text-[10px] font-black text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                  {activity.time}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
    );
}

