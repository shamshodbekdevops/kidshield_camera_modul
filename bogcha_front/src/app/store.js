import { create } from 'zustand';

// Vaqtincha test qilish uchun mock alert
const initialAlerts = [
  {
    id: 'mock-1',
    severity: 'critical',
    message: 'Hovlida begona shaxs kamerasida yuz tasvirga olindi',
    timestamp: new Date().toISOString(),
    isRead: false
  },
  {
    id: 'mock-2',
    severity: 'warning',
    message: 'Bolalar guruhiga 1 ta yangi xabar',
    timestamp: new Date().toISOString(),
    isRead: false
  }
];

export const useAppStore = create((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    alerts: initialAlerts,
    addAlert: (alert) => set((state) => ({ alerts: [alert, ...state.alerts] })),
    removeAlert: (id) => set((state) => ({ alerts: state.alerts.filter(a => a.id !== id) })),
}));
