import React, { useState, useEffect } from 'react';

const SpeechToText = () => {
  const [status, setStatus] = useState('Not Connected');
  const [transcript, setTranscript] = useState('');
  const [speakerTranscripts, setSpeakerTranscripts] = useState([]);

  useEffect(() => {
    const connectToSpeechRecognition = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (!MediaRecorder.isTypeSupported('audio/webm')) {
          alert('Browser not supported');
          return;
        }

        const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
        const socket = new WebSocket('wss://api.deepgram.com/v1/listen?model=nova-2-conversationalai&diarize=true', [
          'token',
          'ce086a82fc025fdc4a3e6a55025b1bf33fda52db',
        ]);

        socket.onopen = () => {
          console.log('WebSocket connected');
          setStatus('Connected');
          mediaRecorder.start(1000);
        };

        mediaRecorder.addEventListener('dataavailable', (event) => {
          if (event.data.size > 0 && socket.readyState === WebSocket.OPEN) {
            socket.send(event.data);
          }
        });

        socket.onmessage = (message) => {
          const received = JSON.parse(message.data);
          const newTranscript = received.channel?.alternatives[0]?.transcript || '';
          const isFinal = received.is_final;
          const speaker = received.channel?.alternatives[0]?.words[0]?.speaker;

          if (newTranscript && speaker !== undefined) {
            if (isFinal) {
              setSpeakerTranscripts((prevTranscripts) => {
                const updatedTranscripts = [...prevTranscripts];
                updatedTranscripts[speaker] = (updatedTranscripts[speaker] || '') + newTranscript + ' ';
                return updatedTranscripts;
              });
              setTranscript((prevTranscript) => prevTranscript + newTranscript + ' ');
            }
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
      // Clean up resources if needed
    };
  }, []);

  return (
    <div>
      <p id="status">{status}</p>
      <p id="transcript">{transcript}</p>
      <div id="speakerTranscripts">
        {speakerTranscripts.map((text, index) => (
          <div key={index}>
            <strong>Speaker {index + 1}:</strong> {text}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpeechToText;