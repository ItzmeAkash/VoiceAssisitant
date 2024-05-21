import React, { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import './AIResponse.css';
import { GrMicrophone } from "react-icons/gr";
import { createClient } from '@deepgram/sdk';

const AIResponse = () => {
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
  const [isAnimating, setIsAnimating] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('Not Connected');
  const [transcriptText, setTranscriptText] = useState('');
  const [socket, setSocket] = useState(null);



  // Deepgram voice to text
  useEffect(() => {
    if (listening) {
      const newSocket = new WebSocket('wss://api.deepgram.com/v1/listen', [
        'token',
        'ce086a82fc025fdc4a3e6a55025b1bf33fda52db',
      ]);

      newSocket.onopen = () => {
        
        setConnectionStatus('Connected');
        console.log('Connected');
      };

      newSocket.onmessage = (message) => {
        const received = JSON.parse(message.data);
        const transcript = received.channel.alternatives[0].transcript;
        if (transcript && received.is_final) {
          setTranscriptText(transcript);
          //printing the text into console
          console.log(transcript);
          // pass the text to llm api
          sendToLLM(transcript);
          
        }
      };
      
      // close the connection 
      newSocket.onclose = () => {
        setTranscriptText('');
      };

      newSocket.onerror = (error) => {
        console.error('WebSocket Error: ', error);
      };

      setSocket(newSocket);
    } else {
      if (socket) {
        socket.close();
        setConnectionStatus('Not Connected');
      }
    }
  }, [listening]);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      if (!MediaRecorder.isTypeSupported('audio/webm'))
        return alert('Browser not supported');

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm',
      });

      const handleDataAvailable = (event) => {
        if (event.data.size > 0 && socket && socket.readyState === 1) {
          socket.send(event.data);
        }
      };

      if (socket) {
        socket.addEventListener('open', () => {
          mediaRecorder.addEventListener('dataavailable', handleDataAvailable);
          mediaRecorder.start(1000);
        });
      }

      return () => {
        mediaRecorder.removeEventListener('dataavailable', handleDataAvailable);
      };
    });
  }, [socket]);


  // Function to toggle listening
  const toggleListening = () => {
    if (listening) {
      SpeechRecognition.stopListening();
      setIsAnimating(false);
    } else {
      resetTranscript();
      setIsAnimating(true);
      setTimeout(() => {
        setIsAnimating(false);
      }, 2000);
      SpeechRecognition.startListening({ continuous: true });
    }
  };


  // Function to send text to LLM
  const sendToLLM = (text) => {
    fetch('http://127.0.0.1:5000/qad', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            question: text,
            username: 'akash',
            language: 'english',
        }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('LLM response:', data);
        
    })
    .catch(error => {
        console.error('Error sending data to LLM service:', error);
    });
  };

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  return (
    <div className="container">
      <div
        className={`button ${listening ? 'listening' : ''} ${isAnimating ? 'animating' : ''}`}
        onClick={toggleListening}
        onTouchStart={toggleListening}
      >
        <div className="inner-circle">
          <div className='inner-mic'>
            <GrMicrophone />
          </div>
        </div>
      </div>
      {listening && (
        <div className="speech-animation">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      )}
    </div>
  );
};

export default AIResponse;