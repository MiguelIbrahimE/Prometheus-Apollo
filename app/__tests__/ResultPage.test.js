// src/__tests__/ResultsPage.test.js
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import ResultsPage from '../src/ResultsPage';  // Adjust path if needed

// Mock the clipboard
Object.defineProperty(navigator, 'clipboard', {
    value: {
        writeText: jest.fn().mockResolvedValue(true), // Mock with a resolved promise to simulate successful copy
    },
});

describe('ResultsPage Component', () => {
    const mockGeneratedData = {
        html: '<!DOCTYPE html><html><head></head><body><h1>Hello World</h1></body></html>',
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders "No data found" message when generatedData is missing', () => {
        render(
            <MemoryRouter>
                <ResultsPage />
            </MemoryRouter>
        );
        expect(screen.getByText(/No data found/i)).toBeInTheDocument();
    });

    test('renders HTML content and "Copy to Clipboard" button when generatedData is present', () => {
        render(
            <MemoryRouter initialEntries={[{ state: { generatedData: mockGeneratedData } }]}>
                <ResultsPage />
            </MemoryRouter>
        );

        expect(screen.getByText(/Copy to Clipboard/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'HTML' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'PHP' })).toBeInTheDocument();
        expect(screen.getByText(/Hello World/i)).toBeInTheDocument();
    });

    test('copies HTML code to clipboard and shows "Copied!" confirmation', async () => {
        render(
            <MemoryRouter initialEntries={[{ state: { generatedData: mockGeneratedData } }]}>
                <ResultsPage />
            </MemoryRouter>
        );

        const copyButton = screen.getByText(/Copy to Clipboard/i);
        fireEvent.click(copyButton);

        expect(navigator.clipboard.writeText).toHaveBeenCalledWith(mockGeneratedData.html);
        // Simulate async behavior to wait for "Copied!" confirmation
        await act(async () => {
            expect(await screen.findByText(/Copied!/i)).toBeInTheDocument();
        });
    });

    test('adjusts layout for mobile when window is resized', () => {
        render(
            <MemoryRouter initialEntries={[{ state: { generatedData: mockGeneratedData } }]}>
                <ResultsPage />
            </MemoryRouter>
        );

        // Initially, window size is desktop (larger than 768px), so preview should be visible
        expect(screen.queryByTitle('HTML Preview')).toBeInTheDocument();

        // Resize window to mobile width and trigger the resize event
        global.innerWidth = 500;
        act(() => {
            global.dispatchEvent(new Event('resize'));
        });

        // In mobile view, preview should not be displayed
        expect(screen.queryByTitle('HTML Preview')).not.toBeInTheDocument();
    });
});
