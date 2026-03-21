"""
generate_now.py — Manual KiloClaw Video Generator
Uses official Runway SDK (not raw HTTP) + HeyGen API
"""
import os
import time
import requests
from dotenv import load_dotenv

load_dotenv()

RUNWAY_API_KEY = os.getenv("RUNWAY_API_KEY")
HEYGEN_API_KEY = os.getenv("HEYGEN_API_KEY")

# Image to use — Plainwork hero image (publicly accessible)
SOURCE_IMAGE_URL = "https://surfaceproject.sg/images/hero-lime-plaster.png"

SCRIPT = (
    "This wall is alive. Every mark you see is hand-applied by our artisan, "
    "using pure Japanese lime and mineral pigment — zero plastic, zero VOC. "
    "This is Plainwork. The only paint that turns to stone."
)

print("=== KILOCLAW MANUAL VIDEO TRIGGER ===")
print(f"Image: {SOURCE_IMAGE_URL}")
print(f"Script: {SCRIPT[:60]}...")

# ── STEP 1: Runway Gen-4 Turbo (Image to Video via official SDK) ──
print("\n[1/3] Sending to RunwayML Gen-4 Turbo...")

try:
    from runwayml import RunwayML, TaskFailedError
    
    client = RunwayML(api_key=RUNWAY_API_KEY)
    
    task = client.image_to_video.create(
        model="gen4_turbo",
        prompt_image=SOURCE_IMAGE_URL,
        prompt_text="Slow cinematic push-in through a luxury lime plaster wall, warm afternoon light, architectural editorial, 4K",
        ratio="1280:720",
        duration=5,
    ).wait_for_task_output()
    
    runway_video_url = task.output[0]
    print(f"✅ Runway video ready: {runway_video_url}")

except ImportError:
    print("Installing runwayml SDK...")
    os.system("pip install runwayml -q")
    from runwayml import RunwayML, TaskFailedError
    client = RunwayML(api_key=RUNWAY_API_KEY)
    task = client.image_to_video.create(
        model="gen4_turbo",
        prompt_image=SOURCE_IMAGE_URL,
        prompt_text="Slow cinematic push-in through a luxury lime plaster wall, warm afternoon light, architectural editorial, 4K",
        ratio="1280:720",
        duration=5,
    ).wait_for_task_output()
    runway_video_url = task.output[0]
    print(f"✅ Runway video ready: {runway_video_url}")

except Exception as e:
    print(f"❌ Runway error: {e}")
    runway_video_url = None

# ── STEP 2: HeyGen Avatar Overlay ──
if runway_video_url:
    print("\n[2/3] Sending to HeyGen for Avatar overlay...")
    
    heygen_payload = {
        "video_inputs": [{
            "character": {
                "type": "avatar",
                "avatar_id": "Angela-inblackskirt-20220820",
                "avatar_style": "normal"
            },
            "voice": {
                "type": "text",
                "input_text": SCRIPT,
                "voice_id": "1bd001e7e50f421d891986aad5158bc8"
            },
            "background": {
                "type": "video",
                "url": runway_video_url
            }
        }],
        "dimension": {"width": 1280, "height": 720}
    }
    
    resp = requests.post(
        "https://api.heygen.com/v2/video/generate",
        json=heygen_payload,
        headers={"X-Api-Key": HEYGEN_API_KEY, "Content-Type": "application/json"}
    )
    
    if resp.status_code == 200:
        video_id = resp.json().get("data", {}).get("video_id")
        print(f"✅ HeyGen video queued! Video ID: {video_id}")
        print(f"   Check status: https://app.heygen.com/videos/{video_id}")
    else:
        print(f"❌ HeyGen error {resp.status_code}: {resp.text[:200]}")
else:
    print("[2/3] Skipping HeyGen — Runway failed.")

print("\n[3/3] Done. Check links above to download your video.")
