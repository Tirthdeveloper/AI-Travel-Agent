FROM python:3.11-slim

# Prevent Python from writing .pyc and enable unbuffered logging
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application files
COPY . .

# Expose default port
ENV PORT=8000
EXPOSE 8000

# Start command (supports dynamic $PORT injection by Cloud Run, Render, Railway, etc.)
CMD ["sh", "-c", "uvicorn app:app --host 0.0.0.0 --port ${PORT:-8000}"]
