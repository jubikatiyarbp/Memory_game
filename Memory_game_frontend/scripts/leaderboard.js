setupNavbar();

const leaderboardUrl = `http://localhost:5221/api/Score/leaderboard`;

async function fetchLeaderboard(url, difficulty) {
  try {
    // console.log(`difficulty in fetchLeaderboard - ${difficulty}`);
    const finalUrl = `${url}/${difficulty}`;

    const response = await fetch(finalUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch leaderboard data: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching leaderboard data:", error);
    alert("Failed to load leaderboard");
  }
}

function displayLeaderboard(difficulty = "Easy") {
  const leaderboardContainer = document.getElementById('leaderboard-body');
  leaderboardContainer.innerHTML = '';
    fetchLeaderboard(leaderboardUrl, difficulty).then((data) => {
      if (data && data.length > 0) {
        data.forEach((entry, index) => {
          const row = leaderboardContainer.insertRow();
          const rankCell = row.insertCell(0);
          const nameCell = row.insertCell(1);
          const scoreCell = row.insertCell(2);
          rankCell.textContent = index + 1;
          nameCell.textContent = entry.username;
          scoreCell.textContent = entry.finalScore;
        });
      } else {
        const row = leaderboardContainer.insertRow();
        const cell = row.insertCell(0);
        cell.colSpan = 3;
        cell.textContent = `No leaderboard data available`;
        cell.style.textAlign = "center";
      }
    });
  
  // Update active tab styling
  document.querySelectorAll(".tab-btn").forEach((btn) => btn.classList.remove("active"));
  document.querySelector(`button[onclick="displayLeaderboard('${difficulty}')"]`).classList.add("active");
}

displayLeaderboard("Easy");
