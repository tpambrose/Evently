import dbConnect from "../../../lib/mongodb";
import Event from "../../../models/Event";

export default async function handler(req, res) {
  await dbConnect();
  const { eventId } = req.body;
  const event = await Event.findById(eventId);
  if (event.availableSeats > 0) {
    event.availableSeats -= 1;
    await event.save();
    res.status(200).json({ message: "Booking successful" });
  } else {
    res.status(400).json({ error: "No seats available" });
  }
}
