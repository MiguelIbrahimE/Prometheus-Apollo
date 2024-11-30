import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function UploadPage() {
  const [inputText, setInputText] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showMobileAlert, setShowMobileAlert] = useState(false);
  const textareaRef = useRef(null);
  const navigate = useNavigate();

  const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

  const fillers = [
    'hi', 'hello', 'hey', 'how are you', 'what\'s up', 'ok', 'okay', 'thanks', 'thank you', 'please', 'sure', 'goodbye',
    'bye', 'see you', 'take care', 'catch you later', 'alright', 'cool', 'awesome', 'sounds good', 'got it', 'understood',
    'yep', 'yeah', 'no problem', 'np', 'alrighty', 'greetings', 'morning', 'afternoon', 'evening', 'good night',
    'talk to you soon', 'ciao', 'peace', 'bye-bye', 'see ya', 'yo', 'hey there', 'sup', 'howdy', 'cheers', 'much obliged',
    'all good', 'thank you so much', 'okie dokie', 'roger that', 'affirmative', 'will do', 'I see', 'noted', 'for sure',
    'certainly', 'alright then', 'take it easy', 'farewell', 'later', 'have a good one', 'make it happen', 'I got it',
    'copy that', 'done', 'no worries', 'much appreciated', 'thanks again', 'oh', 'ah', 'yes', 'right', 'fine', 'great',
    'right on', 'not really', 'cool with me', 'that’s fine', 'works for me', 'same here', 'yessir', 'you bet', 'my pleasure'
  ];

  const activatingKeywords = ['generate', 'code', 'html', 'css', 'javascript', 'build', 'create', 'make', 'script'];

  const isMobile = () => /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  const handleInputChange = (event) => {
    setInputText(event.target.value);
    event.target.style.height = 'auto';
    event.target.style.height = `${Math.max(textareaRef.current.scrollHeight, textareaRef.current.offsetHeight)}px`;
  };

  const isValidPrompt = (text) => {
    const cleanedText = text.trim().toLowerCase();
    const hasActivatingKeyword = activatingKeywords.some(keyword => cleanedText.includes(keyword));
    const isNotFillerOnly = !fillers.includes(cleanedText) && cleanedText.length > 5;
    return hasActivatingKeyword && isNotFillerOnly;
  };

  useEffect(() => {
    if (isMobile()) {
      setShowMobileAlert(true);
      const timeoutId = setTimeout(() => setShowMobileAlert(false), 5000);
      return () => clearTimeout(timeoutId);
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isValidPrompt(inputText)) {
      setStatusMessage('This is not a valid code generation request :(');
      return;
    }

    setLoading(true);
    setStatusMessage('Processing...');

    try {
      const fullPrompt = `${inputText}. Please provide HTML code. Do not include explanations.`;

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

      const generatedData = {
        html: htmlMatch ? htmlMatch[0].trim() : 'No HTML code found.',
      };

      if (!generatedData.html) {
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
              Heads up! You're using mobile, and some features like previewing the website are not available.
            </div>
        )}

        <header>
          <div className="logo-container">
            <img src="/logo.png" alt="Logo" className="logo-top-left img-fluid" />
          </div>
          <div className="buy-me-coffee">
            <a href="https://buymeacoffee.com/prometheus.desico" target="_blank" rel="noopener noreferrer">
              <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me a Coffee" width="150" height="40" />
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
