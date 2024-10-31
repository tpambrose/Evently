import { useState, useEffect } from "react";
import Image from "next/image";
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

// Define an interface for the Event type
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

  // Fetch events when the component mounts
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

  // Function to handle seat booking
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
    <div className="min-h-screen bg-gradient-to-r from-blue-800 to-blue-400 flex flex-col items-center justify-center px-6">
      {/* Header */}
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">Available Events</h1>
        <p className="text-lg text-white">
          Explore events and book your spot today!
        </p>
      </header>

      {/* Error Message */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.length > 0 ? (
          events.map((event) => (
            <div
              key={event._id}
              className="border p-4 rounded-md shadow-md bg-white"
            >
              <h2 className="text-2xl font-bold mb-2">{event.title}</h2>
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
                className={`w-full bg-blue-600 text-white font-bold py-2 rounded-md ${
                  event.availableSeats > 0
                    ? "hover:bg-blue-700"
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
          <p className="text-center text-gray-500">
            No events available at the moment.
          </p>
        )}
      </div>
    </div>
  );
};

export default Home;
