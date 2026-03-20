import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const trips = db.prepare('SELECT * FROM trips ORDER BY start_date ASC').all();
    return NextResponse.json(trips);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch trips' }, { status: 500 });
  }
}
