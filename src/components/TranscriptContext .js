import React, { createContext, useState, useContext } from 'react';

const TranscriptContext = createContext();

export const TranscriptProvider = ({ children }) => {
  const [transcript, setTranscript] = useState('');

  return (
    <TranscriptContext.Provider value={{ transcript, setTranscript }}>
      {children}
    </TranscriptContext.Provider>
  );
};

export const useTranscript = () => useContext(TranscriptContext);
