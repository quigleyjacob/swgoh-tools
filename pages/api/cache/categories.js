import { swapi } from '../../lib/swgoh'
import { connectToDatabase } from "../../util/mongodb"

export default async function handler(req, res) {
    const { db } = await connectToDatabase()

    let payload = {collection: 'categoryList',
        language: 'eng_us'
    }
    let categoryList = await swapi.fetchData(payload)
    if (categoryList.error) {
      res.send(categoryList.error)
      return
    }
    let bulkOperations = categoryList.result.map(category => {
      return {updateOne: {filter: {id: category.id}, update: {$set: category}, upsert: true}}
    })
    let categories = await db
      .collection("categories")
      .bulkWrite(bulkOperations)

    res.status(200).json("Done")
}
