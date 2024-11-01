import { useState, useEffect } from "react";
import localFont from "next/font/local";

const geistSans = localFont({
  src: "../app/fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../app/fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  availableSeats: number;
}

const Home: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("/api/events");
        if (!res.ok) throw new Error("Failed to fetch events");
        const data: Event[] = await res.json();
        setEvents(data);
      } catch (err: any) {
        setError(err.message);
      }
    };
    fetchEvents();
  }, []);

  const handleBooking = async (eventId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/events/book`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ eventId }),
      });

      if (!res.ok) throw new Error("Failed to book a seat. Please try again.");

      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event._id === eventId
            ? { ...event, availableSeats: event.availableSeats - 1 }
            : event
        )
      );
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-6 py-10">

      {/* Main Container */}
      <div className="bg-white shadow-md rounded-lg p-10 max-w-4xl w-full mt-8">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-orange-500 mb-4">Available Events</h1>
          <p className="text-lg text-gray-700">Discover and book your next event!</p>
        </header>

        {/* Error Message */}
        {error && <p className="text-red-500 text-center">{error}</p>}

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.length > 0 ? (
            events.map((event) => (
              <div
                key={event._id}
                className="border border-gray-200 p-4 rounded-lg shadow-sm bg-white"
              >
                <h2 className="text-2xl font-semibold text-orange-500 mb-2">{event.title}</h2>
                <p className="text-gray-700 mb-2">{event.description}</p>
                <p className="text-gray-600 mb-2">
                  <strong>Date:</strong>{" "}
                  {new Date(event.date).toLocaleDateString()}
                </p>
                <p className="text-gray-600 mb-4">
                  <strong>Seats Available:</strong> {event.availableSeats}
                </p>
                <button
                  onClick={() => handleBooking(event._id)}
                  disabled={loading || event.availableSeats <= 0}
                  className={`w-full bg-orange-500 text-white font-semibold py-2 rounded-lg ${
                    event.availableSeats > 0
                      ? "hover:bg-orange-600"
                      : "opacity-50 cursor-not-allowed"
                  }`}
                >
                  {loading
                    ? "Booking..."
                    : event.availableSeats > 0
                    ? "Book Now"
                    : "Sold Out"}
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-black font-semibold">
              No events available at the moment.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
