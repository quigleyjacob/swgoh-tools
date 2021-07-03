import path from 'path'
import { swapi } from './swgoh'
import fs from 'fs'

export async function getCategoryList() {
    let filename = path.join(process.cwd(),'data/game/categoryList.json')
    let categoryList, data
    try {
        categoryList = await fs.promises.readFile(filename)
        data = JSON.parse(categoryList)
    } catch(err) {
        if (err.errno === -2) { //file dne
            categoryList = await swapi.fetchData({collection: 'categoryList', language: 'eng_us'})
            data = categoryList.result
            await fs.promises.writeFile(filename, JSON.stringify(data, null, 2))
        } else {
            return null
        }
    } finally {
        return data.filter(item => item.visible && item.uiFilterList.includes(1))
    }
}

async function getFilteredUnitList(filter) {
    let filename = path.join(process.cwd(),'data/game/unitsList.json')
    let unitsList, data
    try {
        unitsList = await fs.promises.readFile(filename)
        data = JSON.parse(unitsList).filter(item => item.combatType === filter.combatType)
    } catch (err) {
        console.log(err)
        if (err.errno === -2) {
            let payload = {collection: 'unitsList',
                language: 'eng_us',
                enums: true,
                match: {
                    rarity: 7,
                    obtainable: true,
                    combatType: filter.combatType === "CHARACTER" ? 1 : 2,
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
            unitsList = await swapi.fetchData(payload)
            data = unitsList.result
            await fs.promises.writeFile(filename, JSON.stringify(data, null, 2))
        } else {
            return null
        }
    } finally {
        return data
    }
}

export async function getCharactersList() {
    return getFilteredUnitList({combatType: "CHARACTER"})
}

export async function getShipsList() {
    return getFilteredUnitList({combatType: "SHIP"})
}