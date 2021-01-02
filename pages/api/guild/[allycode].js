import { swapi } from '../../../lib/swgoh'
import fs from 'fs'

export default async function handler(req, res) {
    const {
      query: { allycode },
    } = req
    //naive, just pull from API everytime
    // let fetchGuild = await swapi.fetchGuild({ allycodes: allycode, language: 'eng_us'})
    // res.status(200).json(fetchGuild)

    //first check for player whose allycode is provided
    //if it exists, get guild id from file
    //check if guild exists in cache
    //if it exists and is recent enough, read that data
    //if anything fails, just pull data from API

    let filename = `./data/player/${allycode}.json`
    let file, data, fetchPlayer
    let now = Date.now()
    try {
        file = await fs.promises.open(filename)
        data = await fs.promises.readFile(file)
        data = JSON.parse(data)
        file.close()

        let guildID = data.guildRefId
        let guildFileName = `./data/guild/${guildID}.json`
        file = await fs.promises.open(guildFileName)
        data = await fs.promises.readFile(file)
        data = JSON.parse(data)
        file.close()
        if (data.updated + 1000*60*60*24 < now) { //was the data updated less than a day ago
            let err = new Error("Data is too old, update it")
            err.errno = 1
            throw err
        }
    } catch (err) {
        if(err.errno === -2 || err.errno === 1) { // file does not exist or data is out of date
            fetchPlayer = await swapi.fetchGuild({allycodes: allycode, language: 'eng_us'})
            if (fetchPlayer.error === null) {
                let guildID = fetchPlayer.result[0].id
                data = JSON.stringify(fetchPlayer.result[0], null, 2)
                await fs.promises.writeFile(`./data/guild/${guildID}.json`, data)
                res.status(200).json(data)
                return
            }
        }
        res.status(404).json({message: '404 was thrown'})
        return
    }

    res.status(200).json(data)
  }