import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'
// import 'semantic-ui-css/semantic.min.css'
import { getTools } from '../lib/tools'
import Link from 'next/link'
import Date from '../components/date'

export default function Home({ allTools }) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section >
        <h2 >Blog</h2>
        <ul>
          {allTools.map(({ id, title }) => (
            <li  key={id}>
              <Link href={`/tools/${id}`}>
                <a>{title}</a>
              </Link>
              <br />
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  )
}

export async function getStaticProps() {
  const allTools = getTools()
  return {
    props: {
      allTools
    }
  }
}
