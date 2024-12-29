# Soforum: Personal Web Forum Project

This project is done for the CVWO 2025 Holiday Assignment, but mainly aimed for self-learning of foundational web development skills.

## Project Plan

### Structure

- **Frontend**: React library with Typescript\
  **Backend**: Go with Gin (TBD) framework

- **State Management**: Redux \
  **UI Component Library**: Material UI \
  **Database**: PostgreSQL \
  **Authentication**: OAuth or JWT (TBD) \
  **Deployment**: AWS (TBD)

### Features

- Basic CRUD operations: **Create**, **Read**, **Update** and **Destroy** forum threads
- **Upvote**, **Downvote**, **Save** and **Comment** operations for forum threads
- Basic **Authentication** system based on username and password
- Basic **Sort** and **Search** operations based on relevancy, popularity and time with a **Category** system
- User customisation of the web forum's appearance with minimally light/dark **Themes** 
- *Authentication based on external accounts: e.g. Login with Github (TBC)*
- *User profile page and social functions such as follow and personal message (TBC)*
- *Annonymous browsing mode (TBC)*
- *Optimise loading time of web forum (TBU)*
- *Optional content filtering powered by AI (TBU)*

## Prerequisites

- PosgreSQL, Node.js and Go (Golang) installed
- Setup your .env file under */backend* with following environment variables according to your pgAdmin settings
  - JWT_SECRET_KEY: any
  - DB_NAME: database name
  - DB_USER: database username
  - DB_PASSWORD: database password

## Setting up the web application

### `$ cd frontend/`

Navigates to the frontend directory.

### `$ npm install`

Install necessary dependencies.

### `$ npm run dev`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `$ cd backend/cmd/` 

Navigates to the directory where `main.go` is located

### `$ air`

Runs the backend server on [http://localhost:8080](http://localhost:8080).