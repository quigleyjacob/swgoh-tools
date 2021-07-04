import { connectToDatabase } from "../../../util/mongodb";

export default async function handler(req, res) {
    const {
      query: { allycode },
    } = req

    const { db } = await connectToDatabase()

    let playerCursor = await db.collection("player")
      .aggregate([
        {
          $match: {
            allyCode: Number(allycode)
          }
        },
        {
          $project: {
              allyCode: 1,
              name: 1,
              guildRefId: 1,
              roster: {
                  defId: 1,
                  nameKey: 1,
                  combatType: 1,
                  rarity: 1,
                  level: 1,
                  gear: 1,
                  gp: 1,
                  skills: {
                      isZeta: 1
                  },
                  relic: {
                      currentTier: 1
                  }
              }
          }
        }
      ])

      let player = (await playerCursor.toArray())[0]

      res.status(200).json(player)
  }
