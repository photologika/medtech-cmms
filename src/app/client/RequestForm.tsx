'use client';

import { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

type Equipment = {
  id: string;
  name: string;
  serialNumber: string | null;
  facility: { name: string };
};

export default function RequestForm({
  equipments,
  createRequestAction
}: {
  equipments: Equipment[];
  createRequestAction: (formData: FormData) => Promise<void>;
}) {
  const [selectedEq, setSelectedEq] = useState('');
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    let scanner: Html5QrcodeScanner | null = null;
    if (scanning) {
      scanner = new Html5QrcodeScanner(
        "reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      );

      scanner.render(
        (decodedText) => {
          const found = equipments.find(eq => eq.id === decodedText);
          if (found) {
            setSelectedEq(found.id);
            setScanning(false);
            scanner?.clear();
          } else {
            alert('Оборудование с таким QR-кодом не найдено.');
          }
        },
        (error) => {
          // ignore scanner errors
        }
      );
    }

    return () => {
      if (scanner) {
        scanner.clear().catch(console.error);
      }
    };
  }, [scanning, equipments]);

  return (
    <form action={createRequestAction} className="space-y-5">
      <div>
        <label htmlFor="equipmentId" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
          Идентификация оборудования
        </label>
        
        <div className="flex flex-col gap-3 mb-2">
          {scanning ? (
            <div className="bg-slate-900 rounded-xl p-2 relative overflow-hidden">
               <div id="reader" className="w-full mx-auto bg-black rounded-lg overflow-hidden [&>div]:border-none"></div>
               <div className="absolute inset-0 border-2 border-blue-500 opacity-20 pointer-events-none rounded-xl"></div>
            </div>
          ) : (
             <div className="relative">
                <div className="absolute inset-0 bg-slate-900 rounded-xl flex items-center justify-center border-2 border-dashed border-slate-700">
                   <div className="text-center">
                     <svg className="w-8 h-8 text-slate-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" /></svg>
                     <p className="text-xs text-slate-400 font-medium">Сенсор ожидает</p>
                   </div>
                </div>
                {/* Transparent div to hold space if we wanted, but let's hide the visual box if not scanning and show a scan button */}
             </div>
          )}

          <div className="flex gap-2">
            <select 
              id="equipmentId" 
              name="equipmentId" 
              required 
              value={selectedEq}
              onChange={(e) => setSelectedEq(e.target.value)}
              className="block w-full rounded-lg border-slate-200 bg-slate-50 shadow-sm focus:border-[#0066b3] focus:ring-[#0066b3] text-sm py-2.5 px-3 border transition-colors"
            >
              <option value="" disabled>Ручной выбор из базы...</option>
              {equipments.map(eq => (
                <option key={eq.id} value={eq.id}>
                  {eq.name} ({eq.facility.name}) - S/N: {eq.serialNumber || 'N/A'}
                </option>
              ))}
            </select>
            
            <button
              type="button"
              onClick={() => setScanning(!scanning)}
              className={`flex-shrink-0 px-4 py-2.5 rounded-lg shadow-sm text-sm font-bold transition-colors flex items-center gap-2
                 ${scanning ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100' : 'bg-[#0066b3] text-white hover:bg-[#005299]'}`}
            >
              {scanning ? 'Отмена' : (
                 <>
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                   QR-Скан
                 </>
              )}
            </button>
          </div>
        </div>
      </div>
      
      <div className="border-t border-slate-100 pt-4">
        <label htmlFor="description" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
          Экспресс-фиксация дефекта
        </label>
        <p className="text-xs text-slate-400 mb-3">Выберите ключевой признак поломки или опишите ситуацию детально</p>
        
        <div className="grid grid-cols-2 gap-2 mb-3">
           <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center text-xs font-medium text-slate-600 hover:bg-blue-50 hover:border-blue-200 cursor-pointer transition-colors" onClick={() => {
             const el = document.getElementById('description') as HTMLTextAreaElement;
             if(el) el.value = "Не включается\n" + el.value;
           }}>
              <svg className="w-5 h-5 mx-auto mb-1 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636a9 9 0 11-12.728 0M12 3v9" /></svg>
              Не включается
           </div>
           <div className="bg-blue-500 border border-blue-600 rounded-lg p-3 text-center text-xs font-medium text-white shadow-sm cursor-pointer transition-colors" onClick={() => {
             const el = document.getElementById('description') as HTMLTextAreaElement;
             if(el) el.value = "Сбой калибровки\n" + el.value;
           }}>
              <svg className="w-5 h-5 mx-auto mb-1 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
              Сбой калибровки
           </div>
        </div>

        <textarea 
          id="description" 
          name="description" 
          rows={3} 
          required 
          className="mt-1 block w-full rounded-lg border-slate-200 bg-slate-50 shadow-sm focus:border-[#0066b3] focus:ring-[#0066b3] text-sm py-3 px-4 border transition-colors resize-none"
          placeholder="Клиническое описание ситуации (например: При переключении режима выдает ошибку датчика потока #E-104)..."
        />
      </div>
      
      <button 
        type="submit" 
        className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-[#0066b3] hover:bg-[#005299] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0066b3] transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
        Отправить заявку в диспетчерскую
      </button>
      
      <div className="text-center mt-3 flex items-center justify-center gap-2 text-xs text-slate-500 font-medium">
         <svg className="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
         Приоритет: Критический (Жизнеобеспечение)
      </div>
    </form>
  );
}
