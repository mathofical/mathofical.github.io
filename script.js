document.getElementById('btnBuscar').addEventListener('click', fetchStats);
document.getElementById('modeSelect').addEventListener('change', fetchStats);

function fetchStats() {
  const nick = document.getElementById('nickInput').value.trim();
  const modo = document.getElementById('modeSelect').value;
  const res = document.getElementById('resultado');

  if (!nick) {
    res.innerHTML = "<p style='color:red;'>Digite um nick válido!</p>";
    return;
  }
  res.innerHTML = "Carregando...";

  fetch(`/api/player/${nick}`)
    .then(r => {
      if (!r.ok) throw new Error('Jogador não encontrado');
      return r.json();
    })
    .then(data => render(data, modo))
    .catch(e => {
      res.innerHTML = `<p style='color:red;'>Erro: ${e.message}</p>`;
    });
}

function render(data, modo) {
  const u = data.account.username;
  // escolhe estatísticas
  const stat = modo === 'bed_fight'
    ? (data.stats.duels?.bed_fight || {})
    : (data.stats.bedwars || {});
  // comuns
  const games = stat.games_played || 0;
  const wins = stat.wins || 0;
  const losses = stat.losses || 0;
  const wlr = (wins / (losses || 1)).toFixed(2);
  const kills = stat.kills || 0;
  const deaths = stat.deaths || 0;
  const kdr = (kills / (deaths || 1)).toFixed(2);
  const fk = stat['1v1_final_kills'] || 0;
  const fd = stat['1v1_final_deaths'] || 0;
  const fkdr = (fk / (fd || 1)).toFixed(2);
  const cs = stat.winstreak || 0;
  const ms = stat.max_winstreak || 0;
  const lvl = stat.level || data.stats.bedwars.level || 0;

  const hours = Math.floor((data.stats.play_time?.all || 0) / 3600);
  const first = new Date(data.first_login).toLocaleDateString('pt-BR');
  const last = new Date(data.last_login).toLocaleString('pt-BR');

  const mutes = data.mute_blacklist_count || 0;
  const isMuted = mutes > 0 ? 'Sim' : 'Não';

  // API não retorna bans detalhados, mas:
  const bans = data.ban_count || 0;
  const isBanned = data.banned ? 'Sim' : 'Não';

  const rankColor = data.rank_tag?.color || '#fff';
  const clanColor = data.clan?.tag_color || '#fff';

  document.getElementById('resultado').innerHTML = `
    <img src="https://minotar.net/armor/body/${u}/200.png" alt="Skin ${u}" />
    <div class="field"><span class="label">Nick:</span> ${u}</div>
    <div class="field">
      <span class="label">Rank:</span>
      <span style="color:${rankColor};">${data.best_tag.name}</span>
      <button class="rank-btn" onclick='showRanks(${JSON.stringify(data.tags)})'>
        Ver ranks
      </button>
    </div>
    <div class="field">
      <span class="label">Clã:</span>
      <span style="color:${clanColor};">${data.clan.name}</span>
    </div>
    <div class="field"><span class="label">Status:</span> ${data.connected ? 'Online' : 'Offline'}</div>
    <div class="field"><span class="label">Mutado:</span> ${isMuted} (${mutes}x)</div>
    <div class="field"><span class="label">Banido:</span> ${isBanned} (${bans}x)</div>
    <div class="field"><span class="label">Primeiro login:</span> ${first}</div>
    <div class="field"><span class="label">Último login:</span> ${last}</div>
    <div class="field"><span class="label">Horas jogadas:</span> ${hours}</div>
    <hr>
    <h3 class="hoverable">${modo === 'bed_fight' ? 'Bed Fight' : 'BedWars'} Stats (Nível ${lvl})</h3>
    <div class="field"><span class="label">Partidas:</span> ${games}</div>
    <div class="field"><span class="label">Vitórias:</span> ${wins}</div>
    <div class="field"><span class="label">Derrotas:</span> ${losses}</div>
    <div class="field"><span class="label">W/L Ratio:</span> ${wlr}</div>
    <div class="field"><span class="label">Kills:</span> ${kills}</div>
    <div class="field"><span class="label">Deaths:</span> ${deaths}</div>
    <div class="field"><span class="label">K/D Ratio:</span> ${kdr}</div>
    <div class="field"><span class="label">Final Kills:</span> ${fk}</div>
    <div class="field"><span class="label">Final Deaths:</span> ${fd}</div>
    <div class="field"><span class="label">FKDR:</span> ${fkdr}</div>
    <div class="field"><span class="label">Winstreak atual:</span> ${cs}</div>
    <div class="field"><span class="label">Max Winstreak:</span> ${ms}</div>
  `;
}

function showRanks(tags) {
  alert('Ranks do jogador: ' + tags.join(', '));
}
