import os
from dotenv import load_dotenv
load_dotenv()
from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
from typing import Optional
from openai import OpenAI
import base64

app = FastAPI(title="KiloClaw Vision API Quoter")

# Use the provided key or default to env
api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=api_key)

class QuoteResponse(BaseModel):
    floor_area_sqft: float
    wall_area_sqft: float
    room_type: str
    quote_sgd: float
    upsell_recommendation: Optional[str]
    deposit_link: str
    invoice_header: str
    billing_entity: str
    material_origin: str
    stripe_descriptor: str

def encode_image(file_content):
    return base64.b64encode(file_content).decode('utf-8')

@app.post("/api/analyze-floorplan", response_model=QuoteResponse)
async def analyze_floorplan(file: UploadFile):
    """
    Uses OpenAI GPT-4o Vision to analyze an uploaded floorplan.
    Extracts the floor area and calculates the wall area, quote, and upsell logic.
    """
    file_content = await file.read()
    
    # We assume it's an image for now. In production, PDF would need to be converted to image first.
    base64_image = encode_image(file_content)
    
    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "system",
                    "content": "You are KiloClaw, an expert architectural estimator for a Singaporean Mineral Surface Studio. Your job is to analyze HDB/Condo floorplans. Look at the provided image and extract ONLY the total floor area in square meters or square feet. If you see sqm, convert it to sqft (multiply by 10.764). Return ONLY a valid JSON object with the key 'floor_area_sqft' as an integer."
                },
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": "Analyze this floorplan and give me the total floor area in sqft. If you cannot find it, estimate based on the room layout (e.g. 3-room is ~700 sqft, 4-room is ~1000 sqft, 5-room is ~1250 sqft). Return JSON only."},
                        {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{base64_image}"}}
                    ]
                }
            ],
            response_format={ "type": "json_object" }
        )
        
        import json
        result = json.loads(response.choices[0].message.content)
        floor_area_sqft = float(result.get('floor_area_sqft', 1000))
        
    except Exception as e:
        print(f"Vision API Error: {e}")
        # Fallback to standard 4-Room if vision fails
        floor_area_sqft = 1000.0

    # PMOS v1.0 Calculation Logic
    wall_area_sqft = (floor_area_sqft * 3.2) * 0.85  # (Floor Area x 3.2) - 15% Deduction
    
    # Determine room type and base quote
    if floor_area_sqft <= 750:
        room_type = "3-Room BTO"
        quote_sgd = 2488.0
    elif floor_area_sqft <= 1100:
        room_type = "4-Room BTO"
        quote_sgd = 3288.0
    else:
        room_type = "5-Room BTO"
        quote_sgd = 3888.0
        
    # Upsell Logic
    upsell = None
    if floor_area_sqft > 900:
        upsell = "Large living room detected. We highly recommend a Lime Paint Feature Wall upgrade (S$8.80 /sqft) to elevate the space."
        
    return QuoteResponse(
        floor_area_sqft=round(floor_area_sqft, 2),
        wall_area_sqft=round(wall_area_sqft, 2),
        room_type=room_type,
        quote_sgd=quote_sgd,
        upsell_recommendation=upsell,
        deposit_link="https://pay.plainwork.com/deposit/188",
        invoice_header="Plainwork — A Mineral Surface Studio",
        billing_entity="Managed and Installed by Original Copy Pte Ltd (Singapore)",
        material_origin="Mineral Lime formulated by Futureproof Industries Sdn Bhd (Malaysia)",
        stripe_descriptor="ORIGINAL*PLAINWORK"
    )
