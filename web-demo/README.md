# Web-Demo Settings

## Demo Video
- For the web demo, please see [WhisperLive-WebDemo/web-demo](https://github.com/JustinHsu1019/WhisperLive-WebDemo/tree/main/web-demo)

<h2 align="center">
  <a href="https://www.youtube.com/watch?v=FKH5iNP2ZKk"><img
src="https://img.youtube.com/vi/FKH5iNP2ZKk/0.jpg" style="background-color:rgba(0,0,0,0);" height=300 alt="WebDemo"></a>
</h2>

## Backend Settings
```sh
git clone https://github.com/justinhsu1019/WhisperLive-WebDemo
cd WhisperLive-WebDemo
bash scripts/setup.sh
python3 -m venv whisp
source whisp/bin/activate
pip install -r requirements/server.txt
python3 run_server.py --port 8080 --backend faster_whisper
```

## Frontend Settings
```sh
git clone https://github.com/justinhsu1019/WhisperLive-WebDemo
cd WhisperLive-WebDemo/web-demo
python3 -m http.server 8000
```
