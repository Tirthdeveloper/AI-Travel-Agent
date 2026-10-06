# ✈️ VoyageAI — Autonomous AI Travel Planner

VoyageAI is an intelligent, full-stack AI travel concierge that generates bespoke, day-by-day travel itineraries. Powered by **FastAPI**, **LangChain**, **Groq** (`openai/gpt-oss-20b`), and real-time **Google Serper** web intelligence, paired with a luxury **HTML5/CSS3/Vanilla JS** responsive interface.

![VoyageAI Banner](static/hero_banner.jpg)

---

## ✨ Features

- 🌍 **Instant Personalized Itineraries**: Generates comprehensive day-wise schedules (Morning, Afternoon, Evening) customized to duration, group size, and interests.
- 🔍 **Live Search Grounding**: Connects with Google Serper to discover real-time attractions, transit passes, and local dining.
- 🎨 **Modern Vanilla Web UI**:
  - Glassmorphism design system (`backdrop-filter: blur(16px)`).
  - Dark Mode & Light Mode support.
  - Interactive trip configurator (duration slider, traveler stepper, budget tier selector, multi-select interest chips).
  - Quick-preset popular destination cards (Switzerland, Maldives, Paris, Kyoto, Dubai, etc.).
- 🛠️ **Smart Actions**:
  - **Copy Markdown**: One-click copy formatted itinerary to clipboard.
  - **Save .md**: Download your itinerary as a Markdown document.
  - **Print / PDF**: Clean print stylesheet for physical copies or PDF export.

---

## 🚀 Tech Stack

- **Backend**: Python 3.13, [FastAPI](https://fastapi.tiangolo.com/), [Uvicorn](https://www.uvicorn.org/)
- **AI & Orchestration**: [LangChain](https://www.langchain.com/), [LangGraph](https://langchain-ai.github.io/langgraph/), [Groq](https://groq.com/)
- **Search Tooling**: Google Serper API
- **Frontend**: Semantic HTML5, Vanilla CSS3 (Custom Design Tokens), Vanilla JavaScript (ES6+)

---

## 📦 Getting Started

### 1. Clone the Repository
```bash
git clone <YOUR_REPOSITORY_URL>
cd "AI Travel Agent"
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory (refer to `.env.example`):
```env
GROQ_API_KEY=your_groq_api_key_here
SERPER_API_KEY=your_serper_api_key_here
```

### 4. Run the Application
Launch the web server with:
```bash
python app.py
```
or:
```bash
python Test_agent_1.py
```

Open your browser and navigate to:
👉 **http://127.0.0.1:8000**

---

## 📁 Project Structure

```
├── app.py                 # FastAPI application & API endpoints
├── planner_service.py     # LangChain agent & Serper search orchestration
├── Test_agent_1.py        # Application entrypoint
├── requirements.txt       # Project dependencies
├── .env.example           # Example environment variables template
├── .gitignore             # Git ignore rules (secrets protected)
├── README.md              # Project documentation
└── static/
    ├── index.html         # Main web UI structure
    ├── style.css          # Design system, glassmorphism & responsive styles
    ├── app.js             # Client-side reactivity, Markdown parsing & API calls
    └── hero_banner.jpg    # Visual assets
```

---

## 📄 License
MIT License. Feel free to use and customize for your own travels!
