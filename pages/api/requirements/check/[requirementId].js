import { connectToDatabase } from "../../../../util/mongodb"
import {ObjectId} from 'mongodb'

export default async (req, res) => {
  const reqId = req.query.requirementId
  const { db } = await connectToDatabase()
  if (reqId == null) {
    res.end("Must pass in requirement as a param")
    return
  } else {
    let requirements = await db
      .collection("requirements")
      .findOne({_id: ObjectId(reqId)})

    let criteria = requirements.units.map(unit => {
      return {roster: {
        $elemMatch: {
          "defId": unit.baseId,
          "rarity": {$gte: unit.rarity},
          "gear": {$gte: unit.gear},
          "relic.currentTier": {$gte: unit.relicTier+1}
        }
      }}
    })

    let filter = await db
      .collection("player")
      .find({$and: criteria})
    let doc = await filter.toArray()
    let players = doc.map(
      (player) => {
        return {
          name: player.name,
          allyCode: player.allyCode
        }
      }
    )
    res.send(players)
    return
  }
}
