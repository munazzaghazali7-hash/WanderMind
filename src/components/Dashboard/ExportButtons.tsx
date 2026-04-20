import { Calendar, FileText } from 'lucide-react';

export default function ExportButtons() {
  const handleOAuthCalendar = () => {
    alert("Google OAuth integration for Calendar requires a configured GCP client ID to run on localhost. \n\nIn a real deployment, this would pop-up the Google consent flow, request 'calendar.events' scope, and iteratively insert the day's itinerary with buffers.");
  };

  const handleOAuthDocs = () => {
    alert("Similar to Calendar, this requires 'documents' scope and creates a formatted trip document via Google Docs API.");
  };

  return (
    <div className="flex gap-2">
      <button 
        onClick={handleOAuthCalendar}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#4285F4]/10 hover:bg-[#4285F4]/20 border border-[#4285F4]/30 text-[#4285F4] transition-all text-sm font-medium"
      >
        <Calendar size={16} /> <span className="hidden sm:inline">Push to Calendar</span>
      </button>

      <button 
        onClick={handleOAuthDocs}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0F9D58]/10 hover:bg-[#0F9D58]/20 border border-[#0F9D58]/30 text-[#0F9D58] transition-all text-sm font-medium"
      >
        <FileText size={16} /> <span className="hidden sm:inline">Share as Doc</span>
      </button>
    </div>
  );
}
