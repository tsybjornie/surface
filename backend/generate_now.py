import os
import time
from dotenv import load_dotenv
from runway_heygen_live import KiloClawVideoEngine

load_dotenv()

print("=== MANUAL KILOCLAW VIDEO GENERATOR ===")
print("Starting sequence to prove Runway + HeyGen pipeline is functional...\n")

engine = KiloClawVideoEngine()

# The test image and script
test_photo_url = "https://plainwork.sg/images/type-fine-plaster.png" 
test_script = "Most standard HDB paints are basically plastic. Look at this living room. For true Wabi-Sabi, you need the real deal. We use 100 percent Breathable Lime Paint. Drop a 'price' below to get our 12 dollar Vibe Kit."

print("[1] Requesting Cinematic B-Roll from RunwayML...")
broll_url = engine.animate_with_runway(test_photo_url)

if broll_url:
    print(f"\n[2] Runway Success! Generated Video URL:\n{broll_url}")
    print("\n[3] Requesting Avatar Render from HeyGen...")
    video_id = engine.composite_with_heygen(test_script, broll_url)
    
    if video_id:
        print(f"\n[4] HeyGen Success! Video ID: {video_id}")
        print(f"Watch the final result here: https://api.heygen.com/v1/video_status.get?video_id={video_id}")
        print("\n=== PIPELINE COMPLETE ===")
    else:
        print("Pipeline Failed at HeyGen stage.")
else:
    print("Pipeline Failed at RunwayML stage.")
