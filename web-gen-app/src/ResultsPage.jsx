import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Prism from 'prismjs';
import anime from 'animejs';
import 'prismjs/themes/prism-okaidia.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Result.css';


function ResultsPage() {
  const location = useLocation();
  const { generatedData } = location.state || {};

  const [selectedCodeType, setSelectedCodeType] = useState('html');
  const [showCopied, setShowCopied] = useState(false);
  const [previewContent, setPreviewContent] = useState(''); // For preview
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    Prism.highlightAll();
  }, [selectedCodeType]);

  useEffect(() => {
    const handleResize = () => {
      const viewportWidth = window.innerWidth;
      setIsMobile(viewportWidth < 768); // Set to true if the viewport is mobile-sized
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    // Set the preview content when the component first mounts
    if (generatedData?.html) {
      setPreviewContent(generatedData.html);
    }
  }, [generatedData]);

  const handleToggle = (codeType) => {
    setSelectedCodeType(codeType);
    if (codeType === 'html') {
      setPreviewContent(generatedData?.html || '');
    } else if (codeType === 'php') {
      setPreviewContent(''); // You can handle PHP preview accordingly
    }
  };

  const processCodeText = (codeText) => {
    return codeText;
  };

  const handleCopyToClipboard = (code) => {
    navigator.clipboard.writeText(code).then(() => {
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 1500); // Show "Copied!" message for 1.5 seconds
    }).catch((err) => {
      console.error('Failed to copy: ', err);
    });
  };
  if (!generatedData) {
    return <div>No data found. Please go back and generate some code.</div>;
  }

  const { html } = generatedData;
  return (
      <div className="container-fluid results-page">
        <header className="row">
          <div className="col-6">
            <img src="/logo.png" alt="Logo" className="img-fluid logo-top-left"/>
          </div>
          <div className="col-6 text-end">
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

        <main className="content-wrapper row mt-4">
          <div className={`col-lg-6 col-md-6 col-sm-12 code-container ${isMobile ? 'full-width' : ''}`}>
            <div className="code-header d-flex justify-content-between">
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
              <div className="right-buttons">
                <button className="copy-button" onClick={() => handleCopyToClipboard(html)}>Copy to Clipboard</button>
                {showCopied && <span className="copied-text">Copied!</span>}
              </div>
            </div>

            {selectedCodeType === 'html' && (
                <div className="code-block-wrapper">
              <pre className="code-block">
                <code className="language-html">{processCodeText(html)}</code>
              </pre>
                </div>
            )}
          </div>

          {!isMobile && (
              <div className="col-lg-6 col-md-6 col-sm-12 preview-container">
                <div className="browser-mockup">
                  <div className="browser-header">
                    <div className="browser-buttons">
                      <div className="browser-button close"></div>
                      <div className="browser-button minimize"></div>
                      <div className="browser-button maximize"></div>
                    </div>
                    <div className="browser-address-bar">
                      <span>localhost:3000</span>
                    </div>
                  </div>
                  <iframe
                      srcDoc={previewContent}
                      title="HTML Preview"
                      sandbox="allow-scripts allow-same-origin"
                      className="preview-frame"
                  ></iframe>
                </div>
              </div>
          )}
        </main>
      </div>
  );
}

export default ResultsPage;
