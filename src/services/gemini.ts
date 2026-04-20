import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import type { Schema } from '@google/generative-ai';
import type { TripCriteria, DayPlan } from '../store/TripStore';

// In a real app with no backend, this key should be provided by the user via UI or a local .env file.
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(API_KEY);

export async function generateItinerary(criteria: TripCriteria): Promise<DayPlan[]> {
  if (!API_KEY) {
    console.warn("No Gemini API Key found. Returning mock data.");
    return getMockData(criteria);
  }

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: "You are WanderMind, an expert hyper-personalized travel planner. You generate exact, actionable itineraries. Always return valid JSON matching the schema.",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: SchemaType.ARRAY,
        items: {
          type: SchemaType.OBJECT,
          properties: {
            dayNumber: { type: SchemaType.INTEGER },
            date: { type: SchemaType.STRING },
            slots: {
              type: SchemaType.OBJECT,
              properties: {
                morning: getActivitySchema(),
                afternoon: getActivitySchema(),
                evening: getActivitySchema()
              }
            }
          },
          required: ["dayNumber", "date", "slots"]
        }
      }
    }
  });

  const prompt = `
    Create a travel itinerary for ${criteria.groupSize} going to ${criteria.destination}.
    Start Date: ${criteria.startDate?.toISOString().split('T')[0]}
    End Date: ${criteria.endDate?.toISOString().split('T')[0]}
    Total Budget: ${criteria.budget} ${criteria.currency}.
    Vibes: ${criteria.vibes.join(', ')}.
    
    CRITICAL CONSTRAINTS:
    1. STRICT DATES: You MUST generate days starting EXACTLY from Start Date and ending EXACTLY on End Date. Do not add extra days or skip days.
    2. STRICT BUDGET: The total sum of 'estimatedCost' for all paid activities combined MUST NOT exceed ${criteria.budget}. You must calculate the running total and heavily use 'free' activities to stay strictly under the budget limit!
    3. Include exactly 3 activities per day (Morning, Afternoon, Evening).
    4. Ensure locations exist in reality.
    5. VERY IMPORTANT: Every single day MUST have different activities. Do NOT repeat the same activities, restaurants, or places across multiple days.
  `;

  try {
    const response = await model.generateContent(prompt);
    const jsonStr = response.response.text();
    const data = JSON.parse(jsonStr);
    
    // Convert parsed JSON into DayPlan[] with Date objects
    return data.map((d: any) => ({
      ...d,
      date: new Date(d.date)
    }));
  } catch (error) {
    console.error("Gemini generation failed", error);
    throw error;
  }
}

function getActivitySchema(): Schema {
  return {
    type: SchemaType.OBJECT,
    properties: {
      id: { type: SchemaType.STRING },
      name: { type: SchemaType.STRING },
      description: { type: SchemaType.STRING },
      vibeReason: { type: SchemaType.STRING },
      durationMinutes: { type: SchemaType.INTEGER },
      estimatedCost: { type: SchemaType.NUMBER },
      type: { type: SchemaType.STRING, format: "enum", enum: ["free", "paid"] },
      category: { type: SchemaType.STRING, format: "enum", enum: ["Food", "Transport", "Activities", "Accommodation"] },
    },
    required: ["id", "name", "description", "vibeReason", "durationMinutes", "estimatedCost", "type", "category"]
  };
}

function getMockData(criteria: TripCriteria): DayPlan[] {
  const start = criteria.startDate || new Date();
  const end = criteria.endDate || new Date(start.getTime() + 2 * 24 * 60 * 60 * 1000);
  const days = Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 3600 * 24)) + 1);

  const mockActivities = [
    {
      m: { name: "Historic City Center Walk", cat: "Activities" as const, cost: 0, type: "free" as const },
      a: { name: "National Art Gallery", cat: "Activities" as const, cost: 20, type: "paid" as const },
      e: { name: "Local Street Food Market", cat: "Food" as const, cost: 15, type: "paid" as const }
    },
    {
      m: { name: "Botanical Gardens", cat: "Activities" as const, cost: 10, type: "paid" as const },
      a: { name: "River Cruise", cat: "Transport" as const, cost: 35, type: "paid" as const },
      e: { name: "High-end Restaurant Dining", cat: "Food" as const, cost: 80, type: "paid" as const }
    },
    {
      m: { name: "Mountain Hike & Viewpoint", cat: "Activities" as const, cost: 0, type: "free" as const },
      a: { name: "Local History Museum", cat: "Activities" as const, cost: 15, type: "paid" as const },
      e: { name: "Cultural Dance Show", cat: "Activities" as const, cost: 40, type: "paid" as const }
    },
    {
      m: { name: "Morning Beach Walk", cat: "Activities" as const, cost: 0, type: "free" as const },
      a: { name: "Cooking Class", cat: "Food" as const, cost: 50, type: "paid" as const },
      e: { name: "Rooftop Bar Cocktails", cat: "Food" as const, cost: 30, type: "paid" as const }
    }
  ];

  return Array.from({ length: days }).map((_, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    
    // Cycle through our mock options
    const dayMock = mockActivities[i % mockActivities.length];

    return {
      dayNumber: i + 1,
      date: d,
      slots: {
        morning: {
          id: `m-${i}`,
          name: `${criteria.destination} ${dayMock.m.name}`,
          description: "Start the morning with a refreshing activity.",
          vibeReason: "Matches your vibe.",
          durationMinutes: 120,
          estimatedCost: dayMock.m.cost,
          type: dayMock.m.type,
          category: dayMock.m.cat,
          location: { lat: 48.8566 + (i * 0.01), lng: 2.3522 - (i * 0.01), address: "Central Area" }
        },
        afternoon: {
          id: `a-${i}`,
          name: `${dayMock.a.name}`,
          description: "Explore deeply.",
          vibeReason: "Perfect for culture seekers.",
          durationMinutes: 180,
          estimatedCost: dayMock.a.cost,
          type: dayMock.a.type,
          category: dayMock.a.cat,
          location: { lat: 48.8606 - (i * 0.01), lng: 2.3376 + (i * 0.01), address: "Activity District" }
        },
        evening: {
          id: `e-${i}`,
          name: `${dayMock.e.name}`,
          description: "Relaxing evening.",
          vibeReason: "Great experience.",
          durationMinutes: 200,
          estimatedCost: dayMock.e.cost,
          type: dayMock.e.type,
          category: dayMock.e.cat,
          location: { lat: 48.8500 + (i * 0.02), lng: 2.3400 + (i * 0.02), address: "Evening District" }
        }
      }
    };
  });
}
