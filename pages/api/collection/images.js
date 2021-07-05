import { connectToDatabase } from "../../../util/mongodb";

export default async function handler(req, res) {
  const { db } = await connectToDatabase()

  let images = await db.collection("images").find()

  let data = await images.toArray()
  res.status(200).json(data)
}
