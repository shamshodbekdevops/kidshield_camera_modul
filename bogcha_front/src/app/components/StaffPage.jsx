import { UsersRound, UserPlus, Search, Shield, User, UserCog, Mail, Phone, X, Save, Pencil, Wifi, WifiOff, ArrowUpRight } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const initialStaff = [
  { id: '1', fullName: 'Aziza Karimova', role: 'tarbiyachi', email: 'aziza@bogchaguard.uz', phone: '+998 90 123 45 67', groupName: 'Guruh 1', status: 'online', lastLogin: new Date(Date.now() - 1000 * 60 * 15) },
  { id: '2', fullName: 'Malika Nazarova', role: 'tarbiyachi', email: 'malika@bogchaguard.uz', phone: '+998 91 234 56 78', groupName: 'Guruh 2', status: 'online', lastLogin: new Date(Date.now() - 1000 * 60 * 30) },
  { id: '3', fullName: 'Akmal Abdullayev', role: 'security', email: 'akmal@bogchaguard.uz', phone: '+998 93 345 67 89', groupName: null, status: 'online', lastLogin: new Date(Date.now() - 1000 * 60 * 5) },
  { id: '4', fullName: 'Dilorom Rashidova', role: 'mudir', email: 'dilorom@bogchaguard.uz', phone: '+998 94 456 78 90', groupName: null, status: 'online', lastLogin: new Date(Date.now() - 1000 * 60 * 10) },
  { id: '5', fullName: 'Nodira Yusupova', role: 'tarbiyachi', email: 'nodira@bogchaguard.uz', phone: '+998 95 567 89 01', groupName: 'Guruh 3', status: 'offline', lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 2) },
];

export function StaffPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [staff, setStaff] = useState(initialStaff);
  const [editingMember, setEditingMember] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [addForm, setAddForm] = useState({ fullName: '', role: 'tarbiyachi', email: '', phone: '+998', groupName: '' });

  const handlePhoneChange = (e, target = 'add') => {
    const value = e.target.value.replace(/\D/g, '');
    let formatted = '+998';
    if (value.length > 3) formatted += ' ' + value.substring(3, 5);
    if (value.length > 5) formatted += ' ' + value.substring(5, 8);
    if (value.length > 8) formatted += ' ' + value.substring(8, 10);
    if (value.length > 10) formatted += ' ' + value.substring(10, 12);

    if (target === 'add') {
      setAddForm(f => ({ ...f, phone: formatted }));
    } else {
      setEditForm(f => ({ ...f, phone: formatted }));
    }
  };

  const isAddValid = addForm.fullName.trim() !== '' &&
    addForm.email.trim() !== '' &&
    addForm.phone.length === 17;

  const isEditValid = editForm.fullName?.trim() !== '' &&
    editForm.email?.trim() !== '' &&
    editForm.phone?.length === 17;

  const filteredStaff = staff.filter(m => m.fullName.toLowerCase().includes(searchQuery.toLowerCase()));

  const getRoleConfig = (role) => {
    const configs = {
      tarbiyachi: { icon: User, label: 'Tarbiyachi', color: 'text-blue-700', bg: 'bg-blue-50', grad: 'from-blue-500 to-blue-600' },
      security: { icon: Shield, label: 'Xavfsizlik', color: 'text-emerald-700', bg: 'bg-emerald-50', grad: 'from-emerald-500 to-emerald-600' },
      mudir: { icon: UserCog, label: 'Mudir', color: 'text-purple-700', bg: 'bg-purple-50', grad: 'from-purple-500 to-purple-600' },
    };
    return configs[role] || configs.tarbiyachi;
  };

  const getTimeAgo = (date) => {
    const d = date instanceof Date ? date : new Date(date);
    const seconds = Math.floor((Date.now() - d.getTime()) / 1000);
    if (seconds < 60) return `${seconds} soniya oldin`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} daqiqa oldin`;
    return `${Math.floor(minutes / 60)} soat oldin`;
  };

  const handleEdit = (member) => {
    setEditingMember(member.id);
    setEditForm({ fullName: member.fullName, email: member.email, phone: member.phone, groupName: member.groupName || '' });
  };

  const handleSave = () => {
    if (!isEditValid) return;
    setStaff(prev => prev.map(m => m.id === editingMember ? { ...m, ...editForm, groupName: editForm.groupName || null } : m));
    setEditingMember(null);
  };

  const handleAddStaff = (e) => {
    e.preventDefault();
    if (!isAddValid) return;
    const newStaff = {
      id: String(Date.now()),
      ...addForm,
      status: 'offline',
      lastLogin: null
    };
    setStaff(prev => [...prev, newStaff]);
    setShowAddModal(false);
    setAddForm({ fullName: '', role: 'tarbiyachi', email: '', phone: '+998', groupName: '' });
  };

  const handleCancel = () => setEditingMember(null);

  const stats = [
    { label: 'Jami xodimlar', value: staff.length, color: 'blue', icon: UsersRound },
    { label: 'Online', value: staff.filter(s => s.status === 'online').length, color: 'emerald', icon: Wifi },
    { label: 'Tarbiyachilar', value: staff.filter(s => s.role === 'tarbiyachi').length, color: 'purple', icon: User },
  ];

  const colorMap = { blue: { text: 'text-blue-600', bg: 'bg-blue-50', ring: 'ring-blue-200' }, emerald: { text: 'text-emerald-600', bg: 'bg-emerald-50', ring: 'ring-emerald-200' }, purple: { text: 'text-purple-600', bg: 'bg-purple-50', ring: 'ring-purple-200' } };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Xodimlar</h1>
          <p className="text-gray-500">Bog'cha xodimlari boshqaruvi</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg font-medium"
        >
          <UserPlus className="w-4 h-4" />
          Yangi xodim qo'shish
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => {
          const c = colorMap[stat.color];
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
              className="glass rounded-[2rem] p-6 shadow-xl shadow-gray-200/30 border-white/60 flex items-center justify-between group hover:bg-white transition-all"
            >
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <div className="flex items-baseline gap-2">
                  <p className={`text-4xl font-black ${c.text} tracking-tighter`}>{stat.value}</p>
                  <span className="text-[10px] font-bold text-gray-300">faol</span>
                </div>
              </div>
              <div className={`p-4 ${c.bg} rounded-2xl group-hover:scale-110 transition-transform shadow-sm`}>
                <Icon className={`w-8 h-8 ${c.text}`} />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Xodim ismini qidiring..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredStaff.map((member, idx) => {
            const roleConfig = getRoleConfig(member.role);
            const RoleIcon = roleConfig.icon;
            return (
              <motion.div
                key={member.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: idx * 0.03 }}
                whileHover={{ y: -8 }}
                className="glass rounded-[2.5rem] shadow-xl shadow-gray-200/30 border-white/60 overflow-hidden hover:bg-white transition-all group"
              >
                <div className={`h-2 vibrant-gradient opacity-80`} />
                <div className="p-7">
                  {/* Avatar & Role Header */}
                  <div className="flex items-start gap-4 mb-6">
                    <div className={`w-20 h-20 bg-gradient-to-br ${roleConfig.grad} rounded-3xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:rotate-6 transition-transform`}>
                      <span className="text-white text-3xl font-black">{member.fullName[0]}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-black text-gray-900 truncate tracking-tight">{member.fullName}</h3>
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 mt-1.5 ${roleConfig.bg} rounded-full`}>
                        <RoleIcon className={`w-3 h-3 ${roleConfig.color}`} />
                        <span className={`text-[10px] font-black uppercase tracking-widest ${roleConfig.color}`}>{roleConfig.label}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <div className={`w-2 h-2 rounded-full ${member.status === 'online' ? 'bg-emerald-500 animate-pulse' : 'bg-gray-300'}`} />
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          {member.status === 'online' ? 'Online' : 'Offline'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Contact Info Pills */}
                  <div className="space-y-2 mb-6 text-xs text-gray-500">
                    <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-2xl border border-gray-100/50">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="font-bold truncate">{member.email}</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-2xl border border-gray-100/50">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="font-bold">{member.phone}</span>
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="flex items-center justify-between pt-5 border-t border-gray-100">
                    <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">{getTimeAgo(member.lastLogin)}</p>
                    <button
                      onClick={() => handleEdit(member)}
                      className="flex items-center justify-center gap-2 px-6 py-2.5 bg-primary/5 text-primary rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-sm"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      Tahrirlash
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filteredStaff.length === 0 && (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
          <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Hech qanday xodim topilmadi</p>
        </div>
      )}

      {/* Edit Modal */}
      <AnimatePresence>
        {editingMember && (() => {
          const member = staff.find(m => m.id === editingMember);
          const roleConfig = getRoleConfig(member.role);
          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50 p-4" onClick={handleCancel}
            >
              <motion.div
                initial={{ scale: 0.9, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 30 }}
                className="bg-white rounded-[3rem] shadow-2xl w-full max-w-md overflow-hidden border border-white/80" onClick={e => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className={`bg-gradient-to-r ${roleConfig.grad} px-8 py-10 relative`}>
                  <button onClick={handleCancel} className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors">
                    <X className="w-5 h-5 text-white" />
                  </button>
                  <div className="flex flex-col items-center text-center">
                    <div className="w-24 h-24 bg-white/20 rounded-[2rem] flex items-center justify-center mb-4 border-4 border-white/20 shadow-xl">
                      <span className="text-white text-4xl font-black">{member.fullName[0]}</span>
                    </div>
                    <h3 className="text-white font-black text-2xl tracking-tighter">{member.fullName}</h3>
                    <p className="text-white/70 text-xs font-black uppercase tracking-[0.2em] mt-1">{roleConfig.label}</p>
                  </div>
                </div>

                {/* Form */}
                <div className="p-8 space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block pl-1">To'liq ism</label>
                    <input
                      value={editForm.fullName}
                      onChange={(e) => setEditForm(f => ({ ...f, fullName: e.target.value }))}
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-bold text-gray-900"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block pl-1">Telefon raqami</label>
                    <input
                      value={editForm.phone}
                      onChange={(e) => handlePhoneChange(e, 'edit')}
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-bold text-gray-900"
                      placeholder="+998 90 123 45 67"
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={handleSave}
                      disabled={!isEditValid}
                      className={`flex-1 flex items-center justify-center gap-2 py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all text-xs ${isEditValid ? 'vibrant-gradient text-white shadow-primary/30' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                    >
                      <Save className="w-4 h-4" />
                      Saqlash
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-6 py-5 bg-gray-100 text-gray-400 rounded-2xl font-black uppercase tracking-widest transition-all text-xs hover:bg-gray-200"
                    >
                      X
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
      {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className="bg-white rounded-[3rem] shadow-2xl w-full max-w-md overflow-hidden border border-white/80"
              onClick={e => e.stopPropagation()}
            >
              <div className="vibrant-gradient px-8 py-10 relative">
                <button onClick={() => setShowAddModal(false)} className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors">
                  <X className="w-5 h-5 text-white" />
                </button>
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-white/20 rounded-[1.8rem] flex items-center justify-center mb-4 border-4 border-white/20 shadow-xl text-white">
                    <UserPlus className="w-10 h-10" />
                  </div>
                  <h3 className="text-white font-black text-2xl tracking-tighter">Yangi xodim</h3>
                  <p className="text-white/70 text-xs font-bold uppercase tracking-widest mt-1">Tizimga qo'shish</p>
                </div>
              </div>

              <form onSubmit={handleAddStaff} className="p-8 space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block pl-1">To'liq ismi *</label>
                  <input
                    required
                    value={addForm.fullName}
                    onChange={e => setAddForm(f => ({ ...f, fullName: e.target.value }))}
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-bold text-gray-900"
                    placeholder="Ism va familiya"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block pl-1">Lavozimi *</label>
                    <select
                      value={addForm.role}
                      onChange={e => setAddForm(f => ({ ...f, role: e.target.value }))}
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all outline-none font-bold text-gray-900 appearance-none cursor-pointer"
                    >
                      <option value="tarbiyachi">Tarbiyachi</option>
                      <option value="security">Xavfsizlik</option>
                      <option value="mudir">Mudir</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block pl-1">Guruh</label>
                    <input
                      value={addForm.groupName}
                      onChange={e => setAddForm(f => ({ ...f, groupName: e.target.value }))}
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all outline-none font-bold text-gray-900"
                      placeholder="Guruh 1"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block pl-1">Email *</label>
                  <input
                    required
                    type="email"
                    value={addForm.email}
                    onChange={e => setAddForm(f => ({ ...f, email: e.target.value }))}
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all outline-none font-bold text-gray-900"
                    placeholder="email@bogchaguard.uz"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block pl-1">Telefon *</label>
                  <input
                    required
                    value={addForm.phone}
                    onChange={e => handlePhoneChange(e, 'add')}
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all outline-none font-bold text-gray-900"
                    placeholder="+998 90 123 45 67"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={!isAddValid}
                    className={`flex-1 flex items-center justify-center gap-2 py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all text-xs ${isAddValid ? 'vibrant-gradient text-white shadow-primary/30' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                  >
                    <Save className="w-4 h-4" />
                    Saqlash
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
