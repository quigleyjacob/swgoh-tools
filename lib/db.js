import { swapi } from './swgoh'
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
