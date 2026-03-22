Import-Module Posh-SSH -Force
$password = ConvertTo-SecureString 'bjorn_1993Teo' -AsPlainText -Force
$credential = New-Object System.Management.Automation.PSCredential('root', $password)
$session = New-SSHSession -ComputerName 206.189.80.129 -Credential $credential -AcceptKey -Force
function SSH($cmd) { (Invoke-SSHCommand -SessionId $session.SessionId -Command $cmd).Output | % { Write-Host $_ } }

# Check HeyGen account status first
SSH @'
/root/plain-work/backend/venv/bin/python3 - << 'PYEOF'
import os, requests, json
from dotenv import load_dotenv
load_dotenv("/root/plain-work/backend/.env")
HEYGEN_API_KEY = os.getenv("HEYGEN_API_KEY")

# Check account info
resp = requests.get("https://api.heygen.com/v2/user/remaining_quota", headers={"X-Api-Key": HEYGEN_API_KEY})
print("Quota:", resp.status_code, resp.text)

# Try simple talking avatar with color background (no video background - simpler test)
payload = {
    "video_inputs": [{
        "character": {
            "type": "avatar",
            "avatar_id": "Angela-inblackskirt-20220820",
            "avatar_style": "normal"
        },
        "voice": {
            "type": "text",
            "input_text": "This is Plainwork. The only paint that turns to stone.",
            "voice_id": "1bd001e7e50f421d891986aad5158bc8"
        },
        "background": {
            "type": "color",
            "value": "#1a1a1a"
        }
    }],
    "dimension": {"width": 1280, "height": 720}
}
resp2 = requests.post("https://api.heygen.com/v2/video/generate", json=payload, headers={"X-Api-Key": HEYGEN_API_KEY, "Content-Type": "application/json"})
print("Simple test:", resp2.status_code, resp2.text[:300])
PYEOF
'@

Remove-SSHSession -SessionId $session.SessionId
