import { Button } from 'semantic-ui-react'
import Router from 'next/router'

export function DataButton({guildId, guildName, updateContext}) {

  const submitGuildId = async () => {
    // e.target.data({test: 'test'})
    //getGuildData
    let guildResponse = await fetch(`/api/guild/${guildName}`)
    let guildData = await guildResponse.json()

    let guildRequirementResponse = await fetch(`/api/requirements/${guildId}`)
    let guildRequirements = await guildRequirementResponse.json()


    //getGameData
    let unitsListResponse = await fetch('/api/collection/units')
    let unitsList = await unitsListResponse.json()

    let charactersList = unitsList.filter(unit => unit.combatType === "CHARACTER")
    let shipsList = unitsList.filter(unit => unit.combatType === "SHIP")

    let imagesResponse = await fetch('/api/collection/images')
    let images = await imagesResponse.json()

    // derive maps
    let charactersMap = new Map(charactersList.map(character => {
        return [character.baseId, character.nameKey]
      }))
      const alignmentMap = new Map(charactersList.map(character => {
        return [character.baseId, character.categoryIdList.includes("alignment_light") ? "light" : "dark"]
      }))
    let imagesMap = new Map(images.map(image => {
      return [image.baseId, image.image]
    }))

    updateContext(
      {
        guildData: guildData,
        requirementFilter: guildRequirements,
        images: images,
        charactersList: charactersList,
        shipsList: shipsList,
        charactersMap: charactersMap,
        alignmentMap: alignmentMap,
        imagesMap: imagesMap
      }
    )
    Router.push('/guild')
  }

  return (
    <Button
      primary
      fluid
      size='large'
      onClick={submitGuildId}>
      Enter
    </Button>
  )
}
