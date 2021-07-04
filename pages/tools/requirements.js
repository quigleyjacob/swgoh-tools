import { getCharactersList , getRequirementsList } from '../../lib/db'
import { useEffect } from 'react'
import { Checkbox } from 'semantic-ui-react'
import useSWR from 'swr'

export default function Requirements({charactersList, requirementsList}) {
  const [requirementFilter, setRequirementFilter] = React.useState([])
  const [filteredPlayers, setFilteredPlayers] = React.useState([])


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
      <div>
        Requirements
      </div>
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
