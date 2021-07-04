import { connectToDatabase } from "../../../util/mongodb";
import { swapi } from '../../../lib/swgoh'


export default async (req, res) => {
  const allycode = req.query.allycode
  const { db } = await connectToDatabase();

  if (allycode == null) {
    res.end("Must pass in allycode as a param")
    return
  }

  let payload = {
      allycodes: allycode,
      language: 'eng_us',
  }
  let fetchGuild = await swapi.fetchGuild(payload)
  if (fetchGuild.error) {
    console.log(`Error with allycode ${allyCode} in getting guild data`)
    res.end(fetchGuild.error)
    return
  }
  let guildData = fetchGuild.result[0]
  console.log(`Adding guild to database: ${guildData.name}`)

  const guild = await db
    .collection("guild")
    .updateOne({"id": guildData.id},{$set: guildData},{upsert: true})

  console.log(`Added guild to database`)
  console.log(`Retrieving each guild members data`)

  const guildMemberAllyCodes = guildData.roster.map(member => member.allyCode)

  let fetchPlayers = await swapi.fetchPlayer({allyCode: guildMemberAllyCodes, lang: "eng_us"})
  if (fetchPlayers.error) {
    console.log(`Error with allycodes in guild. Likely a timeout instance`)
    res.end(fetchPlayers.error)
    return
  }

  console.log(`Guild Member data successfully retrieved for ${fetchPlayers.result.length} members.`)
  console.log("Adding guild member data to database")

  let playerData = fetchPlayers.result
  const players = await Promise.all(playerData.map(async (player) => {
    db.collection("player")
     .updateOne({"allyCode": player.allyCode},{$set: player}, {upsert: true})
  }))

  console.log("Guild member data successfully added")

  res.status(200).json("Done! See terminal for full details.")
  return
};
