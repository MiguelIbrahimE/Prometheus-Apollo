import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Using Axios to send HTTP requests
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function UploadPage() {
  const [inputText, setInputText] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showMobileAlert, setShowMobileAlert] = useState(false); // State to show/hide mobile alert
  const textareaRef = useRef(null); // Ref for textarea
  const navigate = useNavigate();

  const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

  // Detect if the user is on a mobile device
  const isMobile = () => {
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  };

  // Auto-resize textarea based on content
  const handleInputChange = (event) => {
    setInputText(event.target.value);

    event.target.style.height = 'auto'; // Reset height to auto
    event.target.style.height = `${Math.max(textareaRef.current.scrollHeight, textareaRef.current.offsetHeight)}px`;
  };

  // Show the mobile alert if the user is on mobile
  useEffect(() => {
    if (isMobile()) {
      setShowMobileAlert(true);

      // Hide the alert after 5 seconds
      setTimeout(() => {
        setShowMobileAlert(false);
      }, 5000);
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setStatusMessage('Processing...');

    try {
      const preconditionPrompt = `...`;

      const fullPrompt = `${preconditionPrompt} ${inputText}. Please return only the HTML, CSS, and JavaScript code for this. Do not provide explanations.`;

      const response = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: 'gpt-3.5-turbo',
            messages: [
              { role: 'system', content: 'You are a code generation assistant.' },
              { role: 'user', content: fullPrompt },
            ],
            max_tokens: 1500,
          },
          {
            headers: {
              Authorization: `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
          }
      );

      const generatedText = response.data.choices[0].message.content;

      const htmlMatch = generatedText.match(/<!DOCTYPE html[\s\S]*<\/html>/i);
      const cssMatch = generatedText.match(/(?<=<style>)[\s\S]*?(?=<\/style>)/i);
      const jsMatch = generatedText.match(/(?<=<script>)[\s\S]*?(?=<\/script>)/i);

      const hasCSS = cssMatch && cssMatch[0].trim();
      const hasJS = jsMatch && jsMatch[0].trim();

      let html = htmlMatch ? htmlMatch[0].replace(/<style[\s\S]*?>[\s\S]*<\/style>/, '') : 'No full HTML document found.';
      if (!hasCSS) {
        html = html.replace('<link rel="stylesheet" href="./styles.css">', '');
      }
      if (!hasJS) {
        html = html.replace('<script src="./script.js"></script>', '');
      }

      const generatedData = {
        html,
        css: hasCSS ? cssMatch[0].trim() : '',
        js: hasJS ? jsMatch[0].trim() : '',
      };

      if (!generatedData.html && !generatedData.css && !generatedData.js) {
        setStatusMessage('No code found. Please try a different prompt.');
      } else {
        navigate('/results', { state: { generatedData } });
      }

      setLoading(false);
    } catch (error) {
      console.error('Error generating code:', error);
      setStatusMessage('Error generating code. Please try again.');
      setLoading(false);
    }
  };

  return (
      <div className="container">
        {showMobileAlert && (
            <div className="mobile-alert">
              Heads up! You're using mobile, and some features like previewing the website is not available.
            </div>
        )}

        <header>
          <div className="logo-container">
            <img src="/logo.png" alt="Logo" className="logo-top-left img-fluid" />
          </div>

          <div className="buy-me-coffee">
            <a href="https://buymeacoffee.com/prometheus.desico" target="_blank" rel="noopener noreferrer">
              <img
                  src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
                  alt="Buy Me a Coffee"
                  width="150"
                  height="40"
              />
            </a>
          </div>
        </header>

        <main>
          <form onSubmit={handleSubmit}>
            <div className="input-area">
            <textarea
                ref={textareaRef}
                value={inputText}
                onChange={handleInputChange}
                placeholder="Enter your prompt :D"
                className="text-input"
                rows="1"
                style={{ resize: 'none', overflow: 'hidden' }}
            />
              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? 'Processing...' : 'Generate Code'}
              </button>
            </div>
          </form>

          {statusMessage && <div className="status-message">{statusMessage}</div>}
        </main>
      </div>
  );
}

export default UploadPage;
