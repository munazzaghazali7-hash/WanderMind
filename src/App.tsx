
import Wizard from './components/Onboarding/Wizard';
import DashboardLayout from './components/Dashboard/DashboardLayout';
import BookingSelection from './components/Dashboard/BookingSelection';
import CommunityExplore from './components/Dashboard/CommunityExplore';
import useTripStore from './store/TripStore';
import { Map, Plane, Users } from 'lucide-react';

function App() {
  const { isSetupComplete, activeTab, setActiveTab } = useTripStore();

  const renderContent = () => {
    if (!isSetupComplete) return <Wizard />;
    switch (activeTab) {
      case 'bookings': return <BookingSelection />;
      case 'community': return <CommunityExplore />;
      case 'itinerary':
      default: return <DashboardLayout />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-text flex flex-col">
      <header className="px-6 py-4 border-b border-white/10 glass-panel sticky top-0 z-50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent cursor-pointer" onClick={() => isSetupComplete && setActiveTab('itinerary')}>
          WanderMind
        </h1>
        {isSetupComplete && (
          <nav className="flex items-center gap-2 bg-surface/50 p-1 rounded-full border border-white/5">
            <button 
              onClick={() => setActiveTab('itinerary')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${activeTab === 'itinerary' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-text-muted hover:text-text hover:bg-white/5'}`}
            >
              <Map size={16} /> <span className="hidden sm:inline">My Trip</span>
            </button>
            <button 
              onClick={() => setActiveTab('bookings')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${activeTab === 'bookings' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-text-muted hover:text-text hover:bg-white/5'}`}
            >
              <Plane size={16} /> <span className="hidden sm:inline">Bookings</span>
            </button>
            <button 
              onClick={() => setActiveTab('community')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${activeTab === 'community' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-text-muted hover:text-text hover:bg-white/5'}`}
            >
              <Users size={16} /> <span className="hidden sm:inline">Community</span>
            </button>
          </nav>
        )}
      </header>
      
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
