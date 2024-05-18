import React, { useState } from 'react';
import axios from 'axios';
// import wavUrl from './output.wav';

const Display = () => {
    const [responseData, setResponseData] = useState(null);
    const [inputData, setInputData] = useState({
        question: "",
        username: "",
        language: "english"
    });

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
                await axios.post('http://127.0.0.1:8000/answer', { answer: response.data.answer });
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // const playAudio = () => {
    //     const audio = new Audio(wavUrl);
    //     audio.play();
    // };

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
                    {/* <button onClick={playAudio}>Play Audio</button> */}
                </div>
            )}
        </div>
    );
};

export default Display;

