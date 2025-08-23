# Eventify - University Club Event Management Platform

## Problem Statement
Eventify is a full-stack event management portal designed for university clubs.  
It allows **Club Admins** to create and manage events, and **Students** to browse and register.

## User Roles
- **Student**: browse & register for events, personal dashboard  
- **Admin**: create/edit/delete events, manage attendees  

## Core Features (MVP)
- Authentication (Signup/Login, role-based)  
- Students: view events, register/unregister, dashboard  
- Admins: event CRUD, attendee management  

## Tech Stack
- **Frontend**: React + TailwindCSS  
- **Backend**: Node.js + Express  
- **Database**: MongoDB (Atlas free tier)  

## Deliverables
- Live deployed app (Vercel + Render)  
- GitHub repo with README  
- 2–5 min video demo  
- Presentation slides
---------------------------------------------------------------------------------------------------------
## Setup Instructions

### Backend
1. `cd backend`
2. `npm install`
3. Add your MongoDB URI in `server.js`
4. `npm run dev`

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm start`

Backend runs on http://localhost:5000  
Frontend runs on http://localhost:3000
