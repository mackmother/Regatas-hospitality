'use client';

import { useState } from 'react';
import { Calendar, Plus, Eye, X, Download, Home, Search, Filter, Clock, CheckCircle2, Circle } from 'lucide-react';

export default function Dashboard() {
  const [showNewBooking, setShowNewBooking] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  
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
    if (!newBooking.preferredName || !newBooking.startDate || !newBooking.endDate) return;
    
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

  const getStatusColor = (status: string) => {
    return status === 'scheduled' ? 'text-blue-600 bg-blue-50' : 
           status === 'in-house' ? 'text-green-600 bg-green-50' : 
           'text-gray-600 bg-gray-50';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
      {/* Elegant Header */}
      <header className="bg-white border-b border-gray-200/60 backdrop-blur-xl bg-white/80 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-navy to-pacific flex items-center justify-center shadow-lg shadow-pacific/20">
                <Home className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Regatas</h1>
                <p className="text-sm text-gray-500 font-medium">Welcome Screen Manager</p>
              </div>
            </div>
            
            <button
              onClick={() => setShowNewBooking(true)}
              className="group relative px-6 py-3 bg-gradient-to-r from-pacific to-navy text-white rounded-xl font-medium shadow-lg shadow-pacific/25 hover:shadow-xl hover:shadow-pacific/40 hover:scale-[1.02] transition-all duration-200"
            >
              <span className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                New Booking
              </span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-gray-200/60 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-pacific" />
              </div>
              <span className="text-sm font-medium text-gray-500">Today</span>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-gray-900">{bookings.filter(b => b.startDate === new Date().toISOString().split('T')[0]).length}</p>
              <p className="text-sm text-gray-500">Check-ins scheduled</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200/60 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-sm font-medium text-gray-500">Active</span>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-gray-900">{bookings.filter(b => b.status === 'in-house').length}</p>
              <p className="text-sm text-gray-500">Guests in-house</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200/60 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-sm font-medium text-gray-500">Upcoming</span>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-gray-900">{bookings.filter(b => b.status === 'scheduled').length}</p>
              <p className="text-sm text-gray-500">Future bookings</p>
            </div>
          </div>
        </div>

        {/* Bookings Section */}
        <div className="bg-white rounded-2xl border border-gray-200/60 shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-200/60 bg-gradient-to-r from-gray-50/50 to-transparent">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Bookings</h2>
                <p className="text-sm text-gray-500 mt-1">Manage welcome screens for guest arrivals</p>
              </div>
              <div className="flex gap-3">
                <button className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  <span className="text-sm font-medium">Search</span>
                </button>
                <button className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  <span className="text-sm font-medium">Filter</span>
                </button>
              </div>
            </div>
          </div>

          {bookings.length === 0 ? (
            <div className="px-8 py-20 text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookings yet</h3>
              <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                Create your first booking to generate a personalized welcome screen for your guests
              </p>
              <button
                onClick={() => setShowNewBooking(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-pacific text-white rounded-xl font-medium hover:bg-navy transition-colors"
              >
                <Plus className="w-5 h-5" />
                Create First Booking
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {bookings.map(booking => (
                <div key={booking.id} className="px-8 py-5 hover:bg-gray-50/50 transition-colors group">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-navy to-pacific flex items-center justify-center shadow-lg shadow-pacific/15 flex-shrink-0">
                      <span className="text-2xl font-bold text-white">{booking.roomNumber}</span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">{booking.preferredName}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4" />
                          {new Date(booking.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(booking.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-gray-300" />
                        <span>{booking.guestType}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300" />
                        <span>{booking.venueName}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handlePreview(booking)}
                      className="px-5 py-2.5 bg-white border-2 border-pacific text-pacific rounded-xl font-medium hover:bg-pacific hover:text-white transition-all duration-200 flex items-center gap-2 opacity-0 group-hover:opacity-100"
                    >
                      <Eye className="w-4 h-4" />
                      Preview
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* New Booking Modal - Premium Design */}
      {showNewBooking && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-8 py-6 border-b border-gray-200/60 bg-gradient-to-r from-gray-50/50 to-transparent">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">New Booking</h3>
                  <p className="text-sm text-gray-500 mt-1">Create a personalized welcome experience</p>
                </div>
                <button
                  onClick={() => setShowNewBooking(false)}
                  className="w-10 h-10 rounded-xl hover:bg-gray-100 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="px-8 py-6 space-y-5 max-h-[calc(90vh-200px)] overflow-y-auto">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Room Number</label>
                <input
                  type="text"
                  placeholder="208"
                  value={newBooking.roomNumber}
                  onChange={(e) => setNewBooking({ ...newBooking, roomNumber: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pacific focus:border-transparent outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Guest Name</label>
                <input
                  type="text"
                  placeholder="e.g., Familia Sánchez"
                  value={newBooking.preferredName}
                  onChange={(e) => setNewBooking({ ...newBooking, preferredName: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pacific focus:border-transparent outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Guest Type</label>
                <select
                  value={newBooking.guestType}
                  onChange={(e) => setNewBooking({ ...newBooking, guestType: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pacific focus:border-transparent outline-none transition-all"
                >
                  <option>Single</option>
                  <option>Couple</option>
                  <option>Family</option>
                  <option>Friends</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Check-in</label>
                  <input
                    type="date"
                    value={newBooking.startDate}
                    onChange={(e) => setNewBooking({ ...newBooking, startDate: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pacific focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Check-out</label>
                  <input
                    type="date"
                    value={newBooking.endDate}
                    onChange={(e) => setNewBooking({ ...newBooking, endDate: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pacific focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Venue</label>
                <select
                  value={newBooking.venueName}
                  onChange={(e) => setNewBooking({ ...newBooking, venueName: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pacific focus:border-transparent outline-none transition-all"
                >
                  <option>Zsa Zsa / Playa 3</option>
                  <option>Beach Bar</option>
                  <option>Pool Restaurant</option>
                </select>
              </div>
            </div>

            <div className="px-8 py-6 border-t border-gray-200/60 bg-gray-50/50 flex justify-between">
              <button
                onClick={() => handlePreview(newBooking)}
                disabled={!newBooking.preferredName}
                className="px-6 py-3 border-2 border-pacific text-pacific rounded-xl font-medium hover:bg-pacific hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Eye className="w-5 h-5" />
                Preview
              </button>
              <button
                onClick={handleCreateBooking}
                disabled={!newBooking.preferredName || !newBooking.startDate || !newBooking.endDate}
                className="px-6 py-3 bg-gradient-to-r from-pacific to-navy text-white rounded-xl font-medium shadow-lg shadow-pacific/25 hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal - Premium Design */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-200/60">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Welcome Screen</h3>
                  <p className="text-sm text-gray-500 mt-1">Premium 4K (3840×2160)</p>
                </div>
                <button
                  onClick={() => setShowPreview(false)}
                  className="w-10 h-10 rounded-xl hover:bg-gray-100 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-8 max-h-[calc(90vh-200px)] overflow-y-auto">
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center h-96 space-y-4">
                  <div className="w-16 h-16 border-4 border-pacific/20 border-t-pacific rounded-full animate-spin"></div>
                  <p className="text-gray-600 font-medium">Generating premium 4K image...</p>
                  <p className="text-sm text-gray-400">This may take a few seconds</p>
                </div>
              ) : previewImageUrl ? (
                <div className="space-y-6">
                  <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-xl">
                    <img src={previewImageUrl} alt="Preview" className="w-full" />
                  </div>
                  <button
                    onClick={handleDownload}
                    className="w-full px-6 py-4 bg-gradient-to-r from-pacific to-navy text-white rounded-xl font-semibold shadow-lg shadow-pacific/25 hover:shadow-xl hover:scale-[1.01] transition-all flex items-center justify-center gap-3"
                  >
                    <Download className="w-5 h-5" />
                    Download 4K Image
                  </button>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-red-600 font-medium">Failed to generate image</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
