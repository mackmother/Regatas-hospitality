'use client';

import { useState } from 'react';
import { Calendar, Plus, Eye, X, Download } from 'lucide-react';

export default function Dashboard() {
  const [showNewBooking, setShowNewBooking] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  
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

  const handlePreview = async (data: any) => {
    setPreviewData(data);
    setShowPreview(true);
    setIsGenerating(true);

    try {
      const response = await fetch('/api/render', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          preferredName: data.preferredName,
          guestType: data.guestType,
          roomNumber: data.roomNumber,
          ssid: 'Regatas_San Jose',
          venueName: data.venueName,
          venueWhatsApp: data.venueWhatsApp,
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setPreviewImageUrl(url);
      }
    } catch (error) {
      console.error('Error generating preview:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!previewImageUrl) return;
    const link = document.createElement('a');
    link.href = previewImageUrl;
    link.download = `welcome-room-${previewData.roomNumber}-4K.png`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-navy text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-xl font-bold">Regatas Welcome Screens</h1>
        </div>
      </header>

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
                      <p className="text-sm text-gray-500">{booking.startDate} - {booking.endDate}</p>
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
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
            <div className="p-6 border-b flex justify-between">
              <h3 className="text-xl font-bold">New Booking</h3>
              <button onClick={() => setShowNewBooking(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <input
                type="text"
                placeholder="Room Number"
                value={newBooking.roomNumber}
                onChange={(e) => setNewBooking({ ...newBooking, roomNumber: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />
              <input
                type="text"
                placeholder="Guest Name (e.g., Familia Sánchez)"
                value={newBooking.preferredName}
                onChange={(e) => setNewBooking({ ...newBooking, preferredName: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />
              <select
                value={newBooking.guestType}
                onChange={(e) => setNewBooking({ ...newBooking, guestType: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option>Single</option>
                <option>Couple</option>
                <option>Family</option>
                <option>Friends</option>
              </select>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="date"
                  value={newBooking.startDate}
                  onChange={(e) => setNewBooking({ ...newBooking, startDate: e.target.value })}
                  className="px-4 py-2 border rounded-lg"
                />
                <input
                  type="date"
                  value={newBooking.endDate}
                  onChange={(e) => setNewBooking({ ...newBooking, endDate: e.target.value })}
                  className="px-4 py-2 border rounded-lg"
                />
              </div>
              <select
                value={newBooking.venueName}
                onChange={(e) => setNewBooking({ ...newBooking, venueName: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option>Zsa Zsa / Playa 3</option>
                <option>Beach Bar</option>
                <option>Pool Restaurant</option>
              </select>
            </div>

            <div className="p-6 border-t flex justify-end gap-3">
              <button
                onClick={() => setShowNewBooking(false)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => handlePreview(newBooking)}
                className="px-4 py-2 border border-pacific text-pacific rounded-lg flex items-center gap-2"
              >
                <Eye className="w-5 h-5" />
                Preview
              </button>
              <button
                onClick={handleCreateBooking}
                className="px-4 py-2 bg-pacific text-white rounded-lg"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between">
              <h3 className="text-xl font-bold">Welcome Screen Preview</h3>
              <button onClick={() => setShowPreview(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {isGenerating ? (
                <div className="flex items-center justify-center h-96">
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-pacific border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Generating premium 4K image...</p>
                  </div>
                </div>
              ) : previewImageUrl ? (
                <>
                  <img src={previewImageUrl} alt="Preview" className="w-full rounded-lg shadow-lg" />
                  <button
                    onClick={handleDownload}
                    className="mt-4 w-full px-4 py-3 bg-pacific text-white rounded-lg hover:bg-navy flex items-center justify-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    Download 4K Image (3840x2160)
                  </button>
                </>
              ) : (
                <p className="text-red-600">Failed to generate image</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
