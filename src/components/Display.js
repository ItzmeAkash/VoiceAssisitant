import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import SpeechToText from './SpeechToText';

const Display = () => {
    const [responseData, setResponseData] = useState(null);
    const [status, setStatus] = useState('Not Connected');
    const [transcript, setTranscript] = useState('');
    const [inputData, setInputData] = useState({
        question: "",
        username: "",
        language: "english"
    });
    const audioRef = useRef(null);
    let currentTranscript = '';
    let pauseTimeout = null;
    let autoPlayTimeout = null;


    const handleChange = (e) => {
        setInputData({
            ...inputData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:5000/qad', inputData);
            setResponseData(response.data);
            if (response.data.answer) {
                const audioResponse = await axios.post('http://127.0.0.1:8000/answer', { answer: response.data.answer }, { responseType: 'blob' });
                const audioBlob = new Blob([audioResponse.data], { type: 'audio/wav' });
                const audioUrl = URL.createObjectURL(audioBlob);
                audioRef.current.src = audioUrl;
                audioRef.current.play();
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const setQuestion = (transcript) => {
        setInputData((prevState) => ({
            ...prevState,
            question: transcript
        }));
    };
    
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
                    setStatus('Connected');
                    mediaRecorder.start(500);
                };

                mediaRecorder.addEventListener('dataavailable', async (event) => {
                    if (event.data.size > 0 && socket.readyState === WebSocket.OPEN) {
                        socket.send(event.data);
                    }
                });

                socket.onmessage = (message) => {
                    const received = JSON.parse(message.data);
                  
                    const newWord = received.channel?.alternatives[0]?.transcript || '';
                    if (newWord) {
                        console.log(newWord);
                        currentTranscript += newWord + ' ';
                        setTranscript(currentTranscript);
                        setInputData((prevState) => ({
                            ...prevState,
                            question: currentTranscript
                        }));
                        resetPauseTimer();
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

        const resetPauseTimer = () => {
            if (pauseTimeout) clearTimeout(pauseTimeout);
            pauseTimeout = setTimeout(() => {
                document.getElementById('sendButton').click();
            }, 200000);
        };

        connectToSpeechRecognition();

        return () => {
            if (pauseTimeout) clearTimeout(pauseTimeout);
            if (autoPlayTimeout) clearTimeout(autoPlayTimeout);
        };
    }, []);
    
    return (
        <div>
            <h1>Send Data to Backend</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Question:
                    <input
                        type="text"
                        name="question"
                        value={inputData.question}
                        onChange={handleChange}
                    />
                </label>
                <br />
                <label>
                    Username:
                    <input
                        type="text"
                        name="username"
                        value={inputData.username}
                        onChange={handleChange}
                    />
                </label>
                <br />
                <label>
                    Language:
                    <select
                        name="language"
                        value={inputData.language}
                        onChange={handleChange}
                    >
                        <option value="english">English</option>
                        <option value="Hindi">Hindi</option>
                    </select>
                </label>
                <br />
                <button type="submit">Send</button>
            </form>
            {responseData && (
                <div>
                    <h2>Response from Backend</h2>
                    <p>{JSON.stringify(responseData.answer, null, 2)}</p>
                </div>
            )}
            <SpeechToText setQuestion={setQuestion} />
            <audio ref={audioRef} controls />
        </div>
    );
};

export default Display;
