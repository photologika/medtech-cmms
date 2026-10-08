import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="max-w-3xl w-full p-8 text-center">
        <div className="mb-10 inline-flex items-center justify-center w-20 h-20 bg-[#0066b3] rounded-2xl shadow-lg">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
        </div>
        
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
          МедТехСервис CMMS
        </h1>
        <p className="text-lg text-slate-500 mb-12 max-w-xl mx-auto leading-relaxed">
          Единая платформа управления жизненным циклом медицинского оборудования, контроля ремонтов и поставок.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <Link 
            href="/login" 
            className="group flex flex-col items-center p-8 bg-white rounded-2xl shadow-sm border border-slate-200 hover:border-[#0066b3] hover:shadow-md transition-all"
          >
            <div className="w-12 h-12 bg-blue-50 text-[#0066b3] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" /></svg>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Диспетчерская</h2>
            <p className="text-sm text-slate-500 text-center">Панель управления инцидентами для инженеров и диспетчеров.</p>
          </Link>
          
          <Link 
            href="/client" 
            className="group flex flex-col items-center p-8 bg-white rounded-2xl shadow-sm border border-slate-200 hover:border-[#0066b3] hover:shadow-md transition-all"
          >
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">FAST-TRACK Портал</h2>
            <p className="text-sm text-slate-500 text-center">Мобильное приложение для врачей. QR-сканер и мгновенные заявки.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
