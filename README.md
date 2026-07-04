# 🏠 Rent & Flatmate Finder

An AI-powered room rental and flatmate matching platform where owners can post room listings and tenants can discover rooms that best match their preferences. The platform uses an LLM-based compatibility engine to rank listings, supports real-time chat between owners and tenants, and provides email notifications for important events.

---

# Live Demo

> Deployment URLs-->.

https://rent-flatmate-finder-theta.vercel.app/login

---

# Tech Stack

| Layer                   | Technology                     |
| ----------------------- | ------------------------------ |
| Frontend                | React 19, Vite, Tailwind CSS   |
| Backend                 | Node.js, Express.js            |
| Database                | MongoDB, Mongoose              |
| Authentication          | JWT, Role-Based Authentication |
| AI Integration          | OpenAI API / Gemini API        |
| Real-Time Communication | Socket.IO                      |
| Email Service           | Nodemailer + Brevo SMTP        |
| File Uploads            | Cloudinary                     |
| Deployment              | Vercel, Render                 |

---

# High Level Architecture

```text
React Client
      ↓
REST APIs + Socket.IO
      ↓
Express Server
      ↓
MongoDB Database
      ↓
OpenAI/Gemini API
      ↓
Email Service (Brevo SMTP)
```
The frontend communicates with the backend using REST APIs and WebSockets. The backend manages authentication, listings, compatibility scoring, chat, and notifications. MongoDB stores application data, while the LLM service generates compatibility scores and Brevo handles email notifications.
---


# Features

## Authentication & Authorization

* Owner Registration & Login
* Tenant Registration & Login
* Admin Login
* Zod schema validation for data integrity
* JWT Authentication
* Role-Based Access Control

## Owner Features

* Create room listings
* Upload room photos
* Update and delete listings
* Accept or decline tenant requests
* Mark listings as filled

## Tenant Features

* Create preference profile
* Browse and filter listings
* View AI compatibility score
* Send interest requests
* Real-time chat with owners

## Admin Features

* Manage users
* Manage listings
* View platform activity and analytics

## AI Compatibility Engine

* Generates compatibility score from 0–100
* Provides explanation for the score
* Stores results in the database
* Includes rule-based fallback mechanism

## Real-Time Chat

* WebSocket-based messaging
* Persistent chat history
* Separate conversations for each accepted request

## Email Notifications

* Notify owners about high compatibility requests
* Notify tenants when requests are accepted
* Notify tenants when requests are declined

---

# Project Setup

## Prerequisites

* Node.js >= 18
* MongoDB Atlas
* Brevo Account
* OpenAI API Key or Gemini API Key
* Cloudinary Account

---

# Installation

```bash
git clone <repository-url>
cd Rent-Flatmate-Finder

# Backend
cd Backend
npm install

# Frontend
cd ../Client
npm install
```

---

# Environment Variables

## Server (.env)

```env
PORT=5000
MONGODB_URI=
JWT_SECRET=

OPENAI_API_KEY=
GEMINI_API_KEY=

SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

CLIENT_URL=
```

## Client (.env)

```env
VITE_API_URL=
VITE_SOCKET_URL=
```

---

# Running Locally

Backend:

```bash
cd backend
npm run dev
```

Frontend:

```bash
cd Client
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

Backend URL:

```text
http://localhost:5001
```

---

# API Reference

## Authentication

| Method | Endpoint           | Description   |
| ------ | ------------------ | ------------- |
| POST   | /api/auth/register | Register user |
| POST   | /api/auth/login    | Login user    |
| GET    | /api/auth/profile  | Current user  |

---

## Owner APIs

| Method | Endpoint                  | Description         |
| ------ | ------------------------- | ------------------- |
| POST   | /api/listings/create      | Create listing      |
| PUT    | /api/listings/:id         | Update listing      |
| DELETE | /api/listings/:id         | Delete listing      |
| PATCH  | /api/listings/:id/fill    | Mark listing filled |
| GET    | /api/listings/my-listings | Owner listings      |

---

## Tenant APIs

| Method | Endpoint            | Description           |
| ------ | ------------------- | --------------------- |
| POST   | /api/profile/create | Create tenant profile |
| GET    | /api/listings       | Browse listings       |
| POST   | /api/interests/send | Send interest request |
| GET    | /api/interests      | My requests           |

---

## Compatibility APIs

| Method | Endpoint                | Description           |
| ------ | ----------------------- | --------------------- |
| GET    | /api/matches            | Get ranked listings   |
| GET    | /api/matches/:listingId | Compatibility details |

---

## Chat APIs

| Method | Endpoint                  | Description        |
| ------ | ------------------------- | ------------------ |
| GET    | /api/chat/:conversationId | Chat history       |
| GET    | /api/chat/conversations   | User conversations |

---

## Admin APIs

| Method | Endpoint             | Description         |
| ------ | -------------------- | ------------------- |
| GET    | /api/admin/users     | Manage users        |
| GET    | /api/admin/listings  | Manage listings     |
| GET    | /api/admin/dashboard | Platform statistics |

---

# Database Schema

## User

```text
_id
name
email
password
role
profileImage
createdAt
```

## Listing

```text
_id
owner
location
rent
availableFrom
roomType
furnishingStatus
photos
isFilled
createdAt
```

## TenantProfile

```text
_id
tenant
preferredLocation
budgetMin
budgetMax
moveInDate
```

## CompatibilityScore

```text
_id
tenant
listing
score
explanation
generatedBy
createdAt
```

## InterestRequest

```text
_id
tenant
owner
listing
status
createdAt
```

## Conversation

```text
_id
listing
tenant
owner
createdAt
```

## Message

```text
_id
conversation
sender
message
createdAt
```

---

# LLM Prompt

```text
Given this room listing:

Location:
Rent:
Room Type:
Furnishing Status:

And this tenant profile:

Preferred Location:
Budget Range:
Move-in Date:

Compute a compatibility score from 0 to 100 based on budget and location match.

Return JSON:

{
  "score": number,
  "explanation": string
}
```

---

# Example Input

```json
{
  "listing": {
    "location": "Noida Sector 62",
    "rent": 12000
  },
  "tenant": {
    "preferredLocation": "Noida Sector 62",
    "budgetRange": "10000-13000"
  }
}
```

# Example Output

```json
{
  "score": 92,
  "explanation": "The listing matches the tenant's preferred location and falls within the specified budget range."
}
```

---

# Fallback Scoring Strategy

If the LLM service is unavailable:

* Exact location match: +60 points
* Budget match: +40 points
* Partial location match: +20 points

Maximum score: 100.

---

# Known Limitations

* Compatibility score currently focuses primarily on budget and location.
* No mobile application.
* Email notifications depend on third-party SMTP services.
* AI recommendations depend on LLM availability.

---

# Deployment

## Backend (Render)

* Add environment variables.
* Build Command:

```bash
npm install
```

* Start Command:

```bash
npm start
```

## Frontend (Vercel)

* Add environment variables.
* Build Command:

```bash
npm run build
```

* Output Directory:

```text
dist
```

---

# Future Improvements

* Advanced matching preferences
* Push notifications
* Video room tours
* Saved searches
* Recommendation analytics
* Mobile application support
