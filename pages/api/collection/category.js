import { connectToDatabase } from "../../../util/mongodb";


export default async function handler(req, res) {

  const { db } = await connectToDatabase()

  let categoryCursor = await db.collection("categories")
    .aggregate([
      {
        $match: {
          visible: true
        }
      }
    ])

    let categories = await categoryCursor.toArray()

    res.status(200).json(categories)
}
