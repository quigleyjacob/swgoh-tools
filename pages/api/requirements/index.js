import { connectToDatabase } from "../../../util/mongodb"

export default async (req, res) => {


  const { db } = await connectToDatabase()

  let data = await db.collection("requirements")
    .find()

  let newRequirement = await data.toArray()



  res.status(200).json(newRequirement)
}
