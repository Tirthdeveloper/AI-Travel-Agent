import os
import uuid
import sys
from dotenv import load_dotenv

load_dotenv()

# Ensure utf-8 output in Windows environments
if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

from langchain_community.utilities import GoogleSerperAPIWrapper
from langchain_groq import ChatGroq
from langchain.agents import create_agent
from langgraph.checkpoint.memory import MemorySaver

# Initialize AI model and search tool
groq_api_key = os.getenv("GROQ_API_KEY")
serper_api_key = os.getenv("SERPER_API_KEY")

model = ChatGroq(
    model="openai/gpt-oss-20b",
    temperature=0.7,
)

# Search wrapper (Google Serper)
search_tool = GoogleSerperAPIWrapper()

SYSTEM_PROMPT = """
You are an expert, world-class AI Travel Planner and Concierge.

Whenever the user provides travel details, craft an exquisite, realistic, and highly comprehensive travel itinerary in a polished Markdown format.

Structure your response with the following clear markdown sections:
# 🌟 Trip Overview: [Destination]
A captivating 2-3 sentence introduction summarizing the vibe, best season, and why this trip will be unforgettable.

## 📋 Trip At-a-Glance
A quick table or bullet points with:
- **Duration**: X Days
- **Travelers**: X
- **Budget Tier**: [Budget / Standard / Luxury]
- **Primary Transit**: [Flight / Train / Bus / Car]
- **Hotel Style**: [3 Star / 4 Star / 5 Star]
- **Focus / Interests**: [Interests selected]

## 📅 Day-by-Day Itinerary
For each day (Day 1 to Day N), provide:
### Day X: [Catchy Theme / Focus of the Day]
- **Morning**: Specific places, timing, ticket tips.
- **Afternoon**: Activities, scenic spots, walking routes.
- **Evening**: Sunset points, nightlife or relaxing strolls.
- **Dining Recommendations**: Specific local dishes, famous cafes/restaurants for breakfast, lunch, and dinner.

## 🏨 Recommended Accommodations
Provide 2-3 hand-picked hotels matching the requested hotel category and budget, detailing name, approximate nightly rate, and why the location is optimal.

## 🚆 Local Transit & Getting Around
Practical instructions on metro cards, ride apps, airport transfers, or scenic rail passes.

## 🍽️ Culinary Highlights & Must-Eats
Top 4-5 iconic dishes or beverages to try and where to find the most authentic taste.

## 💰 Estimated Budget Breakdown
A realistic estimated cost table or list (Accommodation, Food & Drinks, Activities/Entrance, Local Transport, Contingency).

## 💡 Essential Travel & Safety Tips
4-6 actionable, insider tips (currency tips, dress codes, packing must-haves, tourist card passes, emergency numbers).

Ensure the formatting uses clean Markdown with bold labels, clear headers, and bullet points.
"""

agent = create_agent(
    model=model,
    tools=[search_tool.run],
    system_prompt=SYSTEM_PROMPT,
    checkpointer=MemorySaver()
)


def generate_itinerary(
    destination: str,
    days: int = 5,
    travelers: int = 2,
    budget: str = "Standard",
    transport: str = "Flight",
    hotel: str = "4 Star",
    interests: list[str] = None,
    notes: str = ""
) -> str:
    """Generate a travel plan using the LangGraph agent."""
    interests_str = ", ".join(interests) if interests else "General sightseeing, culture, and cuisine"
    notes_section = f"\nAdditional Preferences / Notes: {notes}" if notes.strip() else ""

    prompt = f"""
Please generate a comprehensive, highly personalized travel itinerary based on these specifications:

Destination: {destination}
Duration: {days} Days
Number of Travelers: {travelers}
Budget Level: {budget}
Preferred Transport: {transport}
Hotel Category: {hotel}
Key Interests: {interests_str}{notes_section}

Provide rich recommendations with specific places, realistic day-to-day schedules, culinary highlights, and accurate transit details.
"""

    thread_id = str(uuid.uuid4())
    response = agent.invoke(
        {
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        },
        {
            "configurable": {
                "thread_id": thread_id
            }
        }
    )

    last_message = response["messages"][-1]
    return last_message.content
