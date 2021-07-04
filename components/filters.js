import { Checkbox, Tab } from 'semantic-ui-react'
import { pathToFileURL } from 'url'
import path from 'path'




export default function Filters({categoryList, handleFactionFilterChange, factionFilter, charactersList, shipsList, unitsFilter, handleUnitsFilterChange}) {

    const getFactions = () => {
        return (
            categoryList
                .map(item => (
                   <div key={item.id} align='left'>
                       <Checkbox
                        key={item.baseId}
                        name={item.id}
                        onChange={handleFactionFilterChange}
                        checked={factionFilter.includes(item.id)}
                        label={item.descKey}
                        />
                   </div>
                ))
        )
    }

    const getCharacters = () => {
        return (
            charactersList
            .filter(character => factionFilter.every(tag => character.categoryIdList.includes(tag)))
            .map(item => (
                <div key={item.baseId} align='left'>
                    <Checkbox
                        key={item.baseId}
                        name={item.baseId}
                        label={item.nameKey}
                        onChange={handleUnitsFilterChange}
                        checked={unitsFilter.includes(item.baseId)}
                    />
                </div>
            ))
        )
    }

    const getShips = () => {
        return (
            shipsList
            .filter(character => factionFilter.every(tag => character.categoryIdList.includes(tag)))
            .map(item => (
                <div key={item.baseId} align='left'>
                    <Checkbox
                        key={item.baseId}
                        name={item.baseId}
                        label={item.nameKey}
                        onChange={handleUnitsFilterChange}
                        checked={unitsFilter.includes(item.baseId)}
                    />
                </div>
            ))
        )
    }

    const panes = [
  { menuItem: 'Factions', render: () => <Tab.Pane>{getFactions()}</Tab.Pane> },
  { menuItem: 'Characters', render: () => <Tab.Pane>{getCharacters()}</Tab.Pane> },
  { menuItem: 'Ships', render: () => <Tab.Pane>{getShips()}</Tab.Pane> },
]


    return (
        <Tab panes={panes} />
    )

}
