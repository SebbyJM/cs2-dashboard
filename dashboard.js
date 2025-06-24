const csvFile = "cs2_l15_with_lines.csv"; // nightly upload

let players = [];

// 1. Load CSV then build sidebar
Papa.parse(csvFile, {
  download: true,
  header: true,
  dynamicTyping: true,
  complete: ({ data }) => {
    players = data.filter(p => p.Name);         // clean empty rows
    buildSidebar();
  },
});

function buildSidebar() {
  const sb = document.getElementById("sidebar");
  sb.innerHTML = "<h2 style='margin-bottom:12px'>CS2 Players</h2>";
  players.forEach(p => {
    const kills = [...Array(15)].map((_, i) => p[`G${i + 1}`]);
    const l10 = (kills.slice(0, 10).reduce((a, b) => a + b, 0) / 10).toFixed(1);
    const l15 = (kills.reduce((a, b) => a + b, 0) / 15).toFixed(1);

    const div = document.createElement("div");
    div.className = "player";
    div.innerHTML = `
      <div class="name">${p.Name}</div>
      <div class="meta">
        Line ${p.Line} •
        <span class="green">L10 ${l10}</span> •
        <span class="blue">L15 ${l15}</span>
      </div>
    `;
    div.onclick = () => showPanel(p);
    sb.appendChild(div);
  });
}

function showPanel(p) {
  const panel = document.getElementById("panel");
  const kills = [...Array(15)].map((_, i) => p[`G${i + 1}`]);
  const games = [...Array(15)].map((_, i) => 15 - i);

  panel.innerHTML = `
    <h1 style="margin-bottom:16px">${p.Name} — Line ${p.Line}</h1>
    <div class="chart-wrap"><canvas id="chart"></canvas></div>
    <table>
      <thead><tr><th>Game #</th><th>Kills</th></tr></thead>
      <tbody>${games
        .map(
          (g, idx) =>
            `<tr><td>${g}</td><td>${kills[idx]}</td></tr>`
        )
        .join("")}</tbody>
    </table>
  `;

  // build chart
  new Chart(document.getElementById("chart"), {
    type: "line",
    data: {
      labels: games,
      datasets: [
        {
          label: "Kills",
          data: kills,
          fill: false,
          tension: 0.3,
          borderColor: "#4ade80",
          pointRadius: 3,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: false,
          grid: { color: "#333" },
          ticks: { color: "#aaa" },
        },
        x: {
          grid: { color: "#333" },
          ticks: { color: "#aaa" },
        },
      },
      plugins: {
        legend: { display: false },
      },
    },
  });
}

