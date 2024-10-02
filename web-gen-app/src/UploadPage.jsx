import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Using Axios to send HTTP requests
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function UploadPage() {
  const [inputText, setInputText] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Get the API key from the environment variable (which is stored in a .env file)
  const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setStatusMessage('Processing...');

    try {
      // Precondition to ensure CSS and JS are referenced as external files in the HTML
      const preconditionPrompt = `
        Please provide a full HTML document that references an external CSS file and an external JavaScript file (if necessary).
        In the HTML <head> section, add a <link rel="stylesheet" href="./styles.css"> to reference the external CSS file, but only if CSS is required.
        At the end of the <body> section, add a <script src="./script.js"></script> to reference the external JavaScript file, but only if JavaScript is required.
        
        The CSS file should only contain valid CSS rules that style elements in the HTML. It should not contain any HTML or JavaScript.
        Similarly, the JavaScript file should contain only valid JavaScript code related to interactions with elements in the HTML. It should not contain any HTML or CSS.
        
        If no CSS or JavaScript is required, return only the HTML code without the external references.
      `;

      // Combine the precondition prompt with the user's input prompt
      const fullPrompt = `${preconditionPrompt} ${inputText}. Please return only the HTML, CSS, and JavaScript code for this. Do not provide explanations.`;

      // Send the request to OpenAI API
      const response = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: 'gpt-3.5-turbo',
            messages: [
              { role: 'system', content: 'You are a code generation assistant.' },
              { role: 'user', content: fullPrompt },
            ],
            max_tokens: 1500, // Increase token limit for full documents
          },
          {
            headers: {
              Authorization: `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
          }
      );

      const generatedText = response.data.choices[0].message.content;

      // Use regular expressions to capture full HTML, CSS, and JS
      const htmlMatch = generatedText.match(/<!DOCTYPE html[\s\S]*<\/html>/i); // Match the entire HTML document
      const cssMatch = generatedText.match(/(?<=<style>)[\s\S]*?(?=<\/style>)/i); // Capture only the CSS rules inside the <style> tag
      const jsMatch = generatedText.match(/(?<=<script>)[\s\S]*?(?=<\/script>)/i); // Capture only the JS code inside the <script> tag

      // Check if CSS and JS are present
      const hasCSS = cssMatch && cssMatch[0].trim();
      const hasJS = jsMatch && jsMatch[0].trim();

      // Update the HTML to only include CSS and JS references if necessary
      let html = htmlMatch ? htmlMatch[0].replace(/<style[\s\S]*?>[\s\S]*<\/style>/, '') : 'No full HTML document found.';
      if (!hasCSS) {
        html = html.replace('<link rel="stylesheet" href="./styles.css">', ''); // Remove CSS reference if no CSS
      }
      if (!hasJS) {
        html = html.replace('<script src="./script.js"></script>', ''); // Remove JS reference if no JS
      }

      const generatedData = {
        html,
        css: hasCSS ? cssMatch[0].trim() : '', // Only add CSS if present
        js: hasJS ? jsMatch[0].trim() : '', // Only add JS if present
      };

      // If no code is found in any of the sections, show an error message
      if (!generatedData.html && !generatedData.css && !generatedData.js) {
        setStatusMessage('No code found. Please try a different prompt.');
      } else {
        // Navigate to the results page and pass the generated code
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
        <header>
          <div className="logo-container">
            <img src="/logo.png" alt="Logo" className="logo-top-left img-fluid"/>
          </div>
        </header>


        <main>
          <form onSubmit={handleSubmit}>
            <div className="input-area">
            <textarea
                value={inputText}
                onChange={handleInputChange}
                placeholder="Enter your prompt (e.g., Create a button that redirects to Google)"
                className="text-input"
                rows="5"
            />
              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? 'Processing...' : 'Generate Code'}
              </button>
            </div>
          </form>

          {/* Display status message */}
          {statusMessage && <div className="status-message">{statusMessage}</div>}
        </main>
      </div>
  );
}

export default UploadPage;
