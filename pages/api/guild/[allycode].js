import { swapi } from '../../../lib/swgoh'

export default async function handler(req, res) {
    const {
      query: { allycode },
    } = req
    
    let fetchGuild = await swapi.fetchGuild({ allycodes: allycode, language: 'eng_us'})
    res.status(200).json(fetchGuild)
  }