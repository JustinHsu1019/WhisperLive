document.addEventListener("DOMContentLoaded", function () {
    const startButton = document.getElementById("startCapture");
    const stopButton = document.getElementById("stopCapture");

    const useServerCheckbox = document.getElementById("useServerCheckbox");
    const useVadCheckbox = document.getElementById("useVadCheckbox");
    const languageDropdown = document.getElementById('languageDropdown');
    const taskDropdown = document.getElementById('taskDropdown');
    const modelSizeDropdown = document.getElementById('modelSizeDropdown');
    let selectedLanguage = languageDropdown.value;
    let selectedTask = taskDropdown.value;
    let selectedModelSize = modelSizeDropdown.value;
    let socket;
    let audioContext;
    let mediaStreamSource;
    let recorder;

    startButton.addEventListener("click", startCapture);
    stopButton.addEventListener("click", stopCapture);

    function startCapture() {
        if (startButton.disabled) return;

        let host = "localhost";
        let port = "9090";

        console.log("Starting capture with settings:", {
            host, port, selectedLanguage, selectedTask, selectedModelSize, useVad: useVadCheckbox.checked
        });

        toggleCaptureButtons(true);

        socket = new WebSocket(`ws://${host}:${port}/`);
        socket.onopen = function (e) {
            socket.send(
                JSON.stringify({
                    uid: generateUUID(),
                    language: selectedLanguage,
                    task: selectedTask,
                    model: selectedModelSize,
                    use_vad: useVadCheckbox.checked
                })
            );
        };

        socket.onmessage = async (event) => {
            const data = JSON.parse(event.data);
            handleSocketMessage(data);
        };

        captureAudio();
    }

    function stopCapture() {
        if (stopButton.disabled) return;

        console.log("Stopping capture");
        if (recorder) {
            recorder.disconnect();
            recorder = null;
        }
        if (mediaStreamSource) {
            mediaStreamSource.disconnect();
            mediaStreamSource = null;
        }
        if (audioContext) {
            audioContext.close();
            audioContext = null;
        }
        if (socket) {
            socket.close();
            socket = null;
        }

        toggleCaptureButtons(false);
    }

    function toggleCaptureButtons(isCapturing) {
        startButton.disabled = isCapturing;
        stopButton.disabled = !isCapturing;
        useServerCheckbox.disabled = isCapturing;
        useVadCheckbox.disabled = isCapturing;
        modelSizeDropdown.disabled = isCapturing;
        languageDropdown.disabled = isCapturing;
        taskDropdown.disabled = isCapturing;
        startButton.classList.toggle("disabled", isCapturing);
        stopButton.classList.toggle("disabled", !isCapturing);
    }

    useServerCheckbox.addEventListener("change", () => {
        console.log("Use server checkbox changed:", useServerCheckbox.checked);
    });

    useVadCheckbox.addEventListener("change", () => {
        console.log("Use VAD checkbox changed:", useVadCheckbox.checked);
    });

    languageDropdown.addEventListener('change', function () {
        selectedLanguage = languageDropdown.value || null;
        console.log("Language changed:", selectedLanguage);
    });

    taskDropdown.addEventListener('change', function () {
        selectedTask = taskDropdown.value;
        console.log("Task changed:", selectedTask);
    });

    modelSizeDropdown.addEventListener('change', function () {
        selectedModelSize = modelSizeDropdown.value;
        console.log("Model size changed:", selectedModelSize);
    });

    function generateUUID() {
        let dt = new Date().getTime();
        const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = (dt + Math.random() * 16) % 16 | 0;
            dt = Math.floor(dt / 16);
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    }

    function handleSocketMessage(data) {
        console.log("message:", data);
        if (data.status === "WAIT") {
            showPopup(`Estimated wait time ~ ${Math.round(data.message)} minutes`);
            stopCapture();
        } else if (data.message === "DISCONNECT") {
            toggleCaptureButtons(false);
            stopCapture();
            window.cachedSegments = undefined
        } else if (data.message === "SERVER_READY") {
            window.cachedSegments = undefined
        } else if (data.message === undefined) {
            updateCachedSegments(data.segments)
        }
    }

    function updateCachedSegments(segments) {
        if (window.cachedSegments === undefined) {
            window.cachedSegments = segments;
        } else {
            const firstSegmentStart = parseFloat(segments[0].start)
            window.cachedSegments = window.cachedSegments.filter(segment => parseFloat(segment.end) < firstSegmentStart).concat(segments);
        }
        if (window.cachedSegments !== undefined) {
            displayTranscription(window.cachedSegments.map(segment => segment.text).join(' '));
        }
    }

    function displayTranscription(transcription) {
        const transcriptionBox = document.getElementById('transcriptionBox');
        transcriptionBox.innerHTML = `<p>${transcription}</p>`;
    }

    function showPopup(message) {
        alert(message);
    }

    async function captureAudio() {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        mediaStreamSource = audioContext.createMediaStreamSource(stream);
        recorder = audioContext.createScriptProcessor(4096, 1, 1);

        recorder.onaudioprocess = function (event) {
            if (!audioContext || !socket || socket.readyState !== WebSocket.OPEN) return;

            const inputData = event.inputBuffer.getChannelData(0);
            const audioData16kHz = resampleTo16kHZ(inputData, audioContext.sampleRate);
            socket.send(audioData16kHz);
        };

        mediaStreamSource.connect(recorder);
        recorder.connect(audioContext.destination);
    }

    function resampleTo16kHZ(audioData, origSampleRate) {
        const data = new Float32Array(audioData);
        const targetLength = Math.round(data.length * (16000 / origSampleRate));
        const resampledData = new Float32Array(targetLength);
        const springFactor = (data.length - 1) / (targetLength - 1);
        resampledData[0] = data[0];
        resampledData[targetLength - 1] = data[data.length - 1];

        for (let i = 1; i < targetLength - 1; i++) {
            const index = i * springFactor;
            const leftIndex = Math.floor(index);
            const rightIndex = Math.ceil(index);
            const fraction = index - leftIndex;
            resampledData[i] = data[leftIndex] + (data[rightIndex] - data[leftIndex]) * fraction;
        }

        return resampledData;
    }
});
