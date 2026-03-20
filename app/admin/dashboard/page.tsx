'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Booking {
  id: number;
  booking_reference: string;
  trip_name: string;
  total_price: number;
  status: string;
  created_at: string;
}

interface Trip {
  id: number;
  name: string;
  price: number;
  max_participants: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check auth (simple demo check)
    if (typeof window !== 'undefined' && !sessionStorage.getItem('admin')) {
      router.push('/admin');
      return;
    }

    // Load data
    Promise.all([
      fetch('/api/bookings').then(r => r.json()),
      fetch('/api/trips').then(r => r.json())
    ]).then(([bookingsData, tripsData]) => {
      setBookings(bookingsData);
      setTrips(tripsData);
      setLoading(false);
    });
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem('admin');
    router.push('/admin');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-800">Laden...</div>
      </div>
    );
  }

  const totalRevenue = bookings.reduce((sum, b) => sum + b.total_price, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="text-gray-600 hover:text-gray-900"
          >
            Uitloggen
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-gray-700 text-sm mb-1">Totaal Boekingen</div>
            <div className="text-3xl font-bold">{bookings.length}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-gray-700 text-sm mb-1">Totale Omzet</div>
            <div className="text-3xl font-bold text-green-600">€{totalRevenue.toFixed(2)}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-gray-700 text-sm mb-1">Actieve Reizen</div>
            <div className="text-3xl font-bold">{trips.length}</div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-bold text-gray-900">Recente Boekingen</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Reference</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Reis</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Bedrag</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Datum</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-mono text-sm text-gray-900">{booking.booking_reference}</td>
                    <td className="px-6 py-4 text-gray-900">{booking.trip_name}</td>
                    <td className="px-6 py-4 text-gray-900">€{booking.total_price.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {new Date(booking.created_at).toLocaleDateString('nl-NL')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Trips Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-bold text-gray-900">Reizen</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Naam</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Prijs</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Max Deelnemers</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {trips.map((trip) => (
                  <tr key={trip.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-900">{trip.name}</td>
                    <td className="px-6 py-4 text-gray-900">€{trip.price.toFixed(2)}</td>
                    <td className="px-6 py-4 text-gray-900">{trip.max_participants}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-blue-600 hover:text-blue-700">
            ← Terug naar website
          </Link>
        </div>
      </div>
    </div>
  );
}
