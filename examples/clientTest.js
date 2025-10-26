const { io } = require("socket.io-client");
const args = process.argv.slice(2);
console.log(args);

const [userId, teamId] = args;
console.log(`UserId: ${userId}, TeamId: ${teamId}`);

const socket = io("http://localhost:3000");

socket.emit("joinTeam", { userId: userId, teamId: teamId });

socket.on("userJoined", (data) => console.log("Someone joined:", data));
socket.on("newMessage", (msg) => console.log("New message:", msg));

// Send message
socket.emit("sendMessage", { teamId: teamId, userId: userId, text: `Hello team! I'm ${userId}` });
