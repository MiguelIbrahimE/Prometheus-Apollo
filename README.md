<img width="898" alt="cat" src="https://github.com/user-attachments/assets/f3399c4c-163a-4dcb-9c85-afd300aebf9a">

# Prometheus Code Generation Tool

This repository contains a simple web application built using **React**, **Prism.js**, **Anime.js**, and **Bootstrap**. The app allows users to input code prompts and receive generated HTML, CSS, and JavaScript code, which can be viewed and tested through a live preview embedded within a browser-like interface.

## Table of Contents

1. [Features](#features)

2. [Technologies Used](#technologies-used)
3. [How It Works](#how-it-works)


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

## How It Works

### Code Display and Preview
The **ResultsPage** component takes user input, generates code based on the prompt, and displays it in a styled code block using **Prism.js**. The app also displays a live preview of the generated HTML inside an embedded `iframe` styled like a browser window.

### Copy to Clipboard
The application allows users to copy the generated code with a simple click on the "Copy to Clipboard" button, and displays a small animation using **Anime.js** to indicate success.

### Responsiveness
The application uses **Bootstrap’s grid system** to ensure that the layout adjusts properly for different screen sizes. The preview is hidden on smaller screens, such as mobile devices, where space is limited.


