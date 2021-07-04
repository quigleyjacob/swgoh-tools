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

    console.log(guild)

    let allyCodes = guild.roster.map(member => member.allyCode)

    console.log(allyCodes)

    let guildMemberRostersCursor = await db.collection("player")
      .find({allyCode: {$in: allyCodes}})

    let guildMemberRosters = await guildMemberRostersCursor.toArray()

    console.log(guildMemberRosters.length)

    guild.roster = guildMemberRosters

    res.status(200).json(guild)

  }
