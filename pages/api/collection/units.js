import { connectToDatabase } from "../../../util/mongodb";

export default async function handler(req, res) {

  const { db } = await connectToDatabase()

  let unitCursor = await db.collection("units")
    .aggregate([
      {
        $match: {
          rarity: 7,
          obtainable: true,
          obtainableTime: 0
        }
      },
      {
        $project: {
            baseId: 1,
            nameKey: 1,
            categoryIdList: 1,
            combatType: 1,
            skillReferenceList: 1
        }
      }
    ])

    let units = await unitCursor.toArray()

    res.status(200).json(units)

}
