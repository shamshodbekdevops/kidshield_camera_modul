import {
  Users, Search, UserPlus, Calendar, AlertCircle, X,
  Phone, Stethoscope, Activity, MapPin, ChevronRight,
  CheckCircle, XCircle, Baby, ShieldAlert, Save, Plus, Sparkles
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const childrenData = [
  {
    id: '1',
    fullName: 'Aziz Karimov',
    age: 5,
    birthDate: '15.03.2020',
    groupName: 'Guruh 1',
    parentName: 'Jasur Karimov',
    parentPhone: '+998 90 123 45 67',
    status: 'present',
    address: "Toshkent, Yunusobod tumani, Ko'hna yo'l 12",
    bloodType: 'A(II) Rh+',
    allergies: "Yo'q",
    medicalNotes: "Sog'lom",
    height: '110 sm',
    weight: '19 kg',
    todayEvents: 0,
    events: [],
    photoUrl: null,
  },
  {
    id: '2',
    fullName: 'Dilnoza Sultanova',
    age: 4,
    birthDate: '22.06.2021',
    groupName: 'Guruh 1',
    parentName: 'Malika Sultanova',
    parentPhone: '+998 91 234 56 78',
    status: 'present',
    address: "Toshkent, Mirzo Ulug'bek tumani, Bahor ko'chasi 5A",
    bloodType: 'O(I) Rh+',
    allergies: "Yong'oqlar",
    medicalNotes: 'Allergiya kuzatuvida',
    height: '102 sm',
    weight: '16 kg',
    todayEvents: 1,
    events: [{ time: '10:45', type: 'Yiqilish', detail: "Hovlida o'ynayotganda yiqildi, tiz qo'g'oni ozgina tirnaldi.", severity: 'warning' }],
    photoUrl: null,
  },
  {
    id: '3',
    fullName: 'Jamshid Rahimov',
    age: 5,
    birthDate: '08.11.2020',
    groupName: 'Guruh 1',
    parentName: 'Akmal Rahimov',
    parentPhone: '+998 93 345 67 89',
    status: 'present',
    address: "Toshkent, Chilonzor tumani, Bunyodkor 34",
    bloodType: 'B(III) Rh-',
    allergies: "Yo'q",
    medicalNotes: "Sog'lom",
    height: '112 sm',
    weight: '20 kg',
    todayEvents: 1,
    events: [{ time: '13:20', type: 'Mushtlashuv', detail: 'Yugurish paytida boshqa bola bilan to\'qnash keldi. Ikkalasi yig\'ladi, xodim ajratdi.', severity: 'warning' }],
    photoUrl: null,
  },
  {
    id: '4',
    fullName: 'Madina Alimova',
    age: 4,
    birthDate: '30.01.2021',
    groupName: 'Guruh 1',
    parentName: 'Sevara Alimova',
    parentPhone: '+998 94 456 78 90',
    status: 'absent',
    address: "Toshkent, Shayxontohur tumani, G'alabа ko'chasi 7",
    bloodType: 'AB(IV) Rh+',
    allergies: "Yo'q",
    medicalNotes: 'Astma (nazorat ostida)',
    height: '100 sm',
    weight: '15 kg',
    todayEvents: 0,
    events: [],
    photoUrl: null,
  },
  {
    id: '5',
    fullName: 'Sardor Yusupov',
    age: 5,
    birthDate: '14.07.2020',
    groupName: 'Guruh 1',
    parentName: 'Nodira Yusupova',
    parentPhone: '+998 95 567 89 01',
    status: 'present',
    address: "Toshkent, Uchtepa tumani, Zarqaynar massivi 20",
    bloodType: 'A(II) Rh-',
    allergies: "Yo'q",
    medicalNotes: "Sog'lom",
    height: '114 sm',
    weight: '21 kg',
    todayEvents: 0,
    events: [],
    photoUrl: null,
  },
];

const severityColors = { warning: 'bg-amber-100 text-amber-800 border-amber-200', critical: 'bg-red-100 text-red-800 border-red-200', info: 'bg-blue-100 text-blue-800 border-blue-200' };

function ProfileModal({ child, onClose }) {
  const gradients = ['from-blue-500 to-indigo-600', 'from-purple-500 to-pink-600', 'from-emerald-500 to-teal-600', 'from-amber-500 to-orange-600', 'from-red-500 to-rose-600'];
  const grad = gradients[Number(child.id) % gradients.length];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50 p-4" onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white rounded-[3rem] shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-white/80" onClick={e => e.stopPropagation()}
      >
        {/* Header with big avatar */}
        <div className={`bg-gradient-to-br ${grad} relative px-6 pt-8 pb-16 text-center rounded-t-3xl`}>
          <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors">
            <X className="w-5 h-5 text-white"/>
          </button>
          <div className={`w-28 h-28 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-3 shadow-xl border-4 border-white/40`}>
            <span className="text-white text-5xl font-black">{child.fullName[0]}</span>
          </div>
          <h2 className="text-2xl font-bold text-white">{child.fullName}</h2>
          <p className="text-white/80 text-sm mt-1">{child.age} yosh • {child.groupName}</p>
          <span className={`inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full text-xs font-bold ${child.status === 'present' ? 'bg-white/20 text-white' : 'bg-black/20 text-white/80'}`}>
            {child.status === 'present'
              ? <><CheckCircle className="w-3.5 h-3.5"/> Bugun kelgan</>
              : <><XCircle className="w-3.5 h-3.5"/> Kelmagan</>
            }
          </span>
        </div>

        {/* Info cards pulled up */}
        <div className="-mt-8 px-5 pb-6">
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { label: 'Qon guruhi', value: child.bloodType, icon: Activity },
              { label: 'Bo\'yi', value: child.height, icon: Baby },
              { label: 'Vazni', value: child.weight, icon: Baby },
            ].map(item => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="bg-white rounded-2xl p-3 shadow-md border border-gray-100 text-center">
                  <p className="text-[10px] text-gray-400 font-medium uppercase mb-1">{item.label}</p>
                  <p className="text-sm font-bold text-gray-900">{item.value}</p>
                </div>
              );
            })}
          </div>

          <div className="space-y-3">
            {[
              { icon: Calendar, label: 'Tug\'ilgan kun', value: child.birthDate, color: 'text-blue-500', bg: 'bg-blue-50' },
              { icon: Users, label: 'Ota-ona', value: child.parentName, color: 'text-purple-500', bg: 'bg-purple-50' },
              { icon: Phone, label: 'Telefon', value: child.parentPhone, color: 'text-emerald-500', bg: 'bg-emerald-50' },
              { icon: MapPin, label: 'Manzil', value: child.address, color: 'text-amber-500', bg: 'bg-amber-50' },
              { icon: Stethoscope, label: 'Tibbiy eslatma', value: child.medicalNotes, color: 'text-red-500', bg: 'bg-red-50' },
              { icon: ShieldAlert, label: 'Allergiya', value: child.allergies, color: 'text-orange-500', bg: 'bg-orange-50' },
            ].map(item => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-start gap-3 p-3.5 bg-gray-50 rounded-xl hover:bg-white hover:shadow-sm transition-all">
                  <div className={`p-2 ${item.bg} rounded-lg flex-shrink-0`}>
                    <Icon className={`w-4 h-4 ${item.color}`}/>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">{item.label}</p>
                    <p className="text-sm font-semibold text-gray-900">{item.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function EventsModal({ child, onClose }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50 p-4" onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white rounded-[3rem] shadow-2xl w-full max-w-md max-h-[80vh] overflow-y-auto border border-white/80" onClick={e => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-5 rounded-t-3xl flex items-center justify-between">
          <div>
            <h3 className="text-white font-bold text-lg">{child.fullName}</h3>
            <p className="text-white/80 text-sm">Bugungi hodisalar ro'yxati</p>
          </div>
          <button onClick={onClose} className="p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors">
            <X className="w-5 h-5 text-white"/>
          </button>
        </div>
        <div className="p-5">
          {child.events.length === 0 ? (
            <div className="text-center py-10">
              <CheckCircle className="w-14 h-14 text-emerald-300 mx-auto mb-3"/>
              <p className="text-lg font-bold text-gray-700">Hodisalar mavjud emas</p>
              <p className="text-sm text-gray-500 mt-1">Bugun hech qanday hodisa qayd etilmagan</p>
            </div>
          ) : (
            <div className="space-y-3">
              {child.events.map((ev, i) => (
                <div key={i} className={`p-4 rounded-xl border ${severityColors[ev.severity]}`}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <AlertCircle className="w-4 h-4"/>
                    <span className="text-xs font-bold uppercase tracking-wide">{ev.type}</span>
                    <span className="ml-auto text-xs opacity-70">{ev.time}</span>
                  </div>
                  <p className="text-sm leading-relaxed">{ev.detail}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export function ChildrenPage() {
  const [children, setChildren] = useState(childrenData);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('present');
  const [profileChild, setProfileChild] = useState(null);
  const [eventsChild, setEventsChild] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ fullName: '', age: '', birthDate: '', groupName: 'Guruh 1', parentName: '', parentPhone: '', address: '', bloodType: 'A(II) Rh+', allergies: "Yo'q", medicalNotes: "Sog'lom", height: '', weight: '' });

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    let formatted = '+998';
    if (value.length > 3) {
      formatted += ' ' + value.substring(3, 5);
    }
    if (value.length > 5) {
      formatted += ' ' + value.substring(5, 8);
    }
    if (value.length > 8) {
      formatted += ' ' + value.substring(8, 10);
    }
    if (value.length > 10) {
      formatted += ' ' + value.substring(10, 12);
    }
    setAddForm(f => ({ ...f, parentPhone: formatted }));
  };

  const isFormValid = addForm.fullName.trim() !== '' && 
                     addForm.age !== '' && 
                     addForm.parentName.trim() !== '' && 
                     addForm.parentPhone.length === 17;

  const filteredAll = children.filter(c => c.fullName.toLowerCase().includes(searchQuery.toLowerCase()));
  const presentList = filteredAll.filter(c => c.status === 'present');
  const absentList = filteredAll.filter(c => c.status === 'absent');
  const displayList = activeTab === 'present' ? presentList : absentList;

  const handleAddChild = (e) => {
    e.preventDefault();
    const newChild = {
      id: String(Date.now()),
      ...addForm,
      age: Number(addForm.age),
      status: 'present',
      todayEvents: 0,
      events: [],
      photoUrl: null,
    };
    setChildren(prev => [...prev, newChild]);
    setShowAddModal(false);
    setAddForm({ fullName: '', age: '', birthDate: '', groupName: 'Guruh 1', parentName: '', parentPhone: '', address: '', bloodType: 'A(II) Rh+', allergies: "Yo'q", medicalNotes: "Sog'lom", height: '', weight: '' });
  };

  const presentCount = children.filter(c => c.status === 'present').length;
  const absentCount = children.filter(c => c.status === 'absent').length;

  const gradients = ['from-blue-500 to-indigo-600', 'from-purple-500 to-pink-600', 'from-emerald-500 to-teal-600', 'from-amber-500 to-orange-600', 'from-red-500 to-rose-600'];

  return (
    <div className="space-y-6">
      {profileChild && <ProfileModal child={profileChild} onClose={() => setProfileChild(null)}/>}
      {eventsChild && <EventsModal child={eventsChild} onClose={() => setEventsChild(null)}/>}

      {/* Add Child Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-t-3xl px-6 py-5 flex items-center justify-between">
              <div>
                <h3 className="text-white font-bold text-lg">Yangi bola qo'shish</h3>
                <p className="text-white/70 text-sm">Ma'lumotlarni to'ldiring</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors">
                <X className="w-5 h-5 text-white"/>
              </button>
            </div>
            <form onSubmit={handleAddChild} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">To'liq ismi *</label>
                  <input required value={addForm.fullName} onChange={e => setAddForm(f => ({...f, fullName: e.target.value}))} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ism va familiya"/>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">Yoshi *</label>
                  <input required type="number" min="1" max="7" value={addForm.age} onChange={e => setAddForm(f => ({...f, age: e.target.value}))} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="3-6"/>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">Tug'ilgan sana</label>
                  <input value={addForm.birthDate} onChange={e => setAddForm(f => ({...f, birthDate: e.target.value}))} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="KK.OO.YYYY"/>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">Guruh</label>
                  <select value={addForm.groupName} onChange={e => setAddForm(f => ({...f, groupName: e.target.value}))} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                    {['Guruh 1','Guruh 2','Guruh 3'].map(g => <option key={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">Qon guruhi</label>
                  <select value={addForm.bloodType} onChange={e => setAddForm(f => ({...f, bloodType: e.target.value}))} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                    {['A(II) Rh+','A(II) Rh-','B(III) Rh+','B(III) Rh-','O(I) Rh+','O(I) Rh-','AB(IV) Rh+','AB(IV) Rh-'].map(b => <option key={b}>{b}</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">Ota-ona ismi *</label>
                  <input required value={addForm.parentName} onChange={e => setAddForm(f => ({...f, parentName: e.target.value}))} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ota yoki onaning ismi"/>
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">Telefon *</label>
                  <input required value={addForm.parentPhone} onChange={handlePhoneChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="+998 90 123 45 67"/>
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">Manzil</label>
                  <input value={addForm.address} onChange={e => setAddForm(f => ({...f, address: e.target.value}))} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Shahar, ko'cha, uy"/>
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">Allergiya</label>
                  <input value={addForm.allergies} onChange={e => setAddForm(f => ({...f, allergies: e.target.value}))} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Yo'q yoki allergiya turi"/>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button 
                  type="submit" 
                  disabled={!isFormValid}
                  className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold transition-all shadow-md ${
                    isFormValid 
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800' 
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                  }`}
                >
                  <Save className="w-4 h-4"/> Saqlash
                </button>
                <button type="button" onClick={() => setShowAddModal(false)} className="px-6 py-3.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all">Bekor qilish</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Bolalar ro'yxati</h1>
          <p className="text-gray-500">{presentCount} kelgan · {absentCount} kelmagan · {childrenData.length} jami</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg font-medium">
          <Plus className="w-4 h-4"/>
          Yangi bola qo'shish
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Jami bolalar', value: children.length, icon: Users, color: 'blue', grad: 'from-blue-500 to-indigo-600' },
          { label: 'Bugun kelgan', value: presentCount, icon: CheckCircle, color: 'emerald', grad: 'from-emerald-500 to-teal-600' },
          { label: 'Kelmagan', value: absentCount, icon: XCircle, color: 'slate', grad: 'from-slate-400 to-slate-500' },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div 
              key={stat.label} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
              className="glass rounded-[2rem] p-6 shadow-xl shadow-gray-200/30 border-white/60 flex items-center gap-5 hover:bg-white transition-all group"
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${stat.grad} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                <Icon className="w-8 h-8 text-white"/>
              </div>
              <div>
                <p className="text-3xl font-black text-gray-900 tracking-tighter">{stat.value}</p>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mt-0.5">{stat.label}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Search + Tabs */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
          <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            placeholder="Bola ismini qidiring..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"/>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('present')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === 'present' ? 'bg-emerald-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            <CheckCircle className="w-4 h-4"/>
            Kelganlar ({presentCount})
          </button>
          <button
            onClick={() => setActiveTab('absent')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === 'absent' ? 'bg-slate-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            <XCircle className="w-4 h-4"/>
            Kelmaganlar ({absentCount})
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {displayList.map((child, idx) => {
            const grad = gradients[Number(child.id) % gradients.length];
            return (
              <motion.div 
                key={child.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: idx * 0.03 }}
                whileHover={{ y: -8 }}
                className="glass rounded-[2.5rem] shadow-xl shadow-gray-200/30 border-white/60 overflow-hidden hover:bg-white transition-all group"
              >
                <div className={`h-2 vibrant-gradient opacity-80`}/>
                <div className="p-7">
                  {/* Avatar */}
                  <div className="flex items-start gap-4 mb-6">
                    <div className={`w-20 h-20 bg-gradient-to-br ${grad} rounded-3xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:rotate-6 transition-transform`}>
                      <span className="text-white text-3xl font-black">{child.fullName[0]}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-black text-gray-900 truncate tracking-tight">{child.fullName}</h3>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">{child.age} yosh • {child.groupName}</p>
                      
                      <div className={`inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${child.status === 'present' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-50 text-gray-400'}`}>
                        {child.status === 'present' ? (
                          <><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Kelgan</>
                        ) : 'Kelmagan'}
                      </div>
                    </div>
                  </div>

                  {/* Quick info grid */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="p-3 bg-gray-50/50 rounded-2xl border border-gray-100/50">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 leading-none">Qon guruhi</p>
                      <p className="text-xs font-black text-red-500">{child.bloodType}</p>
                    </div>
                    <div className="p-3 bg-gray-50/50 rounded-2xl border border-gray-100/50">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 leading-none">Ota-onasi</p>
                      <p className="text-xs font-black text-gray-700 truncate">{child.parentName.split(' ')[0]}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-5 border-t border-gray-100">
                    <button
                      onClick={() => setProfileChild(child)}
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-50 text-blue-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all"
                    >
                      Profil
                    </button>
                    <button
                      onClick={() => setEventsChild(child)}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${child.todayEvents > 0 ? 'bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white shadow-lg shadow-rose-200' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                    >
                      Hodisalar
                      {child.todayEvents > 0 && <span className="w-4 h-4 bg-white/20 rounded-full flex items-center justify-center">{child.todayEvents}</span>}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {displayList.length === 0 && (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
          <Search className="w-12 h-12 text-gray-200 mx-auto mb-3"/>
          <p className="text-gray-500 font-medium">Hech qanday bola topilmadi</p>
        </div>
      )}
    </div>
  );
}
