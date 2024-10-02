import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Prism from 'prismjs';
import 'prismjs/themes/prism-okaidia.css'; // Optional theme for code highlighting
import './Result.css'; // Assuming you have the necessary styles here
import 'bootstrap/dist/css/bootstrap.min.css';

function ResultsPage() {
  const location = useLocation();
  const { generatedData } = location.state || {}; // Fallback if no data

  const [selectedCodeType, setSelectedCodeType] = useState('html');
  console.log('API Key:', process.env.REACT_APP_OPENAI_API_KEY);

  // Always call useEffect outside any conditional logic
  useEffect(() => {
    Prism.highlightAll();
  }, [selectedCodeType]);

  // Another useEffect to handle the resizing logic
  useEffect(() => {
    const handleResize = () => {
      const container = document.querySelector('.code-container');
      const viewportWidth = window.innerWidth;

      // Adjust font-size based on viewport width
      if (viewportWidth < 768) {
        container.style.fontSize = '12px';
      } else if (viewportWidth >= 768 && viewportWidth < 1440) {
        container.style.fontSize = '14px';
      } else {
        container.style.fontSize = '16px';
      }
    };

    // Initial call to set the size
    handleResize();

    // Add event listener to handle window resizing
    window.addEventListener('resize', handleResize);

    // Cleanup on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleToggle = (codeType) => {
    setSelectedCodeType(codeType);
  };

  // Function to insert line breaks at a character limit for long lines
  const processCodeText = (codeText, lineLimit = 80) => {
    return codeText
        .split('\n')
        .map((line) => {
          if (line.length > lineLimit) {
            return line.match(new RegExp(`.{1,${lineLimit}}`, 'g')).join('\n');
          }
          return line;
        })
        .join('\n');
  };

  // Check if the data is received correctly after the effects are set up
  if (!generatedData) {
    return <div>No data found. Please go back and generate some code.</div>;
  }

  const { html, css, js } = generatedData;

  // If no code is necessary (e.g., no CSS or JS), display the cute cat image for that section
  const showCatImageForCSS = !css;
  const showCatImageForJS = !js;

  return (
      <div className="container">
        <header>
          <div className="logo-container">
            <img src="/logo.png" alt="Logo" className="logo-top-left img-fluid"/>
          </div>
        </header>

        <main>
          <div className="content-wrapper">
            {/* Button container */}
            <div className="button-container">
              <button
                  className={`toggle-button ${selectedCodeType === 'html' ? 'active' : ''}`}
                  onClick={() => handleToggle('html')}
              >
                HTML
              </button>
              <button
                  className={`toggle-button ${selectedCodeType === 'css' ? 'active' : ''}`}
                  onClick={() => handleToggle('css')}
              >
                CSS
              </button>
              <button
                  className={`toggle-button ${selectedCodeType === 'js' ? 'active' : ''}`}
                  onClick={() => handleToggle('js')}
              >
                JS
              </button>
            </div>

            <div className="code-container">
              {selectedCodeType === 'html' && (
                  <pre className="code-block">
                <code className="language-html">{processCodeText(html)}</code>
              </pre>
              )}

              {selectedCodeType === 'css' && showCatImageForCSS ? (
                  <div className="cat-image-container">
                    <img src="/cat.png" alt="No code necessary"/>
                    <p>No code necessary for this prompt! </p>
                  </div>
              ) : (
                  selectedCodeType === 'css' && (
                      <pre className="code-block">
                  <code className="language-css">{processCodeText(css)}</code>
                </pre>
                  )
              )}

              {selectedCodeType === 'js' && showCatImageForJS ? (
                  <div className="cat-image-container">
                    <img src="/cat.png" alt="No code necessary"/>
                    <p>No code necessary for this prompt! 😸</p>
                  </div>
              ) : (
                  selectedCodeType === 'js' && (
                      <pre className="code-block">
                  <code className="language-javascript">{processCodeText(js)}</code>
                </pre>
                  )
              )}
            </div>
          </div>
        </main>
      </div>
  );
}

export default ResultsPage;
