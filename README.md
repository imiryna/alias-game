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
    ```

---

## Authentication Process (JWT with `jsonwebtoken`)

This API implements authentication using the **`jsonwebtoken`** library.
The flow is based on **two tokens**:

- **`accessToken`** — short-lived, used to access protected resources.
- **`refreshToken`** — long-lived, used to renew the `accessToken` after expiration.

---

- Tokens are generated using `jsonwebtoken` (`jwt.sign`, `jwt.verify`).
- `authMiddleware` validates `accessToken` for protected endpoints.
- Each user record stores its current `refreshToken` in the database.
- Error handling is unified through the `HttpError` utility and global error middleware.
- Environment variables:

  - `JWT_ACCESS_SECRET` – secret key for access tokens
  - `JWT_REFRESH_SECRET` – secret key for refresh tokens
  - `JWT_ACCESS_EXPIRES` – expiration time for access tokens
  - `JWT_REFRESH_EXPIRES` – expiration time for refresh tokens

---

## Sign Up

Register a new user account.

**Endpoint**

```
POST /api/auth/signup
```

**Example Request**

```http
POST /api/auth/signup
Content-Type: application/json

{
  "username": "John Doe",
  "email": "john@example.com",
  "password": "mypassword"
}
```

**Example Response**

```json
{
  "message": "Success",
  "user": {
    "_id": "6523f81a2f6c1a0a8c42d190",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "accessToken": "<accessToken>",
  "refreshToken": "<refreshToken>"
}
```

Use the `accessToken` in the `Authorization` header for all protected routes:

```
Authorization: Bearer <accessToken>
```

---

## Login

Authenticate an existing user.

**Endpoint**

```
POST /api/auth/login
```

**Example Request**

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "mypassword"
}
```

**Example Response**

```json
{
  "message": "Success",
  "user": {
    "_id": "6523f81a2f6c1a0a8c42d190",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "accessToken": "<accessToken>",
  "refreshToken": "<refreshToken>"
}
```

---

## Access Protected Routes

Every protected endpoint requires a valid JWT token in the header.

**Example Request**

```http
GET /api/users/profile
Authorization: Bearer <accessToken>
```

**Example Response**

```json
{
  "message": "Profile fetched successfully",
  "user": {
    "_id": "6523f81a2f6c1a0a8c42d190",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

If the token is missing or invalid, the server responds with:

```json
{
  "status": 401,
  "message": "Unauthorized - Invalid or missing token"
}
```

---

## Refresh Access Token

When the `accessToken` expires, use the `refreshToken` to get a new one.

**Endpoint**

```
POST /api/auth/refresh
```

**Example Request**

```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "<refreshToken>"
}
```

**Example Response**

```json
{
  "accessToken": "<newAccessToken>",
  "refreshToken": "<refreshToken>"
}
```

If the refresh token is invalid or expired:

```json
{
  "status": 403,
  "message": "Invalid or expired refresh token"
}
```

---
