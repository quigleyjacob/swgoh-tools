import { connectToDatabase } from "../../../util/mongodb"

export default async function handler(req, res) {

    const { db } = await connectToDatabase();

    let unitIdsCursor = await db.collection('units')
      .aggregate([
        {
          $project: {
            baseId: 1
          }
        }
      ])

    let unitsIds = (await unitIdsCursor.toArray()).map(unit => unit.baseId)

    // let testId = unitsIds[45]

    let unitPromises = unitsIds.map(async (unitId) => {
      let url = `https://swgoh.gg/game-asset/u/${unitId}.png`
      let response = await fetch(url)
      let data = await response.buffer()
      return {baseId: unitId, image: data.toString('base64')}
    })

    let units = await Promise.all(unitPromises)


    await Promise.all(units.map(async (unit) => {
      db.collection("images")
        .updateOne({baseId: unit.baseId}, {$set: unit}, {upsert: true})
    }))

    res.status(200).json("done")


}
