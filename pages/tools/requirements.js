import { getCharactersList } from '../../lib/db'
import { useEffect } from 'react'
import { Checkbox, Grid, Container, Header, Button, Modal, Image, Input, Form } from 'semantic-ui-react'
import { CharacterSubForm } from '../../components/CharacterSubForm'

export default function Requirements({charactersList}) {
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

  const handleRequirementFilterChange = (e, data) => {
    e.preventDefault()
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

  useEffect(() => {
    if (requirementFilter.length > 0) {
      let getReqs = async () => {
          let response = await fetch(`/api/requirements/check/${requirementFilter.join(',')}`)
          let data = await response.json()
          setFilteredPlayers(data)
      }
      getReqs()
    } else {
        setFilteredPlayers([])
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

    // setRequirementsList(requirements)
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
           positive
         />
       </Modal.Actions>
     </Modal>



     <Grid columns={2} padded divided>
     <Grid.Row>
     <Grid.Column width={4}>
     <Container>
     <Header as='h2' textAlign='center'>
       Requirements
     </Header>
     <Button onClick={() => setOpen(true)}>Add Team</Button>
     <ul>
     {
       requirementsList.map(requirement => (
         <div key={requirement._id} align="left">
         <Checkbox
         name={requirement._id}
         label={requirement.name}
         checked={requirementFilter.includes(requirement._id)}
         onChange={handleRequirementFilterChange}
         />
         </div>
       ))
     }
     </ul>
     </Container>
     </Grid.Column>
     <Grid.Column width={12}>
     <div>
     Players who Meet Criteria
     </div>
     <ul>
     {
       filteredPlayers.map(player => (
         <li key={player.allyCode}>{player.name}</li>
       ))
     }
     </ul>
     </Grid.Column>
     </Grid.Row>
     </Grid>

    </div>
  )
}

export async function getStaticProps() {
  let charactersList = (await getCharactersList())
      .sort((a,b) => {
      return a.nameKey.toUpperCase() < b.nameKey.toUpperCase() ? -1 : 1
  })


  return {
    props: {
      charactersList
    }
  }
}
