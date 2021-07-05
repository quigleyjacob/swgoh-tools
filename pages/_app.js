import '../styles/global.css'
import 'semantic-ui-css/semantic.min.css'
import utilStyles from '../styles/utils.module.css'
import GuildProvider from '../context/GuildContext'

export default function App({ Component, pageProps }) {
  return (
      <GuildProvider>
        <Component {...pageProps} />
      </GuildProvider>
  )
}
