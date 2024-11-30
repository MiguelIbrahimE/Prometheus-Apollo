import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Prism from 'prismjs';
import jsPDF from 'jspdf';
import 'prismjs/themes/prism-okaidia.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Result.css';

function ResultsPage() {
  const location = useLocation();
  const { generatedData } = location.state || {};

  const [showCopied, setShowCopied] = useState(false);
  const [previewContent, setPreviewContent] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    Prism.highlightAll();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (generatedData?.html) {
      setPreviewContent(generatedData.html);
    } else {
      setPreviewContent('');
    }
  }, [generatedData]);

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(generatedData.html || '').then(() => {
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 1500);
    }).catch((err) => {
      console.error('Failed to copy: ', err);
    });
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const explanation = `
# Code Explanation

This section provides a detailed explanation of what the generated HTML code does:

The generated HTML code is structured as follows:

1. **Document Type Declaration (<!DOCTYPE html>):** This specifies the document is an HTML5 document.
2. **<html> Tag:** The root element of the document.
3. **<head> Section:** Contains metadata such as the title and links to stylesheets or scripts.
4. **<body> Section:** Contains the main content, which includes headings, paragraphs, images, and other elements.

### Key Features:
- Semantic structure ensures accessibility and usability.
- Focused on responsive design principles if integrated with CSS.
- Modular and ready for integration into larger projects.

### Usage:
The HTML is suitable for use in websites and can be extended with JavaScript and CSS for added functionality.

Preview the code output in the right-hand pane to see how it looks in a browser.
    `;
    doc.text(explanation, 10, 10);
    doc.save('Code_Explanation.pdf');
  };

  if (!generatedData) {
    return <div>No data found. Please go back and generate some code.</div>;
  }

  const { html } = generatedData;

  return (
      <div className="container-fluid results-page">
        <header className="row">
          <div className="col-6">
            <img src="/logo.png" alt="Logo" className="img-fluid logo-top-left" />
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
                <button className="toggle-button active">HTML</button>
              </div>
              <div className="right-buttons">
                <button className="copy-button" onClick={handleCopyToClipboard}>
                  Copy to Clipboard
                </button>
                {showCopied && <span className="copied-text">Copied!</span>}
              </div>
            </div>

            <div className="code-block-wrapper">
            <pre className="code-block">
              <code className="language-html">{html || 'No HTML code available'}</code>
            </pre>
            </div>
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

          <div className="col-12 mt-4">
            <h3>Code Explanation</h3>
            <p>
              This section provides a detailed explanation of the generated HTML code. It covers the structure,
              functionality, and usage, ensuring a clear understanding of the code.
            </p>
            <button onClick={handleDownloadPDF} className="btn btn-primary">
              Download Explanation as PDF
            </button>
          </div>
        </main>
      </div>
  );
}

export default ResultsPage;
