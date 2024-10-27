// src/__tests__/UploadPage.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom'; // Import jest-dom for extended matchers
import UploadPage from '../src/UploadPage';  // Ensure this path points to the correct component file

// Mock the axios module

describe('UploadPage Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders the input and generate button', () => {
        render(<UploadPage />, { wrapper: MemoryRouter });

        const input = screen.getByPlaceholderText(/Enter your prompt :D/i);
        const button = screen.getByText(/Generate Code/i);

        expect(input).toBeInTheDocument();
        expect(button).toBeInTheDocument();
    });

    test('displays an error for invalid input', () => {
        render(<UploadPage />, { wrapper: MemoryRouter });

        const input = screen.getByPlaceholderText(/Enter your prompt :D/i);
        const button = screen.getByText(/Generate Code/i);

        fireEvent.change(input, { target: { value: 'hello' } }); // Enter an invalid input
        fireEvent.click(button); // Submit form

        expect(screen.getByText(/not a valid code generation request/i)).toBeInTheDocument();
    });




});
