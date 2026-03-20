import Link from 'next/link';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

interface Trip {
  id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  price: number;
  max_participants: number;
  image_url: string;
}

export default async function Home() {
  const trips = db.prepare('SELECT * FROM trips ORDER BY start_date ASC').all() as Trip[];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Groepsreizen Booking
          </h1>
          <p className="text-xl text-gray-700">
            Ontdek onze unieke groepsreizen naar de mooiste bestemmingen
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trips.map((trip) => (
            <div key={trip.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative h-64">
                <img 
                  src={trip.image_url || '/placeholder.jpg'} 
                  alt={trip.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{trip.name}</h2>
                <p className="text-gray-800 mb-4 line-clamp-2">{trip.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-700">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {new Date(trip.start_date).toLocaleDateString('nl-NL')} - {new Date(trip.end_date).toLocaleDateString('nl-NL')}
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Max {trip.max_participants} deelnemers
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-blue-600">
                    €{trip.price.toFixed(2)}
                  </span>
                  <Link 
                    href={`/book/${trip.id}`}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                  >
                    Boek Nu
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link 
            href="/admin" 
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            Admin Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
