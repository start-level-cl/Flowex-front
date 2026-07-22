import React, { useState } from 'react';
import { 
  Smartphone, 
  Monitor, 
  MapPin, 
  CheckCircle, 
  XCircle, 
  Camera, 
  Phone, 
  Navigation
} from 'lucide-react';
import { mockDriverRoute } from '../../data/mockData';

export const DailyRoutePage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'mobile' | 'desktop'>('mobile');
  const [stops, setStops] = useState(mockDriverRoute.stops);
  const [activeStopId, setActiveStopId] = useState<string>('STOP-03');
  const [podPhotoUploaded, setPodPhotoUploaded] = useState(false);
  const [signatureName, setSignatureName] = useState('');

  const activeStop = stops.find(s => s.id === activeStopId) || stops[0];

  const handleMarkDelivered = (stopId: string) => {
    setStops(prev => prev.map(s => s.id === stopId ? { ...s, status: 'delivered', notes: `Entregado a ${signatureName || 'destinatario'}.` } : s));
    setPodPhotoUploaded(false);
    setSignatureName('');
  };

  const handleMarkFailed = (stopId: string) => {
    setStops(prev => prev.map(s => s.id === stopId ? { ...s, status: 'failed', notes: 'Intento fallido: Sin respuesta en timbre.' } : s));
  };

  return (
    <div className="space-y-6">
      
      {/* View Switcher Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-flow-secondary uppercase tracking-wider bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200">
            Ejecución de Reparto en Vivo
          </span>
          <h1 className="text-xl font-headline font-bold text-slate-900 mt-1">
            Mi Ruta Diaria (Conductor)
          </h1>
        </div>

        {/* View Toggle */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
          <button
            onClick={() => setViewMode('mobile')}
            className={`flex items-center px-3 py-1.5 rounded-lg font-semibold transition-all ${
              viewMode === 'mobile' ? 'bg-flow-secondary text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-4 h-4 mr-1.5" /> Vista Móvil (Driver App)
          </button>
          <button
            onClick={() => setViewMode('desktop')}
            className={`flex items-center px-3 py-1.5 rounded-lg font-semibold transition-all ${
              viewMode === 'desktop' ? 'bg-flow-primary text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Monitor className="w-4 h-4 mr-1.5" /> Vista Consola (Desktop)
          </button>
        </div>
      </div>

      {viewMode === 'mobile' ? (
        /* Mobile Simulator Layout */
        <div className="max-w-sm mx-auto bg-slate-950 rounded-[40px] p-4 shadow-2xl border-4 border-slate-800">
          
          {/* Smartphone Screen Content */}
          <div className="bg-slate-50 rounded-[32px] overflow-hidden text-slate-900 min-h-[640px] flex flex-col justify-between">
            
            {/* Mobile Header Bar */}
            <div className="bg-flow-primary text-white p-4 pt-6 space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span>09:41 AM</span>
                <span>GPS Batería 94%</span>
              </div>
              <div className="flex justify-between items-end pt-1">
                <div>
                  <span className="text-[10px] text-blue-200 uppercase font-bold">Ruta Viña Z-3</span>
                  <h2 className="text-base font-bold font-headline leading-tight">Roberto Gómez</h2>
                </div>
                <span className="text-xs bg-flow-secondary px-2 py-0.5 rounded-full font-bold">
                  Parada {activeStop.sequence} de {stops.length}
                </span>
              </div>
            </div>

            {/* Active Stop Card */}
            <div className="p-4 space-y-4 overflow-y-auto flex-1">
              
              {/* Select Active Stop Pills */}
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {stops.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setActiveStopId(s.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap border ${
                      activeStopId === s.id
                        ? 'bg-flow-secondary text-white border-flow-secondary shadow-md'
                        : s.status === 'delivered'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    #{s.sequence} {s.recipientName.split(' ')[0]}
                  </button>
                ))}
              </div>

              {/* Stop Detail Card */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex justify-between items-start border-b border-slate-100 pb-2">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-flow-primary">{activeStop.trackingNumber}</span>
                    <h3 className="text-sm font-bold text-slate-900">{activeStop.recipientName}</h3>
                  </div>
                  <a href={`tel:${activeStop.phone}`} className="p-2 bg-emerald-50 text-emerald-700 rounded-full hover:bg-emerald-100">
                    <Phone className="w-4 h-4" />
                  </a>
                </div>

                <div className="text-xs space-y-1 text-slate-600">
                  <p className="flex items-center text-slate-900 font-medium">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-flow-secondary flex-shrink-0" />
                    {activeStop.address}, {activeStop.city}
                  </p>
                  <p className="text-[11px] text-slate-500">Ventana Horaria: {activeStop.timeWindow}</p>
                  {activeStop.notes && (
                    <div className="p-2 bg-amber-50 text-amber-800 rounded-lg text-[11px] border border-amber-200 font-medium">
                      Nota: {activeStop.notes}
                    </div>
                  )}
                </div>

                {/* POD Section */}
                {activeStop.status !== 'delivered' && (
                  <div className="pt-2 border-t border-slate-100 space-y-3">
                    <div className="text-[11px] font-bold text-slate-700 uppercase">Comprobante de Entrega (POD):</div>
                    
                    <button
                      onClick={() => setPodPhotoUploaded(!podPhotoUploaded)}
                      className={`w-full py-2 px-3 border border-dashed rounded-xl text-xs font-semibold flex items-center justify-center transition-colors ${
                        podPhotoUploaded ? 'bg-emerald-50 border-emerald-400 text-emerald-700' : 'bg-slate-50 border-slate-300 text-slate-600'
                      }`}
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      {podPhotoUploaded ? '✓ Foto de Entrega Capturada' : 'Tomar Foto del Paquete / Timbre'}
                    </button>

                    <input
                      type="text"
                      placeholder="Nombre / RUT de quien recibe..."
                      value={signatureName}
                      onChange={(e) => setSignatureName(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-flow-secondary focus:outline-none"
                    />

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        onClick={() => handleMarkDelivered(activeStop.id)}
                        className="py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow flex items-center justify-center"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" /> Entregado
                      </button>
                      <button
                        onClick={() => handleMarkFailed(activeStop.id)}
                        className="py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 flex items-center justify-center"
                      >
                        <XCircle className="w-4 h-4 mr-1" /> Novedad
                      </button>
                    </div>
                  </div>
                )}

                {activeStop.status === 'delivered' && (
                  <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold text-center border border-emerald-200">
                    ✓ Entrega Registrada Exitosamente
                  </div>
                )}
              </div>

            </div>

            {/* Navigation Footer Button */}
            <div className="p-4 bg-white border-t border-slate-200">
              <button 
                onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(activeStop.address + ', ' + activeStop.city)}`, '_blank')}
                className="w-full py-3 bg-flow-primary text-white font-bold text-xs rounded-xl flex items-center justify-center shadow"
              >
                <Navigation className="w-4 h-4 mr-2 text-flow-secondary" /> Iniciar Navegación GPS Waze / Maps
              </button>
            </div>

          </div>

        </div>
      ) : (
        /* Desktop View Layout */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <h2 className="text-lg font-headline font-bold text-slate-900">Hoja de Ruta Diaria (Consola Conductor Desktop)</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stops.map(stop => (
              <div key={stop.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                <div className="flex justify-between font-bold text-xs">
                  <span className="text-flow-primary">Parada #{stop.sequence} - {stop.trackingNumber}</span>
                  <span className="text-slate-500">{stop.timeWindow}</span>
                </div>
                <div className="text-sm font-bold text-slate-900">{stop.recipientName}</div>
                <div className="text-xs text-slate-600">{stop.address}, {stop.city}</div>
                <div className="pt-2 flex justify-between items-center text-xs">
                  <span className="font-mono text-slate-500">Tel: {stop.phone}</span>
                  <button
                    onClick={() => handleMarkDelivered(stop.id)}
                    className="px-3 py-1 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
                  >
                    Confirmar Entrega
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
