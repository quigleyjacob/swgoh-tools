import { Form, Segment, Button, Grid, Header, Input, GridColumn, GridRow } from 'semantic-ui-react'
import { getGuildInfo } from '../../lib/squads'

export default function Squads() {
    const [allycode, setAllycode] = React.useState(0)
    

    const handleSubmit = (e) => {
        e.preventDefault()
        getGuildInfo(allycode)
    }

    const handleChange = (e) => {
        e.preventDefault()
        setAllycode(e.target.value)
    }

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
                        GuildMates List
                        Checkbox to toggle viewing
                    </GridColumn>
                    <GridColumn>
                        Factions Checklist
                        toggle viewing
                    </GridColumn>
                    </Grid>
                </GridRow>
            </GridColumn>
            <GridColumn>
                To display data here
            </GridColumn>
        </Grid>
        </Segment>
        
        </div>

    )
}