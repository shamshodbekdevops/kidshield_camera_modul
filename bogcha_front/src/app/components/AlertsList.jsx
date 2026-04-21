import { useAppStore } from '../store';
import { AlertTriangle, AlertCircle, Info, Clock, X } from 'lucide-react';
import { useEffect } from 'react';
export function AlertsList() {
    const alerts = useAppStore((state) => state.alerts);
    const addAlert = useAppStore((state) => state.addAlert);
    const removeAlert = useAppStore((state) => state.removeAlert);
    // Simulate incoming alerts
    useEffect(() => {
        const mockAlerts = [
            {
                severity: 'warning',
                eventType: 'fall_detection',
                description: 'Bola yiqilib tushdi - Guruh 1',
                cameraId: 'cam-1',
                childName: 'Aziz Karimov',
            },
            {
                severity: 'info',
                eventType: 'group_count_change',
                description: 'Guruh bola soni o\'zgarishi',
                cameraId: 'cam-2',
            },
        ];
        // Add initial mock alerts
        setTimeout(() => {
            mockAlerts.forEach((alert, index) => {
                setTimeout(() => {
                    addAlert({
                        id: `alert-${Date.now()}-${index}`,
                        ...alert,
                        timestamp: new Date(),
                    });
                }, index * 2000);
            });
        }, 3000);
    }, [addAlert]);
    const getSeverityConfig = (severity) => {
        const configs = {
            critical: {
                icon: AlertTriangle,
                bg: 'bg-red-50',
                border: 'border-red-200',
                text: 'text-red-700',
                iconBg: 'bg-red-100',
                iconColor: 'text-red-600',
                label: 'KRITIK',
            },
            warning: {
                icon: AlertCircle,
                bg: 'bg-yellow-50',
                border: 'border-yellow-200',
                text: 'text-yellow-700',
                iconBg: 'bg-yellow-100',
                iconColor: 'text-yellow-600',
                label: 'OGOHLANTIRISH',
            },
            info: {
                icon: Info,
                bg: 'bg-blue-50',
                border: 'border-blue-200',
                text: 'text-blue-700',
                iconBg: 'bg-blue-100',
                iconColor: 'text-blue-600',
                label: 'AXBOROT',
            },
        };
        return configs[severity];
    };
    const getTimeAgo = (timestamp) => {
        const timeValue = typeof timestamp === 'string' ? new Date(timestamp).getTime() : timestamp.getTime();
        const seconds = Math.floor((new Date().getTime() - timeValue) / 1000);
        if (seconds < 60)
            return `${seconds} soniya oldin`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60)
            return `${minutes} daqiqa oldin`;
        const hours = Math.floor(minutes / 60);
        return `${hours} soat oldin`;
    };
    return (<div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl text-gray-900">Xabardorliklar</h2>
        <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
          {alerts.length}
        </span>
      </div>

      {alerts.length === 0 ? (<div className="text-center py-8">
          <Info className="w-12 h-12 text-gray-300 mx-auto mb-3"/>
          <p className="text-gray-500 text-sm">Hozircha xabardorliklar yo'q</p>
        </div>) : (<div className="space-y-3 max-h-[600px] overflow-y-auto">
          {alerts.map((alert) => {
                const config = getSeverityConfig(alert.severity);
                const Icon = config.icon;
                return (<div key={alert.id} className={`${config.bg} ${config.border} border rounded-lg p-4 relative group`}>
                <button onClick={() => removeAlert(alert.id)} className="absolute top-2 right-2 p-1 hover:bg-white/50 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  <X className="w-4 h-4 text-gray-600"/>
                </button>

                <div className="flex gap-3">
                  <div className={`${config.iconBg} p-2 rounded-lg h-fit`}>
                    <Icon className={`w-5 h-5 ${config.iconColor}`}/>
                  </div>
                  <div className="flex-1">
                    <div className={`text-xs ${config.text} mb-1`}>
                      {config.label}
                    </div>
                    <p className="text-sm text-gray-900 mb-2">
                      {alert.description}
                    </p>
                    {alert.childName && (<p className="text-xs text-gray-600 mb-2">
                        Bola: {alert.childName}
                      </p>)}
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3"/>
                      {getTimeAgo(alert.timestamp)}
                    </div>
                  </div>
                </div>
              </div>);
            })}
        </div>)}
    </div>);
}
