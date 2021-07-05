import { GuildConsumer , GuildContext } from '../../context/GuildContext'
import { Button, Form, Grid, Header, Image, Message, Segment, Dropdown } from 'semantic-ui-react'
import { useContext } from 'react'

export default function Guild() {

  const {state, updateState} = useContext(GuildContext);

  const print = (item) => {
    console.log(item)
    return item
  }
  return (
    <GuildConsumer>
    { value => (
      <p>
      hi there
      {print(value.state.requirementFilter[0].name)}
      </p>
    )}
    </GuildConsumer>
  )
}
