const playAgainButton = document.getElementById("play-again");

function handlePlayAgainButton() {
  window.location.href = "game.html";
}

function handleViewLeaderboardButton() {
  window.location.href = "leaderboard.html";
}

async function displayLoggedUserScore() {
  try {
    // console.log("logged user score display");
    let diff = getDifficultyFromLocalOrSessionStorage(
      JSON.parse(localStorage.getItem('isLoggedIn')),
      JSON.parse(sessionStorage.getItem('isGuestUser'))
    );
    if (diff == null) {
      diff = "Easy";  // default difficulty
    }
    const difficultyResponse = await getDifficultyByName(diff);
    const difficultyId = difficultyResponse.id;
  
    const gameResultMessageh1 = document.getElementById("game-result-message");
    const finalScoreP = document.getElementById("final-score");
    const finalTimeP = document.getElementById("final-time");
  
    const gameData = await fetchGameData("image_data.json");
    var playerData = await checkIfScoreExists(difficultyId);
    // console.log(playerData);
    const playerName = (playerData && playerData.username) || "";
  
    const isWin = playerData.finalScore === gameData.maxScore;
    const message = isWin
      ? `🎉 Congratulations ${playerName} ! You matched all pairs! 🎉`
      : `Don't give up ${playerName}! 💪`;
  
    gameResultMessageh1.innerText = message;
    finalScoreP.innerText = `Score ~ ${playerData.finalScore}`;
    finalTimeP.innerText = `Time taken ~ ${playerData.timeTaken.toFixed(
      2
    )} seconds`;
  } catch (error) {
    console.log(error);
  }
}

async function displayGuestUserScore() {
  try {
    const gameResultMessageh1 = document.getElementById("game-result-message");
    const finalScoreP = document.getElementById("final-score");
    const finalTimeP = document.getElementById("final-time");

    const gameData = await fetchGameData("image_data.json");

    const score = JSON.parse(sessionStorage.getItem("guestUserScore"));
    const timeTaken = JSON.parse(sessionStorage.getItem("guestUserTimeTaken"));

    const userName = (gusetUserName != '') ? gusetUserName : "Guest User";

    const isWin = score === gameData.maxScore;

    const message = isWin
      ? `🎉 Congratulations ${userName} ! You matched all pairs! 🎉`
      : `Don't give up ${userName}! 💪`;
    
    gameResultMessageh1.innerText = message;
    finalScoreP.innerText = `Score ~ ${score}`;
    finalTimeP.innerText = `Time taken ~ ${timeTaken.toFixed(2)} seconds`;
  } catch (error) {
    console.log(error);
  }
}

async function displayScore() {
  const isUserLoggedIn = JSON.parse(localStorage.getItem("isLoggedIn"));
  const isGuestUser = JSON.parse(sessionStorage.getItem("isGuestUser"));
  try {
    if (isUserLoggedIn == false && isGuestUser == true) {
      await displayGuestUserScore();
    } else {
      await displayLoggedUserScore();
    }
  } catch (error) {
    console.error("Error displaying score:", error);
    alert("Failed to display score");
  }
}

displayScore();

// go back to home
const goHomeButton = document.getElementById("home");
function handleHomeButton() {
  window.location.href = "index.html";
}
