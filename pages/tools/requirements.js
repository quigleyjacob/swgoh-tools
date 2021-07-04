import { getCharactersList , getRequirementsList } from '../../lib/db'
import { useEffect } from 'react'
import { Checkbox, Grid, Container, Header, Button, Modal, Image, Input } from 'semantic-ui-react'
import useSWR from 'swr'

export default function Requirements({charactersList, requirementsList}) {
  const [requirementFilter, setRequirementFilter] = React.useState([])
  const [filteredPlayers, setFilteredPlayers] = React.useState([])
  const [open, setOpen] = React.useState(false)


  const handleRequirementFilterChange = (e, data) => {
    e.preventDefault()
    if (requirementFilter.includes(data.name)) {
      setRequirementFilter([...requirementFilter].filter(item => item !== data.name))
    } else {
      setRequirementFilter([...requirementFilter, data.name])
    }
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

  return (
    <div>
    <Modal
       onClose={() => setOpen(false)}
       onOpen={() => setOpen(true)}
       open={open}
       size='large'
     >
       <Modal.Header>Add a Team</Modal.Header>
       <Modal.Content image>
         <Grid container columns={5}>
        <Grid.Column width={3}>
        <Input list='units' placeholder='Select a unit'/>
        <Input placeholder="Stars"/>
        <Input placeholder="Gear Level"/>
        <Input placeholder="Relic Level"/>
        </Grid.Column>

        <Grid.Column width={3}>two</Grid.Column>
        <Grid.Column width={3}>three</Grid.Column>
        <Grid.Column width={3}>four</Grid.Column>
        <Grid.Column width={3}>five</Grid.Column>
         </Grid>
       </Modal.Content>
       <Modal.Actions>
         <Button color='black' onClick={() => setOpen(false)}>
           Cancel
         </Button>
         <Button
           content="Create Team"
           labelPosition='right'
           icon='checkmark'
           onClick={() => setOpen(false)}
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
  <datalist id='units'>
    {charactersList.map(character => (
      <option key={character.baseId} value={character.nameKey}/>
    ))}
  </datalist>

    </div>
  )
}

export async function getStaticProps() {
  let charactersList = (await getCharactersList())
      .sort((a,b) => {
      return a.nameKey.toUpperCase() < b.nameKey.toUpperCase() ? -1 : 1
  })

  let requirementsList = await getRequirementsList()

  return {
    props: {
      charactersList,
      requirementsList
    }
  }
}
