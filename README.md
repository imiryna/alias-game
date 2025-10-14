# alias-game

multiplayer word-guessing game

# Alias Game

Alias Game is a **multiplayer word-guessing game** built with **Node.js**.  
Players try to explain words to their teammates without using the word itself, guessing as many as possible within a time limit.  
The project includes **real-time chat functionality** and a **feature to check similar words** to ensure fair play.

---

## Tech Stack

**Backend:** Node.js, Express  
**Database:** MongoDB  
**Deployment:** Docker  
**Linting & Formatting:** ESLint, Prettier  
**Version Control:** Git, GitHub  
**Task Management:** GitHub Projects

---

## Features

- Real-time multiplayer gameplay
- In-game chat
- Similar word detection to prevent cheating
- Round-based game flow
- Score tracking per team

---

## Project Setup

### 1. Clone the repository

```bash
git clone https://github.com/<your-team-name>/alias-game.git
cd alias-game

```
### 2. **Copy the example file and update it with your values:**
    ```bash
    cp .env.example .env
    ```
### 3. **Create and run containers with docker (MongoDB + App)**
    ```bash
    docker-compose up --build