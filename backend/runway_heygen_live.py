import os
import time
import requests

class KiloClawVideoEngine:
    def __init__(self):
        """
        The God-Tier Pipeline: Scraped Photo -> RunwayML Gen-3 -> HeyGen Avatar
        """
        self.runway_api_key = os.getenv("RUNWAY_API_KEY")
        self.heygen_api_key = os.getenv("HEYGEN_API_KEY")
        
    def animate_with_runway(self, image_url, prompt="Slow cinematic pan left across a minimalist wabi-sabi living room with textured lime wash walls. Soft natural sunlight pouring through sheer curtains."):
        """
        Sends a static image to RunwayML Gen-3 Alpha API to create a 5s cinematic b-roll.
        """
        print(f"\n[RunwayML] Initiating Image-to-Video generation...")
        print(f"-> Prompt: {prompt}")
        
        # RunwayML API Endpoint for Video Generation
        url = "https://api.runwayml.com/v1/image_to_video"
        
        headers = {
            "Authorization": f"Bearer {self.runway_api_key}",
            "X-Runway-Version": "2024-09-13",
            "Content-Type": "application/json"
        }
        
        payload = {
            "promptImage": image_url,
            "seed": 42,
            "model": "gen3a_turbo",
            "promptText": prompt,
            "watermark": False,
            "duration": 5,
            "ratio": "1280:768"
        }

        try:
            # Step 1: Request the generation task
            response = requests.post("https://api.runwayml.com/v1/tasks", headers=headers, json=payload)
            
            if response.status_code == 200:
                task_id = response.json().get("id")
                print(f"-> Task Created: {task_id}")
                print("-> Waiting for render to complete (this takes ~30-60 seconds)...")
                
                # Step 2: Poll for completion
                while True:
                    time.sleep(5)
                    status_res = requests.get(f"https://api.runwayml.com/v1/tasks/{task_id}", headers=headers)
                    status_data = status_res.json()
                    
                    if status_data.get("status") == "SUCCEEDED":
                        video_url = status_data.get("output", [{}])[0]
                        print(f"-> SUCCESS: Runway Cinematic Video Generated!")
                        return video_url
                    elif status_data.get("status") == "FAILED":
                        print("-> Error: RunwayML generation failed.")
                        return None
                    else:
                        print(f"   ... Rendering: {status_data.get('progress', 0) * 100}%")
                        
            else:
                print(f"Runway API Error {response.status_code}: {response.text}")
                return None
                
        except Exception as e:
            print(f"Runway Connection Error: {e}")
            return None

    def composite_with_heygen(self, script_text, background_video_url):
        """
        Overlays the HeyGen AI Avatar onto the RunwayML generated video.
        """
        print(f"\n[HeyGen] Initiating Avatar Compositing...")
        print(f"-> Script: {script_text[:50]}...")
        
        url = "https://api.heygen.com/v2/video/generate"
        
        headers = {
            "X-Api-Key": self.heygen_api_key,
            "Content-Type": "application/json"
        }
        
        payload = {
            "video_inputs": [
                {
                    "character": {
                        "type": "avatar",
                        "avatar_id": "Daisy-inTshirt-20220818", # Professional minimalist avatar
                        "avatar_style": "normal"
                    },
                    "voice": {
                        "type": "text",
                        "input_text": script_text,
                        "voice_id": "en-US-JennyNeural"
                    },
                    "background": {
                        "type": "video",
                        "url": background_video_url
                    }
                }
            ],
            "dimension": {
                "width": 1080,
                "height": 1920
            }
        }
        
        try:
            response = requests.post(url, json=payload, headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                video_id = data.get("data", {}).get("video_id")
                print(f"-> SUCCESS: HeyGen Avatar Task Created! (ID: {video_id})")
                print(f"-> View Status/Download: https://api.heygen.com/v1/video_status.get?video_id={video_id}")
                return video_id
            else:
                print(f"HeyGen API Error: {response.status_code} - {response.text}")
                return None
                
        except Exception as e:
            print(f"HeyGen Connection Error: {e}")
            return None

if __name__ == "__main__":
    print("=== PLAINWORK GOD-TIER UGC PIPELINE ===")
    engine = KiloClawVideoEngine()
    
    # Example input: A static photo scraped from Xiaohongshu
    # Replace this with your actual image URL when running live
    test_photo_url = "https://plainwork.sg/images/type-fine-plaster.png" 
    
    test_script = "Most standard HDB paints are basically plastic. Look at this living room. For true Wabi-Sabi, you need the real deal. We use 100 percent Breathable Lime Paint. Drop a 'price' below to get our 12 dollar Vibe Kit."
    
    # 1. Animate Photo
    broll_video_url = engine.animate_with_runway(test_photo_url)
    
    # 2. Add Avatar
    if broll_video_url:
        final_video_id = engine.composite_with_heygen(test_script, broll_video_url)
        print("\n=== PIPELINE COMPLETE ===")
        print("Your broadcast-quality UGC video is processing and will be ready for TikTok/Meta.")
    else:
        print("\nPipeline Halted due to RunwayML error.")
