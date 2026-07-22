import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Bot, ArrowRight, Zap, Barcode, ShieldCheck } from 'lucide-react';

export const SmartOrderPage: React.FC = () => {
  const navigate = useNavigate();
  const [rawText, setRawText] = useState(
    'Enviar caja de repuestos automotrices de 6.2 kg a nombre de Pedro Alvarado, teléfono +56944332211 en Calle 1 Norte 1240, Viña del Mar. Salida desde providencia stgo. Valor $350.000.'
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedResult, setParsedResult] = useState<any>(null);

  const handleSmartAnalyze = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setParsedResult({
        trackingNumber: `FX-SMART-${Math.floor(1000 + Math.random() * 9000)}-CL`,
        senderName: 'Importaciones Santiago S.A. (Reconocido de Historial)',
        senderCity: 'Santiago (Providencia)',
        recipientName: 'Pedro Alvarado',
        recipientPhone: '+56 9 4433 2211',
        recipientAddress: 'Calle 1 Norte 1240',
        recipientCity: 'Viña del Mar',
        weightKg: 6.2,
        packageType: 'Repuestos Automotrices (Caja Reforzada)',
        declaredValue: 350000,
        suggestedHub: 'Hub Costa Viña',
        estimatedCost: 16800,
        aiConfidence: '98.5%'
      });
      setIsProcessing(false);
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Banner Intro */}
      <div className="bg-gradient-to-r from-flow-primary via-blue-900 to-flow-primary text-white p-6 rounded-2xl shadow-flow">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-8 h-8 bg-flow-secondary rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-200">IA FlowEx Core Engine</span>
        </div>
        <h1 className="text-2xl font-headline font-bold">Nuevo Pedido Inteligente</h1>
        <p className="text-xs text-blue-200 mt-1 max-w-2xl">
          Pega cualquier texto informal, chat de WhatsApp o nota de pedido. La IA extraerá los datos de envío, validará direcciones y generará la etiqueta automáticamente.
        </p>
      </div>

      {/* Main Parser Container */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Input Text Box */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center">
              <Bot className="w-4 h-4 mr-1.5 text-flow-secondary" /> Entrada de Texto No Estructurado
            </label>
            <textarea
              rows={8}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Ejemplo: Enviar paquete de 3kg a Juan Perez tel 912345678 en Av Apoquindo 3000 Las Condes..."
              className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-flow-secondary focus:outline-none font-mono"
            />
          </div>

          <button
            onClick={handleSmartAnalyze}
            disabled={isProcessing || !rawText.trim()}
            className="w-full py-3 bg-gradient-to-r from-flow-secondary to-orange-500 hover:from-orange-600 hover:to-orange-600 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center transition-all disabled:opacity-50"
          >
            {isProcessing ? (
              <span className="flex items-center">
                <Zap className="w-4 h-4 mr-2 animate-bounce" /> Procesando con IA FlowEx...
              </span>
            ) : (
              <span className="flex items-center">
                <Sparkles className="w-4 h-4 mr-2" /> Extraer Datos & Generar Etiqueta
              </span>
            )}
          </button>
        </div>

        {/* AI Extraction Preview Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="text-xs font-bold text-flow-primary uppercase tracking-wider flex items-center">
              <ShieldCheck className="w-4 h-4 mr-1.5 text-emerald-600" /> Extracción Estructurada IA
            </h3>
            {parsedResult && (
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                Confianza: {parsedResult.aiConfidence}
              </span>
            )}
          </div>

          {parsedResult ? (
            <div className="space-y-4 text-xs">
              
              {/* Generated Barcode Box */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                <div className="flex justify-center mb-1">
                  <Barcode className="w-32 h-10 text-slate-800" />
                </div>
                <div className="font-mono font-bold text-flow-primary text-sm tracking-wider">
                  {parsedResult.trackingNumber}
                </div>
                <span className="text-[10px] text-slate-400">Hub Destino: {parsedResult.suggestedHub}</span>
              </div>

              <div className="space-y-2 divide-y divide-slate-100">
                <div className="pt-2 flex justify-between">
                  <span className="text-slate-500">Destinatario:</span>
                  <span className="font-bold text-slate-900">{parsedResult.recipientName}</span>
                </div>
                <div className="pt-2 flex justify-between">
                  <span className="text-slate-500">Teléfono:</span>
                  <span className="font-mono font-medium text-slate-800">{parsedResult.recipientPhone}</span>
                </div>
                <div className="pt-2 flex justify-between">
                  <span className="text-slate-500">Dirección:</span>
                  <span className="font-medium text-slate-800">{parsedResult.recipientAddress}, {parsedResult.recipientCity}</span>
                </div>
                <div className="pt-2 flex justify-between">
                  <span className="text-slate-500">Carga Reconocida:</span>
                  <span className="font-medium text-slate-800">{parsedResult.packageType} ({parsedResult.weightKg} kg)</span>
                </div>
                <div className="pt-2 flex justify-between">
                  <span className="text-slate-500">Valor Declarado:</span>
                  <span className="font-medium text-slate-800">${parsedResult.declaredValue.toLocaleString()} CLP</span>
                </div>
                <div className="pt-2 flex justify-between items-center">
                  <span className="text-slate-500">Cotización Estimada:</span>
                  <span className="text-lg font-headline font-extrabold text-flow-secondary font-mono">
                    ${parsedResult.estimatedCost.toLocaleString()} CLP
                  </span>
                </div>
              </div>

              <button
                onClick={() => navigate(`/tracking?code=${parsedResult.trackingNumber}`)}
                className="w-full py-2.5 bg-flow-primary hover:bg-blue-900 text-white font-semibold text-xs rounded-xl transition-colors shadow flex items-center justify-center"
              >
                Confirmar y Despachar Pedido <ArrowRight className="w-4 h-4 ml-1.5" />
              </button>

            </div>
          ) : (
            <div className="py-16 text-center text-slate-400 text-xs">
              <Sparkles className="w-10 h-10 mx-auto text-slate-300 mb-2 animate-pulse" />
              Ingresa el texto a la izquierda y presiona "Extraer Datos" para previsualizar la guía.
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
