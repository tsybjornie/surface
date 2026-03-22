Import-Module Posh-SSH -Force
$password = ConvertTo-SecureString 'bjorn_1993Teo' -AsPlainText -Force
$credential = New-Object System.Management.Automation.PSCredential('root', $password)
$session = New-SSHSession -ComputerName 206.189.80.129 -Credential $credential -AcceptKey -Force
function SSH($cmd) { (Invoke-SSHCommand -SessionId $session.SessionId -Command $cmd).Output | % { Write-Host $_ } }

Write-Host '>>> Installing Nginx...' -ForegroundColor Cyan
SSH 'apt-get install -y nginx -qq && echo "Nginx installed"'

Write-Host '>>> Installing Certbot...' -ForegroundColor Cyan
SSH 'apt-get install -y certbot python3-certbot-nginx -qq && echo "Certbot installed"'

Write-Host '>>> Writing Nginx config for api.sonsoftheland.com...' -ForegroundColor Cyan
SSH @'
cat > /etc/nginx/sites-available/api.sonsoftheland.com << 'NGINXEOF'
server {
    listen 80;
    server_name api.sonsoftheland.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # CORS headers for sonsoftheland.com
        add_header 'Access-Control-Allow-Origin' 'https://sonsoftheland.com' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization' always;

        if ($request_method = 'OPTIONS') {
            add_header 'Access-Control-Allow-Origin' 'https://sonsoftheland.com';
            add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
            add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization';
            add_header 'Content-Length' '0';
            return 204;
        }
    }
}
NGINXEOF
echo "Nginx config written"
'@

Write-Host '>>> Enabling site...' -ForegroundColor Cyan
SSH 'ln -sf /etc/nginx/sites-available/api.sonsoftheland.com /etc/nginx/sites-enabled/ && nginx -t && systemctl reload nginx && echo "Nginx reloaded OK"'

Write-Host '>>> Nginx status...' -ForegroundColor Cyan
SSH 'systemctl status nginx | head -5'

Remove-SSHSession -SessionId $session.SessionId
Write-Host '>>> Nginx ready. Run Certbot after DNS propagates.' -ForegroundColor Green
