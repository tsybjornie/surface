from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
import random
from typing import Optional

app = FastAPI(title="KiloClaw Vision API Quoter")

class QuoteResponse(BaseModel):
    floor_area_sqft: float
    wall_area_sqft: float
    room_type: str
    quote_sgd: float
    upsell_recommendation: Optional[str]
    deposit_link: str

@app.post("/api/analyze-floorplan", response_model=QuoteResponse)
async def analyze_floorplan(file: UploadFile = File(...)):
    """
    Accepts an image or PDF file of a floorplan.
    Extracts the floor area and calculates the wall area, quote, and upsell logic.
    """
    # Mocking Vision AI logic
    # In a real scenario, we would process the file (image/pdf) using a Vision API
    
    # Mock extracted floor area (in sqft) based on typical HDB sizes
    floor_area_sqft = random.choice([700, 1000, 1250]) 
    
    # Determine room type and base quote based on mocked floor area
    if floor_area_sqft <= 750:
        room_type = "3-Room BTO"
        quote_sgd = 988.0
        has_large_living_room = False
    elif floor_area_sqft <= 1000:
        room_type = "4-Room BTO"
        quote_sgd = 1288.0
        has_large_living_room = True
    else:
        room_type = "5-Room BTO"
        quote_sgd = 1588.0
        has_large_living_room = True

    # Formula: Wall Area = (Floor Area x 3.2) - (15% Window/Door Deduction)
    wall_area_sqft = (floor_area_sqft * 3.2) * 0.85
    
    upsell_text = None
    if has_large_living_room:
        upsell_text = "Large living room detected. We highly recommend a Shikkui Feature Wall upgrade (S$8.80 /sqft) to elevate the space."

    return QuoteResponse(
        floor_area_sqft=floor_area_sqft,
        wall_area_sqft=round(wall_area_sqft, 2),
        room_type=room_type,
        quote_sgd=quote_sgd,
        upsell_recommendation=upsell_text,
        deposit_link="https://pay.plainwork.com/deposit/188"
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
