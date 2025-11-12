#!/usr/bin/env node
const { io } = require("socket.io-client");
const readline = require("readline");
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));

const API_URL = "http://localhost:3000/api";
const SOCKET_URL = "http://localhost:3000";

let accessToken = null;
let user = null;
let teamId = null;
let gameId = null;
let socket = null;
let userId = null;

// === READLINE INTERFACE ===
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// === Helper Promisified Question ===
const ask = (query) =>
  new Promise((resolve) => {
    rl.question(query, (ans) => resolve(ans.trim()));
  });

// === STEP 1: LOGIN ===
async function login() {
  const email = await ask("Email: ");
  const password = await ask("Password: ");

  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    console.error(`[*] Login failed: ${res.status}`);
    process.exit(1);
  }
  const data = await res.json();

  accessToken = data.user.token;
  user = data.user;
  userId = user._id;

  console.log("[*] Logged in successfully!");
}

// === STEP 2: LIST GAMES & TEAMS & CHOOSE TEAM ===
async function chooseTeam() {
  const res = await fetch(`${API_URL}/game/`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch games: ${res.status}`);
  }

  const games = await res.json();

  console.log("\n=== Available Games ===");
  games.forEach((g, gi) => {
    console.log(`(${gi + 1}) ${g.name} (${g.status})`);
    g.teams.forEach((t, ti) => {
      console.log(`   [${gi + 1}.${ti + 1}] ${t.name} | Players: ${t.player_list.length}`);
    });
  });

  const choice = await ask("\nEnter team number to join (e.g. 1.2): ");
  const [gameIdx, teamIdx] = choice.split(".").map((n) => parseInt(n) - 1);

  if (!games[gameIdx] || !games[gameIdx].teams[teamIdx]) {
    console.error("[*] Invalid choice — try again.");
    return chooseTeam(); // recursive retry
  }

  const selectedGame = games[gameIdx];
  const selectedTeam = selectedGame.teams[teamIdx];

  teamId = selectedTeam._id;
  gameId = selectedGame._id;

  // Try joining the team
  const joinRes = await fetch(`${API_URL}/team/${teamId}/join`, {
    method: "POST", // if your API expects POST
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!joinRes.ok) {
    const msg = await joinRes.text();
    console.log(`[*] Failed to join team "${selectedTeam.name}": ${joinRes.status} ${msg}`);

    // Offer to retry
    const again = await ask("Try another team? (y/n): ");
    if (again.toLowerCase().startsWith("y")) {
      return chooseTeam();
    } else {
      console.log("[*] Exiting...");
      process.exit(0);
    }
  }

  console.log(`[*] Joined team: ${selectedTeam.name}`);
  return selectedTeam;
}

// === STEP 3: CONNECT SOCKET ===
function connectSocket() {
  socket = io(SOCKET_URL, {
    auth: { token: accessToken },
  });

  socket.on("connect", () => {
    console.log("[*] Connected to game socket.");
    let userName = user.name;
    socket.emit("joinTeam", { userName, userId, teamId });
  });

  socket.on("disconnect", () => {
    console.log("[*] Disconnected.");
    process.exit(0);
  });
  socket.on("connect_error", (err) => console.error("[*] Socket error:", err.message));

  socket.on("userJoined", (data) => console.log(`[*] ${data.userName} joined.`));
  socket.on("newMessage", (msg) => console.log(`[${msg.user.name}]:> ${msg.text}`));
  socket.on("sysMessage", (msg) => console.log(`[Game]:> ${msg.text}`));
  // socket.on("roundTimerTick", (msg) => console.log(`[*] Time left: ${msg.remaining}`));
  socket.on("roundEnded", (msg) => console.log(`[*] Round #${msg.round.number + 1} ended!`));
}

// ==== STEP 4: get chat history ===
async function getChat() {
  try {
    const response = await fetch(`http://localhost:3000/api/chat/${teamId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    data.forEach((msg) => console.log(`[${msg.user.name}]:> ${msg.text}`));
  } catch (err) {
    console.error("Failed to fetch chat:", err);
  }
}

async function startGame() {
  const res = await fetch(`${API_URL}/game/startgame`, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({ gameId, teamId }),
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch games: ${res.status}`);
  }
}

// === STEP 5: CHAT LOOP ===
function startChat() {
  console.log("\nType messages below (type /exit to quit):");
  rl.setPrompt("You => ");
  rl.prompt();

  rl.on("line", (text) => {
    if (text.trim().toLowerCase() === "/exit") {
      console.log("👋 Exiting...");
      socket.disconnect();
      rl.close();
      process.exit(0);
    }
    if (text.trim().toLowerCase() === "/start") {
      socket.emit("sendMessage", { teamId, userId, text: "Game started" });
      startGame();
    }
    if (text.trim() !== "") {
      socket.emit("sendMessage", { teamId, userId, text });
    }
    rl.prompt();
  });
}

// === MAIN ===
(async () => {
  try {
    console.log("=== Welcome to Alias Game CLI ===");
    await login();
    await chooseTeam();
    connectSocket();
    await getChat();
    startChat();
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
})();
