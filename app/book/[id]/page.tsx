'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Trip {
  id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  price: number;
  image_url: string;
}

export default function BookingPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [step, setStep] = useState(1);
  const [numParticipants, setNumParticipants] = useState(1);
  const [participants, setParticipants] = useState([{ name: '', email: '' }]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<any>(null);

  // Load trip data
  useState(() => {
    fetch(`/api/trips`)
      .then(res => res.json())
      .then(trips => {
        const foundTrip = trips.find((t: Trip) => t.id === parseInt(resolvedParams.id));
        setTrip(foundTrip);
        setLoading(false);
      });
  });

  const handleNumParticipantsChange = (num: number) => {
    setNumParticipants(num);
    setParticipants(Array(num).fill(0).map(() => ({ name: '', email: '' })));
  };

  const handleParticipantChange = (index: number, field: string, value: string) => {
    const updated = [...participants];
    updated[index] = { ...updated[index], [field]: value };
    setParticipants(updated);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trip_id: trip?.id,
          participants
        })
      });
      
      const data = await res.json();
      setBooking(data);
      setStep(4);
    } catch (error) {
      alert('Boeking mislukt. Probeer het opnieuw.');
    }
    setLoading(false);
  };

  if (loading || !trip) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-800">Laden...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {['Reis', 'Deelnemers', 'Overzicht', 'Bevestiging'].map((label, idx) => (
              <div key={idx} className={`flex-1 text-center text-sm ${step > idx ? 'text-blue-600 font-semibold' : 'text-gray-500'}`}>
                {label}
              </div>
            ))}
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div 
              className="h-2 bg-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Step 1: Trip Info */}
          {step === 1 && (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">{trip.name}</h2>
              <img src={trip.image_url} alt={trip.name} className="w-full h-64 object-cover rounded-lg mb-6" />
              <p className="text-gray-800 mb-4">{trip.description}</p>
              <div className="space-y-2 mb-6">
                <p className="text-gray-900">
                  <strong>Data:</strong> {new Date(trip.start_date).toLocaleDateString('nl-NL')} - {new Date(trip.end_date).toLocaleDateString('nl-NL')}
                </p>
                <p className="text-gray-700">
                  <strong>Prijs per persoon:</strong> €{trip.price.toFixed(2)}
                </p>
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-900 font-semibold mb-2">Aantal deelnemers</label>
                <select 
                  value={numParticipants}
                  onChange={(e) => handleNumParticipantsChange(parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                >
                  {[1,2,3,4,5,6,7,8,9,10].map(n => (
                    <option key={n} value={n}>{n} {n === 1 ? 'persoon' : 'personen'}</option>
                  ))}
                </select>
              </div>

              <button 
                onClick={() => setStep(2)}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold"
              >
                Volgende
              </button>
            </div>
          )}

          {/* Step 2: Participants */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Gegevens deelnemers</h2>
              <div className="space-y-4 mb-6">
                {participants.map((p, idx) => (
                  <div key={idx} className="p-4 border border-gray-300 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-3">Deelnemer {idx + 1}</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-900 font-medium mb-1">Naam *</label>
                        <input
                          type="text"
                          value={p.name}
                          onChange={(e) => handleParticipantChange(idx, 'name', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-900 font-medium mb-1">Email *</label>
                        <input
                          type="email"
                          value={p.email}
                          onChange={(e) => handleParticipantChange(idx, 'email', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 font-semibold"
                >
                  Terug
                </button>
                <button 
                  onClick={() => setStep(3)}
                  disabled={participants.some(p => !p.name || !p.email)}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 font-semibold"
                >
                  Volgende
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Summary */}
          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Overzicht</h2>
              
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-lg text-gray-900 mb-2">{trip.name}</h3>
                <p className="text-gray-800 text-sm">
                  {new Date(trip.start_date).toLocaleDateString('nl-NL')} - {new Date(trip.end_date).toLocaleDateString('nl-NL')}
                </p>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Deelnemers ({participants.length})</h3>
                <ul className="space-y-2">
                  {participants.map((p, idx) => (
                    <li key={idx} className="text-gray-900">
                      {idx + 1}. {p.name} ({p.email})
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between text-lg">
                  <span>Prijs per persoon:</span>
                  <span>€{trip.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg mt-2">
                  <span>Aantal personen:</span>
                  <span>{participants.length}</span>
                </div>
                <div className="flex justify-between text-2xl font-bold text-blue-600 mt-4">
                  <span>Totaal:</span>
                  <span>€{(trip.price * participants.length).toFixed(2)}</span>
                </div>
              </div>

              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-gray-900">
                  <strong>Let op:</strong> Dit is een demo. Er wordt geen echte betaling verwerkt.
                  Na bevestiging ontvang je een booking reference.
                </p>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setStep(2)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 font-semibold"
                >
                  Terug
                </button>
                <button 
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-300 font-semibold"
                >
                  {loading ? 'Bezig...' : 'Bevestigen'}
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {step === 4 && booking && (
            <div className="text-center">
              <div className="mb-6">
                <svg className="w-20 h-20 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              
              <h2 className="text-3xl font-bold text-green-600 mb-4">Boeking Bevestigd!</h2>
              
              <div className="bg-gray-100 p-6 rounded-lg mb-6">
                <p className="text-gray-600 mb-2">Jouw booking reference:</p>
                <p className="text-4xl font-bold text-gray-900 tracking-wider">{booking.booking_reference}</p>
              </div>

              <div className="text-left mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Samenvatting</h3>
                <ul className="space-y-2 text-gray-900">
                  <li>Reis: {booking.trip_name}</li>
                  <li>Aantal deelnemers: {booking.participants_count}</li>
                  <li>Totaalbedrag: €{booking.total_price.toFixed(2)}</li>
                </ul>
              </div>

              <p className="text-sm text-gray-800 mb-6">
                Een bevestigingsmail is verzonden naar alle deelnemers.
              </p>

              <button 
                onClick={() => router.push('/')}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-semibold"
              >
                Terug naar Home
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
