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

```bash
git clone https://github.com/your-username/alias-game-backend.git
cd alias-game-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create a `.env` file

```bash
MONGO_USER=root
MONGO_PASSWORD=example
MONGO_DB=alias
MONGO_URL_LOCAL=mongodb://127.0.0.1:27017/test
PORT=3000
NODE_ENV=development
```

### 4. Start the server

npm run start:dev

The server will be available at:

http://localhost:3000

### 5. Connect with a client:

Example connection as a client see examples/clientTest.js

### 6. Start the client:

node clientTest.js <userId> <teamId>

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
| PATCH  | `/:id/stats` | Update user statistics      |
| DELETE | `/:id`       | Delete user                 |

---

### 🎮 **Game Routes** `/api/game`

| Method | Endpoint     | Description               |
|--------|--------------|---------------------------|
| POST   | `/`          | Create a new game         |
| GET    | `/`          | Get all games             |
| GET    | `/:id`       | Get game by ID            |
| POST   | `/:id/end`   | End the game manually     |
| POST   | `/startgame` | Start the game for teams  |

---

### 🧑‍🤝‍🧑 **Team Routes** `/api/team`

| Method | Endpoint | Description       |
|--------|----------|-------------------|
| POST   | `/`      | Create a new team |
| GET    | `/`      | Get all teams     |
| GET    | `/:id`   | Get team by ID    |
| PATCH  | `/:id`   | Update team info  |
| DELETE | `/:id`   | Delete team       |

---

### 💬 **Chat Routes** `/api/chat`

| Method | Endpoint   | Description                               |
|--------|------------|-------------------------------------------|
| GET    | `/:teamId` | Get chat history for a team               |
| POST   | `/:teamId` | Create chat for a team                    |
| POST   | `/send`    | Send a message to team chat *(protected)* |

---

### 🧠 **Logic Routes** `/api/logic`

| Method | Endpoint              | Description          |
|--------|-----------------------|----------------------|
| POST   | `/:teamId/join`       | Join a team          |
| POST   | `/:teamId/leave`      | Leave a team         |
| POST   | `/:teamId/next-round` | Start the next round |

---

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

🐳 Docker Setup & Commands
⚙️ Overview

This project includes a Dockerfile and a docker-compose.yml to simplify local development and deployment.
Three services are defined in docker-compose.yml:

Service	Description	Port
app	Node.js backend (Alias Game API)	3000
mongo	MongoDB database	27017
mongo-express	Web UI for MongoDB	8081

All environment variables are managed via .env.

Create and run containers with docker (MongoDB + App):

docker-compose up --build

---

## ❓ FAQ

**1. How does the game start?**  
After creating a game and teams, call `/api/game/startgame`. This initializes the first round and activates the explainer rotation.

**2. How do players join a team?**  
Use `POST /api/logic/:teamId/join`. Once joined, the player is connected to the team room (Socket.IO handles this automatically).

**3. What happens when a player leaves a team?**  
Use `POST /api/logic/:teamId/leave`. The server removes the player from that team and broadcasts a `userOffline` event.

**4. How do rounds work?**  
Each round lasts for a fixed time (e.g. 60 seconds). When time is up, the server emits a `systemMessage` about the round ending, and the next team/explainer is activated.

**5. How is the explainer chosen?**  
Explainers rotate automatically within a team — for each round, the next player becomes the explainer. This ensures balanced participation.

**6. Can I simulate a full game manually (via Postman)?**  
Yes:  
1️⃣ Create a game → `POST /api/game`  
2️⃣ Create two teams → `POST /api/team`  
3️⃣ Join players to each team → `POST /api/logic/:teamId/join`  
4️⃣ Start the game → `POST /api/game/startgame`  
5️⃣ Send messages during rounds via Socket event `sendMessage`  
6️⃣ End the game manually → `POST /api/game/:id/end`  

**7. Does the game end automatically?**  
Yes — after **10 rounds**, the game automatically ends. You can also trigger `/api/game/:id/end` to stop it early.

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
Use `/api/auth/refresh` to obtain a new access token when the old one expires.

**13. Are all endpoints protected?**  
Only key routes (like `/send`, `/next-round`, `/join`, `/leave`) are protected via `protected` middleware. Public endpoints include `/signup`, `/login`, `/help`.

**14. How are errors returned?**  
All errors are unified:
```json
{
  "message": "Team not found"
}
```

**15. Can multiple games run simultaneously?**  
Yes, each game instance is isolated by its ID and has its own set of teams and chat rooms.

---

## 🧩 License

MIT © Alias-Game Backend Team
