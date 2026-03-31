# Mini CRM

Full-stack Mini CRM with React frontend + Express + MongoDB backend.

## Features
- JWT-based admin auth
- Lead CRUD (create, read, update status, delete)
- Lead stats, filtering, search, notes
- Modern glassmorphism dashboard UI

## Setup
1. Install dependencies
   - root: `npm install`
   - server: `cd server && npm install`
   - client: `cd client && npm install`

2. Start MongoDB (local)

3. Run dev mode:
   - `npm run dev`

4. Admin login
   - email: `admin@mini-crm.com`
   - password: `Admin@123`

## API
- POST `/api/auth/login`
- GET `/api/leads`
- POST `/api/leads`
- PUT `/api/leads/:id`
- DELETE `/api/leads/:id`

## Optional custom env
- `MONGO_URI`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `PORT` in `./.env`

## Notes
- Backend seed admin on startup if missing.
- Token required in `Authorization: Bearer TOKEN`.
