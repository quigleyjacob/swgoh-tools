import { swapi } from '../../../lib/swgoh'
import { connectToDatabase } from "../../../util/mongodb";
// import fs from 'fs'
// import path from 'path'

export default async function handler(req, res) {

  const { db } = await connectToDatabase()

  let categoryCursor = await db.collection("categories")
    .aggregate([
      {
        $match: {
          visible: true
        }
      }
    ])

    let categories = await categoryCursor.toArray()

    res.status(200).json(categories)

    // let filename = path.join(process.cwd(),'data/game/categoryList.json')
    // let categoryList, data
    // try {
    //     categoryList = await fs.promises.readFile(filename)
    //     data = JSON.parse(categoryList)
    // } catch(err) {
    //     if (err.errno === -2) { //file dne
    //         categoryList = await swapi.fetchData({collection: 'categoryList', language: 'eng_us'})
    //         data = categoryList.result
    //         await fs.promises.writeFile(filename, JSON.stringify(data, null, 2))
    //     } else {
    //         res.status(404).json({message: "cannot find data"})
    //     }
    // } finally {
    //     res.status(200).json(data.filter(item => item.visible && item.uiFilterList.includes(1)))
    // }
}
