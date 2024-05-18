import React, { useEffect } from 'react';

const SpeechToText = () => {
  useEffect(() => {
    const connectToSpeechRecognition = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (!MediaRecorder.isTypeSupported('audio/webm')) {
          alert('Browser not supported');
          return;
        }

        const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
        const socket = new WebSocket('wss://api.deepgram.com/v1/listen', [
          'token',
          'ce086a82fc025fdc4a3e6a55025b1bf33fda52db',
        ]);

        socket.onopen = () => {
          console.log('WebSocket connected');
          document.getElementById('status').textContent = 'Connected';
        };

        mediaRecorder.addEventListener('dataavailable', async (event) => {
          if (event.data.size > 0 && socket.readyState === WebSocket.OPEN) {
            socket.send(event.data);
          }
        });

        mediaRecorder.start(1000); 

        socket.onmessage = (message) => {
          const received = JSON.parse(message.data);
          const transcript = received.channel?.alternatives[0]?.transcript || '';
          if (transcript && received.is_final) {
            console.log(transcript);
            document.getElementById('transcript').textContent += transcript + ' ';
          }
        };

        socket.onclose = () => {
          console.log('WebSocket closed');
        };

        socket.onerror = (error) => {
          console.error('WebSocket error:', error);
        };
      } catch (error) {
        console.error('Error accessing media devices:', error);
      }
    };

    connectToSpeechRecognition();


    return () => {
      // Close connections or do any cleanup
    };
  }, []);

  return (
    <div>
      <p id="status">Not Connected</p>
      <p id="transcript"></p>
    </div>
  );
};

export default SpeechToText;
