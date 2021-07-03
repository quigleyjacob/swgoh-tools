import { swapi } from '../../lib/swgoh'
import { connectToDatabase } from "../../util/mongodb"

export default async function handler(req, res) {
    const { db } = await connectToDatabase()

    let payload = {collection: 'unitsList',
        language: 'eng_us',
        enums: true,
        match: {
            rarity: 7,
            obtainable: true,
            obtainableTime: 0
        }
    }
    let unitsList = await swapi.fetchData(payload)
    if (unitsList.error) {
      res.send(unitsList.error)
      return
    }
    let bulkOperations = unitsList.result.map(unit => {
      return {updateOne: {filter: {id: unit.baseId}, update: {$set: unit}, upsert: true}}
    })
    let units = await db
      .collection("units")
      .bulkWrite(bulkOperations)

    res.status(200).json("Done")
}
