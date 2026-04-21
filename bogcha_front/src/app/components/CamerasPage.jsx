import { Video, MapPin, Signal, Grid2x2, Grid3x3, Maximize2, X, Camera, Download, Wifi, WifiOff } from 'lucide-react';
import { useState, useRef } from 'react';
import { CameraFeed } from './CameraFeed';

const cameras = [
  { id: '1', name: "Guruh 1 - Asosiy xona", location: 'Ichki', status: 'online' },
  { id: '2', name: "Guruh 1 - O'yin zonasi", location: 'Ichki', status: 'online' },
  { id: '3', name: 'Guruh 2 - Asosiy xona', location: 'Ichki', status: 'online' },
  { id: '4', name: 'Guruh 2 - Uxlash xonasi', location: 'Ichki', status: 'online' },
  { id: '5', name: 'Kirish eshigi', location: 'Tashqi perimetr', status: 'online' },
  { id: '6', name: 'Hovli - Markaziy', location: 'Tashqi', status: 'online' },
  { id: '7', name: 'Ovqatlanish xonasi', location: 'Ichki', status: 'online' },
  { id: '8', name: 'Koridor', location: 'Ichki', status: 'offline' },
];

function FullscreenModal({ camera, onClose }) {
  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 bg-gray-900/90 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-xl">
            <Video className="w-4 h-4 text-white"/>
          </div>
          <div>
            <p className="text-white font-semibold">{camera.name}</p>
            <p className="text-gray-400 text-sm flex items-center gap-1">
              <MapPin className="w-3 h-3"/> {camera.location}
            </p>
          </div>
        </div>
        <button onClick={onClose}
          className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-white">
          <X className="w-5 h-5"/>
        </button>
      </div>
      <div className="flex-1 p-6">
        <CameraFeed cameraName={camera.name} location={camera.location} isOnline={camera.status === 'online'}/>
      </div>
    </div>
  );
}

export function CamerasPage() {
  const [layout, setLayout] = useState('2x2');
  const [fullscreenCam, setFullscreenCam] = useState(null);
  const [snapMsg, setSnapMsg] = useState('');

  const handleSnapshot = (camera) => {
    setSnapMsg(`"${camera.name}" kamerasidan snapshot saqlandi!`);
    setTimeout(() => setSnapMsg(''), 3000);
  };

  const getGridClass = () => {
    if (layout === '1x1') return 'grid-cols-1 max-w-3xl mx-auto';
    if (layout === '2x2') return 'grid-cols-1 lg:grid-cols-2';
    return 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3';
  };

  const onlineCount = cameras.filter(c => c.status === 'online').length;

  return (
    <div className="space-y-6">
      {fullscreenCam && <FullscreenModal camera={fullscreenCam} onClose={() => setFullscreenCam(null)}/>}

      {/* Snapshot Toast */}
      {snapMsg && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right-8">
          <Camera className="w-4 h-4"/>
          <span className="text-sm font-medium">{snapMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Kameralar</h1>
          <div className="flex items-center gap-3 text-sm">
            <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
              <Wifi className="w-4 h-4"/>
              {onlineCount} ishlayapti
            </span>
            <span className="text-gray-300">•</span>
            <span className="flex items-center gap-1.5 text-red-500 font-medium">
              <WifiOff className="w-4 h-4"/>
              {cameras.length - onlineCount} ishlamayapti
            </span>
            <span className="text-gray-300">•</span>
            <span className="text-gray-500">{cameras.length} jami</span>
          </div>
        </div>

        {/* Layout Switcher */}
        <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-2xl shadow-sm border border-gray-200">
          {[
            { key: '1x1', icon: Maximize2, label: '1×1' },
            { key: '2x2', icon: Grid2x2, label: '2×2' },
            { key: '3x3', icon: Grid3x3, label: '3×3' },
          ].map(({ key, icon: Icon, label }) => (
            <button key={key} onClick={() => setLayout(key)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                layout === key
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}>
              <Icon className="w-4 h-4"/>
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Cameras Grid */}
      <div className={`grid ${getGridClass()} gap-5`}>
        {cameras.map((camera) => (
          <div key={camera.id}
            className={`bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-lg transition-all group ${
              camera.status === 'online' ? 'border-gray-100' : 'border-red-100'
            }`}>
            {/* Card header */}
            <div className={`px-4 py-3 border-b flex items-center justify-between ${
              camera.status === 'online' ? 'border-gray-100 bg-gray-50/50' : 'border-red-100 bg-red-50/50'
            }`}>
              <div className="flex items-center gap-2.5">
                <div className={`p-1.5 rounded-lg ${camera.status === 'online' ? 'bg-blue-100' : 'bg-red-100'}`}>
                  <Video className={`w-4 h-4 ${camera.status === 'online' ? 'text-blue-600' : 'text-red-500'}`}/>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{camera.name}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <MapPin className="w-2.5 h-2.5"/> {camera.location}
                  </p>
                </div>
              </div>
              <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                camera.status === 'online'
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-red-100 text-red-600'
              }`}>
                <div className={`w-1.5 h-1.5 rounded-full ${camera.status === 'online' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}/>
                {camera.status === 'online' ? 'Ishlayapti' : 'Ishlamayapti'}
              </div>
            </div>

            {/* Feed */}
            <div className="p-3">
              <CameraFeed cameraName={camera.name} location={camera.location} compact isOnline={camera.status === 'online'}/>
            </div>

            {/* Actions */}
            <div className="px-3 pb-3 grid grid-cols-2 gap-2">
              <button
                onClick={() => setFullscreenCam(camera)}
                disabled={camera.status !== 'online'}
                className="flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed">
                <Maximize2 className="w-4 h-4"/>
                Full Screen
              </button>
              <button
                onClick={() => handleSnapshot(camera)}
                disabled={camera.status !== 'online'}
                className="flex items-center justify-center gap-2 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                <Download className="w-4 h-4"/>
                Snapshot
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
