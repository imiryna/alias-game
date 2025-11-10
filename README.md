# 🧩 Alias-Game Backend

### 📄 Overview  
**Alias-Game Backend** is a **Node.js + Express + Socket.IO** server for a multiplayer word-guessing game inspired by *Alias*.  
It handles **user authentication**, **game logic**, **team and chat management**, and **real-time gameplay synchronization**.  
The backend uses **MongoDB** for persistent data storage and **Socket.IO** for real-time communication between players.

---

## ⚙️ Tech Stack

- **Runtime:** Node.js  
- **Framework:** Express.js  
- **Database:** MongoDB + Mongoose  
- **Real-time:** Socket.IO  
- **Authentication:** JWT tokens 
- **Deployment:** Docker
- **Linting & Formatting:** ESLint, Prettier  
- **Version Control:** Git, GitHub  
- **Task Management:** GitHub Projects 
- **Other:** Morgan, CORS, dotenv  

---

## Features

- Real-time multiplayer gameplay
- In-game chat
- Similar word detection to prevent cheating
- Round-based game flow
- Score tracking per team

---

## 🗂️ Project Structure

```
/controllers      → Request handlers for routes
/routes           → API route definitions
/services         → Business logic & database operations
/models           → Mongoose schemas
/utils            → Helpers (error handling, async wrapper)
/middlewares      → Validation & authorization middlewares
socketManager.js  → Socket.IO setup & event handling
app.js            → Express app configuration
server.js         → App entry point (HTTP + Socket + MongoDB)
```

---

## ⚡ Installation & Setup

### 1. Clone the repository

```
git clone https://github.com/your-username/alias-game-backend.git
cd alias-game-backend
```

### 2. Copy and rename the file `.env.test`

### 3. Start the server:

```
docker-compose up --build
```

The server will be available at:

http://localhost:3000

### 4. Connect with a client:

Example connection as a client see examples/clientTest.js

### 5. Start the client:

```
node clientTest.js <userId> <teamId>
```

---

## 📡 API Documentation

### 🔐 **Auth Routes** `/api/auth`

| Method | Endpoint   | Description                       |
|--------|-------------|-----------------------------------|
| POST   | `/signup`  | Register a new user               |
| POST   | `/login`   | Log in user and return JWT tokens |
| POST   | `/refresh` | Refresh access and refresh tokens |

---

### 👥 **User Routes** `/api/user`

| Method | Endpoint     | Description                 |
|--------|--------------|-----------------------------|
| GET    | `/`          | Get all users               |
| GET    | `/:id`       | Get a user by ID            |
| DELETE | `/:id`       | Delete user                 |

---

### 🎮 **Game Routes** `/api/game`

| Method | Endpoint     | Description               |
|--------|--------------|---------------------------|
| POST   | `/`          | Create a new game         |
| GET    | `/`          | Get all games             |
| GET    | `/:id`       | Get game by ID            |
| POST   | `/startgame` | Start the game for teams  |

---

### 🧑‍🤝‍🧑 **Team Routes** `/api/team`

| Method | Endpoint             | Description     |
|--------|----------------------|---------------  |
| POST   | `/:teamId/join`      | Join the team   |
| POST   | `/:teamId/leave`     | Leave the team  |
| POST   | `/:teamId/next-round`| Next team round |
| GET    | `/:id`               | Get team by ID  |
| DELETE | `/:id`               | Delete team     |

---

### 💬 **Chat Routes** `/api/chat`

| Method | Endpoint   | Description                               |
|--------|------------|-------------------------------------------|
| GET    | `/:teamId` | Get chat history for a team               |
| POST   | `/:teamId` | Create chat for a team                    |
| POST   | `/send`    | Send a message to team chat *(protected)* |

---

## Socket.IO Integration

This project uses **Socket.IO** with an **Express** and **MongoDB** backend to enable real-time communication between users.

- Socket.IO runs on the **same port** as Express (`http://localhost:3000`).

- Always perform user authentication before creating the Socket.IO connection on the client side, to ensure only authorized users can connect and join rooms.

## Overview

- **Express** handles REST API routes (e.g., `/messages`, `/teams/:id`).
- **Socket.IO** manages real-time events like new messages, user connections, and online status.
- **MongoDB** stores chats and messages persistently.

## How It Works

1. When a user connects, the server assigns a unique `socket.id`.
2. Each team has its own **room** identified by `teamId`.
3. Users join their team room via:

   ```js
   socket.emit("joinTeam", { userId, teamId });
   ```

4. Messages are sent in real time:

   ```js
   socket.emit("sendMessage", { teamId, userId, text });
   ```

5. The server saves messages to MongoDB and broadcasts them:

   ```js
   io.to(teamId).emit("newMessage", message);
   ```

## 🔌 Socket.IO Events

| Event           | Direction       | Description                                    |
|-----------------|-----------------|------------------------------------------------|
| `joinTeam`      | client → server | Join a specific team room                      |
| `chatHistory`   | server → client | Send previous messages                         |
| `sendMessage`   | client → server | Send a new message                             |
| `newMessage`    | server → client | Broadcast message to all team members          |
| `userJoined`    | server → client | Notify that a user joined the team             |
| `userOffline`   | server → client | Notify that a user left the game               |
| `systemMessage` | server → client | System messages (round end, timer alerts, etc) |

---

## 🧠 Developer Notes

- All async routes are wrapped in `catchAsync`.
- JWT-based authentication with middleware `protected`.
- MongoDB connection initialized via `server.js`.
- Socket.io events are managed in `socketManager.js`.
- Game automatically ends after **10 rounds**, but can also be ended manually with `/api/game/:id/end`.

---

## 🐳 Docker Setup & Commands

This project includes a Dockerfile and a docker-compose.yml to simplify local development and deployment.
Three services are defined in docker-compose.yml:

Service	Description	Port
app	Node.js backend (Alias Game API)	3000
mongo	MongoDB database	27017
mongo-express	Web UI for MongoDB	8081

All environment variables are managed via .env.

Create and run containers with docker (MongoDB + App):

---

## ❓ FAQ

**1. How does the game start?**  
After creating a game (POST /api/game) and teams (POST /api/team), call POST /api/game/startgame.
This initializes the first round, creates team chats (via /api/chat/:teamId), and activates the explainer rotation for each team.

**2. How do players join a team?**  
Use POST /api/team/:teamId/join.
The server validates the teamId, adds the player to that team, and connects them to the team’s room in Socket.IO.
All team members receive a real-time update when someone joins.

**3. What happens when a player leaves a team?**  
Use POST /api/team/:teamId/leave.
The backend removes the player from that team and emits a userOffline event to other connected teammates.

**4. How do rounds work?**  
Each round lasts for a fixed time (e.g. 60 seconds). When time is up, the server emits a `systemMessage` about the round ending, and the next team/explainer is activated.

**5. How is the explainer chosen?**  
Explainers rotate automatically within a team — for each round, the next player becomes the explainer. This ensures balanced participation.

**6. Can I simulate a full game manually (via Postman)?**  
Yes. Here’s the sequence:
1️⃣ Create a game → POST /api/game
2️⃣ Create two teams → POST /api/team (or via setup logic)
3️⃣ Join players to each team → POST /api/team/:teamId/join
4️⃣ Start the game → POST /api/game/startgame
5️⃣ Send messages (round activity) → Socket event sendMessage or POST /api/chat/send

**7. Does the game end automatically?**  
Yes — after 10 rounds, the game stops automatically.

**8. How is scoring handled?**  
Each correct guess adds a point to the team’s score. Points are stored in the Team model and updated at the end of every round.

**9. What happens if the server restarts during the game?**  
Active games and team states are stored in MongoDB, so they can be restored when the server comes back online.

**10. Is chat history persistent?**  
Yes — all messages are saved in the `Chat` collection with timestamps and team references.

**11. How to test Socket.IO locally?**  
You can connect via the Socket.IO client or use Postman’s WebSocket feature.  
Example:
```
ws://localhost:3000
```
Then emit `joinTeam` and `sendMessage` events.

**12. How to handle JWT expiration?**  
When your access token expires, request a new one via:
POST /api/auth/refresh
You must include your refresh token in the request body or header, depending on implementation.

**13. Are all endpoints protected?**  
Not all — only the key routes require authentication middleware:
Protected: /api/game, /api/team, /api/user, /api/chat, /api/auth/refresh
Public: /api/auth/signup, /api/auth/login, /help
Authentication is handled via the custom protected middleware that verifies JWT.

**14. How are errors returned?**  
All errors are unified:
```json
{
  "message": "Team not found"
}
```

**15. How are chats handled for each team?**
Each team has its own chat:
GET /api/chat/:teamId → get message history
POST /api/chat/:teamId → create a new chat for the team
POST /api/chat/send → send a message (Socket.IO event is also emitted)
💡 All chat routes are protected and available only to authenticated users.

**16. Can multiple games run simultaneously?**  
Yes, each game instance is isolated by its ID and has its own set of teams and chat rooms.

---

## 🧩 License

MIT © Alias-Game Solvd. Backend Team
