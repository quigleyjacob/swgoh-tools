import { connectToDatabase } from "../../../../util/mongodb"
import {ObjectId} from 'mongodb'

export default async (req, res) => {
  const reqIds = req.query.requirementId.split(',')
  const { db } = await connectToDatabase()
  if (reqIds == null) {
    res.end("Must pass in requirement as a param")
    return
  } else {
    const appliedRequirements = await Promise.all(reqIds.map(async (reqId) => {
      let requirements = await db
        .collection("requirements")
        .findOne({_id: ObjectId(reqId)})

      let criteria = requirements.units.map(unit => {
        return {roster: {
          $elemMatch: {
            "defId": unit.baseId,
            "rarity": {$gte: unit.rarity},
            "gear": {$gte: unit.gear},
            "relic.currentTier": {$gte: unit.relicTier+2}
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
      return {id: reqId, name: requirements.name, qualifiedPlayers: players}
    }))

    res.send(appliedRequirements)
    return
  }
}
