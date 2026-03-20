import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

function generateBookingReference(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let ref = '';
  for (let i = 0; i < 8; i++) {
    ref += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return ref;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { trip_id, participants } = body;

    if (!trip_id || !participants || !Array.isArray(participants) || participants.length === 0) {
      return NextResponse.json({ error: 'Invalid booking data' }, { status: 400 });
    }

    // Get trip
    const trip = db.prepare('SELECT * FROM trips WHERE id = ?').get(trip_id) as any;
    if (!trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }

    // Calculate total price
    const total_price = trip.price * participants.length;

    // Generate unique booking reference
    let booking_reference = generateBookingReference();
    let attempts = 0;
    while (db.prepare('SELECT id FROM bookings WHERE booking_reference = ?').get(booking_reference) && attempts < 10) {
      booking_reference = generateBookingReference();
      attempts++;
    }

    // Create booking
    const insertBooking = db.prepare(
      'INSERT INTO bookings (trip_id, booking_reference, total_price, status) VALUES (?, ?, ?, ?)'
    );
    const result = insertBooking.run(trip_id, booking_reference, total_price, 'confirmed');
    const booking_id = result.lastInsertRowid;

    // Add participants
    const insertParticipant = db.prepare(
      'INSERT INTO participants (booking_id, name, email) VALUES (?, ?, ?)'
    );
    for (const participant of participants) {
      insertParticipant.run(booking_id, participant.name, participant.email);
    }

    return NextResponse.json({
      booking_id,
      booking_reference,
      total_price,
      trip_name: trip.name,
      participants_count: participants.length
    });

  } catch (error) {
    console.error('Booking error:', error);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const reference = searchParams.get('reference');

    if (reference) {
      const booking = db.prepare(`
        SELECT b.*, t.name as trip_name, t.start_date, t.end_date
        FROM bookings b
        JOIN trips t ON b.trip_id = t.id
        WHERE b.booking_reference = ?
      `).get(reference) as any;

      if (!booking) {
        return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
      }

      const participants = db.prepare('SELECT * FROM participants WHERE booking_id = ?').all(booking.id);
      
      return NextResponse.json({
        ...booking,
        participants
      });
    }

    // Return all bookings
    const bookings = db.prepare(`
      SELECT b.*, t.name as trip_name
      FROM bookings b
      JOIN trips t ON b.trip_id = t.id
      ORDER BY b.created_at DESC
    `).all();

    return NextResponse.json(bookings);

  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}
