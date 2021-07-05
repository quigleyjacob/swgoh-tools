import { getCharactersList, getImages } from '../../lib/db'
import { useEffect } from 'react'
import { Checkbox, Grid, Container, Header, Button, Modal, Image, Input, Form, Segment, Reveal, List } from 'semantic-ui-react'
import { CharacterSubForm } from '../../components/characterSubForm'
import { MiniCharCard} from '../../components/minicard'

export default function Requirements({charactersList, characterWithIdArray, serializedImagesMap}) {
  const [requirementFilter, setRequirementFilter] = React.useState([])
  const [filteredPlayers, setFilteredPlayers] = React.useState([])
  const [open, setOpen] = React.useState(false)
  const [formElements, setFormElements] = React.useState(
    [
      {baseId:"",rarity:1,gear:1,relicTier:0},
      {baseId:"",rarity:1,gear:1,relicTier:0},
      {baseId:"",rarity:1,gear:1,relicTier:0},
      {baseId:"",rarity:1,gear:1,relicTier:0},
      {baseId:"",rarity:1,gear:1,relicTier:0}
    ]
  )
  const [newTeamName, setNewTeamName] = React.useState("")
  const [requirementsList, setRequirementsList] = React.useState([])
  const [activeTeamDetails, setActiveTeamDetails] = React.useState(-1)
  const [disableCheckbox, setDisableCheckbox] = React.useState(false)

  const characterWithId = new Map(characterWithIdArray)
  const imagesMap = new Map(JSON.parse(serializedImagesMap))
  const alignmentMap = new Map(charactersList.map(character => {
    return [character.baseId, character.categoryIdList]
  }))


  const handleRequirementFilterChange = (e, data) => {
    e.preventDefault()
    console.log("disable checkbox")
    setDisableCheckbox(true)
    if (requirementFilter.includes(data.name)) {
      setRequirementFilter([...requirementFilter].filter(item => item !== data.name))
    } else {
      setRequirementFilter([...requirementFilter, data.name])
    }
  }

  const handleNewTeamName = (e, data) => {
    e.preventDefault()
    setNewTeamName(data.value)
  }

  const submitNewTeamForm = async (e) => {
    e.preventDefault()
    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({name: newTeamName, units: formElements})
    }
    let data = await fetch('/api/requirements/new', requestOptions)

    let newRequirement = await data.json()

    console.log(newRequirement)

    let copy = requirementsList.slice()
    setRequirementsList([...copy, newRequirement])

    setOpen(false)
  }

  const handleTeamDetailsClick = (e, data) => {
    let newActive = Number(e.target.getAttribute('index'))
    setActiveTeamDetails(newActive === activeTeamDetails ? -1 : newActive)
  }

  useEffect(() => {
    if (requirementFilter.length > 0) {
      let getReqs = async () => {
          let response = await fetch(`/api/requirements/check/${requirementFilter.join(',')}`)
          let data = await response.json()
          setFilteredPlayers(data)
          setDisableCheckbox(false)
      }
      getReqs()
    } else {
        setFilteredPlayers([])
        setDisableCheckbox(false)
    }
  }, [requirementFilter])

  useEffect(() => {
    let getRequirementsList = async () => {
      let response = await fetch('/api/requirements')
      let data = await response.json()
      console.log(data)
      setRequirementsList(data)
    }
    getRequirementsList()
  }, [])

  return (
    <div>
    <Modal
       onClose={() => setOpen(false)}
       onOpen={() => setOpen(true)}
       open={open}
       size='small'
     >
       <Modal.Header>Add a Team</Modal.Header>
       <Modal.Content>
       <Form>
       <Form.Field label='Team Name' control={Input} placeholder='Name your team' value={newTeamName} onChange={handleNewTeamName}/>
       {
         [0,1,2,3,4].map((element,index) => (
           <CharacterSubForm
            key={index}
            index={index}
            formElements={formElements}
            setFormElements={setFormElements}
            charactersList={charactersList}
           />
         ))
       }
         </Form>
       </Modal.Content>
       <Modal.Actions>
         <Button color='black' onClick={() => setOpen(false)}>
           Cancel
         </Button>
         <Button
           content="Create Team"
           labelPosition='right'
           icon='checkmark'
           onClick={submitNewTeamForm}
           primary
         />
       </Modal.Actions>
     </Modal>



     <Grid columns={2} padded divided stackable>

     <Grid.Column mobile={16} tablet={10} computer={4}>
     <Container>
     <Header as='h2' textAlign='center'>
       Requirements
     </Header>
     <Segment basic textAlign='center'>
     <Button primary onClick={() => setOpen(true)}>Add Team</Button>
     </Segment>

     {
       requirementsList.map(requirement => (
         <Segment>
         <Grid container textAlign='center' divided='vertically'>
           <Grid.Row verticalAlign='middle'>
            <Grid.Column computer={3} tablet={4} mobile={4}>
              <Checkbox
              disabled={disableCheckbox}
              name={requirement._id}
              checked={requirementFilter.includes(requirement._id)}
              onChange={handleRequirementFilterChange}
              fitted/>
            </Grid.Column>
            <Grid.Column computer={13} tablet={12} mobile={12}>
              {requirement.name}
            </Grid.Column>
           </Grid.Row>
           <Grid.Row columns='equal' textAlign='center'>
           {
             requirement.units.map(unit => (
               <Grid.Column>
               <MiniCharCard
                image={imagesMap.get(unit.baseId)}
                rarity={unit.rarity}
                gear={unit.gear}
                relicTier={unit.relicTier}
                alignment={alignmentMap.get(unit.baseId).includes('alignment_light') ? 'light' : 'dark'}
               />
               </Grid.Column>
             ))
           }
           </Grid.Row>
         </Grid>
         </Segment>
       ))
     }
     </Container>
     </Grid.Column>
     <Grid.Column computer={12} tablet={6} mobile={16}>

     <Grid>

     {
       filteredPlayers.map(requirement => (
         <div key={requirement._id}>
         <Grid.Column mobile={16} tablet={8} computer={4}>
         <Segment basic>
          <Header as='h3'>{requirement.name}</Header>
            <List>
            {
              requirement.qualifiedPlayers.map(player => (
                <List.Item key={player.allyCode}>{player.name}</List.Item>
              ))
            }
            </List>
            </Segment>
          </Grid.Column>
         </div>
       ))
     }

     </Grid>

     </Grid.Column>

     </Grid>

    </div>
  )
}

export async function getStaticProps() {
  const charactersList = (await getCharactersList())
      .sort((a,b) => {
      return a.nameKey.toUpperCase() < b.nameKey.toUpperCase() ? -1 : 1
  })

  const characterWithIdArray = charactersList.map(character => {
    return [character.baseId, character.nameKey]
  })

  let imagesList = await getImages()

  let imagesMap = new Map()

  imagesList.forEach(image => {
    imagesMap.set(image.baseId, image.image)
  })

  let serializedImagesMap = JSON.stringify(Array.from(imagesMap.entries()))


  return {
    props: {
      charactersList,
      characterWithIdArray,
      serializedImagesMap
    }
  }
}
