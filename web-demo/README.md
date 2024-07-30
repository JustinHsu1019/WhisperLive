# Web-Demo Setting

## GPU Server
```sh
source /home/{USER}/WhisperLive/whips/bin/activate
cd /home/{USER}/WhisperLive/
python3 run_server.py --port 8080 --backend faster_whisper
```

## Your Laptop
```sh
python3 -m http.server 8000
```
