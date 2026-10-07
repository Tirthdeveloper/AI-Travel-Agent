import os
from typing import List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

from planner_service import generate_itinerary

app = FastAPI(
    title="VoyageAI - AI Travel Agent API",
    description="Intelligent AI Travel Itinerary Planner powered by LangChain & Groq",
    version="1.0.0",
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve static directory (HTML, CSS, JS, Images)
static_dir = os.path.join(os.path.dirname(__file__), "static")
if not os.path.exists(static_dir):
    os.makedirs(static_dir, exist_ok=True)

app.mount("/static", StaticFiles(directory=static_dir), name="static")


class TravelPlanRequest(BaseModel):
    destination: str = Field(..., description="Destination city, region, or country")
    days: int = Field(default=5, ge=1, le=30, description="Duration in days (1-30)")
    travelers: int = Field(default=2, ge=1, le=20, description="Number of travelers")
    budget: str = Field(default="Standard", description="Budget tier: Budget, Standard, or Luxury")
    transport: str = Field(default="Flight", description="Preferred transport mode")
    hotel: str = Field(default="4 Star", description="Hotel category")
    interests: List[str] = Field(default_factory=list, description="Selected travel interests")
    notes: Optional[str] = Field(default="", description="Optional custom notes or requirements")


@app.get("/")
async def root():
    """Serve the main frontend UI."""
    index_path = os.path.join(static_dir, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    return JSONResponse({"message": "VoyageAI API is running. index.html not found in static folder."})


@app.get("/api/health")
async def health():
    return {
        "status": "ok",
        "service": "VoyageAI Travel Agent",
        "groq_configured": bool(os.getenv("GROQ_API_KEY")),
        "serper_configured": bool(os.getenv("SERPER_API_KEY"))
    }


@app.get("/api/destinations")
async def get_popular_destinations():
    """Curated popular destinations with metadata for instant autofill."""
    return [
        {
            "id": "switzerland",
            "name": "Switzerland",
            "region": "Europe",
            "emoji": "🏔️",
            "tagline": "Alpine peaks, scenic trains & pristine lakes",
            "bestDays": 7,
            "budget": "Luxury",
            "interests": ["Nature", "Adventure", "Photography"],
            "hotel": "5 Star",
            "transport": "Train"
        },
        {
            "id": "maldives",
            "name": "Maldives",
            "region": "South Asia",
            "emoji": "🏖️",
            "tagline": "Overwater villas, azure lagoons & coral reefs",
            "bestDays": 5,
            "budget": "Luxury",
            "interests": ["Beaches", "Wellness", "Nature"],
            "hotel": "5 Star",
            "transport": "Flight"
        },
        {
            "id": "paris",
            "name": "Paris, France",
            "region": "Europe",
            "emoji": "🗼",
            "tagline": "Art, high fashion, world-class gastronomy",
            "bestDays": 5,
            "budget": "Standard",
            "interests": ["Food", "History", "Shopping"],
            "hotel": "4 Star",
            "transport": "Flight"
        },
        {
            "id": "japan",
            "name": "Kyoto & Tokyo, Japan",
            "region": "Asia",
            "emoji": "🏯",
            "tagline": "Ancient temples, bullet trains & neon cities",
            "bestDays": 8,
            "budget": "Standard",
            "interests": ["Food", "History", "Nature", "Shopping"],
            "hotel": "4 Star",
            "transport": "Train"
        },
        {
            "id": "bali",
            "name": "Bali, Indonesia",
            "region": "Southeast Asia",
            "emoji": "🌴",
            "tagline": "Emerald rice terraces, surf beaches & temples",
            "bestDays": 6,
            "budget": "Budget",
            "interests": ["Adventure", "Beaches", "Nature", "Wellness"],
            "hotel": "4 Star",
            "transport": "Flight"
        },
        {
            "id": "dubai",
            "name": "Dubai, UAE",
            "region": "Middle East",
            "emoji": "🏜️",
            "tagline": "Futuristic skyline, desert dunes & luxury malls",
            "bestDays": 4,
            "budget": "Luxury",
            "interests": ["Shopping", "Nightlife", "Adventure"],
            "hotel": "5 Star",
            "transport": "Flight"
        },
        {
            "id": "turkey",
            "name": "Istanbul & Cappadocia, Turkey",
            "region": "Eurasia",
            "emoji": "🕌",
            "tagline": "Hot air balloons, grand bazaars & rich history",
            "bestDays": 6,
            "budget": "Standard",
            "interests": ["History", "Food", "Adventure", "Photography"],
            "hotel": "4 Star",
            "transport": "Flight"
        }
    ]


@app.post("/api/plan")
async def plan_trip(request: TravelPlanRequest):
    """Generate a full travel itinerary using the AI Agent."""
    dest = request.destination.strip()
    if not dest:
        raise HTTPException(status_code=400, detail="Destination cannot be empty.")

    try:
        itinerary_text = generate_itinerary(
            destination=dest,
            days=request.days,
            travelers=request.travelers,
            budget=request.budget,
            transport=request.transport,
            hotel=request.hotel,
            interests=request.interests,
            notes=request.notes or ""
        )
        return {
            "success": True,
            "destination": dest,
            "days": request.days,
            "travelers": request.travelers,
            "budget": request.budget,
            "hotel": request.hotel,
            "transport": request.transport,
            "interests": request.interests,
            "itinerary": itinerary_text
        }
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to generate travel plan: {str(e)}")


if __name__ == "__main__":
    import threading
    import webbrowser
    import uvicorn

    def open_browser():
        try:
            webbrowser.open("http://127.0.0.1:8000")
        except Exception:
            pass

    print("\n" + "=" * 60)
    print(" 🚀 VoyageAI Server starting at http://127.0.0.1:8000")
    print(" 🌐 Opening browser automatically at http://127.0.0.1:8000...")
    print("=" * 60 + "\n")
    threading.Timer(1.5, open_browser).start()
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)
