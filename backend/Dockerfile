FROM python:3.11-slim

# Install tini to properly handle zombie processes
RUN apt-get update && apt-get install -y tini && rm -rf /var/lib/apt/lists/*

# Prevent Python from writing .pyc files and enable unbuffered logging
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PATH="/opt/venv/bin:$PATH"

WORKDIR /app

# Create a non-root user and setup venv
RUN useradd -m appuser && \
    python -m venv /opt/venv && \
    chown -R appuser:appuser /opt/venv /app

USER appuser

# Install dependencies
COPY --chown=appuser:appuser requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY --chown=appuser:appuser . .

# Use tini as entrypoint to reap zombies
ENTRYPOINT ["/usr/bin/tini", "--"]

# Run application with 12 workers to utilize high CPU frequency
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "12", "--timeout-keep-alive", "65"]
