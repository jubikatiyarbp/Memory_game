
// const isUserLoggedIn = localStorage.getItem('isLoggedIn');
// const isGuestUser = JSON.parse(sessionStorage.getItem("isGuestUser"));
const gusetUserName = sessionStorage.getItem("guestUserName");

async function fetchGameData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch game data: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching game data:", error);
  }
}

async function getDifficultyByName(name) {
  const url = new URL(`http://localhost:5221/api/Difficulty/find`);
  url.searchParams.set("name", name);
  const resp = await fetch(url, {
    method: "GET",
  });
  const data = await resp.json();

  if (!resp.ok) {
    throw new Error(`Failed to fetch difficultyId - ${data.message}`);
  }

  return data;
}

async function checkIfScoreExists(difficultyId) {
  // check if player is present in database
  const url = new URL(`http://localhost:5221/api/Score/find`);
  url.searchParams.set("difficultyId", difficultyId);

  const resp = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });
  if (!resp.ok) {
    console.log("score not found");
    return null;
  }

  const data = await resp.json();
  return data;
}

function getDifficultyFromLocalOrSessionStorage(isLoggedIn, isGuestUser) {
  // the user is guest
  if (!isLoggedIn  && isGuestUser) {
    return sessionStorage.getItem('selectedDifficulty');
  } else {
    return localStorage.getItem('selectedDifficulty');
  }
}