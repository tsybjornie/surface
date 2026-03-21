import os
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import our two KiloClaw API routers
from vision_quoter import app as quoter_app
from stripe_server import app as stripe_app

# Create a master FastAPI application
app = FastAPI(title="KiloClaw Master Server")

# Configure CORS to allow the frontend to talk to this DO Droplet
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict to ["https://plainwork.sg", "https://surfaceproject.sg"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount the sub-applications
app.mount("/vision", quoter_app)
app.mount("/api", stripe_app)

@app.get("/")
def health_check():
    return {"status": "KiloClaw Server is online and monitoring.", "version": "1.0 PMOS"}

if __name__ == "__main__":
    # Run the server on port 8000, bound to all network interfaces so DO can expose it
    uvicorn.run("main_server:app", host="0.0.0.0", port=8000, reload=True)
