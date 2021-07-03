import { connectToDatabase } from "../../util/mongodb"

const team = [
  "SHAAKTI",
  "CT5555",
  "CT7567",
  "CT210408",
  "ARCTROOPER501ST"
]

export default async (req, res) => {
  const { db } = await connectToDatabase()

  const playerData = await db.collection("player").find().toArray()


  let data = playerData.map(player => {
    let filteredUnits = player.roster.filter(unit => team.includes(unit.defId) && unit.relic.currentTier > 1+5)
    if (filteredUnits.length === team.length) {
      return {name: player.name, units: filteredUnits}
    } else {
      return null
    }
  })

  res.send(data.filter(element => element).map(element => element.name))

}
