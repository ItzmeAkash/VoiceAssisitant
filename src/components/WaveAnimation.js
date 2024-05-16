import React from 'react';
import './WaveAnimation.css';

const WaveAnimation = () => {
  return (
    <div className="wave-container">
      <div className="microphone-icon">
        <svg viewBox="0 0 24 24" width="50" height="50">
          <circle cx="12" cy="12" r="10" fill="url(#grad1)" />
          <text x="50%" y="50%" textAnchor="middle" dy=".3em" fill="#fff" fontSize="12px">🎙️</text>
        </svg>
      </div>
      <svg className="wave" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path d="M0,0V60C100,80,250,0,400,40C550,80,700,0,900,20C1100,40,1200,0,1200,0V120H0Z"></path>
      </svg>
      <p>Your Voice Assistant</p>
    </div>
  );
};

export default WaveAnimation;