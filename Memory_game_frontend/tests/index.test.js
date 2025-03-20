/**
 * @jest-environment jsdom
 */
const { fireEvent, screen } = require('@testing-library/dom');
require('@testing-library/jest-dom');  
const fs = require('fs');
const path = require('path');

beforeEach(() => {
    // Load HTML structure
    const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');
    document.body.innerHTML = html;
    window.handleGuestUserPlay = jest.fn(); 
    window.handleLoginPlayButton = jest.fn();
});

afterEach(() => {
    jest.restoreAllMocks(); // Reset mocks after each test
});

test('Clicking Home button navigates to index.html', () => {
    const homeLink = screen.getByText('Home');
    expect(homeLink).toBeInTheDocument();

    fireEvent.click(homeLink);

    expect(homeLink.getAttribute('href')).toBe('index.html');
});

test('Clicking Leaderboard button navigates to leaderboard.html', () => {
    const leaderboardLink = screen.getByText('Leaderboard');
    expect(leaderboardLink).toBeInTheDocument();

    fireEvent.click(leaderboardLink);

    expect(leaderboardLink.getAttribute('href')).toBe('leaderboard.html');
});

test('Clicking "Login & Play" shows the correct content', () => {
    const loginTab = screen.getByText('Login & Play');
    expect(loginTab).toBeInTheDocument();

    fireEvent.click(loginTab);

    const loginPlayContent = document.getElementById('loginPlay');
    expect(loginPlayContent).toHaveClass('active');
    expect(screen.getByText('Save your scores and join the leaderboard.')).toBeVisible();
});

test('Selecting difficulty does not immediately set it in local storage ', () => {
    document.body.innerHTML = `
        <button class="difficulty-btn" data-difficulty="Easy">Easy</button>
        <button class="difficulty-btn" data-difficulty="Medium">Medium</button>
        <button class="difficulty-btn" data-difficulty="Hard">Hard</button>
    `;
    
    Storage.prototype.setItem = jest.fn();
    Storage.prototype.getItem = jest.fn();

    const easyButton = screen.getByText('Easy');
    fireEvent.click(easyButton);
    expect(localStorage.setItem).not.toHaveBeenCalled();

    const mediumButton = screen.getByText('Medium');
    fireEvent.click(mediumButton);

    // Ensure localStorage is not updated for Medium
    expect(localStorage.setItem).not.toHaveBeenCalled();
});

test('Clicking "Play as Guest" button calls handleGuestUserPlay()', () => {
    const guestPlayButton = screen.getByRole('button', { name: 'Play as Guest' });
    fireEvent.click(guestPlayButton);
    expect(window.handleGuestUserPlay).toHaveBeenCalled(); 
});

test('Clicking "Login to Play" button calls handleLoginPlayButton()', () => {
    const loginPlayButton = screen.getByRole('button', { name: 'Login to Play' });
    fireEvent.click(loginPlayButton);
    expect(window.handleLoginPlayButton).toHaveBeenCalled(); 
});
