# Soforum: Personal Web Forum Project
The website is hosted at https://soforum.vercel.app/
It may take up to a minute for the backend to wakeup after inactivity

## Project Plan

#### Frontend:
- **Language**: TypeScript
- **Libraries**: React, Material UI
- **Framework**: Next.js
- **State Management**: Redux

#### Backend:
- **Language**: Go (Golang)
- **Framework**: Gin
- **Database**: PostgreSQL

### Features

#### User Registration and Authentication
- A "/signup" page for new users with validation for form inputs.
- Login dialog popup with error handling for incorrect credentials.
- Authentication using JSON Web Tokens (JWT), stored in `sessionStorage`.
- Persistent user state using Redux and `sessionStorage`.
- Automatic logout when the JWT token expires to ensure secure access.

#### Thread Management
- A homepage to view threads with pagination for efficient loading.
- A "/post" page to post threads for logged-in users.
- Search functionality via a top navigation bar to find threads by keywords.
- "/[category]" pages to display category-specific threads (TBC)*.
- "/thread/[id]" pages to display individual threads.
- Editing and deletion capabilities restricted to the thread's author.
- Tag system to attach user-designed tags to threads.
- Interactions such as upvoting, commenting, saving for logged-in users.

#### UI/UX Design
- Responsive layout for devices of all screen sizes.
- Loading placeholders and animations to improve user experience.
- Side navigation bar for navigating "/[category]" pages.
- Global alert system using MUI Snackbar managed by Redux.
- "/user/[username]" page to display user info.

### Next Steps
- Enable optional content filtering powered by AI.
- Enable anonymous browsing mode.
- Enable third-party login with Google and GitHub using OAuth.

## Prerequisites

1. **Install Required Software:**
   - PostgreSQL
   - Node.js
   - Go (Golang)
2. **Setup Environment Variables:**
   - Create a `.env` file under `/backend` with the following keys based on your PostgreSQL configuration:

    ```env
    ENV=development
    JWT_SECRET_KEY=YourSecretKey
    DB_NAME=DatabaseName
    DB_USER=DatabaseUsername
    DB_PASSWORD=DatabasePassword
    ```

## Setting up the Web Application

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   $ cd frontend/
   ```
2. Install necessary dependencies:
   ```bash
   $ npm install
   ```
3. Start the development server:
   ```bash
   $ npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in the browser to view the app.

### Backend Setup
1. Navigate to the backend directory where `main.go` is located:
   ```bash
   $ cd backend/cmd/
   ```
2. Start the backend server:
   ```bash
   $ go run main.go
   ```
   or if you are using AIR
   ```bash
   $ air
   ```
   The server will run on [http://localhost:8080](http://localhost:8080).

---