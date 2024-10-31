import dbConnect from "../../../lib/mongodb";
import Admin from "@/models/Admin";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  await dbConnect();
  if (req.method === "POST") {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({ token });
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
