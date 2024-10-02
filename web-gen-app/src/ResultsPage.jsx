import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Prism from 'prismjs';
import 'prismjs/themes/prism-okaidia.css'; // Optional theme for code highlighting
import './Result.css'; // Assuming you have the necessary styles here

function ResultsPage() {
  const location = useLocation();
  const { generatedData } = location.state || {}; // Fallback if no data

  const [selectedCodeType, setSelectedCodeType] = useState('html');

  // Reapply syntax highlighting whenever the selected code type changes
  useEffect(() => {
    Prism.highlightAll();
  }, [selectedCodeType]);

  const handleToggle = (codeType) => {
    setSelectedCodeType(codeType);
  };

  // Check if the data is received correctly
  if (!generatedData) {
    return <div>No data found. Please go back and generate some code.</div>;
  }

  const { html, css, js } = generatedData;

  // If no code is necessary (e.g., no CSS or JS), display the cute cat image for that section
  const showCatImageForCSS = !css;
  const showCatImageForJS = !js;

  // Dynamic font-size adjustment based on viewport size
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

  return (
      <div className="container">
        <header>
          <img src="/logo-no-background.png" alt="Logo" className="logo-top-left" />
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
                <code className="language-html">{html}</code>
              </pre>
              )}

              {selectedCodeType === 'css' && showCatImageForCSS ? (
                  <div className="cat-image-container">
                    <img src="/cat.png" alt="No code necessary" />
                    <p>No code necessary for this prompt! 😸</p>
                  </div>
              ) : (
                  selectedCodeType === 'css' && (
                      <pre className="code-block">
                  <code className="language-css">{css}</code>
                </pre>
                  )
              )}

              {selectedCodeType === 'js' && showCatImageForJS ? (
                  <div className="cat-image-container">
                    <img src="/cat.png" alt="No code necessary" />
                    <p>No code necessary for this prompt! 😸</p>
                  </div>
              ) : (
                  selectedCodeType === 'js' && (
                      <pre className="code-block">
                  <code className="language-javascript">{js}</code>
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
