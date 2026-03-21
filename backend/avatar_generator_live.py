import os
import json
import time
import requests

class AvatarGenerator:
    def __init__(self, heygen_api_key=None):
        """
        Initializes the Avatar Generator with live HeyGen API integration.
        """
        # Securely fetch from env or use provided key if passed during init
        self.api_key = heygen_api_key or os.getenv("HEYGEN_API_KEY")
        self.api_endpoint = "https://api.heygen.com/v2/video/generate"
        
        # We need to map this to a real HeyGen avatar ID. 
        # For now, we will use a known public avatar or leave it as a placeholder for the user to configure.
        # "Daisy-incasual-20220818" is a common test avatar, but we'll stick to a generic placeholder.
        self.avatar_id = "Daisy-inTshirt-20220818" 
        self.voice_id = "en-US-JennyNeural" # Standard clear voice
        
    def rewrite_script(self, original_desc):
        """
        Rewrites the scraped XHS description into a 'Mineral Purity' script.
        """
        script = f"Look at this typical renovation... {original_desc[:50]}...\n\n"
        script += "But don't do this! Most standard paints are basically plastic. "
        script += "For true Wabi-Sabi, you need the real deal. "
        script += "We use Lime Paint - Japanese Lime Plaster. "
        script += "It's 100% Breathable, Zero VOC, and literally turns into petrifying stone. "
        script += "Get the Level 5 Dustless Resurfacing finish you deserve. "
        script += "Not sure what color fits? Drop a 'price?' below to get our $12 Vibe Kit, $19 Designer Deck, or $29 Master Studio box — fully creditable towards your $188 deposit."
        return script

    def generate_video(self, script_text, background_url=None):
        """
        Sends a LIVE request to the HeyGen API to generate a video.
        """
        print(f"Generating live video for script:\n{script_text}\n")
        
        payload = {
            "video_inputs": [
                {
                    "character": {
                        "type": "avatar",
                        "avatar_id": self.avatar_id,
                        "avatar_style": "normal"
                    },
                    "voice": {
                        "type": "text",
                        "input_text": script_text,
                        "voice_id": self.voice_id
                    },
                    "background": {
                        "type": "color",
                        "value": "#1a1a18" # Dark mode background fallback
                    }
                }
            ],
            "dimension": {
                "width": 1080,
                "height": 1920 # TikTok/Reels format
            }
        }
        
        # If we have a scraped image, we can try to set it as background, 
        # but HeyGen handles image backgrounds differently depending on the endpoint version.
        
        headers = {
            "X-Api-Key": self.api_key,
            "Content-Type": "application/json"
        }
        
        try:
            print("Sending request to HeyGen API...")
            response = requests.post(self.api_endpoint, json=payload, headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                video_id = data.get("data", {}).get("video_id")
                print(f"Success! Video ID created: {video_id}")
                print(f"You can check the status of this video at: https://api.heygen.com/v1/video_status.get?video_id={video_id}")
                return data
            else:
                print(f"HeyGen API Error: {response.status_code}")
                print(response.text)
                return None
                
        except requests.RequestException as e:
            print(f"Failed to connect to HeyGen API: {e}")
            return None

if __name__ == "__main__":
    print("Avatar Generator Script Initialized.")
