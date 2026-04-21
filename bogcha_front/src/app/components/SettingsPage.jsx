import { Bell, Video, Shield, Database, Save, CheckCircle, X, Sliders, Monitor } from 'lucide-react';
import { useState, useEffect } from 'react';

function Toast({ message, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div className="fixed top-5 right-5 z-[999] flex items-center gap-3 bg-emerald-600 text-white px-5 py-4 rounded-2xl shadow-2xl animate-in slide-in-from-right-8 duration-300">
      <CheckCircle className="w-5 h-5 flex-shrink-0"/>
      <span className="font-medium text-sm">{message}</span>
      <button onClick={onClose} className="ml-2 hover:bg-white/20 rounded-lg p-0.5 transition-colors">
        <X className="w-4 h-4"/>
      </button>
    </div>
  );
}

export function SettingsPage() {
  const [toast, setToast] = useState(false);
  const [notifications, setNotifications] = useState({ push: true, email: true, sms: false, sound: true });
  const [cameraQuality, setCameraQuality] = useState('1080p');
  const [fps, setFps] = useState('15');
  const [archiveDays, setArchiveDays] = useState('30');
  const [accuracy, setAccuracy] = useState(85);
  const [aiFeatures, setAiFeatures] = useState({ fall: true, fight: true, face: true });

  const handleSave = () => {
    setToast(true);
  };

  const sections = [
    {
      icon: Bell,
      title: 'Xabardorliklar',
      color: 'blue',
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
      content: (
        <div className="space-y-3">
          {[
            { key: 'push', label: 'Push bildirishnomalar', desc: "Qurilmangizga to'g'ridan to'g'ri xabar" },
            { key: 'email', label: 'Email xabardorliklar', desc: 'Elektron pochta orqali xabar' },
            { key: 'sms', label: 'SMS xabardorliklar', desc: 'Telefon raqamiga SMS' },
            { key: 'sound', label: 'Tovush signallari', desc: 'Ovozli ogohlantirish' },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 hover:bg-blue-50/50 rounded-xl transition-colors">
              <div>
                <p className="text-sm font-medium text-gray-800">{item.label}</p>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer"
                  checked={notifications[item.key]}
                  onChange={e => setNotifications(n => ({ ...n, [item.key]: e.target.checked }))}/>
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-focus:ring-2 peer-focus:ring-blue-300"/>
              </label>
            </div>
          ))}
        </div>
      )
    },
    {
      icon: Monitor,
      title: 'Kamera sozlamalari',
      color: 'emerald',
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      content: (
        <div className="space-y-4">
          {[
            { label: 'Video sifati', value: cameraQuality, onChange: setCameraQuality, opts: ['1080p', '720p', '480p'].map(v => ({ val: v, label: `${v === '1080p' ? 'Yuqori' : v === '720p' ? "O'rtacha" : 'Past'} (${v})` })) },
            { label: 'Kadrlar soni (FPS)', value: fps, onChange: setFps, opts: [{ val: '30', label: '30 FPS' }, { val: '15', label: '15 FPS' }, { val: '10', label: '10 FPS' }] },
            { label: 'Video arxiv muddati', value: archiveDays, onChange: setArchiveDays, opts: [{ val: '7', label: '7 kun' }, { val: '14', label: '14 kun' }, { val: '30', label: '30 kun' }, { val: '60', label: '60 kun' }] },
          ].map(sel => (
            <div key={sel.label} className="p-4 bg-gray-50 rounded-xl">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">{sel.label}</label>
              <select value={sel.value} onChange={e => sel.onChange(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-sm">
                {sel.opts.map(o => <option key={o.val} value={o.val}>{o.label}</option>)}
              </select>
            </div>
          ))}
        </div>
      )
    },
    {
      icon: Shield,
      title: 'AI aniqlash sozlamalari',
      color: 'purple',
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-600',
      content: (
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-xl">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-3">Aniqlik chegarasi: <span className="text-purple-700 font-black text-base">{accuracy}%</span></label>
            <input type="range" min="70" max="95" value={accuracy} onChange={e => setAccuracy(Number(e.target.value))}
              className="w-full accent-purple-600"/>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>70%</span><span>95%</span>
            </div>
          </div>
          {[
            { key: 'fall', label: 'Yiqilishni aniqlash', desc: 'Bola yiqilganda darhol xabar beradi' },
            { key: 'fight', label: 'Mushtlashuvni aniqlash', desc: 'Agressiv harakatlarni kuzatadi' },
            { key: 'face', label: 'Yuz tanish (Face Recognition)', desc: 'Begona kishilarni aniqlaydi' },
          ].map(f => (
            <div key={f.key} className="flex items-center justify-between p-4 bg-gray-50 hover:bg-purple-50/50 rounded-xl transition-colors">
              <div>
                <p className="text-sm font-medium text-gray-800">{f.label}</p>
                <p className="text-xs text-gray-500">{f.desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer"
                  checked={aiFeatures[f.key]}
                  onChange={e => setAiFeatures(a => ({ ...a, [f.key]: e.target.checked }))}/>
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-purple-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-focus:ring-2 peer-focus:ring-purple-300"/>
              </label>
            </div>
          ))}
        </div>
      )
    },
    {
      icon: Database,
      title: "Tizim ma'lumotlari",
      color: 'amber',
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-600',
      content: (
        <div className="grid md:grid-cols-2 gap-3">
          {[
            { label: 'Versiya', value: 'v1.0 (MVP)' },
            { label: 'Database hajmi', value: '2.4 GB' },
            { label: 'Video arxiv hajmi', value: '45.2 GB' },
            { label: "So'nggi backup", value: '07.04.2026 03:00' },
            { label: 'Uptime', value: '99.7%' },
            { label: 'Faol foydalanuvchilar', value: '4 online' },
          ].map(info => (
            <div key={info.label} className="p-4 bg-gray-50 rounded-xl">
              <div className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wide">{info.label}</div>
              <div className="text-sm font-bold text-gray-900">{info.value}</div>
            </div>
          ))}
        </div>
      )
    },
  ];

  const colorMap = {
    blue: 'border-blue-200 hover:border-blue-300',
    emerald: 'border-emerald-200 hover:border-emerald-300',
    purple: 'border-purple-200 hover:border-purple-300',
    amber: 'border-amber-200 hover:border-amber-300',
  };

  return (
    <div className="space-y-6">
      {toast && <Toast message="Sozlamalar muvaffaqiyatli saqlandi!" onClose={() => setToast(false)}/>}

      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Sozlamalar</h1>
        <p className="text-gray-500">Tizim sozlamalari va konfiguratsiyasi</p>
      </div>

      <div className="grid gap-5">
        {sections.map((sec) => {
          const Icon = sec.icon;
          return (
            <div key={sec.title} className={`bg-white rounded-2xl p-6 shadow-sm border ${colorMap[sec.color]} transition-all hover:shadow-md`}>
              <div className="flex items-center gap-3 mb-5">
                <div className={`p-2.5 ${sec.iconBg} rounded-xl`}>
                  <Icon className={`w-5 h-5 ${sec.iconColor}`}/>
                </div>
                <h2 className="text-lg font-bold text-gray-900">{sec.title}</h2>
              </div>
              {sec.content}
            </div>
          );
        })}
      </div>

      <div className="flex gap-4">
        <button onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg font-medium">
          <Save className="w-4 h-4"/>
          O'zgarishlarni saqlash
        </button>
        <button className="px-6 py-3.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-medium">
          Bekor qilish
        </button>
      </div>
    </div>
  );
}
