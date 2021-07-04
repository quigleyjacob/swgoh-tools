import { useEffect } from 'react'
import { Checkbox, Form, Segment, Button, Grid, Header, Input, GridColumn, GridRow, Message, Container, Item, Card} from 'semantic-ui-react'
import { getCategoryList, getCharactersList, getShipsList, getImages } from '../../lib/db'
import { CharCard , ShipCard } from '../../components/card'
import Filters from '../../components/filters'

export default function Squads({ categoryList, charactersList, shipsList, serializedImagesMap}) {
    const [allycode, setAllycode] = React.useState(0)
    const [guildData, setGuildData] = React.useState({roster: []})
    const [factionFilter, setFactionFilter] = React.useState([])
    const [unitsFilter, setUnitsFilter] = React.useState([])
    const [guildFilter, setGuildFilter] = React.useState([])
    const [toggleAllGuild, setToggleAllGuild] = React.useState(true)
    const [shownCharacters, setShownCharacters] = React.useState([])

    const imagesMap = new Map(JSON.parse(serializedImagesMap))


    const handleSubmit = async (e) => {
        e.preventDefault()
        let response = await fetch(`/api/guild/${allycode}`)
        let data = await response.json()
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
    }

    const handleUnitsFilterChange = (e, data) => {
        let unit = data.name
        if(unitsFilter.includes(unit)) {
            setUnitsFilter([...unitsFilter].filter(item => item !== unit))
        } else {
            setUnitsFilter([...unitsFilter, unit])
        }
    }

    const handleGuildFilterChange = (e, data) => {
        let allycode = Number(data.name)
        if (guildFilter.includes(allycode)) {
            // console.log("removing guild member")
            setGuildFilter([...guildFilter].filter(item => item !== allycode))
        } else {
            setGuildFilter([...guildFilter, allycode])
        }
    }

    const handleToggleAllGuildChange = (e) => {
        setToggleAllGuild(!toggleAllGuild)

    }

    useEffect(() => {
        if (toggleAllGuild) {
            setGuildFilter(guildData.roster.map(member => member.allyCode))
        } else {
            setGuildFilter([])
        }
    }, [toggleAllGuild])

    useEffect(() => {
        if(factionFilter.length <= 0) {
            setShownCharacters([
                ...charactersList
                    .filter(character => unitsFilter.includes(character.baseId))
                    .map(characters => characters.baseId)
                    ,
                ...shipsList
                    .filter(ship => unitsFilter.includes(ship.baseId))
                    .map(ships => ships.baseId)
            ]

                )
        } else {
            setShownCharacters(charactersList
                .filter(character => factionFilter.every(tag => character.categoryIdList.includes(tag)))
                .filter(character => unitsFilter.includes(character.baseId))
                .map(characters => characters.baseId))
        }
    }, [factionFilter, unitsFilter])

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
                            <div key={String(member.allyCode)} align='left'>
                            <Checkbox
                            name={String(member.allyCode)}
                            onChange={handleGuildFilterChange}
                            checked={guildFilter.includes(member.allyCode)}
                            label={member.name}/>
                            </div>
                        ))}
                    </GridColumn>
                    <GridColumn>
                        <Filters
                            categoryList={categoryList}
                            handleFactionFilterChange={handleFactionFilterChange}
                            factionFilter={factionFilter}
                            unitsFilter={unitsFilter}
                            handleUnitsFilterChange={handleUnitsFilterChange}
                            charactersList={charactersList}
                            shipsList={shipsList}

                        />
                    </GridColumn>
                    </Grid>
                </GridRow>
            </GridColumn>
            <GridColumn>
                <Item.Group>
                {guildData.roster
                .filter(member => guildFilter.includes(member.allyCode))
                .map(member => (
                    <Item>
                    <Container fluid align='left'>
                    <div>
                    <Message
                    attached
                    header={member.name}
                    />
                    <Card.Group stackable>

                        {member.roster
                        .filter(character => shownCharacters.includes(character.defId) && character.combatType === 1)
                        .map(character => (
                            <CharCard
                            character={character}
                            charactersList={charactersList}
                            image={imagesMap.get(character.defId)}
                            />
                        ))
                        }
                        {member.roster
                        .filter(character => shownCharacters.includes(character.defId) && character.combatType === 2)
                        .map(character => (
                            <ShipCard
                            ship={character}
                            shipsList={shipsList}
                            image={imagesMap.get(character.defId)}
                            />

                        ))
                        }
                        </Card.Group>
                    </div>
                    </Container>
                    </Item>
                ))}
                </Item.Group>
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
    let shipsList = (await getShipsList())
        .sort((a,b) => {
        return a.nameKey.toUpperCase() < b.nameKey.toUpperCase() ? -1 : 1
    })

    let imagesList = await getImages()

    let imagesMap = new Map()

    imagesList.forEach(image => {
      imagesMap.set(image.baseId, image.image)
    })

    let serializedImagesMap = JSON.stringify(Array.from(imagesMap.entries()))

    return {
        props: {
            categoryList,
            charactersList,
            shipsList,
            serializedImagesMap
        }
    }
}
