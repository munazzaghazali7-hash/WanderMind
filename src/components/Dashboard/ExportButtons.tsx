import { useState } from 'react';
import { Calendar, FileText, Check, Loader2 } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';

export default function ExportButtons() {
  const [exporting, setExporting] = useState<string | null>(null);

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log('OAuth Success:', tokenResponse);
      // In production: Use token to call Google Calendar/Docs API
      setTimeout(() => setExporting(null), 1500);
    },
    onError: () => {
      console.error('Login Failed');
      setExporting(null);
    },
    scope: 'https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/documents'
  });

  const handleExport = (type: 'calendar' | 'docs') => {
    setExporting(type);
    // Trigger login flow
    login();
    
    // Fallback for demo if no real client ID is set
    setTimeout(() => {
      if (exporting) setExporting(null);
    }, 2000);
  };

  return (
    <div className="flex gap-2">
      <button 
        onClick={() => handleExport('calendar')}
        disabled={!!exporting}
        aria-label="Export to Google Calendar"
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#4285F4]/10 hover:bg-[#4285F4]/20 border border-[#4285F4]/30 text-[#4285F4] transition-all text-sm font-medium disabled:opacity-50"
      >
        {exporting === 'calendar' ? <Loader2 size={16} className="animate-spin" /> : <Calendar size={16} />} 
        <span className="hidden sm:inline">{exporting === 'calendar' ? 'Syncing...' : 'Push to Calendar'}</span>
      </button>

      <button 
        onClick={() => handleExport('docs')}
        disabled={!!exporting}
        aria-label="Export to Google Docs"
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0F9D58]/10 hover:bg-[#0F9D58]/20 border border-[#0F9D58]/30 text-[#0F9D58] transition-all text-sm font-medium disabled:opacity-50"
      >
        {exporting === 'docs' ? <Loader2 size={16} className="animate-spin" /> : <FileText size={16} />} 
        <span className="hidden sm:inline">{exporting === 'docs' ? 'Creating...' : 'Share as Doc'}</span>
      </button>
    </div>
  );
}
