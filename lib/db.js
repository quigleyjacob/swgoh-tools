import { connectToDatabase } from "../util/mongodb"


export async function getCategoryList() {
  const { db } = await connectToDatabase()

  let categories = await db.collection("categories").find({visible:true})

  let data = await categories.toArray()

  return JSON.parse(JSON.stringify(data))
}

export async function getUnitsList(type) {
  const { db } = await connectToDatabase()

  let units = await db.collection("units").find({"combatType": type}, {baseId: 1, nameKey: 1})

  let data = await units.toArray()
  return JSON.parse(JSON.stringify(data))
}

export async function getCharactersList() {
  return getUnitsList("CHARACTER")
}

export async function getShipsList() {
  return getUnitsList("SHIP")
}

export async function getRequirementsList() {
  const { db } = await connectToDatabase()

  let requirements = await db.collection("requirements").find()

  let data = await requirements.toArray()
  return JSON.parse(JSON.stringify(data))
}

export async function getImages() {
  const { db } = await connectToDatabase()

  let images = await db.collection("images").find()

  let data = await images.toArray()
  return JSON.parse(JSON.stringify(data))
}

export async function getGuilds() {
  const { db } = await connectToDatabase()
  let response = await db.collection('guild')
    .aggregate([
      {
        $project: {
          id: 1,
          name: 1,
          roster: {
            allyCode: 1
          }
        }
      }
    ])

  let data = await response.toArray()
  return JSON.parse(JSON.stringify(data))
}
