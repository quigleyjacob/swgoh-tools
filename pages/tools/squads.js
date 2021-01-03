import { useEffect } from 'react'
import { Checkbox, Form, Segment, Button, Grid, Header, Input, GridColumn, GridRow } from 'semantic-ui-react'
import { getCategoryList, getCharactersList } from '../../lib/squads'

export default function Squads({ categoryList, charactersList }) {
    const [allycode, setAllycode] = React.useState(0)
    const [guildData, setGuildData] = React.useState({roster: []})
    const [factionFilter, setFactionFilter] = React.useState([])
    const [guildFilter, setGuildFilter] = React.useState([])
    const [toggleAllGuild, setToggleAllGuild] = React.useState(true)
    const [shownCharacters, setShownCharacters] = React.useState([])
    

    const handleSubmit = async (e) => {
        e.preventDefault()
        let response = await fetch(`/api/guild/${allycode}`)
        let data = await response.json()
        console.log(data)
        setGuildFilter(data.roster.map(member => member.allyCode))
        setGuildData(data)
    }

    const handleChange = (e) => {
        e.preventDefault()
        setAllycode(e.target.value)
    }

    const handleFactionFilterChange = (e, data) => {
        let factionTag = data.name
        if (factionFilter.includes(factionTag)) {
            setFactionFilter([...factionFilter].filter(item => item !== factionTag))
        } else {
            setFactionFilter([...factionFilter, factionTag])
        }
        // console.log(factionFilter)
        // console.log([...factionFilter, factionTag].filter(item => item !== factionTag))
        
    }

    const handleGuildFilterChange = (e, data) => {
        let allycode = data.name
        if (guildFilter.includes(allycode)) {
            setGuildFilter([...guildFilter].filter(item => item !== allycode))
        } else {
            setGuildFilter([...guildFilter, allycode])
        }
    }

    const handleToggleAllGuildChange = (e) => {
        console.log(toggleAllGuild)
        setToggleAllGuild(!toggleAllGuild)
        console.log(toggleAllGuild)
        
    }

    useEffect(() => {
        if (toggleAllGuild) {
            setGuildFilter(guildData.roster.map(member => member.allyCode))
        } else {
            setGuildFilter([])
        }
    }, [toggleAllGuild])

    useEffect(() => {
        console.log(factionFilter)
        if(factionFilter.length <= 0) {
            setShownCharacters([])
        } else {
        setShownCharacters(charactersList
            .filter(character => factionFilter.every(tag => character.categoryIdList.includes(tag)))
            .map(characters => characters.baseId))
        }
    }, [factionFilter])

    useEffect(() => {
        console.log(shownCharacters)
    }, [shownCharacters])

    return (
        <div>
        <Segment textAlign='center' padded>
        <Header>
            Guild Roster
        </Header>
        <Grid columns={2} divided padded>
            <GridColumn>
                <GridRow>
                    <Form onSubmit={handleSubmit}>
                        <Input name='allycode' placeholder='Allycode' onChange={handleChange}/>
                        <Button>Find Guild</Button>
                    </Form>

                </GridRow>
                <GridRow>
                    <Grid columns={2} divided padded>
                    <GridColumn>
                        <h1>{guildData.name}</h1>
                        <div align='left'>
                            <Checkbox 
                            checked={toggleAllGuild}
                            label={`${toggleAllGuild ? "Unc" : "C"}heck all`}
                            onChange={handleToggleAllGuildChange}
                            disabled={guildData.roster.length <= 0}
                            />
                        </div>
                        {guildData.roster.map(member => (
                            <div align='left'>
                            <Checkbox
                            name={member.allyCode}
                            onChange={handleGuildFilterChange}
                            checked={guildFilter.includes(member.allyCode)}
                            label={member.name}/>
                            </div>
                        ))}
                    </GridColumn>
                    <GridColumn>
                        <h1>Faction List</h1>
                        {categoryList
                        // .sort((a,b) => {
                        //     return a.descKey.toUpperCase() < b.descKey.toUpperCase() ? -1 : 1
                        // })
                        .map(item => (
                           <div align='left'>
                               <Checkbox 
                                name={item.id}
                                onChange={handleFactionFilterChange}
                                checked={factionFilter.includes(item.id)}
                                label={item.descKey}
                                />
                           </div> 
                        ))}
                    </GridColumn>
                    </Grid>
                </GridRow>
            </GridColumn>
            <GridColumn>
                {guildData.roster
                .filter(member => guildFilter.includes(member.allyCode))
                .map(member => (
                    <div align='left'>
                        <strong>{member.name}- </strong> 
                        {console.log(shownCharacters)}
                        {member.roster
                        .filter(character => shownCharacters.includes(character.defId))
                        .map(character => (
                            <span>{character.nameKey} </span>
                        ))
                        }
                        {/* .filter(character => shownCharacters.includes(character.defId))
                        .map(character => (
                            <span>{character.name} </span>
                        ))} */}
                    </div>
                ))}

                {/* {charactersList
                .filter(character => factionFilter.every(tag => character.categoryIdList.includes(tag)))
                .map(character => (
                    <div>
                        {character.nameKey}
                    </div>
                ))} */}
            </GridColumn>
        </Grid>
        </Segment>
        
        </div>

    )
}

export async function getStaticProps() {
    let categoryList = (await getCategoryList())
        .sort((a,b) => {
        return a.descKey.toUpperCase() < b.descKey.toUpperCase() ? -1 : 1
    })
    let charactersList = (await getCharactersList())
        .sort((a,b) => {
        return a.nameKey.toUpperCase() < b.nameKey.toUpperCase() ? -1 : 1
    })
    return {
        props: {
            categoryList,
            charactersList
        }
    }
}