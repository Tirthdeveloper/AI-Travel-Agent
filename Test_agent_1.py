"""VoyageAI - AI Travel Agent Entrypoint

Streamlit has been removed and replaced with a modern FastAPI backend
and HTML5/CSS3/Vanilla JS responsive user interface.

Run this script to launch the local web server:
    python Test_agent_1.py
or:
    python app.py
"""
import threading
import webbrowser
import uvicorn

def open_browser():
    try:
        webbrowser.open("http://127.0.0.1:8000")
    except Exception:
        pass

if __name__ == "__main__":
    print("\n" + "=" * 65)
    print(" ✈️  VoyageAI - Intelligent Travel Planner")
    print(" 🌐 Server running at: http://127.0.0.1:8000")
    print(" 🎨 Opening browser automatically...")
    print("=" * 65 + "\n")
    threading.Timer(1.5, open_browser).start()
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)