import { swapi } from '../../../lib/swgoh'
import { connectToDatabase } from "../../../util/mongodb";
// import fs from 'fs'
// import path from 'path'

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

    // let filename = path.join(process.cwd(), `data/player/${allycode}.json`)
    // let file, data, fetchPlayer
    // let now = Date.now()
    //
    // try {
    //     //check if file exists
    //     file = await fs.promises.open(filename)
    //     data = await fs.promises.readFile(file)
    //     file.close()
    //     data = JSON.parse(data)
    //     if (data.updated + 1000*60*60*24 < now) { //was the data updated less than a day ago
    //         let err = new Error("Data is too old, update it")
    //         err.errno = 1
    //         throw err
    //     }
    // } catch (err) {
    //     if (err.errno === -2 || err.errno === 1) { //no such file or directory, or data is out of date
    //         //get data and write to file
    //         let payload = {
    //             allycodes: allycode,
    //             language: 'eng_us',
    //             project: {
    //                 allyCode: 1,
    //                 name: 1,
    //                 guildRefId: 1,
    //                 roster: {
    //                     defId: 1,
    //                     nameKey: 1,
    //                     combatType: 1,
    //                     rarity: 1,
    //                     level: 1,
    //                     gear: 1,
    //                     gp: 1,
    //                     skills: {
    //                         isZeta: 1
    //                     },
    //                     relic: {
    //                         currentTier: 1
    //                     }
    //                 }
    //             }
    //         }
    //         fetchPlayer = await swapi.fetchPlayer(payload)
    //         if (fetchPlayer.error === null) {
    //             data = JSON.stringify(fetchPlayer.result[0], null, 2)
    //             await fs.promises.writeFile(filename, data)
    //             res.status(200).json(data)
    //             return
    //         }
    //     }
    //     res.status(404).json({"message": err.message})
    //     return
    // }
    //
    // res.status(200).json(data)
  }
