import {
  AlertTriangle, AlertCircle, Info, Filter, CheckCircle,
  Clock, Video, Trash2, X, Shield, User, Eye, Search,
  MessageSquare, History, Calendar
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const initialEvents = [
  { id: '1', type: 'fall_detection', severity: 'critical', description: 'Bola yiqilib tushdi', childName: 'Aziz Karimov', groupName: 'Guruh 1', cameraName: "Guruh 1 - O'yin zonasi", timestamp: new Date(Date.now() - 1000 * 60 * 15), status: 'active', confidence: 0.94 },
  { id: '2', type: 'fight_detection', severity: 'critical', description: "Bolalar o'rtasida jismoniy to'qnashuv", groupName: 'Guruh 2', cameraName: 'Guruh 2 - Asosiy xona', timestamp: new Date(Date.now() - 1000 * 60 * 45), status: 'resolved', confidence: 0.87, resolvedBy: 'Malika Nazarova', resolvedAt: new Date(Date.now() - 1000 * 60 * 30), comment: 'Vaziyat nazoratga olindi, bolalar ajratildi.' },
  { id: '3', type: 'cry_detection', severity: 'warning', description: "Uzoq vaqt yig'lash (>3 daqiqa)", childName: 'Dilnoza Sultanova', groupName: 'Guruh 1', cameraName: 'Guruh 1 - Asosiy xona', timestamp: new Date(Date.now() - 1000 * 60 * 90), status: 'resolved', confidence: 0.91, resolvedBy: 'Siz', resolvedAt: new Date(Date.now() - 1000 * 60 * 60) },
  { id: '4', type: 'zone_monitoring', severity: 'warning', description: 'Xavfli joyga yaqinlashish (deraza)', childName: 'Jamshid Rahimov', groupName: 'Guruh 2', cameraName: 'Guruh 2 - Asosiy xona', timestamp: new Date(Date.now() - 1000 * 60 * 120), status: 'active', confidence: 0.89 },
  { id: '5', type: 'intruder_detection', severity: 'critical', description: "Noma'lum shaxs kirishi aniqlandi", cameraName: 'Kirish eshigi', timestamp: new Date(Date.now() - 1000 * 60 * 180), status: 'resolved', confidence: 0.96, resolvedBy: 'Akmal Abdullayev', resolvedAt: new Date(Date.now() - 1000 * 60 * 150) },
  { id: '6', type: 'group_count_change', severity: 'info', description: "Guruh bola soni o'zgarishi", groupName: 'Guruh 1', cameraName: 'Guruh 1 - Asosiy xona', timestamp: new Date(Date.now() - 1000 * 60 * 240), status: 'resolved', confidence: 0.99, resolvedBy: 'Nizom Komilov', resolvedAt: new Date(Date.now() - 1000 * 60 * 200) },
];

const severityConfig = {
  critical: { icon: AlertTriangle, grad: 'from-rose-500 to-red-600', bg: 'bg-rose-50', border: 'border-rose-200', badge: 'bg-rose-100 text-rose-700', text: 'text-rose-600', label: 'KRITIK' },
  warning: { icon: AlertCircle, grad: 'from-amber-500 to-orange-500', bg: 'bg-amber-50', border: 'border-amber-200', badge: 'bg-amber-100 text-amber-700', text: 'text-amber-600', label: 'OGOHLANTIRISH' },
  info: { icon: Info, grad: 'from-blue-500 to-indigo-500', bg: 'bg-blue-50', border: 'border-blue-200', badge: 'bg-blue-100 text-blue-700', text: 'text-blue-600', label: 'AXBOROT' },
};

export function EventsPage() {
  const [events, setEvents] = useState(initialEvents);
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [resolvingEvent, setResolvingEvent] = useState(null);
  const [resolveComment, setResolveComment] = useState('');

  const filteredEvents = events.filter(ev => {
    if (filterSeverity !== 'all' && ev.severity !== filterSeverity) return false;
    if (filterStatus !== 'all' && ev.status !== filterStatus) return false;
    if (searchQuery && !ev.description.toLowerCase().includes(searchQuery.toLowerCase()) && !ev.childName?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleConfirmResolve = () => {
    if (!resolvingEvent) return;
    setEvents(prev => prev.map(ev => 
      ev.id === resolvingEvent.id 
        ? { ...ev, status: 'resolved', resolvedBy: 'Siz', resolvedAt: new Date(), comment: resolveComment } 
        : ev
    ));
    setResolvingEvent(null);
    setResolveComment('');
  };

  const handleDelete = (id) => {
    setEvents(prev => prev.filter(ev => ev.id !== id));
  };

  const formatTime = (date) => {
    const d = date instanceof Date ? date : new Date(date);
    const diff = Math.floor((Date.now() - d.getTime()) / 1000);
    if (diff < 60) return `${diff} soniya oldin`;
    if (diff < 3600) return `${Math.floor(diff / 60)} daqiqa oldin`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} soat oldin`;
    return d.toLocaleDateString();
  };

  const stats = [
    { label: 'Jami', value: events.length, color: 'blue', grad: 'from-blue-600 to-indigo-700' },
    { label: 'Faol', value: events.filter(e => e.status === 'active').length, color: 'rose', grad: 'from-rose-500 to-red-600' },
    { label: 'Hal etilgan', value: events.filter(e => e.status === 'resolved').length, color: 'emerald', grad: 'from-emerald-500 to-teal-600' },
    { label: 'Kritik', value: events.filter(e => e.severity === 'critical').length, color: 'amber', grad: 'from-amber-500 to-orange-600' },
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Live Monitoring</span>
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter mb-2">Hodisalar <span className="text-primary italic">Logi</span></h1>
          <p className="text-gray-500 font-medium max-w-md">Barcha xavfsizlik va o'quv jarayonidagi hodisalar AI tomonidan qayd etib boriladi.</p>
        </div>
        
        <div className="flex gap-4">
          <div className="glass px-6 py-4 rounded-[1.8rem] flex items-center gap-4 border-white/60 shadow-xl shadow-gray-200/40">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                <History className="w-5 h-5"/>
            </div>
            <div>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Ohirgi faoliyat</p>
              <p className="text-sm font-black text-gray-900">2 daqiqa oldin</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Modern Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ y: -5 }}
            className="glass p-6 rounded-[2.5rem] shadow-xl shadow-gray-200/30 border-white/80 transition-all group overflow-hidden relative"
          >
            <div className={`absolute -right-6 -bottom-6 w-24 h-24 bg-gradient-to-br ${stat.grad} opacity-5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700`} />
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 relative z-10">{stat.label}</p>
            <p className="text-4xl font-black text-gray-900 tracking-tighter relative z-10">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="grid lg:grid-cols-3 gap-6 items-center bg-white/40 backdrop-blur-xl p-4 rounded-[2.5rem] border border-white/60 shadow-xl shadow-gray-200/20">
        <div className="lg:col-span-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
          <input 
            type="text" 
            placeholder="Qidiruv (bola ismi, tavsifi)..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white/50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-medium text-sm"
          />
        </div>
        
        <div className="lg:col-span-2 flex flex-wrap gap-2 justify-end">
          <div className="flex bg-gray-100/50 p-1.5 rounded-2xl gap-1">
            {['all', 'critical', 'warning', 'info'].map(s => (
              <button 
                key={s}
                onClick={() => setFilterSeverity(s)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  filterSeverity === s ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {s === 'all' ? 'Barchasi' : s}
              </button>
            ))}
          </div>
          <div className="flex bg-gray-100/50 p-1.5 rounded-2xl gap-1">
            {['all', 'active', 'resolved'].map(s => (
              <button 
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  filterStatus === s ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {s === 'all' ? 'Hammasi' : s === 'active' ? 'Faol' : 'Hal etilgan'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredEvents.map((event, idx) => {
            const cfg = severityConfig[event.severity];
            const Icon = cfg.icon;
            const isResolved = event.status === 'resolved';

            return (
              <motion.div 
                key={event.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: idx * 0.05 }}
                className={`glass p-6 rounded-[2.5rem] shadow-xl shadow-gray-200/30 border-white/60 hover:bg-white transition-all group relative overflow-hidden flex flex-col md:flex-row gap-6 items-start md:items-center ${isResolved ? 'opacity-70' : ''}`}
              >
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b ${cfg.grad} opacity-80`} />
                
                {/* Visual Icon */}
                <div className={`w-16 h-16 rounded-[1.8rem] bg-gradient-to-br ${cfg.grad} flex items-center justify-center flex-shrink-0 shadow-lg shadow-gray-200`}>
                  <Icon className="w-8 h-8 text-white"/>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className={`px-2.5 py-1 ${cfg.badge} rounded-full text-[9px] font-black uppercase tracking-widest`}>{cfg.label}</span>
                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      event.status === 'active' ? 'bg-orange-50 text-orange-600' : 'bg-emerald-50 text-emerald-600'
                    }`}>
                      {event.status === 'active' ? '🔴 Faol' : '✅ Hal etilgan'}
                    </span>
                    <div className="flex items-center gap-1.5 ml-auto text-gray-400 bg-gray-50 px-3 py-1 rounded-full text-[10px] font-bold">
                        <Clock className="w-3.5 h-3.5"/>
                        {formatTime(event.timestamp)}
                    </div>
                  </div>

                  <h3 className="text-xl font-black text-gray-900 tracking-tight mb-3 truncate">{event.description}</h3>

                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    {event.childName && (
                      <div className="flex items-center gap-2 bg-blue-50/50 px-3 py-1.5 rounded-xl border border-blue-100/50">
                        <User className="w-4 h-4 text-blue-500"/>
                        <span className="text-blue-700">{event.childName}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
                      <Video className="w-4 h-4 text-gray-400"/>
                      <span>{event.cameraName}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
                      <Eye className="w-4 h-4 text-emerald-500"/>
                      <span className="text-emerald-700">AI: {Math.round(event.confidence * 100)}%</span>
                    </div>
                  </div>
                  
                  {isResolved && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-4 pt-4 border-t border-gray-100 flex items-start gap-4"
                    >
                        <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-emerald-600">
                            <CheckCircle className="w-4 h-4"/>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                                Hal etildi: {event.resolvedBy} • {formatTime(event.resolvedAt)}
                            </p>
                            <p className="text-xs text-gray-600 font-medium italic">"{event.comment || 'Tizim tomonidan tasdiqlandi.'}"</p>
                        </div>
                    </motion.div>
                  )}
                </div>

                {/* Main Actions */}
                <div className="flex md:flex-col gap-3 flex-shrink-0 self-center">
                  {!isResolved ? (
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setResolvingEvent(event)}
                      className="px-6 py-4 bg-emerald-600 text-white rounded-3xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4"/> Tasdiqlash
                    </motion.button>
                  ) : (
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDelete(event.id)}
                      className="p-4 bg-gray-100 text-gray-400 hover:bg-rose-50 hover:text-rose-500 rounded-2xl transition-all border border-transparent hover:border-rose-100"
                    >
                      <Trash2 className="w-5 h-5"/>
                    </motion.button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filteredEvents.length === 0 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-[3rem] p-20 text-center shadow-2xl shadow-gray-200/40 border border-white/80"
        >
          <div className="w-24 h-24 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-gray-200"/>
          </div>
          <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-2">Hech qanday hodisa topilmadi</h3>
          <p className="text-gray-400 font-medium italic">Filtrlar bo'yicha ma'lumotlar mavjud emas.</p>
        </motion.div>
      )}

      {/* Resolve Confirmation Modal */}
      <AnimatePresence>
        {resolvingEvent && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-[60] flex items-center justify-center p-4"
            onClick={() => setResolvingEvent(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className="bg-white rounded-[3rem] shadow-2xl w-full max-w-lg overflow-hidden border border-white/80"
              onClick={e => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-8 py-10 relative">
                <button onClick={() => setResolvingEvent(null)} className="absolute top-6 right-6 p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors">
                  <X className="w-5 h-5 text-white"/>
                </button>
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-white/20 rounded-[1.8rem] flex items-center justify-center border-4 border-white/20 shadow-xl">
                        <CheckCircle className="w-10 h-10 text-white" />
                    </div>
                    <div>
                        <h3 className="text-white font-black text-2xl tracking-tighter">Hodisani tasdiqlash</h3>
                        <p className="text-white/70 text-xs font-black uppercase tracking-widest mt-1">Holatni hal etish</p>
                    </div>
                </div>
              </div>

              <div className="p-8 space-y-6">
                <div className="p-5 bg-gray-50 rounded-2xl border border-gray-200/50">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Hodisa tavsifi</p>
                    <p className="text-sm font-bold text-gray-900 leading-relaxed">{resolvingEvent.description}</p>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block pl-1 flex items-center gap-2">
                        <MessageSquare className="w-3 h-3"/>
                        Amalga oshirilgan chora (ixtiyoriy)
                    </label>
                    <textarea 
                        value={resolveComment}
                        onChange={e => setResolveComment(e.target.value)}
                        placeholder="Masalan: Bola tinchlantirildi, ota-onasiga xabar berildi..."
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 transition-all outline-none font-medium text-sm min-h-[120px] resize-none"
                    />
                </div>

                <div className="flex gap-4 pt-2">
                  <button
                    onClick={handleConfirmResolve}
                    className="flex-1 flex items-center justify-center gap-3 py-5 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-emerald-200 active:scale-95 transition-all"
                  >
                    <CheckCircle className="w-4 h-4"/>
                    Hal etildi deb belgilash
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
