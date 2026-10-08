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
    <form action={createRequestAction} className="space-y-4">
      <div>
        <label htmlFor="equipmentId" className="block text-sm font-medium text-gray-700 mb-1">
          Выберите оборудование или отсканируйте QR-код
        </label>
        
        <div className="flex gap-2 mb-2">
          <select 
            id="equipmentId" 
            name="equipmentId" 
            required 
            value={selectedEq}
            onChange={(e) => setSelectedEq(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
          >
            <option value="">Выберите оборудование...</option>
            {equipments.map(eq => (
              <option key={eq.id} value={eq.id}>
                {eq.name} ({eq.facility.name}) - С/Н: {eq.serialNumber}
              </option>
            ))}
          </select>
          
          <button
            type="button"
            onClick={() => setScanning(!scanning)}
            className="flex-shrink-0 bg-gray-200 px-4 py-2 rounded shadow hover:bg-gray-300 text-sm font-medium"
          >
            {scanning ? 'Отмена' : 'QR-Скан'}
          </button>
        </div>

        {scanning && (
          <div id="reader" className="w-full max-w-sm mx-auto mb-4 border rounded p-2"></div>
        )}
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Описание неисправности</label>
        <textarea 
          id="description" 
          name="description" 
          rows={4} 
          required 
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
          placeholder="Опишите проблему с оборудованием..."
        />
      </div>
      
      <button 
        type="submit" 
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Отправить заявку
      </button>
    </form>
  );
}
