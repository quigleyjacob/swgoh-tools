import { getGuilds } from '../lib/db'
import { Button, Form, Grid, Header, Image, Message, Segment, Dropdown } from 'semantic-ui-react'
import { GuildConsumer } from '../context/GuildContext'
import { DataButton } from '../components/getDataButton'
import { useContext } from 'react'

export default function Home({ allGuilds }) {
  const [guildId, setGuildId] = React.useState("")
  const [guildName, setGuildName] = React.useState("")


  const guildOptions = allGuilds.map(guild => {
    return {key: guild.id, value: guild.roster[0].allyCode, text:guild.name}
  })

  const handleGuildNameChange = (e, data) => {
    e.preventDefault()
    let newGuildId = data.options[0].key
    setGuildId(newGuildId)
    let newGuildName = data.value
    setGuildName(newGuildName)
  }

  return (
  <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>

    <Grid.Column style={{ maxWidth: 450 }}>
      <Header as='h2' color='blue' textAlign='center'>
        SWGOH Tools
      </Header>


      <Form size='large'>
        <Segment stacked>
          <Form.Field
            search
            selection
            fluid
            control={Dropdown}
            options={guildOptions}
            value={guildName}
            onChange={handleGuildNameChange}
            placeholder='Guild Name'
          />

            <GuildConsumer>
            {(value) => (
              <DataButton
                guildId={guildId}
                guildName={guildName}
                updateContext={value.updateState}
                />
            )}
            </GuildConsumer>

        </Segment>
      </Form>
      <Message>
        Guild not listed? Contact us to get set up <a href='https://discord.com/channels/@me/639248696583651381' target="_blank">here</a>.
      </Message>
    </Grid.Column>
  </Grid>
  )
}

// export default function Home({ allTools }) {
//   return (
//     <Layout>
//       <Head>
//         <title>{siteTitle}</title>
//       </Head>
//       <section >
//         <h2 >Blog</h2>
//         <ul>
//           {allTools.map(({ id, title }) => (
//             <li  key={id}>
//               <Link href={`/tools/${id}`}>
//                 <a>{title}</a>
//               </Link>
//               <br />
//             </li>
//           ))}
//         </ul>
//       </section>
//     </Layout>
//   )
// }

export async function getStaticProps() {
  const allGuilds = await getGuilds()
  return {
    props: {
      allGuilds
    }
  }
}
