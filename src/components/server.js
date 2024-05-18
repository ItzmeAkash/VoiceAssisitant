const express = require('express');
const bodyParser = require('body-parser');
const { createClient } = require('@deepgram/sdk');
const fs = require('fs');
const cors = require('cors');

const app = express();
const port = 8000;

app.use(cors());
app.use(bodyParser.json());

const deepgram = createClient('6fa713b27411f9bef12b4aacf3f95f3f20e33304');

const getAudio = async (text) => {
  try {
    const response = await deepgram.speak.request(
      { text },
      {
        model: 'aura-asteria-en',
        encoding: 'linear16',
        container: 'wav',
      }
    );

    const stream = await response.getStream();
    const buffer = await getAudioBuffer(stream);

    fs.writeFile('output.wav', buffer, (err) => {
      if (err) {
        console.error('Error writing audio to file:', err);
      } else {
        console.log('Audio file written to output.wav');
      }
    });
  } catch (error) {
    console.error('Error generating audio:', error);
  }
};

const getAudioBuffer = async (response) => {
  const reader = response.getReader();
  const chunks = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }

  const dataArray = chunks.reduce(
    (acc, chunk) => Uint8Array.from([...acc, ...chunk]),
    new Uint8Array(0)
  );

  return Buffer.from(dataArray.buffer);
};

app.post('/answer', async (req, res) => {
  const { answer } = req.body;
  if (answer) {
    await getAudio(answer);
    res.status(200).send('Audio generation in progress.');
  } else {
    res.status(400).send('No answer provided.');
  }
});

app.listen(port, () => {
  console.log(`Server running on http://127.0.0.1:${port}`);
});
