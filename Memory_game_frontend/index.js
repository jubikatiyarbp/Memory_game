setupNavbar();

// const isUserLoggedIn = JSON.parse(localStorage.getItem("isLoggedIn"));
// const messageP = document.getElementById("message");

let selectedDifficulty = null;

document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".tab");
  const playOptions = document.querySelectorAll(".play-option-content");
  const difficultyButtons = document.querySelectorAll(".difficulty-btn");

  // tab selection logic
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("active"));
        playOptions.forEach(option => option.classList.remove("active"));

        tab.classList.add("active");
        document.getElementById(tab.dataset.target).classList.add("active");
    });
  });

  // Difficulty Selection Logic
  difficultyButtons.forEach(button => {
    button.addEventListener("click", () => {
      difficultyButtons.forEach(btn => btn.classList.remove("selected"));
      button.classList.add("selected");

      // Determine which play mode is active
      const activePlayOption = document.querySelector(".play-option-content.active");

      if (activePlayOption.id === "loginPlay") {
          localStorage.setItem("selectedDifficulty", button.dataset.difficulty);
      } else if (activePlayOption.id === "guestPlay") {
          sessionStorage.setItem("selectedDifficulty", button.dataset.difficulty);
      }
    });
  });

  // Load stored difficulty if available
  const storedDifficulty = localStorage.getItem("selectedDifficulty") || sessionStorage.getItem("selectedDifficulty");
  if (storedDifficulty) {
    const buttonToSelect = document.querySelector(`.difficulty-btn[data-difficulty="${storedDifficulty}"]`);
    if (buttonToSelect) {
      buttonToSelect.classList.add("selected");
    }
  }
});


function handleGuestUserPlay(e) {
  const messageP = document.getElementById("messageP");
  const playerNameInput = document.getElementById("playerName");
  const userLoggedIn = JSON.parse(localStorage.getItem("isLoggedIn"));

  if (!userLoggedIn) {
    sessionStorage.setItem("isGuestUser", JSON.stringify(true));
    sessionStorage.setItem("guestUserName", playerNameInput.value);
    window.location.href = "game.html";
  } else {    
    const msg = "Not allowed to play as guest since user logged in";
    showMessage(messageP, msg, false);
  }
}

function handleLoginPlayButton() {
  const userLoggedIn = JSON.parse(localStorage.getItem("isLoggedIn"));
    if (!userLoggedIn) {
    window.location.href = "login.html";
  } else {
    window.location.href = "game.html";
  }
}

document.querySelector("#homeLink").addEventListener("click", () => {
  localStorage.setItem("previousPage", window.location.pathname);
});

