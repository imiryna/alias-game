const { io } = require("socket.io-client");
const readline = require("readline");

const args = process.argv.slice(2);
console.log(args);

const [userId, teamId, initMessage] = args;
console.log(`UserId: ${userId}, TeamId: ${teamId}, Init message: ${initMessage}`);

const socket = io("http://localhost:3000");

socket.emit("joinTeam", { userId: userId, teamId: teamId });

socket.on("userJoined", (data) => console.log("Someone joined:", data));
socket.on("newMessage", (msg) => console.log(`[${msg.user.name}]:> ${msg.text}`));
socket.on("roundTimerTick", (msg) => console.log(`Timer Ticking, left: ${msg.remaining}`));
socket.on("roundEnded", (msg) => console.log(`Time UP! Round#${msg.round.number} is finished.`));
// Send message
//socket.emit("sendMessage", { teamId: teamId, userId: userId, text: initMessage });

async function getChat() {
  try {
    const response = await fetch(`http://localhost:3000/api/chat/${teamId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    data.forEach((msg) => console.log(`[${msg.user.name}]:> ${msg.text}`));
  } catch (err) {
    console.error("Failed to fetch chat:", err);
  }
}

// Interactive CLI input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.setPrompt("You => ");
rl.prompt();

rl.on("line", (text) => {
  if (text.trim().toLowerCase() === "/exit") {
    console.log("👋 Exiting...");
    socket.disconnect();
    rl.close();
    process.exit(0);
  }

  socket.emit("sendMessage", { teamId, userId, text });
  rl.prompt();
});

// Start
(async () => {
  await getChat();

  // Optional: send initial message if provided
  if (initMessage) {
    socket.emit("sendMessage", { teamId, userId, text: initMessage });
  }

  console.log("\nType your message below (type /exit to quit):");
})();
