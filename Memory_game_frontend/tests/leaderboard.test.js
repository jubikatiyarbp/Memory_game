const { fireEvent, screen } = require('@testing-library/dom');
require('@testing-library/jest-dom');  

// Set up the test DOM
document.body.innerHTML = `
    <div id="leaderboard-container" class="leaderboard-container">
        <h2 class="leaderboard-title">Leaderboard</h2>

        <div class="difficulty-tabs">
            <button class="tab-btn active" onclick="displayLeaderboard('Easy')">Easy</button>
            <button class="tab-btn" onclick="displayLeaderboard('Medium')">Medium</button>
            <button class="tab-btn" onclick="displayLeaderboard('Hard')">Hard</button>
        </div>

        <table>
            <thead>
                <tr>
                    <th>Rank</th>
                    <th>Player Name</th>
                    <th>Score</th>
                </tr>
            </thead>
            <tbody id="leaderboard-body"></tbody>
        </table>
    </div>
`;

// // ✅ Spy on global functions
beforeEach(() => {
    window.displayLeaderboard = jest.fn();
    global.fetch = jest.fn();
});

afterEach(() => {
    jest.restoreAllMocks();
});

// ✅ Test 1: Clicking difficulty button calls `displayLeaderboard`
test('Clicking Medium difficulty tab calls displayLeaderboard with correct difficulty', () => {
    const mediumButton = screen.getByText('Medium');
    fireEvent.click(mediumButton);

    expect(displayLeaderboard).toHaveBeenCalledWith('Medium'); // ✅
});

test('Clicking Easy difficulty tab calls displayLeaderboard with correct difficulty', () => {
    const mediumButton = screen.getByText('Easy');
    fireEvent.click(mediumButton);

    expect(displayLeaderboard).toHaveBeenCalledWith('Easy'); // ✅
});

test('Clicking Hard difficulty tab calls displayLeaderboard with correct difficulty', () => {
    const mediumButton = screen.getByText('Hard');
    fireEvent.click(mediumButton);

    expect(displayLeaderboard).toHaveBeenCalledWith('Hard'); // ✅
});





