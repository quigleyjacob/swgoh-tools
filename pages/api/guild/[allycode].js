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

    let guild = await db.collection("guild")
      .findOne({id: guildRefId})

    let allyCodes = guild.roster.map(member => member.allyCode)

    let guildMemberRostersCursor = await db.collection("player")
      .find({allyCode: {$in: allyCodes}})

    let guildMemberRosters = await guildMemberRostersCursor.toArray()

    guild.roster = guildMemberRosters

    res.send(guild)

  }
