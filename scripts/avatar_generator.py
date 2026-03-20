import os
import json
import time
import requests

class AvatarGenerator:
    def __init__(self, heygen_api_key=None):
        """
        Initializes the Avatar Generator with API keys and settings.
        Target: Generate 50+ UGC videos daily based on XHS scraped data.
        """
        self.api_key = heygen_api_key or os.getenv("HEYGEN_API_KEY", "MOCK_KEY")
        self.api_endpoint = "https://api.heygen.com/v2/video/generate"
        self.avatar_id = "default_mineral_expert_avatar" 
        self.voice_id = "default_sg_english_voice"
        
    def load_scraped_data(self, filepath):
        """Loads XHS scraped data from a JSON file."""
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                return json.load(f)
        except FileNotFoundError:
            print(f"Error: {filepath} not found.")
            return []
        except json.JSONDecodeError:
            print(f"Error: Could not decode JSON in {filepath}.")
            return []

    def rewrite_script(self, original_desc):
        """
        Rewrites the scraped XHS description into a 'Mineral Purity' script.
        Follows the 'Anti-Plastic' and 'Lime Paint' narrative.
        """
        # In a production environment, this could be passed to an LLM like OpenAI GPT-4.
        # For now, we apply a template transformation.
        
        script = f"Look at this typical renovation... {original_desc[:50]}...\n\n"
        script += "But don't do this! Most standard paints are basically plastic. "
        script += "For true Wabi-Sabi, you need the real deal. "
        script += "We use Lime Paint - Japanese Lime Plaster. "
        script += "It's 100% Breathable, Zero VOC, and literally turns into petrifying stone. "
        script += "Get the Level 5 Dustless Resurfacing finish you deserve. "
        script += "Check out our $29 Swatch Box or drop a 'price?' below for the deposit link."
        
        return script

    def generate_video(self, script_text, background_url=None):
        """
        Sends a request to the HeyGen API to generate a video using the rewritten script.
        """
        print(f"Generating video for script:\n{script_text}\n")
        
        # MOCK API Request
        payload = {
            "video_inputs": [
                {
                    "character": {
                        "type": "avatar",
                        "avatar_id": self.avatar_id,
                    },
                    "voice": {
                        "type": "text",
                        "input_text": script_text,
                        "voice_id": self.voice_id
                    },
                    "background": {
                        "type": "image",
                        "url": background_url
                    }
                }
            ]
        }
        
        headers = {
            "X-Api-Key": self.api_key,
            "Content-Type": "application/json"
        }
        
        if self.api_key == "MOCK_KEY":
            # Simulate processing delay
            time.sleep(1)
            return {"status": "success", "video_id": f"mock_video_{int(time.time())}", "video_url": "https://heygen.mock/video.mp4"}
            
        try:
            response = requests.post(self.api_endpoint, json=payload, headers=headers)
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            print(f"Failed to generate video: {e}")
            return None

    def run_daily_batch(self, filepath, max_videos=50):
        """
        Runs the daily batch to generate up to 'max_videos' UGC videos.
        """
        print(f"--- Starting Daily Avatar Generation Batch (Target: {max_videos} videos) ---")
        data = self.load_scraped_data(filepath)
        
        if not data:
            print("No data available to generate videos.")
            return

        success_count = 0
        for i, item in enumerate(data[:max_videos]):
            original_desc = item.get("description", "")
            image_url = item.get("image_url", "")
            
            print(f"\nProcessing Video {i+1}/{len(data[:max_videos])}")
            
            mineral_script = self.rewrite_script(original_desc)
            result = self.generate_video(mineral_script, image_url)
            
            if result and result.get("status") == "success":
                success_count += 1
                print(f"Success: {result.get('video_id')} -> {result.get('video_url')}")
            else:
                print("Failed to generate video.")
                
        print(f"\n--- Batch Complete: Generated {success_count} videos. ---")


class KiloClawBot:
    def __init__(self):
        """
        KiloClaw bot for monitoring comments on TikTok and Meta.
        """
        self.antigravity_link = "https://antigravity.link/deposit"
        
    def monitor_comments(self, platform="TikTok"):
        """
        Monitors comments for 'price?' and automatically replies with the Antigravity link.
        """
        print(f"\n[KiloClaw] Monitoring {platform} comments for 'price?' triggers...")
        
        # MOCK: Simulating incoming comments stream
        mock_comments = [
            {"user": "@user123", "text": "Wow, this looks amazing! price?"},
            {"user": "@designfan", "text": "Is this microcement?"},
            {"user": "@hdb_owner", "text": "How much for a 4-room BTO? Price?"}
        ]
        
        for comment in mock_comments:
            text = comment.get("text", "").lower()
            user = comment.get("user", "")
            
            print(f"\nNew comment from {user}: '{text}'")
            
            if "price" in text or "how much" in text:
                print(f"[KiloClaw Action] Detected price inquiry from {user}.")
                print(f"-> Replying to {user}: 'We exclusively use Lime Paint. Secure your Level 5 Dustless finish here: {self.antigravity_link}'")
            else:
                if "microcement" in text:
                     print(f"[KiloClaw Action] Educational reply to {user}.")
                     print(f"-> Replying to {user}: 'We never use Microcement. We only use 100% Breathable Lime Paint.'")
                else:
                    print(f"No action needed for {user}.")
            
            time.sleep(1) # simulate monitoring delay


if __name__ == "__main__":
    # 1. Run the Avatar Generation Loop
    generator = AvatarGenerator()
    data_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'xhs_wabi_sabi', 'xhs_data.json')
    generator.run_daily_batch(filepath=data_path, max_videos=50)
    
    # 2. Start KiloClaw Comment Monitoring
    bot = KiloClawBot()
    bot.monitor_comments(platform="TikTok")
    bot.monitor_comments(platform="Meta")
