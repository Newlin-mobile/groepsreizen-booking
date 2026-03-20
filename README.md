# Groepsreizen Booking System

Demo boekingssysteem voor groepsreizen met Next.js 14, TypeScript en SQLite.

## Features

- ✅ Multi-step booking flow (reis kiezen → deelnemers → overzicht → bevestiging)
- ✅ Admin dashboard met overzicht boekingen en reizen
- ✅ SQLite database met seed data (4 voorbeeld reizen)
- ✅ Responsive design (mobile-first)
- ✅ TypeScript strict mode
- ✅ WordPress API endpoints voor integratie

## Quick Start

```bash
# Installeer dependencies
npm install

# Start development server (draait op port 3006)
npm run dev

# Open browser
# http://localhost:3006
```

## Admin Login

- **Email:** admin@reizen.nl
- **Wachtwoord:** Admin2026!

## Database

De SQLite database (`groepsreizen.db`) wordt automatisch aangemaakt bij eerste start met:
- 1 admin user
- 4 voorbeeld groepsreizen (Spanje, Italië, Frankrijk, Griekenland)

## API Endpoints

### GET /api/trips
Lijst van alle reizen (voor WordPress plugin)

### POST /api/bookings
Nieuwe boeking maken
```json
{
  "trip_id": 1,
  "participants": [
    { "name": "Jan Jansen", "email": "jan@example.com" },
    { "name": "Piet Pietersen", "email": "piet@example.com" }
  ]
}
```

### GET /api/bookings?reference=ABC12345
Ophalen booking details

## Project Structure

```
├── app/
│   ├── admin/              # Admin login + dashboard
│   ├── book/[id]/          # Multi-step booking flow
│   ├── api/                # API routes
│   └── page.tsx            # Homepage met trip overzicht
├── lib/
│   └── db.ts              # Database setup + seeds
└── groepsreizen.db        # SQLite database (auto-generated)
```

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Database:** SQLite (better-sqlite3)
- **Styling:** Tailwind CSS
- **Auth:** JWT (jose)

## Production Deployment

```bash
npm run build
npm start
```

## Notes

- This is a demo - no real payment processing
- Session storage used for admin auth (use httpOnly cookies in production)
- Images loaded from Unsplash

---

**Gebouwd voor:** Hoofdkraan opdracht "Boekingssysteem voor groepsreizen"  
**Demo URL:** http://46.225.105.26:3006 (wanneer live)
