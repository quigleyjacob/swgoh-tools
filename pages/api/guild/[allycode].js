import { connectToDatabase } from "../../../util/mongodb";


export default async function handler(req, res) {
    const {
      query: { allycode },
    } = req

    const { db } = await connectToDatabase()

    let player = await db.collection("player")
      .aggregate([
        {
          $match: {
            allyCode: Number(allycode)
          }
        },
        {
          $project: {
            guildRefId: 1
          }
        }
      ])

    let data = await player.toArray()
    let guildRefId = data[0].guildRefId
    console.log(data)
    console.log(guildRefId)

    let guild = await db.collection("guild")
      .findOne({id: guildRefId})



    let allyCodes = guild.roster.map(member => member.allyCode)



    let guildMemberRostersCursor = await db.collection("player")
    .aggregate([
      {
        $match: {
          allyCode: {$in: allyCodes}
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
      // .find({allyCode: {$in: allyCodes}})
    //
    let guildMemberRosters = await guildMemberRostersCursor.toArray()
    //
    console.log(guildMemberRosters.length)
    //
    guild.roster = guildMemberRosters

    res.status(200).send(guild)

  }
