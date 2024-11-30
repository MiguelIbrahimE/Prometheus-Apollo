# Prometheus Code Generation Tool

This repository contains a simple web application built using **React**, **Prism.js**, **Anime.js**, and **Bootstrap**. The app allows users to input code prompts and receive generated HTML, CSS, and JavaScript code, which can be viewed and tested through a live preview embedded within a browser-like interface.

## Table of Contents

1. [Features](#features)
2. [Technologies Used](#technologies-used)
3. [File Structure](#file-structure)
4. [How It Works](#how-it-works)


## Features

- **Code Prompt Input**: Users can input code-related prompts and receive generated HTML/CSS/JS.
- **Code Preview**: The application displays the generated code and provides a live preview of the HTML in a browser-like environment.
- **Copy to Clipboard**: Easily copy the generated code to the clipboard for quick use.
- **Responsive Design**: The application is fully responsive, ensuring that the layout adjusts correctly on mobile, tablet, and desktop devices.

## Technologies Used

- **React**: A JavaScript library for building user interfaces.
- **Prism.js**: A lightweight and fast syntax highlighter.
- **Anime.js**: A flexible JavaScript animation library.
- **Bootstrap**: A front-end framework for responsive design.
- **Axios**: For making API requests.

## File Structure

.
├── README.md
├── docker-compose.yml
└── web-gen-app
├── Dockerfile
├── build
│   ├── asset-manifest.json
│   ├── cat.png
│   ├── favi.png
│   ├── favico.ico
│   ├── index.html
│   ├── laptop-clr.png
│   ├── laptop.png
│   ├── logo.png
│   └── static
│       ├── css
│       │   ├── main.91328d15.css
│       │   └── main.91328d15.css.map
│       └── js
│           ├── 453.dc1a4ebd.chunk.js
│           ├── 453.dc1a4ebd.chunk.js.map
│           ├── main.215e67c7.js
│           ├── main.215e67c7.js.LICENSE.txt
│           └── main.215e67c7.js.map
├── components
│   └── FileUpload.js
├── package-lock.json
├── package.json
├── public
│   ├── cat.png
│   ├── favi.png
│   ├── favico.ico
│   ├── index.html
│   ├── laptop-clr.ico
│   ├── laptop.png
│   └── logo.png
└── src
├── App.css
├── App.js
├── Result.css
├── ResultsPage.jsx
├── Sample Generation
├── UploadPage.jsx
├── index.css
├── index.js
├── logo.svg
├── reportWebVitals.js
└── setupTests.js


## How It Works

### Code Display and Preview
The **ResultsPage** component takes user input, generates code based on the prompt, and displays it in a styled code block using **Prism.js**. The app also displays a live preview of the generated HTML inside an embedded `iframe` styled like a browser window.

### Copy to Clipboard
The application allows users to copy the generated code with a simple click on the "Copy to Clipboard" button, and displays a small animation using **Anime.js** to indicate success.

### Responsiveness
The application uses **Bootstrap’s grid system** to ensure that the layout adjusts properly for different screen sizes. The preview is hidden on smaller screens, such as mobile devices, where space is limited.

### Example Request
give me a code that generates random sequence of characters when you press a button,
XZY00 is an example, QWE01give me a code that generates random sequence of characters when you press a button,
XZY00 is an example, QWE01
