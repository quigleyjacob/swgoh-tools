import { connectToDatabase } from "../../../../util/mongodb"

export default async (req, res) => {


  const { db } = await connectToDatabase()

  let newRequirement = await db.collection("requirements")
    .insertOne(req.body)



  res.status(200).json(newRequirement.ops[0])
}
