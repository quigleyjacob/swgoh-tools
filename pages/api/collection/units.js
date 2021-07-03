import { swapi } from '../../../lib/swgoh'
import fs from 'fs'
import path from 'path'

export default async function handler(req, res) {
    let filename = path.join(process.cwd(),'data/game/unitsList.json')
    let categoryList, data
    try {
        categoryList = await fs.promises.readFile(filename)
        data = JSON.parse(categoryList)
    } catch(err) {
        if (err.errno === -2) { //file dne

            let payload = {collection: 'unitsList',
                language: 'eng_us',
                enums: true,
                match: {
                    rarity: 7,
                    obtainable: true,
                    obtainableTime: 0
                },
                project: {
                    baseId: 1,
                    nameKey: 1,
                    categoryIdList: 1,
                    combatType: 1,
                    skillReferenceList: 1
                }
            }
            categoryList = await swapi.fetchData(payload)
            data = categoryList.result
            await fs.promises.writeFile(filename, JSON.stringify(data, null, 2))
        } else {
            res.status(404).json({message: "cannot find data"})
        }
    } finally {
        res.status(200).json(data)
    }
}