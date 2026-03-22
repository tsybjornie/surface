import os
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

# Import our two KiloClaw API routers
from vision_quoter import app as quoter_app
from stripe_server import app as stripe_app

# Create a master FastAPI application
app = FastAPI(title="KiloClaw Master Server")

# Configure CORS to explicitly allow BOTH www and non-www Vercel domains
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://sonsoftheland.com",
        "https://www.sonsoftheland.com",
        "https://sonsoftheland.com",
        "https://www.sonsoftheland.com",
        "http://localhost",
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount the sub-applications
app.mount("/vision", quoter_app)
app.mount("/", stripe_app)

@app.get("/")
def health_check():
    return {"status": "KiloClaw Server is online and monitoring.", "version": "1.0 PMOS"}

if __name__ == "__main__":
    # Run the server on port 8000, bound to all network interfaces so DO can expose it
    uvicorn.run("main_server:app", host="0.0.0.0", port=8000, reload=True)
