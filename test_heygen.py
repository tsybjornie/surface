import os
import requests

api_key = os.getenv("HEYGEN_API_KEY", "sk_V2_hgu_kzAyHOg14nE_krhH4RsdplcosuGIVRqJvrIoj1G0J0xx")
url = "https://api.heygen.com/v2/video/generate"

headers = {
    "X-Api-Key": api_key,
    "Content-Type": "application/json"
}

payload = {
    "video_inputs": [
        {
            "character": {
                "type": "avatar",
                "avatar_id": "Daisy-inTshirt-20220818",
                "avatar_style": "normal"
            },
            "voice": {
                "type": "text",
                "input_text": "Testing 1 2 3",
                "voice_id": "1bd001e7e50f421d891986aad5158bc8" # Fallback to known standard voice ID instead of named neural string
            },
            "background": {
                "type": "color",
                "value": "#1a1a18"
            }
        }
    ]
}

response = requests.post(url, json=payload, headers=headers)
print(response.status_code)
print(response.text)
