import dbConnect from "../../../lib/mongodb";
import Event from "@/models/Event";

export default async function handler(req, res) {
  await dbConnect();
  const { id } = req.query;

  if (req.method === "GET") {
    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.status(200).json(event);
  } else if (req.method === "PUT") {
    const { title, description, date, availableSeats } = req.body;
    const event = await Event.findByIdAndUpdate(
      id,
      { title, description, date, availableSeats },
      { new: true }
    );
    res.status(200).json(event);
  } else if (req.method === "DELETE") {
    await Event.findByIdAndDelete(id);
    res.status(204).end();
  } else {
    res.status(405).end();
  }
}
