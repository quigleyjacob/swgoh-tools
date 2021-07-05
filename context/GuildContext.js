// src/context/state.js
import { createContext, useState } from 'react';

const GuildContext = createContext();

export default function GuildProvider({ children }) {
  let [data, setData] = useState({})

  return (
    <GuildContext.Provider value={{state: data, updateState: setData}}>
      {children}
    </GuildContext.Provider>
  )
}

const GuildConsumer = GuildContext.Consumer

export { GuildConsumer , GuildContext }
