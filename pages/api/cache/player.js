import { connectToDatabase } from "../../../util/mongodb";
import { swapi } from '../../../util/swgoh'


export default async (req, res) => {
  const allycode = req.query.allycode
if (allycode == null) {
  res.end("Must pass in allycode as a param")
  return
} else {
  let payload = {
      allycodes: allycode,
      language: 'eng_us',
      project: {
          allyCode: 1,
          name: 1,
          guildRefId: 1,
          roster: 1
      }
  }
  let fetchPlayer = await swapi.fetchPlayer(payload)
  if (fetchPlayer.error === null) {
      let data = fetchPlayer.result[0]
      // START INTEGRATION OF ADDING TO MONGO HERE
      // let roster = data.roster
      const { db } = await connectToDatabase();

      const player = await db
        .collection("player")
        .insertOne(data)

      res.status(200).json(player)
      return

  } else {
    res.end("Could not get player matching that allycode")
    return
  }
}
};
