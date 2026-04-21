import { useState } from 'react';
import { format, isSameDay } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import * as Popover from '@radix-ui/react-popover';
import { FileText, TrendingUp, TrendingDown, Download, Calendar, BarChart2, PieChart as PieIcon, X, Info, RotateCcw } from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';

import 'react-day-picker/dist/style.css';

const dailyEventsData = [
  { day: 'Dush', critical: 2, warning: 5, info: 8 },
  { day: 'Sesh', critical: 1, warning: 3, info: 6 },
  { day: 'Chor', critical: 3, warning: 4, info: 7 },
  { day: 'Pay', critical: 1, warning: 6, info: 9 },
  { day: 'Juma', critical: 2, warning: 4, info: 5 },
];

const attendanceData = [
  { day: '07.04', present: 142, absent: 14 },
  { day: '06.04', present: 138, absent: 18 },
  { day: '05.04', present: 145, absent: 11 },
  { day: '04.04', present: 140, absent: 16 },
  { day: '03.04', present: 143, absent: 13 },
];

const eventsByType = [
  { name: 'Yiqilish', value: 12, color: '#ef4444' },
  { name: 'Mushtlashuv', value: 8, color: '#f59e0b' },
  { name: "Yig'lash", value: 15, color: '#eab308' },
  { name: 'Zona monitoring', value: 10, color: '#3b82f6' },
  { name: 'Boshqalar', value: 5, color: '#6b7280' },
];

const reports = [
  {
    title: 'Haftalik hodisalar hisoboti',
    description: "Oxirgi hafta ichidagi barcha hodisalar to'liq tahlili",
    period: '01.04.2026 - 07.04.2026',
    filename: 'Haftalik_hodisalar_hisoboti.doc',
    color: 'from-red-500 to-rose-600',
    badge: 'bg-red-100 text-red-700',
    content: `HAFTALIK HODISALAR HISOBOTI\n01.04.2026 - 07.04.2026\n\nJami hodisalar: 156\nKritik: 9\nOgohlantirish: 22\nAxborot: 125\n\nDastur tomonidan avtomatik yaratildi.\nBogchaGuard AI tizimi.`
  },
  {
    title: 'Oylik davomatlik hisoboti',
    description: 'Bolalar davomatligi va statistikasi',
    period: 'Mart 2026',
    filename: 'Oylik_davomatlik_hisoboti.doc',
    color: 'from-emerald-500 to-teal-600',
    badge: 'bg-emerald-100 text-emerald-700',
    content: `OYLIK DAVOMATLIK HISOBOTI\nMart 2026\n\nJami bolalar: 156\nO'rtacha davomat: 91.5%\nEng ko'p kelgan: Aziz Karimov\nEng kam kelgan: Madina Alimova\n\nBogchaGuard AI tizimi.`
  },
  {
    title: 'Xavfsizlik tahlili',
    description: 'Kritik hodisalar va tizim samaradorligi',
    period: 'Q1 2026',
    filename: 'Xavfsizlik_tahlili_Q1_2026.doc',
    color: 'from-amber-500 to-orange-600',
    badge: 'bg-amber-100 text-amber-700',
    content: `XAVFSIZLIK TAHLILI\n1-chorak (Q1) 2026\n\nTizim ishonchliligi: 99.7%\nKritik hodisalar: 27\nO'rtacha javob vaqti: 2.3 soniya\nJami kuzatuv vaqti: 2184 soat\n\nBogchaGuard AI tizimi.`
  },
  {
    title: 'Xodimlar faolligi',
    description: "Xodimlar ish vaqti va javob vaqti tahlili",
    period: 'Mart 2026',
    filename: 'Xodimlar_faolligi_mart_2026.doc',
    color: 'from-purple-500 to-violet-600',
    badge: 'bg-purple-100 text-purple-700',
    content: `XODIMLAR FAOLLIGI HISOBOTI\nMart 2026\n\nFaol xodimlar: 5\nO'rtacha ish vaqti: 8.2 soat/kun\nEng faol: Akmal Abdullayev\nO'rtacha javob: 1.8 daqiqa\n\nBogchaGuard AI tizimi.`
  },
];

function downloadWord(report) {
  const blob = new Blob([report.content], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = report.filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

const summaryStats = [
  { label: 'Jami hodisalar', value: '156', change: '+12%', up: true },
  { label: 'Kritik hodisalar', value: '9', change: '-5%', up: false },
  { label: "O'rtacha javob", value: '2.3s', change: '-0.5s', up: false },
  { label: 'Tizim ishonchliligi', value: '99.7%', change: '+0.2%', up: true },
];

export function ReportsPage() {
  const [range, setRange] = useState();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // For demonstration, only "today" (assuming today is April 7, 2026 based on mock data) has data.
  // In a real app, this would be an API call based on the range.
  const hasData = !range || (range.from && isSameDay(range.from, new Date(2026, 3, 7)));

  const handleReset = () => {
    setRange(undefined);
  };

  const rangeLabel = range?.from 
    ? (range.to 
        ? `${format(range.from, 'dd.MM.yyyy')} - ${format(range.to, 'dd.MM.yyyy')}`
        : format(range.from, 'dd.MM.yyyy'))
    : 'Davr tanlash';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Hisobotlar</h1>
          <p className="text-gray-500">Statistika va tahlil ma'lumotlari</p>
        </div>
        
        <div className="flex items-center gap-2">
          {range && (
            <button 
              onClick={handleReset}
              className="p-2.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
              title="Filtrni tozalash"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          )}
          
          <Popover.Root open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <Popover.Trigger asChild>
              <button className={`flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all shadow-sm ${range ? 'border-blue-500 ring-1 ring-blue-500/20' : ''}`}>
                <Calendar className={`w-4 h-4 ${range ? 'text-blue-600' : ''}`} />
                <span className="text-sm font-medium">{rangeLabel}</span>
              </button>
            </Popover.Trigger>
            <Popover.Content className="z-50 bg-white p-4 rounded-3xl shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200" sideOffset={8}>
              <DayPicker
                mode="range"
                selected={range}
                onSelect={(r) => {
                  setRange(r);
                  if (r?.from && r?.to) setIsCalendarOpen(false);
                }}
                className="m-0 border-none"
                classNames={{
                  selected: "bg-blue-600 text-white rounded-full",
                  range_start: "rounded-l-full",
                  range_end: "rounded-r-full",
                  range_middle: "bg-blue-50 text-blue-600",
                  day: "hover:bg-blue-50 rounded-full transition-colors",
                  caption: "flex justify-center pt-1 relative items-center mb-4",
                  caption_label: "text-sm font-bold text-gray-900",
                  nav: "space-x-1 flex items-center",
                  nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                  table: "w-full border-collapse space-y-1",
                  head_row: "flex",
                  head_cell: "text-gray-400 rounded-md w-9 font-normal text-[0.8rem]",
                  row: "flex w-full mt-2",
                  cell: "text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
                }}
              />
            </Popover.Content>
          </Popover.Root>
        </div>
      </div>

      {!hasData ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="min-h-[60vh] flex flex-col items-center justify-center glass rounded-[3rem] border-dashed border-primary/20 p-12 text-center"
        >
          <div className="w-24 h-24 bg-primary/5 rounded-[2rem] flex items-center justify-center mb-8 shadow-inner">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Info className="w-12 h-12 text-primary" />
            </motion.div>
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-3 tracking-tighter">Ma'lumot topilmadi</h2>
          <p className="text-gray-400 font-medium max-w-sm mx-auto mb-10 leading-relaxed">
            Siz tanlagan {rangeLabel} davri uchun hech qanday statistik ma'lumotlar mavjud emas.
          </p>
          <button 
            onClick={handleReset}
            className="px-8 py-4 vibrant-gradient text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-primary/30 hover:shadow-primary/50"
          >
            Barchasini ko'rish
          </button>
        </motion.div>
      ) : (
        <>
          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {summaryStats.map((stat, idx) => (
              <motion.div 
                key={stat.label} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
                className="glass rounded-[2rem] p-6 shadow-xl shadow-gray-200/30 border-white/60 flex flex-col justify-between hover:bg-white transition-all"
              >
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">{stat.label}</p>
                <div className="flex items-end justify-between">
                  <p className="text-3xl font-black text-gray-900 tracking-tighter">{stat.value}</p>
                  <div className={`flex items-center gap-0.5 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${stat.up ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                    {stat.change}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass rounded-[2.5rem] p-8 shadow-xl shadow-gray-200/30 border-white/60"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                  <BarChart2 className="w-6 h-6 text-blue-600"/>
                </div>
                <div>
                  <h2 className="text-xl font-black text-gray-900 tracking-tight">Kunlik Hodisalar</h2>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Haftalik dinamika</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={dailyEventsData} barSize={16}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false}/>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}/>
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}/>
                  <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}/>
                  <Bar dataKey="critical" fill="oklch(0.6 0.2 25)" name="Kritik" radius={[6,6,0,0]}/>
                  <Bar dataKey="warning" fill="oklch(0.7 0.15 80)" name="Ogohlantirish" radius={[6,6,0,0]}/>
                  <Bar dataKey="info" fill="oklch(0.55 0.25 264)" name="Axborot" radius={[6,6,0,0]}/>
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass rounded-[2.5rem] p-8 shadow-xl shadow-gray-200/30 border-white/60"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-emerald-600"/>
                </div>
                <div>
                  <h2 className="text-xl font-black text-gray-900 tracking-tight">Davomatlik</h2>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">So'nggi 5 kun</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false}/>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}/>
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}/>
                  <Tooltip contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}/>
                  <Line type="monotone" dataKey="present" stroke="oklch(0.6 0.2 150)" strokeWidth={4} name="Kelgan" dot={{ fill: 'oklch(0.6 0.2 150)', r: 6, strokeWidth: 3, stroke: '#fff' }}/>
                  <Line type="monotone" dataKey="absent" stroke="oklch(0.6 0.2 25)" strokeWidth={4} name="Kelmagan" dot={{ fill: 'oklch(0.6 0.2 25)', r: 6, strokeWidth: 3, stroke: '#fff' }}/>
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-[2.5rem] p-8 shadow-xl shadow-gray-200/30 border-white/60"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-purple-50 rounded-xl text-purple-600">
                  <PieIcon className="w-6 h-6"/>
                </div>
                <h2 className="text-xl font-black text-gray-900 tracking-tight">Turlar</h2>
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={eventsByType} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={8} dataKey="value">
                    {eventsByType.map((entry, index) => <Cell key={index} fill={entry.color}/>)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}/>
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-8 space-y-2">
                {eventsByType.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}/>
                      <span className="text-xs font-bold text-gray-500">{item.name}</span>
                    </div>
                    <span className="text-xs font-black text-gray-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2 glass rounded-[2.5rem] p-8 shadow-xl shadow-gray-200/30 border-white/60"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
                  <FileText className="w-6 h-6"/>
                </div>
                <div>
                  <h2 className="text-xl font-black text-gray-900 tracking-tight">Tayyor Hisobotlar</h2>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">Yuklab olish uchun</p>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {reports.map((report, index) => (
                  <motion.div 
                    key={index}
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="flex flex-col p-6 bg-gray-50/50 hover:bg-white rounded-[2rem] border border-transparent hover:border-primary/20 transition-all cursor-pointer group shadow-sm hover:shadow-xl"
                    onClick={() => downloadWord(report)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${report.color} flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform`}>
                        <FileText className="w-6 h-6 text-white"/>
                      </div>
                      <div className="p-2 bg-white rounded-xl shadow-sm text-primary opacity-0 group-hover:opacity-100 transition-all">
                        <Download className="w-4 h-4"/>
                      </div>
                    </div>
                    <h3 className="text-sm font-black text-gray-900 mb-1 group-hover:text-primary transition-colors">{report.title}</h3>
                    <p className="text-[10px] font-medium text-gray-400 leading-relaxed mb-4">{report.description}</p>
                    <div className={`mt-auto inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest w-fit ${report.badge}`}>
                      {report.period}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </div>
  );
}
