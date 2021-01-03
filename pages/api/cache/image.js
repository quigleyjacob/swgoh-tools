import fs from 'fs'
import path from 'path'

export default async function handler(req, res) {

    let unitsDataFile = path.join(process.cwd(), 'data/game/unitsList.json')
    let read = await fs.promises.readFile(unitsDataFile)
    let unitsData = JSON.parse(read)
    // console.log(unitsData)
    let unitsId = unitsData.map(unit => unit.baseId)
    console.log(unitsId)

    let images = unitsId.map(async id => {
        let url = `https://swgoh.gg/game-asset/u/${id}`
        let destination = path.join(process.cwd(),`data/images/${id}.png`)
        let response = await fetch(url)
        let data = await response.buffer()
        return await fs.promises.writeFile(destination, data)
    })

    await Promise.all(images)

    res.status(200).json({message: "done"})

}