import { Form, Input, Dropdown } from 'semantic-ui-react'

export function CharacterSubForm({index, formElements, setFormElements, charactersList}) {

  const [value, setValue] = React.useState("")

  const setStars = (e) => {
    let newStars = Number(e.target.value)
    let copy = formElements.slice()
    let currStars = copy[index].rarity
    let currGear = copy[index].gear
    let currRelics = copy[index].relicTier
    copy[index].rarity = newStars
    copy[index].gear = newStars < 7 ? Math.min(11, currGear) : currGear
    copy[index].relicTier = newStars == 7 && currGear == 13 ? currRelics : 0
    setFormElements(copy)
  }

  const setGear = (e) => {
    let newGear = Number(e.target.value)
    let copy = formElements.slice()
    let currStars = copy[index].rarity
    let currGear = copy[index].gear
    let currRelics = copy[index].relicTier
    copy[index].gear = currStars == 7 ? newGear : Math.min(11, newGear)
    copy[index].relicTier = newGear == 13 ? currRelics : 0
    setFormElements(copy)
  }

  const setRelics = (e) => {
    let newRelic = Number(e.target.value)
    let copy = formElements.slice()
    let currStars = copy[index].rarity
    let currGear = copy[index].gear
    let currRelics = copy[index].relicTier
    copy[index].relicTier = currGear == 13 ? newRelic : 0
    setFormElements(copy)
  }

  const setUnitName = (e, data) => {
    let characterId = data.value

    let copy = formElements.slice()
    copy[index].baseId = characterId
    setFormElements(copy)
  }

    const characterOptions = charactersList.map(character => {
      return {key: character.baseId, value: character.baseId, text: character.nameKey}
    })


  return (
    <Form.Group>
       <Form.Field control={Dropdown} search selection label={`Unit${index === 0 ? " (Leader)" : ""}`} onChange={setUnitName} value={formElements[index].baseId} options={characterOptions} placeholder='Select a unit'/>
       <Form.Field control={Input} label='Stars'  type='number' min={1} max={7} value={formElements[index].rarity} onChange={setStars} placeholder="Stars"/>
       <Form.Field control={Input} label='Gear'  type='number' min={1} max={13} value={formElements[index].gear} onChange={setGear} placeholder="Gear Level"/>
       <Form.Field control={Input} label='Relic' type='number' min={0} max={8} value={formElements[index].relicTier} onChange={setRelics} placeholder="Relic Level"/>
     </Form.Group>
  )
}
