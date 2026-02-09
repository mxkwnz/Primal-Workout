# Primal-Fit

Fitness tracker: workout plans, calendar, exercise catalog, logging, and progress.

## Setup

### Backend (server)

```bash
cd server
npm install
cp .env.example .env
```

Edit `.env`: set `MONGO_URI`, `JWT_SECRET`. Optional: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM` for welcome/reset emails.

```bash
npm run dev
```

Server runs on `http://localhost:5001`.

### Frontend (client)

Serve the `client` folder (e.g. Live Server on port 5500, or `npx serve client`). Set `API_URL` in JS to your backend (default `http://localhost:5001/api`).

## Project overview

- **Backend**: Node.js, Express, MongoDB Atlas, JWT, bcrypt, express-validator, nodemailer.
- **Frontend**: Static HTML/CSS/JS, responsive.
- **Features**: Auth (register, login, forgot/reset password), profile and onboarding, workout plans and catalog, schedule workouts on calendar, log workouts with sets/reps, history and progress, exercises catalog, RBAC (user, premium, moderator, admin), email (welcome, reset).

## API documentation

Base URL: `http://localhost:5001/api`

### Auth (public)

| Method | Endpoint              | Body                      | Description                          |
| ------ | --------------------- | ------------------------- | ------------------------------------ |
| POST   | /auth/register        | username, email, password | Register; returns token              |
| POST   | /auth/login           | email, password           | Login; returns token                 |
| POST   | /auth/forgot-password | email                     | Send reset link (if SMTP configured) |
| POST   | /auth/reset-password  | token, password           | Set new password; returns token      |

### User (Bearer token)

| Method | Endpoint           | Body                                                                    | Description               |
| ------ | ------------------ | ----------------------------------------------------------------------- | ------------------------- |
| GET    | /users/profile     | -                                                                       | Current user profile      |
| PUT    | /users/profile     | username?, email?, password?, profile?, settings?, onboardingCompleted? | Update profile            |
| PUT    | /users/upgrade     | -                                                                       | Upgrade to premium        |
| PUT    | /users/select-plan | planId                                                                  | Set selected workout plan |

### Workouts (Bearer token)

| Method | Endpoint           | Query/Body                                                      | Description              |
| ------ | ------------------ | --------------------------------------------------------------- | ------------------------ |
| GET    | /workouts/plans    | target?, difficulty?                                            | Public plans (no auth)   |
| GET    | /workouts          | target?, difficulty?, mine=true?                                | Plans + user's workouts  |
| POST   | /workouts          | planId? or name, target, exercises[], description?, difficulty? | Create (copy or new)     |
| POST   | /workouts/generate | age, height, weight, goal, gender, ...                          | Premium: generate plan   |
| GET    | /workouts/:id      | -                                                               | One plan                 |
| PUT    | /workouts/:id      | name?, description?, exercises?, target?, difficulty?           | Update (owner/mod/admin) |
| DELETE | /workouts/:id      | -                                                               | Delete (owner/mod/admin) |

### Exercises (Bearer token)

| Method | Endpoint       | Query                                            | Description       |
| ------ | -------------- | ------------------------------------------------ | ----------------- |
| GET    | /exercises     | muscleGroup?, equipment?, difficulty?, type?, q? | List with filters |
| GET    | /exercises/:id | -                                                | One exercise      |

### Scheduled (Bearer token)

| Method | Endpoint       | Query/Body              | Description           |
| ------ | -------------- | ----------------------- | --------------------- |
| GET    | /scheduled     | from?, to?              | My scheduled workouts |
| POST   | /scheduled     | date, workoutTemplateId | Schedule workout      |
| PUT    | /scheduled/:id | date?, status?          | Update                |
| DELETE | /scheduled/:id | -                       | Delete                |

### Workout logs (Bearer token)

| Method | Endpoint         | Body                                                               | Description    |
| ------ | ---------------- | ------------------------------------------------------------------ | -------------- |
| POST   | /workoutlogs     | scheduledWorkoutId?, durationMinutes?, rpe?, mood?, exerciseLogs[] | Finish workout |
| GET    | /workoutlogs     | from?, to?, limit?                                                 | My logs        |
| GET    | /workoutlogs/:id | -                                                                  | One log        |

### Reviews (Bearer token)

| Method | Endpoint | Body                  | Description            |
| ------ | -------- | --------------------- | ---------------------- |
| POST   | /reviews | rating (1-5), review? | Create review          |
| GET    | /reviews | -                     | List (admin/moderator) |

### Admin (Bearer token, admin)

| Method | Endpoint              | Description |
| ------ | --------------------- | ----------- |
| GET    | /admin/users          | List users  |
| POST   | /admin/users          | Create user |
| PUT    | /admin/users/:id/role | Update role |
| DELETE | /admin/users/:id      | Delete user |

## Deployment

- Backend: Render
