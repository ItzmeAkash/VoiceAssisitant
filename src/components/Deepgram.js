// import React, { useState } from 'react';
// import axios from 'axios';
// import { createClient } from "@deepgram/sdk";
// import dotenv from "dotenv";
// dotenv.config();

// const Deepgram = () => {
//     const [responseData, setResponseData] = useState(null);
//     const [inputData, setInputData] = useState({
//         question: "",
//         username: "",
//         language: "english"
//     });

//     const dotenv = require("dotenv");
    
//     const deepgram = createClient(process.env.DEEPGRAM_API_KEY);
//     const fs = require("fs");
    
//     const getAudio = async (text) => {
//         try {
//             const response = await deepgram.speak.request(
//                 { text },
//                 {
//                     model: "aura-asteria-en",
//                     encoding: "linear16",
//                     container: "wav",
//                 }
//             );

//             const stream = await response.getStream();
//             const headers = await response.getHeaders();

//             if (stream) {
//                 // Convert the stream to an audio buffer
//                 const buffer = await getAudioBuffer(stream);
//                 fs.writeFile("output.wav", buffer, (err) => {
//                     if (err) {
//                       console.error("Error writing audio to file:", err);
//                     } else {
//                       console.log("Audio file written to output.wav");
//                     }
//                   });
//             } else {
//                 console.error("Error generating audio:", stream);
//             }

//             if (headers) {
//                 console.log("Headers:", headers);
//             }
//         } catch (error) {
//             console.error("Error generating audio:", error);
//             // Handle error, maybe set an error state
//         }
//     };

//     // Helper function to convert stream to audio buffer
//     const getAudioBuffer = async (response) => {
//         const reader = response.getReader();
//         const chunks = [];

//         while (true) {
//             const { done, value } = await reader.read();
//             if (done) break;

//             chunks.push(value);
//         }

//         const dataArray = chunks.reduce(
//             (acc, chunk) => Uint8Array.from([...acc, ...chunk]),
//             new Uint8Array(0)
//         );

//         return Buffer.from(dataArray.buffer);
//     };

 
//     const handleChange = (e) => {
//         setInputData({
//             ...inputData,
//             [e.target.name]: e.target.value
//         });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const response = await axios.post('http://127.0.0.1:5000/qad', inputData);
//             setResponseData(response.data);
//             console.log(response.data.answer);
//             getAudio(response.data.answer);
//         } catch (error) {
//             console.error('Error:', error);
//         }
//     };

//     return (
//         <div>
//             <h1>Send Data to Backend</h1>
//             <form onSubmit={handleSubmit}>
//                 <label>
//                     Question:
//                     <input
//                         type="text"
//                         name="question"
//                         value={inputData.question}
//                         onChange={handleChange}
//                     />
//                 </label>
//                 <br />
//                 <label>
//                     Username:
//                     <input
//                         type="text"
//                         name="username"
//                         value={inputData.username}
//                         onChange={handleChange}
//                     />
//                 </label>
//                 <br />
//                 <label>
//                     Language:
//                     <select
//                         name="language"
//                         value={inputData.language}
//                         onChange={handleChange}
//                     >
//                         <option value="english">English</option>
//                         <option value="Hindi">Hindi</option>
//                     </select>
//                 </label>
//                 <br />
//                 <button type="submit">Send</button>
//             </form>
//             {responseData && (
//                 <div>
//                     <h2>Response from Backend</h2>
//                     <pre>{JSON.stringify(responseData.answer, null, 2)}</pre>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Deepgram;
