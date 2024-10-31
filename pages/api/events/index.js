import dbConnect from "../../../lib/mongodb";
import Event from "@/models/Event";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    const events = await Event.find({});
    res.status(200).json(events);
  } else if (req.method === "POST") {
    const { title, description, date, availableSeats } = req.body;
    const event = new Event({ title, description, date, availableSeats });
    await event.save();
    res.status(201).json(event);
  } else {
    res.status(405).end();
  }
}
