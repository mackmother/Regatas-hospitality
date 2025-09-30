'use client';

import { useState } from 'react';
import { Calendar, Users, Home, Settings, Plus, Eye, X } from 'lucide-react';
import ImageGenerator from '@/components/ImageGenerator';

export default function Dashboard() {
  const [showNewBooking, setShowNewBooking] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);
  
  const [bookings, setBookings] = useState<any[]>([]);
  const [newBooking, setNewBooking] = useState({
    roomNumber: '208',
    preferredName: '',
    guestType: 'Family',
    startDate: '',
    endDate: '',
    venueName: 'Zsa Zsa / Playa 3',
    venueWhatsApp: 'https://wa.me/51990411197?text=Pedido%20Bungalow%20{ROOM}',
  });

  const handleCreateBooking = () => {
    const booking = {
      id: Date.now(),
      ...newBooking,
      status: 'scheduled',
      createdAt: new Date().toISOString()
    };
    
    setBookings([...bookings, booking]);
    setShowNewBooking(false);
    setNewBooking({
      roomNumber: '208',
      preferredName: '',
      guestType: 'Family',
      startDate: '',
      endDate: '',
      venueName: 'Zsa Zsa / Playa 3',
      venueWhatsApp: 'https://wa.me/51990411197?text=Pedido%20Bungalow%20{ROOM}',
    });
  };

  const handlePreview = (data: any) => {
    setPreviewData(data);
    setShowPreview(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-navy text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                <Home className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Regatas Welcome Screens</h1>
                <p className="text-sm text-blue-200">Dashboard</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Bookings</h2>
          <button
            onClick={() => setShowNewBooking(true)}
            className="bg-pacific text-white px-4 py-2 rounded-lg hover:bg-navy transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            New Booking
          </button>
        </div>

        {/* Bookings List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {bookings.length === 0 ? (
            <div className="p-12 text-center">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No bookings yet</p>
              <button
                onClick={() => setShowNewBooking(true)}
                className="mt-4 text-pacific hover:text-navy"
              >
                Create your first booking
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {bookings.map(booking => (
                <div key={booking.id} className="p-4 hover:bg-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-navy text-white rounded-lg flex items-center justify-center font-bold">
                      {booking.roomNumber}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{booking.preferredName}</p>
                      <p className="text-sm text-gray-500">
                        {booking.startDate} - {booking.endDate}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handlePreview(booking)}
                    className="p-2 text-gray-600 hover:text-pacific hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* New Booking Modal */}
      {showNewBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <h3 className="text-xl font-bold text-gray-900">New Booking</h3>
              <button
                onClick={() => setShowNewBooking(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Room Number
                </label>
                <input
                  type="text"
                  value={newBooking.roomNumber}
                  onChange={(e) => setNewBooking({ ...newBooking, roomNumber: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pacific focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Guest Name
                </label>
                <input
                  type="text"
                  value={newBooking.preferredName}
                  onChange={(e) => setNewBooking({ ...newBooking, preferredName: e.target.value })}
                  placeholder="e.g., Familia Sánchez"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pacific focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Guest Type
                </label>
                <select
                  value={newBooking.guestType}
                  onChange={(e) => setNewBooking({ ...newBooking, guestType: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pacific focus:border-transparent"
                >
                  <option>Single</option>
                  <option>Couple</option>
                  <option>Family</option>
                  <option>Friends</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-in Date
                  </label>
                  <input
                    type="date"
                    value={newBooking.startDate}
                    onChange={(e) => setNewBooking({ ...newBooking, startDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pacific focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-out Date
                  </label>
                  <input
                    type="date"
                    value={newBooking.endDate}
                    onChange={(e) => setNewBooking({ ...newBooking, endDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pacific focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Venue
                </label>
                <select
                  value={newBooking.venueName}
                  onChange={(e) => setNewBooking({ ...newBooking, venueName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pacific focus:border-transparent"
                >
                  <option>Zsa Zsa / Playa 3</option>
                  <option>Beach Bar</option>
                  <option>Pool Restaurant</option>
                </select>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3 bg-gray-50">
              <button
                onClick={() => setShowNewBooking(false)}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handlePreview(newBooking)}
                className="px-4 py-2 text-pacific border border-pacific rounded-lg hover:bg-pacific hover:text-white transition-colors flex items-center gap-2"
              >
                <Eye className="w-5 h-5" />
                Preview
              </button>
              <button
                onClick={handleCreateBooking}
                className="px-4 py-2 bg-pacific text-white rounded-lg hover:bg-navy transition-colors"
              >
                Create Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && previewData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Welcome Screen Preview</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <ImageGenerator
                preferredName={previewData.preferredName}
                guestType={previewData.guestType}
                roomNumber={previewData.roomNumber}
                ssid="Regatas_San Jose"
                venueName={previewData.venueName}
                venueWhatsApp={previewData.venueWhatsApp}
                backgroundImageUrl="/backgrounds/default-beach.jpg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
