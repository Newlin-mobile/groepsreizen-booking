import Database from 'better-sqlite3';
import { join } from 'path';
import bcrypt from 'bcrypt';

const dbPath = join(process.cwd(), 'groepsreizen.db');
const db = new Database(dbPath);

// Enable WAL mode for better concurrency
db.pragma('journal_mode = WAL');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'admin',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS trips (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    price REAL NOT NULL,
    max_participants INTEGER NOT NULL,
    image_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    trip_id INTEGER NOT NULL,
    booking_reference TEXT UNIQUE NOT NULL,
    total_price REAL NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (trip_id) REFERENCES trips(id)
  );

  CREATE TABLE IF NOT EXISTS participants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    FOREIGN KEY (booking_id) REFERENCES bookings(id)
  );
`);

// Seed admin user if not exists
const adminExists = db.prepare('SELECT COUNT(*) as count FROM users WHERE email = ?').get('admin@reizen.nl') as { count: number };

if (adminExists.count === 0) {
  const hash = bcrypt.hashSync('Admin2026!', 10);
  db.prepare('INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)').run('admin@reizen.nl', hash, 'admin');
  
  // Seed trips
  const trips = [
    {
      name: 'Spanje - Costa Brava',
      description: 'Een week genieten van zon, zee en tapas aan de prachtige Costa Brava.',
      start_date: '2026-07-15',
      end_date: '2026-07-22',
      price: 699.00,
      max_participants: 40,
      image_url: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800'
    },
    {
      name: 'Italië - Toscane',
      description: 'Culinaire reis door het hart van Italië met wijnproeverijen en authentieke maaltijden.',
      start_date: '2026-08-10',
      end_date: '2026-08-17',
      price: 849.00,
      max_participants: 30,
      image_url: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800'
    },
    {
      name: 'Frankrijk - Provence',
      description: 'Ontdek de lavendelvelden en pittoreske dorpjes van de Provence.',
      start_date: '2026-06-20',
      end_date: '2026-06-27',
      price: 799.00,
      max_participants: 35,
      image_url: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800'
    },
    {
      name: 'Griekenland - Santorini',
      description: 'Romantische groepsreis naar het witte eiland met adembenemende zonsondergangen.',
      start_date: '2026-09-05',
      end_date: '2026-09-12',
      price: 999.00,
      max_participants: 25,
      image_url: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800'
    }
  ];

  const insertTrip = db.prepare('INSERT INTO trips (name, description, start_date, end_date, price, max_participants, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)');
  for (const trip of trips) {
    insertTrip.run(trip.name, trip.description, trip.start_date, trip.end_date, trip.price, trip.max_participants, trip.image_url);
  }
}

export default db;
