import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Prism from 'prismjs';
import anime from 'animejs';
import 'prismjs/themes/prism-okaidia.css';
import './Result.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function ResultsPage() {
  const location = useLocation();
  const { generatedData } = location.state || {};

  const [selectedCodeType, setSelectedCodeType] = useState('html');
  const [showCopied, setShowCopied] = useState(false);

  useEffect(() => {
    Prism.highlightAll();
  }, [selectedCodeType]);

  useEffect(() => {
    const handleResize = () => {
      const container = document.querySelector('.code-container');
      const viewportWidth = window.innerWidth;

      if (viewportWidth < 768) {
        container.style.fontSize = '12px';
      } else if (viewportWidth >= 768 && viewportWidth < 1440) {
        container.style.fontSize = '14px';
      } else {
        container.style.fontSize = '16px';
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleToggle = (codeType) => {
    setSelectedCodeType(codeType);
  };

  const processCodeText = (codeText) => {
    const viewportWidth = window.innerWidth;
    let lineLimit;

    if (viewportWidth < 768) {
      lineLimit = 50;
    } else if (viewportWidth >= 768 && viewportWidth < 1440) {
      lineLimit = 80;
    } else {
      lineLimit = 100;
    }

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

  const handleCopyToClipboard = (code) => {
    // Copy the code to the clipboard
    navigator.clipboard.writeText(code).then(() => {
      // Set state to show the "Copied!" message
      setShowCopied(true);

      // Use a small delay to ensure state is set before triggering animation
      setTimeout(() => {
        // Run the animation
        anime({
          targets: '.copied-text',
          translateY: [-20, -50],
          opacity: [0, 1],
          duration: 1000,
          easing: 'easeOutQuad',
          complete: () => {
            setTimeout(() => {
              // Hide the "Copied!" message after 1 second
              setShowCopied(false);
            }, 1000);
          }
        });
      }, 50); // A slight delay to ensure state is updated
    }).catch((err) => {
      console.error('Failed to copy: ', err);
    });
  };

  if (!generatedData) {
    return <div>No data found. Please go back and generate some code.</div>;
  }

  const { html, css, js } = generatedData;

  const showCatImageForCSS = !css;
  const showCatImageForJS = !js;

  return (
      <div className="container-fluid">
        <header>
          <div className="logo-container">
            <img src="/logo.png" alt="Logo" className="logo-top-left img-fluid" />
          </div>

          {/* Buy Me a Coffee button */}
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
        <br /><br /><br /><br /><br /><br />

        <main>
          <div className="row">
            <div className="col-md-2 button-container">
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

            <div className="col-md-10 code-container">
              {selectedCodeType === 'html' && (
                  <div className="code-block-wrapper">
                    <button className="copy-button" onClick={() => handleCopyToClipboard(html)}>Copy</button>
                    {showCopied && <div className="copied-text">Copied!</div>}
                    <pre className="code-block">
                  <code className="language-html">{processCodeText(html)}</code>
                </pre>
                  </div>
              )}

              {selectedCodeType === 'css' && showCatImageForCSS ? (
                  <div className="cat-image-container">
                    <img src="/cat.png" alt="No code necessary" />
                    <p>No code necessary for this prompt! </p>
                  </div>
              ) : (
                  selectedCodeType === 'css' && (
                      <div className="code-block-wrapper">
                        <button className="copy-button" onClick={() => handleCopyToClipboard(css)}>Copy</button>
                        {showCopied && <div className="copied-text">Copied!</div>}
                        <pre className="code-block">
                    <code className="language-css">{processCodeText(css)}</code>
                  </pre>
                      </div>
                  )
              )}

              {selectedCodeType === 'js' && showCatImageForJS ? (
                  <div className="cat-image-container">
                    <img src="/cat.png" alt="No code necessary" />
                    <p>No code necessary for this prompt! </p>
                  </div>
              ) : (
                  selectedCodeType === 'js' && (
                      <div className="code-block-wrapper">
                        <button className="copy-button" onClick={() => handleCopyToClipboard(js)}>Copy</button>
                        {showCopied && <div className="copied-text">Copied!</div>}
                        <pre className="code-block">
                    <code className="language-javascript">{processCodeText(js)}</code>
                  </pre>
                      </div>
                  )
              )}
            </div>
          </div>
        </main>
      </div>
  );
}

export default ResultsPage;
