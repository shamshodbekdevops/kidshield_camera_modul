import { Video, MapPin, Camera, Maximize2, X, Download } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

export function CameraFeed({ cameraName, location, compact = false, isOnline = true }) {
  const [timestamp, setTimestamp] = useState(new Date());
  const canvasRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => setTimestamp(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Animate particles on canvas for a realistic feed look
  useEffect(() => {
    if (!isOnline || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let raf;
    const dots = Array.from({ length: compact ? 4 : 8 }, (_, i) => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * (compact ? 10 : 16) + 8,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.3,
      color: ['#fde68a', '#bfdbfe', '#a7f3d0', '#fca5a5'][i % 4],
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      dots.forEach(d => {
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = d.color + '55';
        ctx.fill();
        d.x += d.dx; d.y += d.dy;
        if (d.x < 0 || d.x > canvas.width) d.dx *= -1;
        if (d.y < 0 || d.y > canvas.height) d.dy *= -1;
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [isOnline, compact]);

  if (!isOnline) {
    return (
      <div className={`relative bg-gray-900 rounded-xl overflow-hidden ${compact ? 'aspect-video' : 'aspect-video'} flex flex-col items-center justify-center`}>
        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,#1f2937,#1f2937_10px,#111827_10px,#111827_20px)]"/>
        <div className="relative flex flex-col items-center gap-3 text-center px-4">
          <div className="w-12 h-12 bg-gray-700 rounded-2xl flex items-center justify-center">
            <Camera className="w-6 h-6 text-gray-500"/>
          </div>
          <div>
            <p className="text-white font-semibold text-sm">{cameraName}</p>
            <p className="text-red-400 text-xs font-medium mt-1">⚠ Ishlamayapti</p>
          </div>
        </div>
        <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-red-900/70 text-red-300 text-xs px-2 py-1 rounded-lg">
          <div className="w-1.5 h-1.5 bg-red-400 rounded-full"/>
          OFFLINE
        </div>
      </div>
    );
  }

  return (
    <div className={`relative bg-gray-900 rounded-xl overflow-hidden ${compact ? 'aspect-video' : 'aspect-video'}`}>
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-blue-950 to-indigo-950"/>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-60"
        width={640} height={360}/>

      {/* Grid scanline overlay */}
      <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)' }}/>

      {/* Detection box simulation */}
      {!compact && (
        <div className="absolute" style={{ top: '30%', left: '35%', width: '90px', height: '120px' }}>
          <div className="w-full h-full border-2 border-green-400 rounded-lg animate-pulse relative">
            <div className="absolute -top-5 left-0 bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded font-mono">
              Bola #12 ✓
            </div>
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-green-300"/>
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-green-300"/>
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-green-300"/>
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-green-300"/>
          </div>
        </div>
      )}

      {/* Top overlay */}
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1 bg-white/10 rounded-md">
              <Video className="w-3 h-3 text-white"/>
            </div>
            <div>
              <p className={`text-white font-medium ${compact ? 'text-[11px]' : 'text-xs'}`}>{cameraName}</p>
              <p className="text-gray-400 text-[10px] flex items-center gap-0.5">
                <MapPin className="w-2.5 h-2.5"/> {location}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"/>
            REC
          </div>
        </div>
      </div>

      {/* Bottom timestamp */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
        <p className="text-white/70 text-[10px] font-mono">
          {timestamp.toLocaleTimeString('uz-UZ')} • {timestamp.toLocaleDateString('uz-UZ')} • <span className="text-green-400">Ishlayapti</span>
        </p>
      </div>
    </div>
  );
}
