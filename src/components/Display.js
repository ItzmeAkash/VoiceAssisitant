import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
            // const response = await axios.post('https://api.supermilla.com/qad', inputData); 
            const response = await axios.post('http://127.0.0.1:5000/qad', inputData); 
            
            setResponseData(response.data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

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
                    <pre>{JSON.stringify(responseData.answer, null, 2)}</pre>
                    {/* <p>{{ responseData}}</p> */}
                </div>
            )}
        </div>
    );
};

export default Display;
