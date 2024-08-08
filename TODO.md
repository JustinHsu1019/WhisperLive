# 2024/07/30 TODO

## 1. 解決長期紀錄不保存 (吃字問題)

#### WhisperLive-WebDemo/whisper_live/server.py

```python
segments = []
if len(self.transcript) >= self.send_last_n_segments:
  # 在這邊將被丟棄的 segments 存於某處 (前端 local storage / 後端 txt, db -> 需能保留完整訊息於 Frontend text box)
  segments = self.transcript[-self.send_last_n_segments:].copy()
else:
  segments = self.transcript.copy()
if last_segment is not None:
  segments = segments + [last_segment]
return segments
```

## 2. Stop Capture 按鈕，確定作用正確
- 目前點擊後分頁 Microphone 並未停止監聽

## 3. 語言偵測頻繁出錯 (不斷出現 韓文 / 英文)
- 參數: initial_prompt "繁體中文" 可否解決？
- 承上，參數 initial_prompt 可否取代少數訓練資源，用作糾正部分常見錯誤轉錄詞彙？

## 4. 不斷轉錄出 "字幕來自XXX / 點讚轉發XXX"
