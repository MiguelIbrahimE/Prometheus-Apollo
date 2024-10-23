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
  const [previewContent, setPreviewContent] = useState(''); // For preview

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
    if (codeType === 'html') {
      setPreviewContent(generatedData?.html || '');
    } else if (codeType === 'php') {
      setPreviewContent(''); // You can handle PHP preview accordingly
    }
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
    navigator.clipboard.writeText(code).then(() => {
      setShowCopied(true);

      setTimeout(() => {
        anime({
          targets: '.copied-text',
          translateY: [-20, -50],
          opacity: [0, 1],
          duration: 1000,
          easing: 'easeOutQuad',
          complete: () => {
            setTimeout(() => {
              setShowCopied(false);
            }, 1000);
          },
        });
      }, 50);
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

        <main className="content-wrapper">
          <div className="row">
            <div className="col-md-5 code-container">
              <div className="code-header">
                <div className="left-buttons">
                  <button
                      className={`toggle-button ${selectedCodeType === 'html' ? 'active' : ''}`}
                      onClick={() => handleToggle('html')}
                  >
                    HTML
                  </button>
                  <button
                      className={`toggle-button ${selectedCodeType === 'php' ? 'active' : ''}`}
                      onClick={() => handleToggle('php')}
                  >
                    PHP
                  </button>
                </div>
                <button className="copy-button" onClick={() => handleCopyToClipboard(html)}>Copy to Clipboard</button>
              </div>

              {selectedCodeType === 'html' && (
                  <div className="code-block-wrapper">
                <pre className="code-block">
                  <code className="language-html">{processCodeText(html)}</code>
                </pre>
                  </div>
              )}
            </div>

            <div className="col-md-7 preview-container">
              <h4>Live Preview</h4>
              <iframe
                  srcDoc={previewContent}
                  title="HTML Preview"
                  sandbox="allow-scripts allow-same-origin"
                  className="preview-frame"
              ></iframe>
            </div>
          </div>
        </main>
      </div>
  );
}

export default ResultsPage;
