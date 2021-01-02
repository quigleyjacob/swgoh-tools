import { swapi } from '../../../lib/swgoh'
import fs from 'fs'

export default async function handler(req, res) {
    const {
      query: { allycode },
    } = req

    let filename = `./data/player/${allycode}.json`
    let file, data, fetchPlayer
    let now = Date.now()
    try {
        file = await fs.promises.open(filename, 'wx')
        console.log("File DNE")
        fetchPlayer = await swapi.fetchPlayer({ allycodes: allycode, language: 'eng_us'})
        fetchPlayer.last_updated = now
        data = JSON.stringify(fetchPlayer, null, 2)
        await fs.promises.writeFile(file, data)
        file.close()
    } catch (err) {
        data = await fs.promises.readFile(filename)
    }

    res.status(200).json(data)
  }