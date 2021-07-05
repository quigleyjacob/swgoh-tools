import { connectToDatabase } from "../../../util/mongodb"

export default async (req, res) => {
  let guildId = req.query.guildId

  const { db } = await connectToDatabase()

  let data = await db.collection("requirements")
    .find({guildId: guildId})

  let newRequirement = await data.toArray()



  res.status(200).json(newRequirement)
}
