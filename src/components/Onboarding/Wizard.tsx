import { useState } from 'react';
import useTripStore from '../../store/TripStore';
import { generateItinerary } from '../../services/gemini';
import { MapPin, Calendar, DollarSign, Users, Sparkles, ArrowRight, Loader2 } from 'lucide-react';

const VIBES = ['Adventure', 'Culture', 'Food & Nightlife', 'Relaxation', 'Shopping', 'Nature'];

export default function Wizard() {
  const [step, setStep] = useState(1);
  const { criteria, updateCriteria, setItinerary, setSetupComplete, setLoadingItinerary } = useTripStore();
  
  const handleNext = () => setStep((s) => Math.min(s + 1, 5));
  const handleBack = () => setStep((s) => Math.max(s - 1, 1));

  const toggleVibe = (vibe: string) => {
    const current = criteria.vibes;
    if (current.includes(vibe)) {
      updateCriteria({ vibes: current.filter((v) => v !== vibe) });
    } else if (current.length < 3) {
      updateCriteria({ vibes: [...current, vibe] });
    }
  };

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    setLoadingItinerary(true);
    try {
      // Dummy keys or standard logic in services
      const itinerary = await generateItinerary(criteria);
      setItinerary(itinerary);
      setSetupComplete(true);
    } catch (error) {
      console.error("Failed to generate itinerary", error);
      alert("Failed to generate itinerary. Please try again.");
    } finally {
      setIsLoading(false);
      setLoadingItinerary(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 mt-12 mb-24">
      <div className="glass-panel max-w-xl w-full rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 h-1 bg-white/10 w-full">
          <div 
            className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300" 
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>

        <div className="text-center mb-8 pt-4">
          <h2 className="text-3xl font-bold mb-2">Design Your Dream Trip</h2>
          <p className="text-text-muted text-sm">Step {step} of 5</p>
        </div>

        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 font-medium text-lg text-primary-dark">
                <MapPin size={20} /> Destination
              </label>
              <input 
                type="text" 
                placeholder="Where to? (e.g., Tokyo, Japan)" 
                className="w-full bg-surface p-4 rounded-xl border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                value={criteria.destination}
                onChange={(e) => updateCriteria({ destination: e.target.value })}
              />
            </div>
            <button 
              onClick={handleNext}
              disabled={!criteria.destination}
              className="w-full bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all mt-6"
            >
              Continue <ArrowRight size={20} />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 font-medium text-lg text-primary-dark">
                <Calendar size={20} /> Dates
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-xs text-text-muted">Start</span>
                  <input 
                    type="date" 
                    className="w-full bg-surface p-4 rounded-xl border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    onChange={(e) => updateCriteria({ startDate: e.target.value ? new Date(e.target.value) : null })}
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-text-muted">End</span>
                  <input 
                    type="date" 
                    className="w-full bg-surface p-4 rounded-xl border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    onChange={(e) => updateCriteria({ endDate: e.target.value ? new Date(e.target.value) : null })}
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <button onClick={handleBack} className="w-1/3 bg-surface hover:bg-white/10 p-4 rounded-xl font-bold transition-all border border-white/5">Back</button>
              <button 
                onClick={handleNext}
                disabled={!criteria.startDate || !criteria.endDate}
                className="w-2/3 bg-primary hover:bg-primary-dark disabled:opacity-50 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
              >
                Continue <ArrowRight size={20} />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 font-medium text-lg text-primary-dark">
                <DollarSign size={20} /> Budget
              </label>
              <div className="flex gap-2">
                <select 
                  className="bg-surface p-4 rounded-xl border border-white/10 outline-none w-1/3"
                  value={criteria.currency}
                  onChange={(e) => updateCriteria({ currency: e.target.value as any })}
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="INR">INR (₹)</option>
                </select>
                <input 
                  type="number" 
                  min="0"
                  placeholder="Total budget" 
                  className="w-2/3 bg-surface p-4 rounded-xl border border-white/10 focus:border-primary outline-none"
                  value={criteria.budget || ''}
                  onChange={(e) => updateCriteria({ budget: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <button onClick={handleBack} className="w-1/3 bg-surface hover:bg-white/10 p-4 rounded-xl font-bold transition-all border border-white/5">Back</button>
              <button 
                onClick={handleNext}
                disabled={criteria.budget <= 0}
                className="w-2/3 bg-primary hover:bg-primary-dark disabled:opacity-50 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
              >
                Continue <ArrowRight size={20} />
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 font-medium text-lg text-primary-dark">
                <Users size={20} /> Group Setup
              </label>
              <div className="grid grid-cols-2 gap-4">
                {['Solo', 'Couple', 'Family', 'Friends'].map((type) => (
                  <button 
                    key={type}
                    onClick={() => updateCriteria({ groupSize: type.toLowerCase() })}
                    className={`p-4 rounded-xl border transition-all text-center font-medium ${
                      criteria.groupSize === type.toLowerCase() 
                      ? 'bg-primary/20 border-primary text-primary-dark' 
                      : 'bg-surface border-white/10 hover:border-white/30 text-text'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <button onClick={handleBack} className="w-1/3 bg-surface hover:bg-white/10 p-4 rounded-xl font-bold transition-all border border-white/5">Back</button>
              <button 
                onClick={handleNext}
                className="w-2/3 bg-primary hover:bg-primary-dark disabled:opacity-50 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
              >
                Continue <ArrowRight size={20} />
              </button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 font-medium text-lg text-primary-dark">
                <Sparkles size={20} /> Travel Vibe (Pick 1-3)
              </label>
              <div className="flex flex-wrap gap-3">
                {VIBES.map((vibe) => {
                  const isSelected = criteria.vibes.includes(vibe);
                  const maxReached = !isSelected && criteria.vibes.length >= 3;
                  return (
                    <button 
                      key={vibe}
                      onClick={() => toggleVibe(vibe)}
                      disabled={maxReached}
                      className={`px-4 py-2 rounded-full border transition-all text-sm font-medium ${
                        isSelected 
                        ? 'bg-secondary/20 border-secondary text-secondary' 
                        : 'bg-surface border-white/10 hover:border-white/30 text-text disabled:opacity-50 disabled:cursor-not-allowed'
                      }`}
                    >
                      {vibe}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <button onClick={handleBack} disabled={isLoading} className="w-1/3 bg-surface hover:bg-white/10 p-4 rounded-xl font-bold transition-all border border-white/5">Back</button>
              <button 
                onClick={handleSubmit}
                disabled={criteria.vibes.length === 0 || isLoading}
                className="w-2/3 bg-gradient-to-r from-primary to-secondary hover:opacity-90 disabled:opacity-50 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20"
              >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : <><Sparkles size={20} /> Generate Trip</>}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
