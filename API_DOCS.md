# API Documentation

## Auth API

- `POST /api/auth/signup`: Registers a new user. Role required: 'tenant', 'owner', or 'admin'.
- `POST /api/auth/login`: Authenticates user and returns JWT.

## Listings API

- `GET /api/listings`: Fetches all available (unfilled) rooms.
- `POST /api/listings`: Creates a new room (Owner role required).

## Match & AI API

- `POST /api/matches/calculate`: Triggers AI compatibility engine. Stores score and explanation in DB.

## LLM Prompt (Groq)

"Given this room listing: [JSON], and this tenant profile: [JSON], compute a compatibility score from 0 to 100 based on budget and location match. Return JSON: { 'score': number, 'explanation': 'string' }"
