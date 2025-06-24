// Load and parse the CSV
fetch("cs2_l15_with_lines.csv")
  .then((res) => res.text())
  .then((text) => {
    const rows = text.split("\n").filter(Boolean);
    const headers = rows[0].split(",");
    const players = rows.slice(1).map((row) => {
      const values = row.split(",");
      const player = {};
      headers.forEach((h, i) => (player[h] = isNaN(values[i]) ? values[i] : +values[i]));
      return player;
    });

    displayPlayers(players);
  })
  .catch((err) => {
    document.body.innerHTML = `<pre style="color:red">CSV Load Error: ${err.message}</pre>`;
    console.error("CSV Load Failed:", err);
  });

// Display the player list
function displayPlayers(players) {
  const list = document.getElementById("player-list");
  const detail = document.getElementById("player-detail");

  players.forEach((p) => {
    const div = document.createElement("div");
    div.className = "player-card";
    div.innerHTML = `
      <div class="card-left">
        <strong>${p.Name}</strong>
        <div class="line">
          <img src="prizepicks-logo.png" class="icon" />
          Line: ${p.Line}
        </div>
      </div>
      <div class="card-right">
        <div class="l10">L10: ${calcAvg(p, 10)}</div>
        <div class="l15">L15: ${calcAvg(p, 15)}</div>
      </div>
    `;
    div.onclick = () => showDetail(p);
    list.appendChild(div);
  });

  function calcAvg(player, count) {
    const kills = Array.from({ length: 15 }, (_, i) => player[`G${i + 1}`] || 0);
    const avg = kills.slice(0, count).reduce((a, b) => a + b, 0) / count;
    return avg.toFixed(1);
  }

  function showDetail(player) {
    detail.innerHTML = `
      <h2>${player.Name}</h2>
      <p><strong>Line:</strong> ${player.Line}</p>
      <p><strong>Last 15 Games:</strong></p>
      <ul class="game-list">
        ${Array.from({ length: 15 }, (_, i) => {
          const gameNum = 15 - i;
          return `<li>Game ${gameNum}: ${player[`G${i + 1}`]}</li>`;
        }).join("")}
      </ul>
    `;
  }
}

