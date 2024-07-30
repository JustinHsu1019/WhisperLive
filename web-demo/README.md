# Web-Demo Setting

## Backend
```sh
git clone https://github.com/justinhsu1019/WhisperLive-WebDemo
cd WhisperLive-WebDemo
bash scripts/setup.sh
python3 -m venv whisp
source whisp/bin/activate
pip install -r requirements/server.txt
python3 run_server.py --port 8080 --backend faster_whisper
```

## Frontend
```sh
git clone https://github.com/justinhsu1019/WhisperLive-WebDemo
cd WhisperLive-WebDemo/web-demo
python3 -m http.server 8000
```
