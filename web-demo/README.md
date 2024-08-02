# WhisperLive 專案總覽
## 利用 Whisper 實現即時轉錄

## Demo & TODO

- For the web demo, please see [WhisperLive-WebDemo/web-demo](https://github.com/JustinHsu1019/WhisperLive-WebDemo/tree/main/web-demo)
- TODO: [WhisperLive-WebDemo/TODO.md](https://github.com/JustinHsu1019/WhisperLive-WebDemo/blob/main/TODO.md)

<h2 align="center">
  <a href="https://www.youtube.com/watch?v=FKH5iNP2ZKk"><img
src="https://img.youtube.com/vi/FKH5iNP2ZKk/0.jpg" style="background-color:rgba(0,0,0,0);" height=300 alt="WebDemo"></a>
</h2>

## 通訊架構
![通訊架構](https://github.com/JustinHsu1019/WhisperLive-WebDemo/blob/main/通訊架構.png)

## 技術棧
- 後端：Python, faster-whisper
- 前端：HTML, JavaScript, WebSocket

## 後端設定

### 程式碼來源
[collabora/WhisperLive](https://github.com/collabora/WhisperLive)

### 設置步驟
```sh
git clone https://github.com/justinhsu1019/WhisperLive-WebDemo
cd WhisperLive-WebDemo
bash scripts/setup.sh
python3 -m venv whisp
source whisp/bin/activate
pip install -r requirements/server.txt
python3 run_server.py --port 8080 --backend faster_whisper
```

## 前端設定

### 程式碼來源
[JustinHsu1019/WhisperLive-WebDemo](https://github.com/JustinHsu1019/WhisperLive-WebDemo/tree/main/web-demo)

### 設置步驟
```sh
git clone https://github.com/justinhsu1019/WhisperLive-WebDemo
cd WhisperLive-WebDemo/web-demo
python3 -m http.server 8000
```
