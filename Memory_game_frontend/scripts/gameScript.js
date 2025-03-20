/* 
Structure of code and its features------
1. `fetchGameData`: Asynchronously loads game settings (card dimensions, image URLs, etc.) from an external JSON file 'game_data.json'
2. Card Class: Represents individual cards, including their position, image, and flipped status. Handles rendering on the canvas.
3. Game Class: Manages the entire game, including:
    Card setup, shuffling, and positioning.
    Real-time score and timer updates.
    User interactions like card flipping.
    Game logic for matching pairs and determining the game's outcome.

Features ---
1. Scoring: Players earn 10 points for every successful match with score being updated in real-time and displayed on the screen.
2. Timer: The game has a countdown timer based on the configured time limit (in minutes). Players are tasked to 
complete the game within the time limit to win the game.
3. Shuffling of cards: Cards are shuffled randomly at the beginning of the game, ensuring a fresh and unpredictable layout every time.
4. Play Again: This button reloads the game, allowing players to replay immediately without refreshing the browser manually.
*/


setupNavbar();

// Card class to represent each card in the game
class Card {
  constructor(x, y, imageUrl) {
    this.x = x; // x-coordinate
    this.y = y; // y-coordinate
    this.image = imageUrl; // Image URL for the card
    this.flipped = false; // Flipped status of the card
  }

  // Draws the card on the canvas
  draw(ctx, cardWidth, cardHeight) {
    if (this.flipped) {
      // Load the image and draw it on the canvas
      const img = new Image();
      img.src = this.image;
      img.onload = () => {
        ctx.drawImage(img, this.x, this.y, cardWidth, cardHeight);
      };
    } else {
      // draw the card back if it is not flipped
      ctx.fillStyle = "#808080";
      ctx.fillRect(this.x, this.y, cardWidth, cardHeight);
      ctx.strokeStyle = "#333";
      ctx.strokeRect(this.x, this.y, cardWidth, cardHeight);
    }
  }
}

// Main Game class which uses dynamic game data
class Game {
  constructor(canvasId, gameData, imgUrls, timeLimit) {
    // Setup the canvas and its context
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");
    this.canvas.width = 410;
    this.canvas.height = 410;

    // Game configuration
    this.cardWidth = parseInt(gameData.cardWidth);
    this.cardHeight = parseInt(gameData.cardHeight);
    this.cardSpacing = parseInt(gameData.cardSpacing);
    this.cardsPerRow = parseInt(gameData.cardsPerRow);
    this.timeLimit = parseFloat(timeLimit) * 60 * 1000; // convert minutes to milliseconds
    this.remainingTime = this.timeLimit; // tracks remaining time of the game
    this.imageUrls = imgUrls; // array of image URLs for the cards

    // Game state variables
    this.cards = []; // Array to store all card objects
    this.flippedCards = []; // Array to track currently flipped cards
    this.score = 0; // Player's score
    this.timerInterval = null; // Timer interval reference
    this.gameStarted = false; // Whether the game has started

    // Get references to time and score display elements
    this.timeDisplay = document.getElementById("time-remaining");
    this.scoreDisplay = document.getElementById("score-display");

    this.maxScore = this.imageUrls.length * 10; // Maximum score (10 points per pair)
    this.setupGame(); // Initialize the game board
    this.updateTimeDisplay(); // Display initial timer value
  }

  /* Sets up the initial game board by creating and shuffling cards. */
  setupGame() {
    this.cards = [];
    for (let i = 0; i < this.imageUrls.length; i++) {
      const imageUrl = this.imageUrls[i % this.imageUrls.length];

      // Create two cards for each image (pair)
      for (let j = 0; j < 2; j++) {
        this.cards.push(new Card(0, 0, imageUrl)); // Position will be updated later
      }
    }
    this.allCards = [...this.cards];

    // Shuffle the cards and update their positions on canvas
    this.shuffleCards();
    this.updateCardPositions();
    // Render the initial game board
    this.drawCards();
  }

  /* Shuffles the cards array using the Fisher-Yates algorithm. */
  shuffleCards() {
    for (let i = this.allCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.allCards[i], this.allCards[j]] = [
        this.allCards[j],
        this.allCards[i],
      ];
    }
  }

  /* Updates the x and y positions of all cards based on the grid layout. */
  updateCardPositions() {
    this.allCards.forEach((card, index) => {
      card.x =
        (index % this.cardsPerRow) * (this.cardWidth + this.cardSpacing) +
        this.cardSpacing;
      card.y =
        Math.floor(index / this.cardsPerRow) *
          (this.cardHeight + this.cardSpacing) +
        this.cardSpacing;
    });
  }

  /* Draws all cards on the canvas */
  drawCards() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // clear previous canvas elements
    this.allCards.forEach((card) => {
      card.draw(this.ctx, this.cardWidth, this.cardHeight); // draw each card
    });
  }

  /**
   * Starts the game timer and updates the remaining time every second using `timerInterval`.
   * It also checks if the time has run out, and if so, ends the game.
   */
  startTimer() {
    const startTime = Date.now();
    this.timerInterval = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      this.remainingTime = this.timeLimit - elapsedTime;

      if (this.remainingTime <= 0) {
        this.endGame();
      } else {
        this.updateTimeDisplay();
      }
    }, 1000);
  }

  /**
   * Updates the timer display with the current remaining time.
   * Converts time into minutes and seconds for readability.
   */
  updateTimeDisplay() {
    const seconds = Math.floor((this.remainingTime / 1000) % 60);
    const minutes = Math.floor(this.remainingTime / (1000 * 60));
    this.timeDisplay.textContent = `Time Remaining (in mins): ${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;
  }

  /* Updates the score display to reflect the player's current score. */
  updateScoreDisplay() {
    this.scoreDisplay.textContent = `Score: ${this.score}`;
  }

  /**
   * Initializes the game and sets up the event listeners for gameplay.
   * Called when the player clicks the start button.
   */
  initializeGame() {
    if (!this.gameStarted) {
      this.gameStarted = true; // mark the game as started
      this.startTimer(); // start the game timer
      this.updateTimeDisplay();
      this.updateScoreDisplay();

      this.canvas.addEventListener("click", (e) => {
        const mouseX = e.offsetX;
        const mouseY = e.offsetY;
        this.flipCard(mouseX, mouseY); // flip the card at the clicked position
      });
    }
  }

  /**
   * Flips a card based on mouse click position
   * @param {number} mouseX - The x-coordinate of the mouse click.
   * @param {number} mouseY - The y-coordinate of the mouse click.
   */
  flipCard(mouseX, mouseY) {
    this.allCards.forEach((card) => {
      if (
        mouseX >= card.x &&
        mouseX <= card.x + this.cardWidth &&
        mouseY >= card.y &&
        mouseY <= card.y + this.cardHeight
      ) {
        if (!card.flipped && this.flippedCards.length < 2) {
          card.flipped = true; // Flip the card
          this.flippedCards.push(card); // Add it to the flipped cards array
          this.drawCards(); // Redraw cards to reflect the flip
          this.checkMatch(); // Check if two flipped cards match
        }
      }
    });
  }

  /**
   * Checks if the two currently flipped cards match.
   * Updates the score if they match, or flips them back if they don't.
   * Ends the game if all cards are successfully matched.
   */
  checkMatch() {
    if (this.flippedCards.length === 2) {
      const [firstCard, secondCard] = this.flippedCards;

      // Check if the two flipped cards have the same image
      if (firstCard.image === secondCard.image) {
        this.score += 10;
        this.updateScoreDisplay();
        this.flippedCards = [];

        // Check if all cards are flipped (game completed)
        if (this.allCards.every((card) => card.flipped)) {
          setTimeout(() => this.endGame(), 500); // End the game with a slight delay so that the last flipped card is displayed properly on the canvas
        }
      } else {
        // If the cards don't match, flip them back after a short delay
        // unflip the 2 cards and then redraw all cards to reflect the changes
        setTimeout(() => {
          firstCard.flipped = false;
          secondCard.flipped = false;
          this.flippedCards = [];
          this.drawCards();
        }, 1000);
      }
    }
  }

  /**
   * Ends the game, stops the timer, and displays the final results.
   * Shows a "Play Again" button to restart the game.
   */
  endGame() {
    clearInterval(this.timerInterval); // Stop the timer

    const timeTaken = (this.timeLimit - this.remainingTime) / 1000; // Time taken in seconds

    let isUserLoggedIn = JSON.parse(localStorage.getItem('isLoggedIn'));
    let isGuestUser = JSON.parse(sessionStorage.getItem('isGuestUser'));

    if (isUserLoggedIn == true && isGuestUser == null) {
      saveScoreToBackend(this.score, timeTaken);
    }

    if (!isUserLoggedIn && isGuestUser) {
      sessionStorage.setItem("guestUserScore", this.score);
      sessionStorage.setItem("guestUserTimeTaken", timeTaken);
    } 

    window.location.href = "gameResult.html";
  }
}

async function launchGame() {
  try {
    const gameData = await fetchGameData("image_data.json");
    let timeLimit = 1;

    const difficulty = getDifficultyFromLocalOrSessionStorage(
      JSON.parse(localStorage.getItem('isLoggedIn')),
      JSON.parse(sessionStorage.getItem('isGuestUser'))
    );
    if (difficulty) {
      const difficultyResp = await getDifficultyByName(difficulty);
      timeLimit = difficultyResp.timeLimit;
    }

    if (gameData) {
      const startButton = document.getElementById("start-btn");
      const game = new Game(
        "gameCanvas",
        gameData,
        gameData.imageUrls,
        timeLimit
      );

      startButton.addEventListener("click", () => {
        if((JSON.parse(localStorage.getItem('isLoggedIn')) == false) && (JSON.parse(sessionStorage.getItem('isGuestUser')) == null)){
          window.location.href = "index.html";
        }
        startButton.disabled = true;
        game.initializeGame();
      });
    }
  } catch (error) {
    console.log(error);
    alert("Failed to load game");
  }
}

// launch the game when page loads
document.addEventListener("DOMContentLoaded", () => {
  launchGame();
});

async function saveScoreToBackend(finalScore, timeTaken) {
  let difficulty = getDifficultyFromLocalOrSessionStorage(
    JSON.parse(localStorage.getItem('isLoggedIn')),
    JSON.parse(sessionStorage.getItem('isGuestUser'))
  );

  if (difficulty == null) {
    difficulty = "Easy";
  }
  const difficultyResp = await getDifficultyByName(difficulty);
  const difficultyId = difficultyResp.id;

  
  // check if player exists in database
  const scoreExists = await checkIfScoreExists(difficultyResp.id);
  
  // create the request
  const scoreData = {
    FinalScore: finalScore,
    NoOfPairsMatched: finalScore / 10,
    TimeTaken: timeTaken,
    DifficultyId: difficultyId,
  };

  if (scoreExists == null) {
    console.log("calling submitScore api");
    try {
      const response = await fetch("http://localhost:5221/api/Score/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(scoreData),
      });

      if (!response.ok) {
        throw new Error(`Failed to save score: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error saving score:", error);
    }
  } else {
    console.log("calling updateScore api");
    try {
      const resp = await fetch(`http://localhost:5221/api/Score/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(scoreData),
      });
      if (!resp.ok) {
        throw new Error(`Failed to update score: ${resp.statusText}`);
      }
    } catch (error) {
      console.error("Error updating score:", error);
    }
  }
}
