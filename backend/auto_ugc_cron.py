import os
import time
import schedule
from runway_heygen_live import KiloClawVideoEngine
from dotenv import load_dotenv

# Load environment variables from the .env file Antigravity suggested
load_dotenv()

def run_daily_ugc_batch():
    """
    This is the heartbeat function.
    It wakes up KiloClaw to generate 3 videos per batch.
    """
    print(f"\n[{time.strftime('%Y-%m-%d %H:%M:%S')}] KiloClaw Daily UGC Batch Started")
    engine = KiloClawVideoEngine()
    
    # In a fully deployed setup, these images would come dynamically from xhs_scraper.py
    # For now, we cycle through your top tier reference images
    photos = [
        "https://plainwork.sg/images/type-fine-plaster.png",
        "https://plainwork.sg/images/microcement-hero.png",
        "https://plainwork.sg/assets/liquid-metal-hero.png"
    ]
    
    scripts = [
        "Most standard HDB paints are basically plastic. Look at this living room. For true Wabi-Sabi, you need the real deal. We use 100 percent Breathable Lime Paint. Drop a 'price' below to get our 12 dollar Vibe Kit.",
        "Stop using cheap tiles in your bathroom. Our 7-layer seamless Microcement is 100 percent waterproof and zero-grout. It's the ultimate quiet luxury aesthetic for Singapore condos. Hit the link in bio to book your site assessment.",
        "This isn't metallic paint. This is real cold-spray Liquid Metal. We hand-trowel real bronze and zinc particles to create a living, breathing architectural statement. Perfect for your feature wall."
    ]
    
    for i in range(len(photos)):
        print(f"\n--- Generating Video {i+1}/3 ---")
        try:
            # 1. Runway Animation
            broll_url = engine.animate_with_runway(photos[i])
            if broll_url:
                # 2. HeyGen Avatar
                video_id = engine.composite_with_heygen(scripts[i], broll_url)
                print(f"Video {i+1} queued in HeyGen with ID: {video_id}")
            else:
                print("Skipping Avatar gen due to Runway failure.")
        except Exception as e:
            print(f"Error in video {i+1}: {e}")
            
        # Sleep for 10 seconds between requests to avoid API rate limits
        time.sleep(10)
        
    print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] KiloClaw Daily UGC Batch Complete")

# Schedule the batch to run every day at 9:00 AM Singapore Time
schedule.every().day.at("09:00").do(run_daily_ugc_batch)

if __name__ == "__main__":
    print("=== KiloClaw UGC Autopilot Activated ===")
    print("The machine is now alive and waiting for scheduled execution.")
    print("Keys successfully loaded from .env.")
    print("Press CTRL+C to kill the engine.")
    
    # Run once immediately on startup for testing
    run_daily_ugc_batch()
    
    # Keep the script alive forever to run on schedule
    while True:
        schedule.run_pending()
        time.sleep(60)
